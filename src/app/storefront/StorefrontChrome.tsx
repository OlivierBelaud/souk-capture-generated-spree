import type { ComponentPropsWithoutRef } from "react";

export function StorefrontHeader(props: ComponentPropsWithoutRef<"header">) {
  return <header {...props} />;
}

export function StorefrontFooter(props: ComponentPropsWithoutRef<"footer">) {
  return <footer {...props} />;
}
