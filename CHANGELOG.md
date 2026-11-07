# brotli-wasm-2

## 0.0.1

### Patch Changes

- [`f480bc1`](https://github.com/jeremy-code/brotli-wasm-2/commit/f480bc1549057d3af7b864fae3e3a6b6b8881f0c) Thanks [@jeremy-code](https://github.com/jeremy-code)! - chore: resolve node loader for workerd condition in package.json

- [`89b9317`](https://github.com/jeremy-code/brotli-wasm-2/commit/89b93178078cd47a10975791e7f26275fc9d9564) Thanks [@jeremy-code](https://github.com/jeremy-code)! - chore: resolve browser loader for Bun

  - Bun doesn't support source phase imports, but it does support fetching file URLs,
    so resolve the browser loader
