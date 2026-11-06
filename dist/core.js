(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.StoreCore = factory();
})(typeof window !== 'undefined' ? window : globalThis, function() {
  function normalizeCart(value, products) {
    if (!Array.isArray(value)) return [];
    const rows = new Map();
    for (const item of value.slice(0,100)) {
      if (!item || typeof item !== 'object') continue;
      const product = products.find(p => p.id === item.id);
      if (!product || product.active === false || !product.sizes.includes(item.size) || !Number.isInteger(item.qty) || item.qty < 1) continue;
      const key = item.id + ':' + item.size;
      rows.set(key, {id:item.id, size:item.size, qty:Math.min(10,(rows.get(key)?.qty || 0)+item.qty)});
    }
    return Array.from(rows.values());
  }
  function total(cart, products) {
    return normalizeCart(cart,products).reduce((sum,item) => sum + products.find(p=>p.id===item.id).price*item.qty, 0);
  }
  function money(value) { return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value); }
  function orderMessage(cart, details, config) {
    const rows = normalizeCart(cart,config.products);
    if (!rows.length) throw new Error('Your bag is empty.');
    const clean = val => String(val || '').replace(/[\u0000-\u001f]/g,' ').trim().slice(0,500);
    const lines = rows.map((row,i) => { const p=config.products.find(p=>p.id===row.id);return `${i+1}. ${p.name} — ${p.color}\nSize: ${row.size} | Qty: ${row.qty} | ${money(p.price*row.qty)}`; });
    return [config.catalogueApproved ? 'MENSHOOD — Order request' : 'MENSHOOD — Preview collection enquiry',
      config.catalogueApproved ? 'Hi Menshood! I would like to order:' : 'Hi Menshood! I saw these sample styles on your website preview. Please share actual products, availability, and confirmed prices:',
      lines.join('\n\n'), `${config.catalogueApproved?'Item subtotal':'Illustrative subtotal'}: ${money(total(rows,config.products))}`,
      `Name: ${clean(details.name)}\nCity: ${clean(details.city)}\nPIN code: ${clean(details.pin)}`,
      details.notes ? `Notes: ${clean(details.notes)}` : '',
      'Please confirm stock, sizing, final price, shipping charges, delivery time, and payment options. No payment has been made.'].filter(Boolean).join('\n\n');
  }
  function whatsappUrl(number,message) {
    if(!/^[1-9]\d{7,14}$/.test(number)) throw new Error('A valid business WhatsApp number is needed.');
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }
  return {normalizeCart,total,money,orderMessage,whatsappUrl};
});
