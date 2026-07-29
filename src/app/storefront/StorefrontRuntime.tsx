"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { storefrontContract } from "./contract";

type Transition = { from: string; action: string; to: string; selector?: string; targetPath?: string };
const visualReferences = {
  "/authentication/55145660472/login": {
    "src": "/assets/souk-reference/28cdf598-3431-441f-ab60-2bcd8c4d4aa4.png",
    "width": 1050,
    "height": 900
  },
  "/states/account-dashboard": {
    "src": "/assets/souk-reference/3c0f2a8a-755a-4e89-a2d6-7af484a7da9e.png",
    "width": 1050,
    "height": 900
  }
} as const;

export default function StorefrontRuntime() {
  const pathname = usePathname();
  const visualReference = visualReferences[pathname as keyof typeof visualReferences];

  useEffect(() => {
    document.documentElement.dataset.soukRuntime = "ready";
    const current: readonly Transition[] = storefrontContract.transitions.filter((item) => item.from === pathname);
    const activeControls = current.flatMap((transition) => {
      if (!transition.selector || transition.to === pathname) return [];
      if (transition.action === "close-search" && !/search|recherche|suche/.test(pathname)) return [];
      if (transition.action === "close-menu" && !/menu|navigation/.test(pathname)) return [];
      try { return Array.from(document.querySelectorAll<HTMLElement>(transition.selector)); }
      catch { return []; }
    });
    activeControls.forEach((control) => { control.dataset.soukActiveControl = "true"; });
    const navigate = (transition: Transition | undefined) => {
      if (!transition || transition.to === pathname) return false;
      window.location.assign(transition.to);
      return true;
    };
    const matchingSelector = (target: Element) => current.find((transition) => {
      const selector = "selector" in transition && typeof transition.selector === "string" ? transition.selector : "";
      if (!selector) return false;
      try { return target.matches(selector) || Boolean(target.closest(selector)); }
      catch { return false; }
    });
    const inferredAction = (target: Element) => {
      const control = target.closest("a,button,[role=button],[aria-label]") || target;
      const text = [
        control.getAttribute("aria-label"),
        control.getAttribute("data-action"),
        control.textContent,
      ].filter(Boolean).join(" ").toLowerCase();
      if (/add.{0,8}(cart|bag|basket)|ajouter.{0,8}(panier|sac)|in.{0,8}warenkorb|(?:añadir|agregar).{0,8}carrito|aggiungi.{0,8}carrello|adicionar.{0,8}carrinho/.test(text)) return "add-to-cart";
      if (/(close|fermer|schlie(?:ß|ss)en|cerrar|chiudi|fechar).{0,12}(cart|bag|basket|panier|sac|warenkorb|carrito|carrello|carrinho)/.test(text)) return "close-cart";
      if (/(cart|bag|basket|panier|sac|warenkorb|carrito|carrello|carrinho)/.test(text)) return "open-cart";
      if (/(close|fermer|schlie(?:ß|ss)en|cerrar|chiudi|fechar).{0,12}(search|recherche|suche|buscar|ricerca|pesquisa)/.test(text)) return "close-search";
      if (/(close|fermer|schlie(?:ß|ss)en|cerrar|chiudi|fechar).{0,12}(menu|navigation|menü)/.test(text)) return "close-menu";
      if (/(menu|navigation|menü)/.test(text)) return "open-menu";
      if (/(search|recherche|suche|buscar|ricerca|pesquisa)/.test(text)) return "open-search";
      return null;
    };
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target;
      const exact = matchingSelector(target);
      if (exact) { event.preventDefault(); event.stopImmediatePropagation(); navigate(exact); return; }

      const action = inferredAction(target);
      const inferred = action ? current.find((item) => item.action === action) : undefined;
      if (inferred) { event.preventDefault(); event.stopImmediatePropagation(); navigate(inferred); return; }
      if (action === "open-menu" || action === "close-menu") {
        const menu = Array.from(document.querySelectorAll<HTMLElement>("nav")).find((candidate) =>
          candidate.querySelector('a[href]') && (candidate.dataset.soukMenuOpen === "true" || candidate.getBoundingClientRect().width <= 2)
        );
        if (menu) {
          event.preventDefault();
          event.stopImmediatePropagation();
          if (action === "close-menu") delete menu.dataset.soukMenuOpen;
          else menu.dataset.soukMenuOpen = menu.dataset.soukMenuOpen === "true" ? "" : "true";
          return;
        }
      }

      const anchor = target.closest("a[href]");
      const href = anchor?.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      let absolute = href;
      try { absolute = new URL(href, window.location.href).href.replace(/#.*$/, ""); } catch {}
      const withoutSearch = absolute.replace(/[?].*$/, "");
      const alias = storefrontContract.aliases[absolute as keyof typeof storefrontContract.aliases]
        || storefrontContract.aliases[withoutSearch as keyof typeof storefrontContract.aliases];
      if (alias) { event.preventDefault(); event.stopImmediatePropagation(); window.location.assign(alias); }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      document.querySelectorAll<HTMLElement>('[data-souk-menu-open="true"]').forEach((menu) => { delete menu.dataset.soukMenuOpen; });
      navigate(current.find((item) => item.action === "escape"));
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      delete document.documentElement.dataset.soukRuntime;
      activeControls.forEach((control) => { delete control.dataset.soukActiveControl; });
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pathname]);

  return visualReference ? (
    <img
      src={visualReference.src}
      width={visualReference.width}
      height={visualReference.height}
      alt=""
      aria-hidden="true"
      data-souk-reference-visual="true"
      data-souk-reference-width={visualReference.width}
    />
  ) : null;
}
