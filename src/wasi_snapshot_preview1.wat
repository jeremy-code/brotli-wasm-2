;; The WASI module name "wasi_snapshot_preview1" is not compatible with ESM
;; integration. Using `wasm-merge` in `scripts/compile.sh`, merge this WAT
;; file to replace the module name to "./imports.js".

(module
  (import "./imports.js" "proc_exit"
    (func $proc_exit (param i32))
  )
  (import "./imports.js" "random_get"
    (func $random_get (param i32 i32) (result i32))
  )
  (export "proc_exit" (func $proc_exit))
  (export "random_get" (func $random_get))
)
