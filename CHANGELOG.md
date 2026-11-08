# brotli-wasm-2

## 0.0.2

### Patch Changes

- [`4c8994b`](https://github.com/jeremy-code/brotli-wasm-2/commit/4c8994bf8b2b7acec230dba1c8626313a2e8da8e) Thanks [@jeremy-code](https://github.com/jeremy-code)! - perf: update Dockerfile to include Binaryen installation and add wasm-opt step in compile script

  - 827654 bytes to 803455 bytes

- [`2c6dd37`](https://github.com/jeremy-code/brotli-wasm-2/commit/2c6dd37a23f1239b97f3bb90ff5ae79b37932f6b) Thanks [@jeremy-code](https://github.com/jeremy-code)! - fix: resolve node loader and not browser for workerd condition in package.json

- [`0a16801`](https://github.com/jeremy-code/brotli-wasm-2/commit/0a16801c77fdd49fa7ff7c550b5902d8c1c318bc) Thanks [@jeremy-code](https://github.com/jeremy-code)! - fix: replace get_undefined with __builtin_wasm_ref_null_extern and update return types to allow null

- [`10d50b6`](https://github.com/jeremy-code/brotli-wasm-2/commit/10d50b610aa795b95b7550c2406e7c90074cd8bd) Thanks [@jeremy-code](https://github.com/jeremy-code)! - chore: keep target_features section in Wasm binary

  - It's only 167 bytes and it has some value for debugging and analysis

## 0.0.1

### Patch Changes

- [`f480bc1`](https://github.com/jeremy-code/brotli-wasm-2/commit/f480bc1549057d3af7b864fae3e3a6b6b8881f0c) Thanks [@jeremy-code](https://github.com/jeremy-code)! - chore: resolve node loader for workerd condition in package.json

- [`89b9317`](https://github.com/jeremy-code/brotli-wasm-2/commit/89b93178078cd47a10975791e7f26275fc9d9564) Thanks [@jeremy-code](https://github.com/jeremy-code)! - chore: resolve browser loader for Bun

  - Bun doesn't support source phase imports, but it does support fetching file URLs,
    so resolve the browser loader
