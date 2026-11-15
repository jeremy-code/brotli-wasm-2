// Equivalent to https://github.com/GoogleChromeLabs/wasm-feature-detect but
// only for features used.

/**
 * wasm-as ./test.wast --enable-reference-types
 *
 * ```wat
 * (module
 *   (func
 *     ref.null func
 *     drop
 *   )
 * )
 * ```
 */
const isReferenceTypesSupported = () => {
  return WebAssembly.validate(
    new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x04, 0x01, 0x60,
      0x00, 0x00, 0x03, 0x02, 0x01, 0x00, 0x0a, 0x07, 0x01, 0x05, 0x00, 0xd0,
      0x70, 0x1a, 0x0b,
    ]),
  );
};

/**
 * wasm-as ./test.wast --enable-bulk-memory-opt
 *
 * ```wat
 * (module
 *  (memory 1)
 *  (func
 *    i32.const 0
 *    i32.const 0
 *    i32.const 0
 *    memory.copy
 *  )
 * )
 * ```
 */
const isBulkMemoryOperationsSupported = () => {
  return WebAssembly.validate(
    new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x04, 0x01, 0x60,
      0x00, 0x00, 0x03, 0x02, 0x01, 0x00, 0x05, 0x03, 0x01, 0x00, 0x01, 0x0a,
      0x0e, 0x01, 0x0c, 0x00, 0x41, 0x00, 0x41, 0x00, 0x41, 0x00, 0xfc, 0x0a,
      0x00, 0x00, 0x0b,
    ]),
  );
};

/**
 * wasm-as ./test.wast --enable-nontrapping-float-to-int
 *
 * ```wat
 * (module
 *  (func
 *    f32.const 0
 *    i32.trunc_sat_f32_s
 *    drop
 *  )
 * )
 * ```
 */
const isNonTrappingFloatToIntSupported = () => {
  return WebAssembly.validate(
    new Uint8Array([
      0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x04, 0x01, 0x60,
      0x00, 0x00, 0x03, 0x02, 0x01, 0x00, 0x0a, 0x0c, 0x01, 0x0a, 0x00, 0x43,
      0x00, 0x00, 0x00, 0x00, 0xfc, 0x00, 0x1a, 0x0b,
    ]),
  );
};

const assertAllFeaturesAreSupported = () => {
  if (!isNonTrappingFloatToIntSupported()) {
    throw new Error(
      "The feature 'Non-trapping Float-to-int Conversions' is not supported.",
    );
  }
  if (!isBulkMemoryOperationsSupported) {
    throw new Error("The feature 'Bulk Memory Operations' is not supported.");
  }
  if (!isReferenceTypesSupported) {
    throw new Error("The feature 'Reference Types' is not supported.");
  }
};

export { assertAllFeaturesAreSupported };
