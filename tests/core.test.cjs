const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const core = require('../dist/core.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync('dist/catalogue.js','utf8'),context);
const store=JSON.parse(JSON.stringify(context.window.STORE));
test('Stored cart cannot inject products, sizes or prices',()=>{
  const result=core.normalizeCart([{id:'ivory-script-shirt',size:'M',qty:2,price:1},{id:'unknown',size:'M',qty:1},{id:'ivory-script-shirt',size:'BAD',qty:1},{id:'washed-olive-shirt',size:'L',qty:-2},null],store.products);
  assert.deepEqual(result,[{id:'ivory-script-shirt',size:'M',qty:2}]);
  assert.equal(core.total(result,store.products),2398);
});
test('Quantities merge by variant and cap at ten',()=>{
  const result=core.normalizeCart([{id:'ivory-script-shirt',size:'M',qty:8},{id:'ivory-script-shirt',size:'M',qty:5},{id:'ivory-script-shirt',size:'L',qty:2}],store.products);
  assert.equal(result.length,2);assert.equal(result[0].qty,10);assert.equal(result[1].qty,2);
  assert.deepEqual(core.normalizeCart({items:[]},store.products),[]);
});
test('Order preview is accurate and uses confirmed WhatsApp recipient',()=>{
  const cart=[{id:'ivory-script-shirt',size:'M',qty:2},{id:'orange-joggers',size:'L',qty:1}];
  assert.equal(core.total(cart,store.products),3197);
  const text=core.orderMessage(cart,{name:'Demo & Test',city:'Raebareli',pin:'229001',notes:'Fit? #1'},store);
  assert.match(text,/Order request/);assert.match(text,/Item subtotal: ₹3,197/);assert.match(text,/No payment has been made/);
  const url=new URL(core.whatsappUrl(store.whatsappNumber,text));
  assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/919336454309');assert.equal(url.searchParams.get('text'),text);
  assert.throws(()=>core.whatsappUrl('',text));assert.throws(()=>core.orderMessage([],{},store));
});

test('Catalogue paths, IDs, prices and contact configuration are valid',()=>{
  assert.ok(store.products.length>0);
  assert.equal(new Set(store.products.map(p=>p.id)).size,store.products.length,'Duplicate product ID');
  for(const p of store.products){
    assert.match(p.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(p.name && p.description && p.color && p.fit);
    assert.ok(['Shirts','Bottoms'].includes(p.category));
    assert.match(p.swatch,/^#[0-9a-f]{6}$/i);
    assert.ok(p.price>0 && Number.isInteger(p.price));
    assert.equal(typeof p.active,'boolean');
    assert.ok(p.sizes.length>0 && p.sizes.every(s=>typeof s==='string' && s.length>0));
    assert.equal(new Set(p.sizes).size,p.sizes.length);
    assert.ok(p.images.length>0);
    for(const image of p.images){
      assert.match(image.src,/^assets\/products\/[a-z0-9-]+\.png$/);
      assert.ok(image.label);
      assert.ok(fs.existsSync('dist/'+image.src),image.src+' missing');
    }
  }
  assert.ok(fs.existsSync('dist/'+store.logo));
  assert.ok(store.phoneNumbers.some(c=>c.number===store.whatsappNumber));
  for(const contact of store.phoneNumbers)assert.match(contact.number,/^[1-9]\d{7,14}$/);
  assert.deepEqual(core.normalizeCart([{id:'essential-black',size:'M',qty:1}],store.products),[]);
});
test('Hidden products cannot be restored into a bag',()=>{
 const products=store.products.map(p=>({...p,active:false}));
 assert.deepEqual(core.normalizeCart([{id:products[0].id,size:products[0].sizes[0],qty:1}],products),[]);
});
test('Jeans waist sizes and image galleries do not affect order totals',()=>{
 const p=store.products.find(p=>p.id==='panel-jeans');
 const cart=core.normalizeCart([{id:p.id,size:'32',qty:2},{id:p.id,size:'M',qty:1}],store.products);
 assert.equal(cart.length,1);
 assert.equal(core.total(cart,store.products),3198);
 assert.match(core.orderMessage(cart,{name:'Test',city:'Raebareli',pin:'229001'},store),/Size: 32 \| Qty: 2/);
});
