import { module } from "brotli-wasm-2/loaders";

import { getImports } from "./imports.ts";
import type { Options } from "./interfaces.ts";

const instance = await Promise.resolve(module).then((resolvedModule) =>
  WebAssembly.instantiate(resolvedModule, getImports()),
);

type Exports = {
  brotliCompress: (
    input: ArrayBufferLike | ArrayBufferView,
    options?: Options,
  ) => Uint8Array<ArrayBuffer> | null;
  brotliDecompress: (
    input: ArrayBufferLike | ArrayBufferView,
  ) => Uint8Array<ArrayBuffer> | null;
  version: () => string;
};

const { brotliCompress, brotliDecompress, version } =
  instance.exports as Exports;

export { brotliCompress, brotliDecompress, version };
