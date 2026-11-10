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
  -Xlinker --import-memory=./imports.js,memory
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

FEATURE_OPTIONS=(
  --enable-reference-types
  --enable-bulk-memory-opt
  --enable-nontrapping-float-to-int
)

wasm-merge \
  $PWD/src/wasi_snapshot_preview1.wat wasi_snapshot_preview1 \
  $OUTPUT_DIR/brotli.wasm brotli \
  -o $OUTPUT_DIR/brotli.wasm \
  ${FEATURE_OPTIONS[@]}

wasm-opt \
  $OUTPUT_DIR/brotli.wasm \
  ${FEATURE_OPTIONS[@]} \
  --remove-exports="proc_exit,random_get" \
  --generate-global-effects \
  --flatten \
  --rereloop \
  -O3 \
  -O3 \
  --emit-target-features \
  -o $OUTPUT_DIR/brotli.wasm

# TypeScript doesn't copy handwritten declaration files
cp $PWD/src/brotli.d.wasm.ts $OUTPUT_DIR
