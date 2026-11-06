/**
 * EDIT YOUR STORE HERE — no build step needed.
 * Prices are whole Indian rupees. Product order = Featured order.
 * Duplicate a product to add a listing; give it a unique, permanent id.
 * Set active: false to hide a product. Sizes express preferences, not stock.
 * Put product PNGs in assets/products/ and list their paths under images.
 * The first image is the cover; extra images get view-switching buttons.
 * Keep all private keys, payment details and customer data out of this file.
 */
window.STORE = {
  "name": "MENSHOOD",
  "instagram": "https://www.instagram.com/menshood__official/",
  "whatsappNumber": "919336454309",
  "catalogueApproved": true,
  "currency": "INR",
  "products": [
    {
      "id": "ivory-script-shirt",
      "name": "The Script Shirt",
      "category": "Shirts",
      "color": "Ivory",
      "swatch": "#e5dfcc",
      "price": 1199,
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "fit": "Embroidered back",
      "description": "An ivory long-sleeve button-front shirt with subtle chest script and a statement embroidered back. Explore both views, then confirm your preferred size and exact measurements with the team.",
      "active": true,
      "images": [
        {
          "src": "assets/products/script-front.png",
          "label": "Front view"
        },
        {
          "src": "assets/products/script-back.png",
          "label": "Back view"
        }
      ]
    },
    {
      "id": "washed-olive-shirt",
      "name": "The Washed Shirt",
      "category": "Shirts",
      "color": "Washed olive",
      "swatch": "#74694f",
      "price": 999,
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "fit": "Chest pocket",
      "description": "A washed olive-brown shirt with a textured appearance, button front, chest pocket, and long sleeves. Pair it with dark denim or neutral trousers.",
      "active": true,
      "images": [
        {
          "src": "assets/products/washed-olive-shirt.png",
          "label": "Front view"
        }
      ]
    },
    {
      "id": "cream-embroidered-shirt",
      "name": "The Signature Shirt",
      "category": "Shirts",
      "color": "Cream",
      "swatch": "#e8e1bb",
      "price": 1199,
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "fit": "Embroidered back",
      "description": "A cream long-sleeve shirt with a chest crest, subtle hem embroidery, and contrasting script across the back. View both sides and ask the team for exact garment measurements.",
      "active": true,
      "images": [
        {
          "src": "assets/products/signature-front.png",
          "label": "Front view"
        },
        {
          "src": "assets/products/signature-back.png",
          "label": "Back view"
        }
      ]
    },
    {
      "id": "coral-button-down",
      "name": "The Coral Shirt",
      "category": "Shirts",
      "color": "Coral red",
      "swatch": "#cc4e42",
      "price": 899,
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "fit": "Button-down collar",
      "description": "A coral-red shirt with a button-down collar, contrasting light buttons, and a small embroidered chest emblem. An easy way to bring colour into your everyday rotation.",
      "active": true,
      "images": [
        {
          "src": "assets/products/coral-button-down.png",
          "label": "Front view"
        }
      ]
    },
    {
      "id": "rust-track-shirt",
      "name": "The Track-Stripe Shirt",
      "category": "Shirts",
      "color": "Rust orange",
      "swatch": "#a45934",
      "price": 1099,
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "fit": "Boxy silhouette",
      "description": "A rust-orange boxy shirt with black stripes along the shoulders and sleeves, chest patches, and bold lettering. A statement piece for a casual outfit.",
      "active": true,
      "images": [
        {
          "src": "assets/products/rust-track-shirt.png",
          "label": "Front view"
        }
      ]
    },
    {
      "id": "orange-joggers",
      "name": "The Drawstring Joggers",
      "category": "Bottoms",
      "color": "Bright orange",
      "swatch": "#e66b16",
      "price": 799,
      "sizes": [
        "S",
        "M",
        "L",
        "XL",
        "XXL"
      ],
      "fit": "Drawstring waist",
      "description": "Bright-orange trousers with an elasticated waistband, a light drawstring, and a small black upper-leg emblem. Confirm your preferred size and fit with the team.",
      "active": true,
      "images": [
        {
          "src": "assets/products/orange-joggers.png",
          "label": "Front view"
        }
      ]
    },
    {
      "id": "heritage-jeans",
      "name": "The Heritage Jeans",
      "category": "Bottoms",
      "color": "Vintage indigo",
      "swatch": "#4e5049",
      "price": 1499,
      "sizes": [
        "28",
        "30",
        "32",
        "34",
        "36"
      ],
      "fit": "Contrast stitching",
      "description": "Vintage-wash denim with bold contrast stitching, whisker fading, and a distinctive flap coin pocket. A relaxed everyday statement; confirm waist and length measurements before ordering.",
      "active": true,
      "images": [
        {
          "src": "assets/products/heritage-jeans.png",
          "label": "Front view"
        }
      ]
    },
    {
      "id": "vintage-jeans",
      "name": "The Vintage Straight",
      "category": "Bottoms",
      "color": "Faded blue-grey",
      "swatch": "#74766a",
      "price": 1399,
      "sizes": [
        "28",
        "30",
        "32",
        "34",
        "36"
      ],
      "fit": "Straight fit",
      "description": "A faded blue-grey wash with a worn-in look, subtle distressed details, and a straight leg. Pair with a clean shirt or relaxed tee. Confirm your preferred waist size with the team.",
      "active": true,
      "images": [
        {
          "src": "assets/products/vintage-jeans.png",
          "label": "Front view"
        }
      ]
    },
    {
      "id": "charcoal-jeans",
      "name": "The Afterhours Jeans",
      "category": "Bottoms",
      "color": "Washed charcoal",
      "swatch": "#454641",
      "price": 1399,
      "sizes": [
        "28",
        "30",
        "32",
        "34",
        "36"
      ],
      "fit": "Straight fit",
      "description": "Dark charcoal denim with whiskered thighs, light fading, and small distressed details. An easy straight-leg option for your everyday rotation.",
      "active": true,
      "images": [
        {
          "src": "assets/products/charcoal-jeans.png",
          "label": "Front view"
        }
      ]
    },
    {
      "id": "panel-jeans",
      "name": "The Panel Baggy Jeans",
      "category": "Bottoms",
      "color": "Washed sage",
      "swatch": "#777a67",
      "price": 1599,
      "sizes": [
        "28",
        "30",
        "32",
        "34",
        "36"
      ],
      "fit": "Baggy fit",
      "description": "A loose baggy silhouette in washed sage-grey denim, finished with distinctive curved panel seams. Ask the team about available sizes and exact measurements.",
      "active": true,
      "images": [
        {
          "src": "assets/products/panel-jeans.png",
          "label": "Front view"
        }
      ]
    },
    {
      "id": "ocean-jeans",
      "name": "The Ocean Wash Jeans",
      "category": "Bottoms",
      "color": "Ocean blue",
      "swatch": "#8c9c9d",
      "price": 1499,
      "sizes": [
        "28",
        "30",
        "32",
        "34",
        "36"
      ],
      "fit": "Relaxed straight fit",
      "description": "Light ocean-blue denim with vintage fading, distressed accents, and a relaxed straight leg. Style with a neutral shirt or a bold layer.",
      "active": true,
      "images": [
        {
          "src": "assets/products/ocean-jeans.png",
          "label": "Front view"
        }
      ]
    }
  ],
  "phoneNumbers": [
    {
      "number": "919336454309",
      "label": "+91 93364 54309"
    },
    {
      "number": "919569446458",
      "label": "+91 95694 46458"
    }
  ],
  "address": [
    "Khoya Mandi Bus Stop Road",
    "Near Globe Café, Raebareli"
  ],
  "logo": "assets/menshood-logo-charcoal.png"
};
