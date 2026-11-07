---
"brotli-wasm-2": patch
---

chore: resolve browser loader for Bun

- Bun doesn't support source phase imports, but it does support fetching file URLs,
  so resolve the browser loader
