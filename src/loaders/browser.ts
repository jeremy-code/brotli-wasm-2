const module = WebAssembly.compileStreaming(
  fetch(new URL("../brotli.wasm", import.meta.url)),
);

export { module };
