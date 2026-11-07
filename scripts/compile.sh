#!/bin/bash

OUTPUT_DIR="${PWD}/dist"

if [ ! -d "${OUTPUT_DIR}" ]; then
  mkdir -p "${OUTPUT_DIR}"
fi

OPTIONS=(
  -O3
  -flto
  --sysroot=/opt/wasi-sdk/share/wasi-sysroot
  --target=wasm32-wasip1
  --wasm-opt
  -Wl,--import-memory
  -Wl,--initial-memory=524288
  -Wl,--lto-O3
  -Wl,--no-entry
  -Wl,--strip-all
  -nostartfiles
)

clang \
  ${OPTIONS[@]} \
  -I/opt/brotli/include \
  -L/opt/brotli/lib \
  -lbrotlienc \
  -lbrotlidec \
  -lbrotlicommon \
  -o $OUTPUT_DIR/brotli.wasm \
  $PWD/src/brotli.c
