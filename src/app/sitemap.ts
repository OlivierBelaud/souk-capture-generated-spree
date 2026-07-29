import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "../lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/de/de",
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/de/de/products",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/states/listing-default",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/de/de/c/kitchen",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/de/de/products/digitale-heissluftfritteuse-6-2l",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/states/product-structured",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/states/product-cart-drawer-open",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/de/de/cart",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/authentication/55145660472/login",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: SITE_ORIGIN + "https://demo.spreecommerce.org/states/account-dashboard",
    changeFrequency: "weekly",
    priority: 0.7,
  },
  ];
}
