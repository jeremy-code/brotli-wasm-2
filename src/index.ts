import { module } from "brotli-wasm-2/loaders";

import { getImports } from "./imports.ts";
import { assertAllFeaturesAreSupported } from "./wasm.ts";

const getInstance = (): Promise<WebAssembly.Instance> => {
  assertAllFeaturesAreSupported();
  return Promise.resolve<WebAssembly.Module | Promise<WebAssembly.Module>>(
    module,
  ).then((resolvedModule) =>
    WebAssembly.instantiate(resolvedModule, getImports()),
  );
};

const instance = await getInstance();

const { brotliCompress, brotliDecompress, version } =
  instance.exports as typeof import("./brotli.wasm");

export { brotliCompress, brotliDecompress, version };
