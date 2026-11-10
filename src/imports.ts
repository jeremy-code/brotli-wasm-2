import type { Options } from "./interfaces.ts";

let memory = new WebAssembly.Memory({ initial: 8 });

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

class ProcessExit extends Error {
  code: number;

  constructor(code: number) {
    super(`proc_exit=${code}`);
    this.code = code;
  }
}

const getByteLength = (val: ArrayBufferLike | ArrayBufferView) =>
  val.byteLength;

const copyBytesFromJs = (
  ptr: number,
  data: ArrayBufferLike | ArrayBufferView,
) => {
  new Uint8Array(memory.buffer, ptr, data.byteLength).set(
    ArrayBuffer.isView(data)
      ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
      : new Uint8Array(data),
  );
};

const copyBytesToJs = (ptr: number, size: number) =>
  new Uint8Array(memory.buffer, ptr, size).slice();

const enum Mode {
  Generic,
  Text,
  Font,
}

const serializeOptions = (options: Options) => {
  const quality = clamp(
    options?.quality ?? /* BROTLI_DEFAULT_QUALITY */ 11,
    2,
    /* BROTLI_MAX_QUALITY */ 11,
  );
  const window = clamp(
    options?.window ?? /* BROTLI_DEFAULT_WINDOW */ 22,
    /* BROTLI_MIN_WINDOW_BITS */ 10,
    /* BROTLI_MAX_WINDOW_BITS */ 24,
  );
  const mode = options?.mode ?? /* BROTLI_DEFAULT_MODE */ "generic";
  const modeInt =
    mode === "generic"
      ? Mode.Generic
      : mode === "text"
        ? Mode.Text
        : mode === "font"
          ? Mode.Font
          : Mode.Generic;
  if (!Number.isInteger(quality) || !Number.isInteger(window)) {
    throw new Error("Options must be an integer");
  }
  return (modeInt << 16) | (window << 8) | quality;
};

// Inverse of https://github.com/google/brotli/blob/d89c4b1c52e25ddafe047bc78bbee5c1e24b1809/c/common/version.h#L14
const parseVersion = (version: number) => {
  const major = (version >> 24) & 0xff;
  const minor = (version >> 12) & 0xfff;
  const patch = version & 0xfff;

  return `${major}.${minor}.${patch}`;
};

// https://github.com/WebAssembly/WASI/blob/wasi-0.1/preview0/docs.md#-proc_exitrval-exitcode
const proc_exit = (rval: number) => {
  throw new ProcessExit(rval);
};

// https://github.com/WebAssembly/WASI/blob/wasi-0.1/preview0/docs.md#-random_getbuf-pointeru8-buf_len-size---result-errno
const random_get = (buf: number, buf_len: number) => {
  crypto.getRandomValues(new Uint8Array(memory.buffer, buf, buf_len));
  return 0; /* Success */
};

const getImports = (options?: { memory?: WebAssembly.Memory | undefined }) => {
  if (options?.memory !== undefined) {
    memory = options.memory;
  }

  return {
    "./imports.js": {
      memory,
      getByteLength,
      copyBytesFromJs,
      serializeOptions,
      copyBytesToJs,
      parseVersion,
      proc_exit,
      random_get,
    },
  } satisfies WebAssembly.Imports;
};

export {
  // WebAssembly imports
  memory,
  getByteLength,
  copyBytesFromJs,
  serializeOptions,
  copyBytesToJs,
  parseVersion,
  proc_exit,
  random_get,
  // Additional exports
  getImports,
  ProcessExit,
};
