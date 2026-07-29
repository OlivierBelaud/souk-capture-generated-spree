import "./globals.css";
import type { ReactNode } from "react";
import StorefrontRuntime from "./storefront/StorefrontRuntime";
import { SITE_ORIGIN } from "../lib/site";

export const metadata = {
  "metadataBase": new URL(SITE_ORIGIN || "http://localhost:3000"),
  "title": "Spree Commerce Demo | Next.js Ecommerce Storefront",
  "description": "Explore a live Next.js storefront powered by Spree Commerce open source. Browse products, add to cart, and check out, then build your own with the quickstart guide.",
  "keywords": [
    "spree commerce demo",
    "next.js ecommerce",
    "open source ecommerce",
    "headless commerce"
  ],
  "alternates": {
    "canonical": "https://demo.spreecommerce.org/de/de",
    "languages": {
      "en-US": "https://demo.spreecommerce.org/us/en",
      "de-DE": "https://demo.spreecommerce.org/de/de",
      "fr-FR": "https://demo.spreecommerce.org/fr/fr",
      "es-ES": "https://demo.spreecommerce.org/es/es",
      "en-GB": "https://demo.spreecommerce.org/gb/en",
      "x-default": "https://demo.spreecommerce.org/us/en"
    }
  },
  "openGraph": {
    "title": "Spree Commerce Demo | Next.js Ecommerce Storefront",
    "description": "Explore a live Next.js storefront powered by Spree Commerce open source. Browse products, add to cart, and check out, then build your own with the quickstart guide.",
    "type": "website",
    "url": "https://demo.spreecommerce.org/de/de",
    "images": [
      "https://demo.spreecommerce.org/social-image.webp"
    ]
  },
  "twitter": {
    "card": "summary_large_image",
    "title": "Spree Commerce Demo | Next.js Ecommerce Storefront",
    "description": "Explore a live Next.js storefront powered by Spree Commerce open source. Browse products, add to cart, and check out, then build your own with the quickstart guide.",
    "site": "@spreecommerce",
    "images": [
      "https://demo.spreecommerce.org/social-image.webp"
    ]
  },
  "icons": {
    "icon": [
      {
        "url": "/assets/cloned/images/43ffd884d516.ico",
        "type": "image/x-icon",
        "sizes": "256x256"
      }
    ]
  }
};
export const viewport = {
  "width": "device-width",
  "initialScale": 1
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={"de"}>
      <body className="cn0" data-cid="n0">
        <StorefrontRuntime />
        {children}
      </body>
    </html>
  );
}
