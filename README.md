# Souk Capture — generated Spree storefront

This repository is a deployable preview produced by the Souk Capture pipeline
from ten captured storefront routes.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOlivierBelaud%2Fsouk-capture-generated-spree&project-name=souk-capture-generated-spree&repository-name=souk-capture-generated-spree)

## Run locally

```bash
npm ci
npm run dev
```

## Current scope

- Ten statically generated routes.
- Captured navigation states and local route transitions.
- No live commerce backend, checkout, authentication, inventory, or cart state.
- The login and account-dashboard routes currently use visual-reference
  fallbacks and must be reconstructed as semantic React before production use.

See `ARCHITECTURE.md` for the generated route and component inventory.
