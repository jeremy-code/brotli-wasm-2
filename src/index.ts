import { module } from "brotli-wasm-2/loaders";

import { getImports } from "./imports.ts";

const instance = await Promise.resolve<
  WebAssembly.Module | Promise<WebAssembly.Module>
>(module).then((resolvedModule) =>
  WebAssembly.instantiate(resolvedModule, getImports()),
);

const { brotliCompress, brotliDecompress, version } =
  instance.exports as typeof import("./brotli.wasm");

export { brotliCompress, brotliDecompress, version };
