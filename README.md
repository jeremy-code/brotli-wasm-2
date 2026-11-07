# brotli-wasm-2

[github-actions]: https://www.github.com/jeremy-code/brotli-wasm-2/actions/workflows/ci.yml
[github-actions-badge]: https://www.github.com/jeremy-code/brotli-wasm-2/actions/workflows/ci.yml/badge.svg
[license-badge]: https://img.shields.io/github/license/jeremy-code/brotli-wasm-2
[npm-version-badge]: https://img.shields.io/npm/v/brotli-wasm-2
[npm-package]: https://www.npmjs.com/package/brotli-wasm-2
[npm-package-size-badge]: https://badgen.net/packagephobia/install/brotli-wasm-2
[npm-package-size]: https://packagephobia.com/result?p=brotli-wasm-2

[![GitHub Actions][github-actions-badge]][github-actions] [![License][license-badge]](LICENSE) [![NPM version][npm-version-badge]][npm-package] [![NPM package size][npm-package-size-badge]][npm-package-size]

Documentation is available at this URL: <https://npmx.dev/package-docs/brotli-wasm-2>.

## Installation

```shell
npm install brotli-wasm-2 # npm
yarn add brotli-wasm-2    # yarn
pnpm add brotli-wasm-2    # pnpm
```

## Usage

### Node.js or Browser

```js
import { brotliCompress, brotliDecompress } from "brotli-wasm-2";

brotliCompress(new TextEncoder().encode("Hello world!"));
brotliCompress(new TextEncoder().encode("Hello world!"), {
  quality: 2,
  mode: "text",
});
brotliDecompress(brotliCompress(new TextEncoder().encode("Hello world!")));
```

This requires Node.js v24.0.5 or above (or Node.js v24.0.0 with flag `--js-source-phase-imports`). In Webpack, make sure [`experiments.sourceImport`](https://webpack.js.org/configuration/experiments/#experimentssourceimport) is set to true. This is also supported on Cloudflare's [workerd](https://github.com/cloudflare/workerd/blob/519e60ed20d0848c24920d128af266e74afa33f4/src/workerd/tests/module-imports-test.js#L23) and [Rollup](https://github.com/rollup/rollup/issues/6011).

### Manual instantiation fallback

The previous syntax should work on most runtimes and some bundlers (e.g. Rollup); however, if you want to instantiate it manually and use the exports directly from the WebAssembly instance, you can do so like this:

#### Vite

```ts
import init from "brotli-wasm-2/brotli.wasm?init";
import { getImports } from "brotli-wasm-2/imports";

const instance = await init(getImports());
const { brotliCompress, brotliDecompress } =
  instance.exports as typeof import("brotli-wasm-2");
```

#### Remote URL

```ts
import { getImports } from "brotli-wasm-2/imports";

const instance = await WebAssembly.instantiateStreaming(
  fetch("https://esm.sh/brotli-wasm-2@%5E0.0.1/brotli.wasm"),
  getImports(),
);
const { brotliCompress, brotliDecompress } =
  instance.exports as typeof import("brotli-wasm-2");
```

#### Unwasm, Vercel Edge

```ts
import mod from "brotli-wasm-2/brotli.wasm?module";
import { getImports } from "brotli-wasm-2/imports";

const instance = WebAssembly.instantiate(mod, getImports());
const { brotliCompress } = instance.exports as typeof import("brotli-wasm-2");
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.
