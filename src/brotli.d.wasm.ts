import type { Options } from "./interfaces.ts";

declare const brotliCompress: (
  input: ArrayBufferLike | ArrayBufferView,
  options?: Options,
) => Uint8Array<ArrayBuffer> | null;

declare const brotliDecompress: (
  input: ArrayBufferLike | ArrayBufferView,
) => Uint8Array<ArrayBuffer> | null;

declare const version: () => string;

export { brotliCompress, brotliDecompress, version };
