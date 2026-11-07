(() => {
  'use strict';
  const $ = (s,root=document) => root.querySelector(s);
  const $$ = (s,root=document) => Array.from(root.querySelectorAll(s));
  const esc = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const {normalizeCart,total,money,orderMessage,whatsappUrl} = window.StoreCore;
  const products = STORE.products.filter(p=>p.active!==false);
  const getProduct = id => products.find(p=>p.id===id);
  const readStorage = key => {try{return JSON.parse(localStorage.getItem(key));}catch{return null;}};
  const writeStorage = (key,value) => {try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Still usable when local storage is unavailable. */}};
  let cart = normalizeCart(readStorage('menshood-bag-v1'),products);
  let saved = new Set((Array.isArray(readStorage('menshood-saved-v1'))?readStorage('menshood-saved-v1'):[]).filter(id=>getProduct(id)));
  let category='All',sort='featured',selectedProduct=null,selectedSize='',toastTimer;
  let activeOrderMessage='', orderDetails={};
  const productImages = p => p.images;
  const art = (p, extra='', index=0, decorative=false) => {
    const photo=productImages(p)[index];
    return `<img class="product-art ${extra}" src="${esc(photo.src)}" alt="${decorative?'':`${esc(p.name)}, ${esc(p.color)}, ${esc(photo.label.toLowerCase())}`}" ${decorative?'aria-hidden="true"':''} loading="${extra.includes('gallery-image')?'eager':'lazy'}" decoding="async">`;
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function motion(element,frames,options={}){
    if(!element||reducedMotion.matches||!element.animate)return;
    element.getAnimations().forEach(animation=>animation.cancel());
    element.animate(frames,{duration:280,easing:'cubic-bezier(.22,.7,.2,1)',...options});
  }
  function renderContacts(){
    const contacts=STORE.phoneNumbers||[];
    $$('.contact-numbers').forEach(el=>el.innerHTML=contacts.map(c=>`<a href="tel:+${esc(c.number)}">${esc(c.label)}</a>`).join(''));
    $$('.store-address').forEach(el=>el.innerHTML=STORE.address.map(esc).join('<br>'));
    $$('.brand-logo').forEach(img=>img.src=STORE.logo);
    $$('[data-instagram]').forEach(a=>a.href=STORE.instagram);
    $$('[data-whatsapp-contact]').forEach(a=>a.href=whatsappUrl(STORE.whatsappNumber,'Hi Menshood! I would like to know more about your collection.'));
  }

  function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);}
  function openDialog(id,replace=true){
    if(replace) $$('dialog[open]').forEach(d=>d.close());
    const d=$('#'+id);if(!d.open)d.showModal();document.body.classList.add('modal-open');
  }
  $$('dialog').forEach(d=>{
    d.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');});
    d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
  });
  function updateCounts(){
    const count=cart.reduce((n,i)=>n+i.qty,0);
    $$('.cart-count').forEach(e=>e.textContent=count);
    $('.bag-button').setAttribute('aria-label',`Open bag, ${count} ${count===1?'item':'items'}`);
    $('#bag-title-count').textContent=`(${count})`;
    $('.saved-count').textContent=saved.size;$('.saved-count').hidden=!saved.size;
  }
  function renderProducts(animate=false){
    let shown=products.filter(p=>category==='All'||(category==='Saved'?saved.has(p.id):p.category===category));
    if(sort==='price-low')shown.sort((a,b)=>a.price-b.price);
    if(sort==='price-high')shown.sort((a,b)=>b.price-a.price);
    if(sort==='name')shown.sort((a,b)=>a.name.localeCompare(b.name));
    $('#product-grid').innerHTML=shown.length?shown.map(p=>`<article class="product-card"><div class="product-photo ${p.images.length>1?'has-alternate':''}"><button class="product-open" data-product="${p.id}" aria-label="View ${esc(p.name)}, ${esc(p.color)}">${art(p)}${p.images.length>1?art(p,'product-alternate',1,true):''}</button><span class="product-tag">${p.images.length>1?'FRONT + BACK':esc(p.images[0].label.toUpperCase())}</span><button class="save-button ${saved.has(p.id)?'is-saved':''}" data-save="${p.id}" aria-pressed="${saved.has(p.id)}" aria-label="${saved.has(p.id)?'Unsave':'Save'} ${esc(p.name)}, ${esc(p.color)}">${icon('heart')}</button><button class="quick-add" data-product="${p.id}" aria-label="Choose size for ${esc(p.name)}, ${esc(p.color)}">${icon('plus')}</button></div><div class="product-info"><div class="product-name-line"><button class="product-name" data-product="${p.id}">${esc(p.name)}</button><span class="price">${money(p.price)}</span></div><div class="product-meta"><span class="swatch" style="background:${p.swatch}"></span>${esc(p.color)} <span>·</span> ${esc(p.fit.replace(' silhouette',''))}</div></div></article>`).join(''):`<div class="empty-state">${icon('heart')}<h3>Your next favourites live here.</h3><p>Tap the heart on a piece to keep it in your rotation.</p><button class="button dark" data-filter="All">Explore the edit ${icon('arrow')}</button></div>`;
    if(animate) $$('.product-card').forEach((card,i)=>motion(card,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{delay:Math.min(i,5)*35,duration:340,fill:'backwards'}));
    $('#result-count').textContent=category==='Saved'?`${shown.length} saved ${shown.length===1?'piece':'pieces'}`:`Showing ${shown.length===products.length?'all ':''}${shown.length} ${shown.length===1?'piece':'pieces'}`;
    $$('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===category);b.setAttribute('aria-pressed',String(b.dataset.filter===category));});
  }
  function setCategory(value,scroll=false){category=value;renderProducts(true);if(scroll)$('#shop').scrollIntoView({behavior:'smooth'});}
  function toggleSaved(id){if(!getProduct(id))return;if(saved.has(id)){saved.delete(id);toast('Removed from saved items');}else{saved.add(id);toast('Saved to your rotation');}writeStorage('menshood-saved-v1',[...saved]);
    if(category==='Saved')renderProducts();
    else $$('[data-save]').filter(b=>b.dataset.save===id).forEach(b=>{b.classList.toggle('is-saved',saved.has(id));b.setAttribute('aria-pressed',String(saved.has(id)));b.setAttribute('aria-label',`${saved.has(id)?'Unsave':'Save'} ${getProduct(id).name}, ${getProduct(id).color}`);motion(b,[{transform:'scale(1)'},{transform:'scale(1.14)'},{transform:'scale(1)'}]);});
    updateCounts();}
  function showProduct(id){
    const p=getProduct(id);if(!p)return;selectedProduct=p;selectedSize='';
    $('#product-detail').innerHTML=`<div class="product-detail-layout"><div class="detail-gallery"><div class="detail-image" aria-label="Product photos">${p.images.map((photo,i)=>art(p,`gallery-image ${i===0?'is-active':''}`,i,i!==0)).join('')}</div>${p.images.length>1?`<div class="gallery-controls" role="group" aria-label="Choose product view">${p.images.map((photo,i)=>`<button class="view-button ${i===0?'selected':''}" data-view="${i}" aria-pressed="${i===0}">${esc(photo.label)}</button>`).join('')}</div>`:''}</div><div class="detail-copy"><span class="eyebrow">THE EVERYDAY EDIT / ${esc(p.category.toUpperCase())}</span><h2>${esc(p.name)}</h2><div class="detail-price">${money(p.price)}</div><div class="detail-note">Starter price · Confirm size availability on WhatsApp.</div><p>${esc(p.description)}</p><div class="detail-color"><span class="swatch" style="background:${p.swatch}"></span>Colour: <strong>${esc(p.color)}</strong></div><div class="size-heading"><span>PREFERRED SIZE</span><button data-info="size">Find your fit ↗</button></div><div class="sizes" role="group" aria-label="Choose your preferred size">${p.sizes.map(s=>`<button class="size-button" data-size="${s}" aria-pressed="false">${s}</button>`).join('')}</div><div class="size-error" id="size-error" role="status"></div><button class="button dark detail-add" data-action="add">Add to bag ${icon('plus')}</button><span class="detail-fit">${icon('check')}${esc(p.fit)} · Sizes & measurements confirmed by the team</span></div></div>`;
    openDialog('product-dialog');
    motion($('.detail-image'),[{opacity:0,transform:'scale(.97)'},{opacity:1,transform:'scale(1)'}],{duration:360});
  }
  function switchProductView(index){
    if(!selectedProduct||!Number.isInteger(index)||!selectedProduct.images[index])return;
    $$('.gallery-image').forEach((img,i)=>{img.classList.toggle('is-active',i===index);img.setAttribute('aria-hidden',String(i!==index));if(i===index)img.alt=`${selectedProduct.name}, ${selectedProduct.color}, ${selectedProduct.images[i].label.toLowerCase()}`;});
    $$('.view-button').forEach(b=>{const active=Number(b.dataset.view)===index;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});
  }
  function addSelected(){
    if(!selectedSize){$('#size-error').textContent='Choose your size first.';$('.size-button').focus();return;}
    const existing=cart.find(i=>i.id===selectedProduct.id&&i.size===selectedSize);
    if(existing&&existing.qty>=10){toast('Maximum 10 of each size per enquiry.');return;}
    cart=normalizeCart([...cart,{id:selectedProduct.id,size:selectedSize,qty:1}],products);writeStorage('menshood-bag-v1',cart);updateCounts();renderCart();openDialog('cart-dialog');toast(`${selectedProduct.name} added to your bag`);motion($('.cart-count'),[{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}]);
  }
  function renderCart(){
    updateCounts();
    $('#cart-items').innerHTML=cart.length?cart.map((row,index)=>{const p=getProduct(row.id);return `<article class="cart-row">${art(p)}<div><div class="cart-row-name"><button data-product="${p.id}">${esc(p.name)}</button><span>${money(p.price*row.qty)}</span></div><small>${esc(p.color)} / Size ${row.size}</small><div class="cart-row-actions"><div class="qty-control"><button data-qty="${index}" data-delta="-1" aria-label="Decrease quantity of ${esc(p.name)}, size ${row.size}" ${row.qty<=1?'disabled':''}>−</button><span aria-label="Quantity">${row.qty}</span><button data-qty="${index}" data-delta="1" aria-label="Increase quantity of ${esc(p.name)}, size ${row.size}" ${row.qty>=10?'disabled':''}>+</button></div><button class="remove-item" data-remove="${index}">Remove</button></div></div></article>`;}).join(''):`<div class="cart-empty">${icon('bag')}<h3>Room for your next favourite.</h3><p>Your bag is empty.<br>Let’s find something that feels like you.</p><button class="button dark" data-action="continue">Explore the edit ${icon('arrow')}</button></div>`;
    $('#cart-summary').hidden=!cart.length;
    $('#cart-summary').innerHTML=cart.length?`<div class="summary-line"><span>${STORE.catalogueApproved?'Subtotal':'Illustrative subtotal'}</span><span>${money(total(cart,products))}</span></div><p>Starter prices. Size availability, shipping charges, and the final order total are confirmed on WhatsApp.</p><button class="button dark" data-action="checkout">Review your selection ${icon('arrow')}</button><button class="continue-link" data-action="continue">Keep exploring</button>`:'';
  }
  function changeQty(index,delta){if(!cart[index])return;cart[index].qty=Math.min(10,Math.max(1,cart[index].qty+delta));writeStorage('menshood-bag-v1',cart);renderCart();}
  function removeItem(index){if(!cart[index])return;cart.splice(index,1);writeStorage('menshood-bag-v1',cart);renderCart();toast('Piece removed from your bag');}
  function renderSearch(){
    const query=$('#search-input').value.toLowerCase().trim();
    const tokens=query.split(/\s+/).filter(Boolean);
    const results=products.filter(p=>tokens.every(token=>`${p.name} ${p.color} ${p.category} ${p.fit} ${p.description}`.toLowerCase().includes(token)));
    $('#search-results').innerHTML=results.length?results.map(p=>`<button class="search-result" data-product="${p.id}">${art(p)}<span><strong>${esc(p.name)}</strong><small>${esc(p.color)} · ${esc(p.category)}</small></span><span class="price">${money(p.price)}</span></button>`).join(''):`<div class="empty-search">No pieces found for “${esc(query)}”.<br>Try “shirt”, “embroidered”, “olive”, or “joggers”.</div>`;
  }
  function showCheckout(){
    if(!cart.length)return;
    $('#checkout-content').innerHTML=`<div class="preview-notice"><strong>${STORE.catalogueApproved?'Your order request':'You’re exploring a sample collection.'}</strong><br>${STORE.catalogueApproved?'Starter prices are shown. The team will confirm your preferred size, stock, shipping charges, and payment.':'Products and prices are illustrative. Send an enquiry to see actual availability and confirmed prices. No payment is collected here.'}</div><div class="order-lines">${cart.map(row=>{const p=getProduct(row.id);return `<div class="order-line"><span>${esc(p.name)}<small>${esc(p.color)} / Size ${row.size} / Qty ${row.qty}</small></span><strong>${money(p.price*row.qty)}</strong></div>`;}).join('')}<div class="order-total"><span>${STORE.catalogueApproved?'Subtotal':'Illustrative subtotal'}</span><span>${money(total(cart,products))}</span></div></div><form class="order-form" id="order-form"><label class="full-width">Your name<input name="name" autocomplete="name" required maxlength="80" placeholder="How should we address you?"></label><label>City<input name="city" autocomplete="address-level2" required maxlength="80" placeholder="Your city"></label><label>PIN code<input name="pin" inputmode="numeric" pattern="[1-9][0-9]{5}" minlength="6" maxlength="6" autocomplete="postal-code" required placeholder="6-digit PIN" title="Enter a valid 6-digit Indian PIN code"></label><label class="full-width">Anything else? <span class="sr-only">Optional</span><textarea name="notes" maxlength="500" placeholder="Fit questions, delivery questions… (optional)"></textarea></label><label class="consent full-width"><input type="checkbox" required>I agree to include these details in a WhatsApp message to Menshood. This is an enquiry, not a confirmed order.</label><button type="submit" class="button dark full-width">Prepare WhatsApp message ${icon('arrow')}</button><p class="order-note full-width">Details entered here are not stored by this storefront. You’ll review the message before opening WhatsApp. Share your full delivery address directly with the team after confirming your order.</p></form>`;
    Object.entries(orderDetails).forEach(([key,value])=>{const field=$('#order-form').elements.namedItem(key);if(field&&field.type!=='checkbox')field.value=value;});
    $('#order-form').addEventListener('submit',e=>{e.preventDefault();prepareOrder(new FormData(e.target));});
    openDialog('checkout-dialog');
  }
  function prepareOrder(form){
    if(!cart.length){toast('Your bag is empty.');return;}
    const details=Object.fromEntries(form.entries());orderDetails=details;
    if(!details.name.trim()||!details.city.trim()){toast('Please enter your name and city.');return;}
    activeOrderMessage=orderMessage(cart,details,STORE);
    const ready=/^[1-9]\d{7,14}$/.test(STORE.whatsappNumber);
    $('#checkout-content').innerHTML=`<div class="preview-notice"><strong>Ready for your review.</strong><br>Nothing has been sent. Open WhatsApp, review the recipient and message, then tap Send there.</div><pre class="order-review-text" id="order-message"></pre><div class="order-actions">${ready?`<a class="button dark" id="whatsapp-order" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} Open WhatsApp ${icon('arrow')}</a>`:'<button class="button dark" disabled>WhatsApp setup pending</button>'}<button class="button outline" data-action="copy-order">Copy message</button></div><button class="continue-link" style="margin-top:15px" data-action="checkout">Edit details</button><p class="order-note" style="margin-top:15px">Contact: ${esc((STORE.phoneNumbers||[]).find(c=>c.number===STORE.whatsappNumber)?.label||STORE.whatsappNumber)}. This enquiry does not reserve stock or place an order. The Menshood team must confirm the final terms.</p>`;
    $('#order-message').textContent=activeOrderMessage;
    if(ready)$('#whatsapp-order').href=whatsappUrl(STORE.whatsappNumber,activeOrderMessage);
  }
  const info={
    size:{title:'Find your fit.',body:'<p>The best reference is a piece you already love. Lay it flat, smooth it gently, and measure without stretching.</p><ol><li><strong>For tees and shirts:</strong> measure across the chest from armpit to armpit, then measure the length from the highest shoulder point to the hem.</li><li><strong>For bottoms:</strong> measure the waistband flat, double it for circumference, and measure the inside leg from the crotch seam to the hem.</li><li><strong>Compare before ordering:</strong> ask the team for the exact garment measurements in your preferred size.</li></ol><p>These are measurement instructions, not a product size chart. Available sizes, exact garment measurements, and fabric details must be confirmed with the team before ordering.</p>'},
    shipping:{title:'Shipping & delivery.',body:'<p>Delivery areas, charges, dispatch times, and courier options are being finalised.</p><p>Include your city and PIN code with your enquiry. Menshood will confirm serviceability, the final delivered price, and estimated delivery before you pay. There is no automated shipment tracking connected to this preview.</p>'},
    returns:{title:'Returns & exchanges.',body:'<p>Menshood’s return and exchange terms are awaiting confirmation.</p><p>Before buying, ask the team about eligibility, the permitted timeframe, item condition, return shipping costs, and how refunds or exchanges are processed. This preview does not promise a specific return window.</p>'},
    privacy:{title:'Your privacy.',body:'<p>This storefront saves your bag and saved items in your browser’s local storage. They stay on this device and can be removed through your browser’s site settings.</p><p>Name, city, PIN code, and notes entered during order review are held only in the current page session. The storefront has no customer database and does not collect payment details.</p><p>When you choose Open WhatsApp, the prepared message is passed to WhatsApp. You decide whether to send it. WhatsApp and Instagram apply their own privacy terms. The site’s hosting provider handles access and technical logs.</p><p>For questions about information you share with the business, contact Menshood directly.</p>'}
  };
  function showInfo(key){const content=info[key];if(!content)return;$('#info-title').textContent=content.title;$('#info-body').innerHTML=content.body+`<a class="text-link" href="${STORE.instagram}" target="_blank" rel="noopener noreferrer">Ask Menshood on Instagram ${icon('arrow')}</a>`;openDialog('info-dialog',false);}
  function closeMenu(){const n=$('#mobile-nav');n.hidden=true;$('.menu-toggle').setAttribute('aria-expanded','false');}
  document.addEventListener('click',async e=>{
    const b=e.target.closest('button,a');if(!b)return;
    if(b.hasAttribute('data-close')){b.closest('dialog').close();return;}
    if(b.dataset.product){showProduct(b.dataset.product);return;}
    if(b.dataset.save){toggleSaved(b.dataset.save);return;}
    if(b.dataset.category){setCategory(b.dataset.category);closeMenu();return;}
    if(b.dataset.filter){setCategory(b.dataset.filter);return;}
    if(b.dataset.view!==undefined){switchProductView(Number(b.dataset.view));return;}
    if(b.dataset.size){selectedSize=b.dataset.size;$$('.size-button').forEach(s=>{s.classList.toggle('selected',s.dataset.size===selectedSize);s.setAttribute('aria-pressed',String(s.dataset.size===selectedSize));});$('#size-error').textContent='';motion(b,[{transform:'scale(.94)'},{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:230});return;}
    if(b.dataset.qty!==undefined){changeQty(Number(b.dataset.qty),Number(b.dataset.delta));return;}
    if(b.dataset.remove!==undefined){removeItem(Number(b.dataset.remove));return;}
    if(b.dataset.info){showInfo(b.dataset.info);return;}
    switch(b.dataset.action){
      case 'menu':{const n=$('#mobile-nav');n.hidden=!n.hidden;$('.menu-toggle').setAttribute('aria-expanded',String(!n.hidden));break;}
      case 'cart':renderCart();openDialog('cart-dialog');break;
      case 'saved':setCategory('Saved',true);break;
      case 'search':$('#search-input').value='';renderSearch();openDialog('search-dialog');$('#search-input').focus();break;
      case 'add':addSelected();break;
      case 'checkout':showCheckout();break;
      case 'continue':$$('dialog[open]').forEach(d=>d.close());$('#shop').scrollIntoView({behavior:'smooth'});break;
      case 'copy-order':try{await navigator.clipboard.writeText(activeOrderMessage);toast('Message copied.');}catch{const range=document.createRange();range.selectNodeContents($('#order-message'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);toast('Select and copy the message above.');}break;
    }
    if(b.closest('.mobile-nav')&&b.tagName==='A')closeMenu();
  });
  $('#sort').addEventListener('change',e=>{sort=e.target.value;renderProducts(true);});
  $('#search-input').addEventListener('input',renderSearch);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  window.addEventListener('storage',e=>{if(e.key==='menshood-bag-v1'){cart=normalizeCart(readStorage('menshood-bag-v1'),products);renderCart();if($('#checkout-dialog').open){$('#checkout-dialog').close();toast('Your bag changed in another tab. Please review it again.');}}if(e.key==='menshood-saved-v1'){const value=readStorage('menshood-saved-v1');saved=new Set((Array.isArray(value)?value:[]).filter(id=>getProduct(id)));renderProducts();updateCounts();}});
  $('#year').textContent=new Date().getFullYear();
  renderContacts();
  $$('[data-product-count]').forEach(el=>el.textContent=String(products.length).padStart(2,'0'));
  renderProducts();updateCounts();
})();
