export const storefrontContract = {
  "version": 1,
  "routes": [
    {
      "captureId": "87a180f4-d5d8-4c0a-a5a8-9c2ad3704b2b",
      "sourceUrl": "https://demo.spreecommerce.org/de/de",
      "routePath": "/de/de",
      "pageType": "home",
      "stateLabel": "default"
    },
    {
      "captureId": "2d1bbe7c-615b-416d-93ff-0d9f88710c46",
      "sourceUrl": "https://demo.spreecommerce.org/de/de/products",
      "routePath": "/de/de/products",
      "pageType": "listing",
      "stateLabel": "all-products"
    },
    {
      "captureId": "26b9e539-e1e1-46f8-836b-3151beada5e1",
      "sourceUrl": "https://demo.spreecommerce.org/de/de/products",
      "routePath": "/states/listing-default",
      "pageType": "listing",
      "stateLabel": "default"
    },
    {
      "captureId": "7d473be3-0fa7-43b0-98cc-0e5a9a3d43c7",
      "sourceUrl": "https://demo.spreecommerce.org/de/de/c/kitchen",
      "routePath": "/de/de/c/kitchen",
      "pageType": "listing",
      "stateLabel": "category-kitchen"
    },
    {
      "captureId": "63b8f340-c82e-4047-b1e5-285d913946a9",
      "sourceUrl": "https://demo.spreecommerce.org/de/de/products/digitale-heissluftfritteuse-6-2l",
      "routePath": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "pageType": "product",
      "stateLabel": "default"
    },
    {
      "captureId": "9629ff8b-3aae-4b32-b11d-8932b4af1ee8",
      "sourceUrl": "https://demo.spreecommerce.org/de/de/products/digitale-heissluftfritteuse-6-2l",
      "routePath": "/states/product-structured",
      "pageType": "product",
      "stateLabel": "structured"
    },
    {
      "captureId": "cbfae0c4-89c7-4ee9-82cc-246900add4a6",
      "sourceUrl": "https://demo.spreecommerce.org/de/de/products/digitale-heissluftfritteuse-6-2l",
      "routePath": "/states/product-cart-drawer-open",
      "pageType": "product",
      "stateLabel": "cart-drawer-open"
    },
    {
      "captureId": "3d69fb5b-95de-4611-b97b-cbbb06425da4",
      "sourceUrl": "https://demo.spreecommerce.org/de/de/cart",
      "routePath": "/de/de/cart",
      "pageType": "cart",
      "stateLabel": "filled"
    },
    {
      "captureId": "28cdf598-3431-441f-ab60-2bcd8c4d4aa4",
      "sourceUrl": "https://shopify.com/authentication/55145660472/login",
      "routePath": "/authentication/55145660472/login",
      "pageType": "login",
      "stateLabel": "unauthenticated"
    },
    {
      "captureId": "3c0f2a8a-755a-4e89-a2d6-7af484a7da9e",
      "sourceUrl": "https://shopify.com/authentication/55145660472/login",
      "routePath": "/states/account-dashboard",
      "pageType": "account",
      "stateLabel": "dashboard"
    }
  ],
  "aliases": {
    "https://demo.spreecommerce.org/de/de": "/de/de",
    "https://demo.spreecommerce.org/de/de/c/kitchen": "/de/de/c/kitchen",
    "https://demo.spreecommerce.org/de/de/cart": "/de/de/cart",
    "https://demo.spreecommerce.org/de/de/products": "/de/de/products",
    "https://demo.spreecommerce.org/de/de/products/digitale-heissluftfritteuse-6-2l": "/de/de/products/digitale-heissluftfritteuse-6-2l",
    "https://shopify.com/authentication/55145660472/login": "/authentication/55145660472/login"
  },
  "transitions": [
    {
      "from": "/de/de/c/kitchen",
      "action": "close-search",
      "to": "/de/de/c/kitchen",
      "selector": "[aria-label=\"Suche schließen\"]"
    },
    {
      "from": "/de/de/c/kitchen",
      "action": "navigate",
      "to": "/de/de/c/kitchen",
      "selector": "a[href=\"/de/de/c/kitchen\"]",
      "targetPath": "/de/de/c/kitchen"
    },
    {
      "from": "/de/de/c/kitchen",
      "action": "navigate",
      "to": "/de/de/cart",
      "selector": "a[href=\"/de/de/cart\"]",
      "targetPath": "/de/de/cart"
    },
    {
      "from": "/de/de/c/kitchen",
      "action": "navigate",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "selector": "a[href=\"/de/de/products/digitale-heissluftfritteuse-6-2l?category_id=ctg_Ej9hxLZ9ck\"]",
      "targetPath": "/de/de/products/digitale-heissluftfritteuse-6-2l?category_id=ctg_Ej9hxLZ9ck"
    },
    {
      "from": "/de/de/c/kitchen",
      "action": "navigate",
      "to": "/de/de/products",
      "selector": "a[href=\"/de/de/products\"]",
      "targetPath": "/de/de/products"
    },
    {
      "from": "/de/de/c/kitchen",
      "action": "navigate",
      "to": "/de/de",
      "selector": "a[href=\"/de/de\"]",
      "targetPath": "/de/de"
    },
    {
      "from": "/de/de/c/kitchen",
      "action": "open-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[aria-label=\"Warenkorb öffnen\"]"
    },
    {
      "from": "/de/de/cart",
      "action": "close-search",
      "to": "/de/de/cart",
      "selector": "[aria-label=\"Suche schließen\"]"
    },
    {
      "from": "/de/de/cart",
      "action": "navigate",
      "to": "/de/de/c/kitchen",
      "selector": "a[href=\"/de/de/c/kitchen\"]",
      "targetPath": "/de/de/c/kitchen"
    },
    {
      "from": "/de/de/cart",
      "action": "navigate",
      "to": "/de/de/cart",
      "selector": "a[href=\"/de/de/cart\"]",
      "targetPath": "/de/de/cart"
    },
    {
      "from": "/de/de/cart",
      "action": "navigate",
      "to": "/de/de/products",
      "selector": "a[href=\"/de/de/products\"]",
      "targetPath": "/de/de/products"
    },
    {
      "from": "/de/de/cart",
      "action": "navigate",
      "to": "/de/de",
      "selector": "a[href=\"/de/de\"]",
      "targetPath": "/de/de"
    },
    {
      "from": "/de/de/cart",
      "action": "open-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[aria-label=\"Warenkorb öffnen\"]"
    },
    {
      "from": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "action": "add-to-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[data-slot=\"button\"]"
    },
    {
      "from": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "action": "close-search",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "selector": "[aria-label=\"Suche schließen\"]"
    },
    {
      "from": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "action": "navigate",
      "to": "/de/de/c/kitchen",
      "selector": "a[href=\"/de/de/c/kitchen\"]",
      "targetPath": "/de/de/c/kitchen"
    },
    {
      "from": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "action": "navigate",
      "to": "/de/de/cart",
      "selector": "a[href=\"/de/de/cart\"]",
      "targetPath": "/de/de/cart"
    },
    {
      "from": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "action": "navigate",
      "to": "/de/de/products",
      "selector": "a[href=\"/de/de/products\"]",
      "targetPath": "/de/de/products"
    },
    {
      "from": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "action": "navigate",
      "to": "/de/de",
      "selector": "a[href=\"/de/de\"]",
      "targetPath": "/de/de"
    },
    {
      "from": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "action": "open-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[aria-label=\"Warenkorb öffnen\"]"
    },
    {
      "from": "/de/de/products",
      "action": "close-search",
      "to": "/de/de/products",
      "selector": "[aria-label=\"Suche schließen\"]"
    },
    {
      "from": "/de/de/products",
      "action": "navigate",
      "to": "/de/de/c/kitchen",
      "selector": "a[href=\"/de/de/c/kitchen\"]",
      "targetPath": "/de/de/c/kitchen"
    },
    {
      "from": "/de/de/products",
      "action": "navigate",
      "to": "/de/de/cart",
      "selector": "a[href=\"/de/de/cart\"]",
      "targetPath": "/de/de/cart"
    },
    {
      "from": "/de/de/products",
      "action": "navigate",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "selector": "a[href=\"/de/de/products/digitale-heissluftfritteuse-6-2l\"]",
      "targetPath": "/de/de/products/digitale-heissluftfritteuse-6-2l"
    },
    {
      "from": "/de/de/products",
      "action": "navigate",
      "to": "/de/de/products",
      "selector": "a[href=\"/de/de/products\"]",
      "targetPath": "/de/de/products"
    },
    {
      "from": "/de/de/products",
      "action": "navigate",
      "to": "/de/de",
      "selector": "a[href=\"/de/de\"]",
      "targetPath": "/de/de"
    },
    {
      "from": "/de/de/products",
      "action": "open-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[aria-label=\"Warenkorb öffnen\"]"
    },
    {
      "from": "/de/de",
      "action": "close-search",
      "to": "/de/de",
      "selector": "[aria-label=\"Suche schließen\"]"
    },
    {
      "from": "/de/de",
      "action": "navigate",
      "to": "/de/de/c/kitchen",
      "selector": "a[href=\"/de/de/c/kitchen\"]",
      "targetPath": "/de/de/c/kitchen"
    },
    {
      "from": "/de/de",
      "action": "navigate",
      "to": "/de/de/cart",
      "selector": "a[href=\"/de/de/cart\"]",
      "targetPath": "/de/de/cart"
    },
    {
      "from": "/de/de",
      "action": "navigate",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "selector": "a[href=\"/de/de/products/digitale-heissluftfritteuse-6-2l\"]",
      "targetPath": "/de/de/products/digitale-heissluftfritteuse-6-2l"
    },
    {
      "from": "/de/de",
      "action": "navigate",
      "to": "/de/de/products",
      "selector": "a[href=\"/de/de/products\"]",
      "targetPath": "/de/de/products"
    },
    {
      "from": "/de/de",
      "action": "navigate",
      "to": "/de/de",
      "selector": "a[href=\"/de/de\"]",
      "targetPath": "/de/de"
    },
    {
      "from": "/de/de",
      "action": "open-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[aria-label=\"Warenkorb öffnen\"]"
    },
    {
      "from": "/states/listing-default",
      "action": "close-search",
      "to": "/de/de/products",
      "selector": "[aria-label=\"Suche schließen\"]"
    },
    {
      "from": "/states/listing-default",
      "action": "navigate",
      "to": "/de/de/c/kitchen",
      "selector": "a[href=\"/de/de/c/kitchen\"]",
      "targetPath": "/de/de/c/kitchen"
    },
    {
      "from": "/states/listing-default",
      "action": "navigate",
      "to": "/de/de/cart",
      "selector": "a[href=\"/de/de/cart\"]",
      "targetPath": "/de/de/cart"
    },
    {
      "from": "/states/listing-default",
      "action": "navigate",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "selector": "a[href=\"/de/de/products/digitale-heissluftfritteuse-6-2l\"]",
      "targetPath": "/de/de/products/digitale-heissluftfritteuse-6-2l"
    },
    {
      "from": "/states/listing-default",
      "action": "navigate",
      "to": "/de/de/products",
      "selector": "a[href=\"/de/de/products\"]",
      "targetPath": "/de/de/products"
    },
    {
      "from": "/states/listing-default",
      "action": "navigate",
      "to": "/de/de",
      "selector": "a[href=\"/de/de\"]",
      "targetPath": "/de/de"
    },
    {
      "from": "/states/listing-default",
      "action": "open-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[aria-label=\"Warenkorb öffnen\"]"
    },
    {
      "from": "/states/product-cart-drawer-open",
      "action": "close-cart",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "selector": "[aria-label=\"Warenkorb schließen\"]"
    },
    {
      "from": "/states/product-cart-drawer-open",
      "action": "close-search",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "selector": "[aria-label=\"Suche schließen\"]"
    },
    {
      "from": "/states/product-cart-drawer-open",
      "action": "escape",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l"
    },
    {
      "from": "/states/product-cart-drawer-open",
      "action": "navigate",
      "to": "/de/de/c/kitchen",
      "selector": "a[href=\"/de/de/c/kitchen\"]",
      "targetPath": "/de/de/c/kitchen"
    },
    {
      "from": "/states/product-cart-drawer-open",
      "action": "navigate",
      "to": "/de/de/cart",
      "selector": "a[href=\"/de/de/cart\"]",
      "targetPath": "/de/de/cart"
    },
    {
      "from": "/states/product-cart-drawer-open",
      "action": "navigate",
      "to": "/de/de/products",
      "selector": "a[href=\"/de/de/products\"]",
      "targetPath": "/de/de/products"
    },
    {
      "from": "/states/product-cart-drawer-open",
      "action": "navigate",
      "to": "/de/de",
      "selector": "a[href=\"/de/de\"]",
      "targetPath": "/de/de"
    },
    {
      "from": "/states/product-structured",
      "action": "add-to-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[data-slot=\"button\"]"
    },
    {
      "from": "/states/product-structured",
      "action": "close-search",
      "to": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "selector": "[aria-label=\"Suche schließen\"]"
    },
    {
      "from": "/states/product-structured",
      "action": "navigate",
      "to": "/de/de/c/kitchen",
      "selector": "a[href=\"/de/de/c/kitchen\"]",
      "targetPath": "/de/de/c/kitchen"
    },
    {
      "from": "/states/product-structured",
      "action": "navigate",
      "to": "/de/de/cart",
      "selector": "a[href=\"/de/de/cart\"]",
      "targetPath": "/de/de/cart"
    },
    {
      "from": "/states/product-structured",
      "action": "navigate",
      "to": "/de/de/products",
      "selector": "a[href=\"/de/de/products\"]",
      "targetPath": "/de/de/products"
    },
    {
      "from": "/states/product-structured",
      "action": "navigate",
      "to": "/de/de",
      "selector": "a[href=\"/de/de\"]",
      "targetPath": "/de/de"
    },
    {
      "from": "/states/product-structured",
      "action": "open-cart",
      "to": "/states/product-cart-drawer-open",
      "selector": "[aria-label=\"Warenkorb öffnen\"]"
    }
  ]
} as const;
