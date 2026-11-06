# Editing your catalogue

Open **`dist/catalogue.js`**. All products and basic store settings live here.

## Change a price

Find the product by its name or `id`. Change only the number:

```js
"price": 1299,
```

This shows ₹1,299 everywhere: product cards, detail view, search, bag and order message. Shipping is confirmed separately by the team.

## Add a product

1. Place the cleaned image in `dist/assets/products/`, for example `navy-shirt.png`.
2. Copy a product object inside the `products` list, including its surrounding braces.
3. Give it a unique permanent ID and edit its content. Keep a comma between product objects.
4. Run `npm run check`, then `npm start` and review the listing.

Example object (replace the image path with an existing file):

```js
{
  "id": "navy-shirt",
  "name": "The Navy Shirt",
  "category": "Shirts",
  "color": "Navy",
  "swatch": "#25344a",
  "price": 999,
  "sizes": ["S", "M", "L", "XL"],
  "fit": "Relaxed fit",
  "description": "A navy button-front shirt for your everyday rotation.",
  "active": true,
  "images": [
    { "src": "assets/products/navy-shirt.png", "label": "Front view" }
  ]
}
```

Use `Shirts` or `Bottoms` for the existing category filters. Add a category filter in `index.html` if introducing a new category. Swatches use six-digit hex colours. Prices are whole rupees. Sizes are strings, including numeric waist sizes.

## Add a second view

The first image is the cover. Extra views appear as labelled buttons in the product dialog. On a mouse/trackpad, hovering over a two-view product also crossfades to its second photo.

```js
"images": [
  { "src": "assets/products/navy-shirt.png", "label": "Front view" },
  { "src": "assets/products/navy-shirt-back.png", "label": "Back view" }
]
```

Use clear labels such as Front view, Back view or Detail. To remove a photo, remove its whole object and the appropriate separating comma.

## Temporarily hide a product

Change `"active": true` to `"active": false`. It disappears from browsing, search, saved items and restored bags on the next page load. Restore `true` to show it again. Do not rename an ID just to hide an item.

## Change contact details

`whatsappNumber` is the order-request destination, without a `+` or spaces. `phoneNumbers` controls the footer's click-to-call numbers; the order contact should also appear in this list. `address`, `instagram` and `logo` are in this same file. Footer contact text is generated from these settings when the page loads; static HTML retains the current fallback text.

## Validation and publication

`npm run check` reports missing images, duplicate IDs, invalid prices or sizes, broken contact configuration and JavaScript syntax errors. Tests cover cart totals and WhatsApp message encoding too.

Commit the changed catalogue and any new images together. Upload the full `dist/` contents to your chosen static host. The existing ChatGPT Site has its own publication workflow; a GitHub push does not automatically deploy it unless you separately set up that integration.
