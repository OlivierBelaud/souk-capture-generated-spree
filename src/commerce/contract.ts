export const commercePlan = {
  "version": 1,
  "mode": "hybrid",
  "pages": [
    {
      "captureId": "87a180f4-d5d8-4c0a-a5a8-9c2ad3704b2b",
      "routePath": "/de/de",
      "role": "home",
      "sections": [
        {
          "index": 0,
          "kind": "product-grid",
          "dynamicSource": "catalog"
        },
        {
          "index": 1,
          "kind": "generic",
          "dynamicSource": "static"
        }
      ]
    },
    {
      "captureId": "2d1bbe7c-615b-416d-93ff-0d9f88710c46",
      "routePath": "/de/de/products",
      "role": "collection",
      "sections": [
        {
          "index": 0,
          "kind": "product-grid",
          "dynamicSource": "catalog"
        },
        {
          "index": 1,
          "kind": "generic",
          "dynamicSource": "static"
        }
      ]
    },
    {
      "captureId": "26b9e539-e1e1-46f8-836b-3151beada5e1",
      "routePath": "/states/listing-default",
      "role": "collection",
      "sections": [
        {
          "index": 0,
          "kind": "product-grid",
          "dynamicSource": "catalog"
        },
        {
          "index": 1,
          "kind": "generic",
          "dynamicSource": "static"
        }
      ]
    },
    {
      "captureId": "7d473be3-0fa7-43b0-98cc-0e5a9a3d43c7",
      "routePath": "/de/de/c/kitchen",
      "role": "collection",
      "sections": [
        {
          "index": 0,
          "kind": "product-grid",
          "dynamicSource": "catalog"
        },
        {
          "index": 1,
          "kind": "generic",
          "dynamicSource": "static"
        }
      ]
    },
    {
      "captureId": "63b8f340-c82e-4047-b1e5-285d913946a9",
      "routePath": "/de/de/products/digitale-heissluftfritteuse-6-2l",
      "role": "product",
      "sections": [
        {
          "index": 0,
          "kind": "generic",
          "dynamicSource": "static"
        },
        {
          "index": 1,
          "kind": "product-showcase",
          "dynamicSource": "product"
        },
        {
          "index": 2,
          "kind": "generic",
          "dynamicSource": "static"
        }
      ]
    },
    {
      "captureId": "9629ff8b-3aae-4b32-b11d-8932b4af1ee8",
      "routePath": "/states/product-structured",
      "role": "product",
      "sections": [
        {
          "index": 0,
          "kind": "generic",
          "dynamicSource": "static"
        },
        {
          "index": 1,
          "kind": "product-showcase",
          "dynamicSource": "product"
        },
        {
          "index": 2,
          "kind": "generic",
          "dynamicSource": "static"
        }
      ]
    },
    {
      "captureId": "cbfae0c4-89c7-4ee9-82cc-246900add4a6",
      "routePath": "/states/product-cart-drawer-open",
      "role": "product",
      "sections": [
        {
          "index": 0,
          "kind": "generic",
          "dynamicSource": "static"
        },
        {
          "index": 1,
          "kind": "product-showcase",
          "dynamicSource": "product"
        },
        {
          "index": 2,
          "kind": "generic",
          "dynamicSource": "static"
        }
      ]
    },
    {
      "captureId": "3d69fb5b-95de-4611-b97b-cbbb06425da4",
      "routePath": "/de/de/cart",
      "role": "cart",
      "sections": [
        {
          "index": 0,
          "kind": "generic",
          "dynamicSource": "cart"
        },
        {
          "index": 1,
          "kind": "generic",
          "dynamicSource": "cart"
        }
      ]
    },
    {
      "captureId": "28cdf598-3431-441f-ab60-2bcd8c4d4aa4",
      "routePath": "/authentication/55145660472/login",
      "role": "account",
      "sections": [
        {
          "index": 0,
          "kind": "generic",
          "dynamicSource": "static"
        },
        {
          "index": 1,
          "kind": "generic",
          "dynamicSource": "static"
        },
        {
          "index": 2,
          "kind": "generic",
          "dynamicSource": "static"
        },
        {
          "index": 3,
          "kind": "newsletter",
          "dynamicSource": "content"
        }
      ]
    },
    {
      "captureId": "3c0f2a8a-755a-4e89-a2d6-7af484a7da9e",
      "routePath": "/states/account-dashboard",
      "role": "account",
      "sections": [
        {
          "index": 0,
          "kind": "generic",
          "dynamicSource": "customer"
        },
        {
          "index": 1,
          "kind": "generic",
          "dynamicSource": "customer"
        },
        {
          "index": 2,
          "kind": "generic",
          "dynamicSource": "customer"
        },
        {
          "index": 3,
          "kind": "newsletter",
          "dynamicSource": "customer"
        }
      ]
    }
  ],
  "sharedComponents": [
    "Header",
    "Footer",
    "Navigation",
    "Search",
    "CartTrigger",
    "ProductGrid",
    "ProductGallery",
    "CartDrawer",
    "Filters",
    "AccountNavigation"
  ],
  "contentModels": [
    "EditorialSection",
    "MediaAsset",
    "NavigationMenu"
  ],
  "connectorContract": {
    "catalog": [
      "listProducts",
      "getProduct",
      "listCollections",
      "searchProducts"
    ],
    "cart": [
      "getCart",
      "addItem",
      "updateItem",
      "removeItem"
    ],
    "customer": [
      "getCustomer",
      "listOrders",
      "getWishlist"
    ],
    "content": [
      "getPage",
      "getNavigation",
      "getLocalizedContent"
    ]
  },
  "notes": [
    "Pixels and interactions remain owned by the deterministic Ditto compiler and fidelity gates.",
    "/de/de/products and /states/listing-default are classified as collection (all-products catalog listing) rather than product; declaredPageType 'listing' maps to collection role.",
    "/authentication/55145660472/login is classified as account (login entry point) rather than unknown, consistent with the account-dashboard state sharing the same urlPath.",
    "CartDrawer is surfaced as a shared component activated from the product-showcase section on the cart-drawer-open state capture.",
    "QuantitySelector and AddToCart are bound exclusively to product-showcase sections with dynamicSource product.",
    "Cart page sections both draw from dynamicSource cart: section 0 renders line items, section 1 renders order summary and checkout trigger."
  ]
} as const;

export interface CommerceConnector {
  listProducts(input?: Record<string, unknown>): Promise<unknown[]>;
  getProduct(handle: string): Promise<unknown | null>;
  listCollections(input?: Record<string, unknown>): Promise<unknown[]>;
  searchProducts(query: string, input?: Record<string, unknown>): Promise<unknown[]>;
  getCart(): Promise<unknown>;
  addItem(variantId: string, quantity: number): Promise<unknown>;
  updateItem(lineId: string, quantity: number): Promise<unknown>;
  removeItem(lineId: string): Promise<unknown>;
  getCustomer(): Promise<unknown | null>;
  listOrders(input?: Record<string, unknown>): Promise<unknown[]>;
  getWishlist(): Promise<unknown[]>;
  getPage(handle: string, locale?: string): Promise<unknown | null>;
  getNavigation(handle: string, locale?: string): Promise<unknown | null>;
  getLocalizedContent(handle: string, locale: string): Promise<unknown | null>;
}
