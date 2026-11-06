# MENSHOOD

A clean, responsive menswear storefront with 11 products, front/back shirt galleries, subtle shopping animations, search, filters, saved items, a persistent bag, and a WhatsApp order request.

**Edit products and prices in [`dist/catalogue.js`](dist/catalogue.js).** This is the single source of truth for the catalogue, phone numbers, Instagram link, address and logo. No build or installation step is required.

## Run locally

Install Node.js 20 or newer, then run:

```sh
npm start
```

Open `http://127.0.0.1:3000`. Save your edits and refresh. Run `npm run check` before pushing. There are no third-party runtime dependencies.

## Everyday catalogue edits

| Change | Edit in `dist/catalogue.js` |
| --- | --- |
| Price | `price: 1199` means ₹1,199; use a number, no currency symbol |
| Name/description | `name` and `description` |
| Size choices | `sizes`, e.g. `["28", "30", "32", "34"]` |
| Cover photo | First entry in `images` |
| Front/back photos | Add more `{src, label}` entries to `images` |
| Hide a listing | Set `active` to `false` |
| Featured order | Move the product object up/down in `products` |
| Add a listing | Duplicate a product, change its unique `id`, then edit its fields |
| Main WhatsApp | `whatsappNumber`, international digits only |
| Footer phone numbers | `phoneNumbers` |
| Brand logo/address | `logo` and `address` |

Place product PNGs in `dist/assets/products/`. Keep filenames lowercase with hyphens. Use paths such as `assets/products/new-shirt.png`. Never reuse a product ID for a different garment: browsers use IDs for saved bags. Changing a price automatically updates bag totals. Product counts are calculated automatically.

Full examples and instructions: [Editing the catalogue](docs/CATALOGUE.md).

## Project map

| File | Purpose |
| --- | --- |
| `dist/catalogue.js` | All routine business/catalogue edits |
| `dist/index.html` | Page content and accessible dialog structure |
| `dist/styles.css` | Layout, theme and motion (includes reduced-motion support) |
| `dist/app.js` | Gallery, filters, search, cart and order-review interactions |
| `dist/core.js` | Cart validation, totals and WhatsApp message generation |
| `dist/assets/` | Local photos, logo and fonts |
| `tests/` | Catalogue consistency and order calculation checks |
| `scripts/serve.mjs` | Dependency-free local preview server |

`dist/` is the editable static website, not generated build output. Deploy its contents to any static host. `.openai/hosting.json` belongs to the existing ChatGPT Site; preserve its project ID. GitHub source storage and website hosting are separate; pushing to a new GitHub repository alone does not change the live Site.

## Orders and privacy

Primary WhatsApp: **+91 93364 54309**. Additional footer contact: **+91 95694 46458**.

Size buttons record a preferred size, not a stock guarantee. Prices were chosen with the owner's authorisation; stock, final delivered total, payment and delivery are confirmed by the store. The visitor reviews a message before opening WhatsApp and decides whether to send it there. There is no automatic order submission, payment collection, inventory system or courier tracking.

Only bag and saved product IDs persist in local storage. Name, city, PIN and notes stay in page memory until the visitor opens WhatsApp. There is no customer database. Never place API keys or private customer information in public frontend files.

## Images and branding

Product PNGs are cleaned and straightened edits of owner-supplied Instagram screenshots. Some fabric hidden by interface overlays has been reconstructed; confirm exact product details with the store. Two shirts have front/back images. The charcoal logo retains the original Menshood circular mark and lettering. Hero/editorial imagery remains illustrative concept photography. Keep the original logo image for reference. Fonts are locally hosted Barlow Condensed and Manrope.

## Launch status

The existing ChatGPT Site remains owner-private with `noindex`. Before a public launch, confirm size/stock data, garment measurements, shipping terms, returns/exchanges and payment arrangements, then explicitly change the Site audience. No license is granted to third parties for the brand or clothing imagery by this repository.
