#include "brotli.h"
#include <brotli/decode.h>
#include <brotli/encode.h>
#include <stdlib.h>

typedef struct Options {
  int quality : 8;
  int window : 8;
  BrotliEncoderMode mode : 8;
} Options;

typedef union ParsedOptions {
  Options options;
  uint32_t bits;
} ParsedOptions;

static inline Options deserialize_options(uint32_t options_value) {
  ParsedOptions parsed_options = {.bits = options_value};
  return parsed_options.options;
}

WASM_EXPORT("brotliCompress")
__externref_t brotli_compress(__externref_t buf, __externref_t js_options) {
  Options options = deserialize_options(serialize_options(js_options));
  int input_size = get_byte_length(buf);
  uint8_t *input_ptr = malloc(input_size * sizeof(uint8_t));
  if (input_ptr == NULL) {
    return __builtin_wasm_ref_null_extern();
  }
  copy_bytes_from_js(input_ptr, buf);

  size_t output_size = BrotliEncoderMaxCompressedSize(input_size);
  if (output_size == 0) {
    free(input_ptr);
    return __builtin_wasm_ref_null_extern();
  }

  uint8_t *output_ptr = malloc(output_size);
  if (output_ptr == NULL) {
    free(input_ptr);
    return __builtin_wasm_ref_null_extern();
  }

  BROTLI_BOOL result =
      BrotliEncoderCompress(options.quality, options.window, options.mode,
                            input_size, input_ptr, &output_size, output_ptr);

  if (result != BROTLI_TRUE) {
    free(input_ptr);
    free(output_ptr);
    return __builtin_wasm_ref_null_extern();
  }

  __externref_t output = copy_bytes_to_js(output_ptr, output_size);
  free(input_ptr);
  free(output_ptr);
  return output;
}

WASM_EXPORT("brotliDecompress")
__externref_t brotli_decompress(__externref_t buf) {
  int input_size = get_byte_length(buf);
  uint8_t *input_ptr = malloc(input_size * sizeof(uint8_t));
  if (input_ptr == NULL) {
    return __builtin_wasm_ref_null_extern();
  }
  copy_bytes_from_js(input_ptr, buf);

  BrotliDecoderState *state = BrotliDecoderCreateInstance(NULL, NULL, NULL);
  if (state == NULL) {
    free(input_ptr);
    return __builtin_wasm_ref_null_extern();
  }

  size_t output_capacity = input_size * 4;
  if (output_capacity < 4096) {
    output_capacity = 4096;
  }

  uint8_t *output_ptr = malloc(output_capacity);
  if (output_ptr == NULL) {
    free(input_ptr);
    BrotliDecoderDestroyInstance(state);
    return __builtin_wasm_ref_null_extern();
  }

  BrotliDecoderResult result = BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT;
  size_t available_in = input_size;
  const uint8_t *next_in = input_ptr;
  size_t available_out = output_capacity;
  uint8_t *next_out = output_ptr;

  uint8_t output_size;
  while (1) {
    result = BrotliDecoderDecompressStream(state, &available_in, &next_in,
                                           &available_out, &next_out, NULL);

    if (result == BROTLI_DECODER_RESULT_SUCCESS) {
      output_size = output_capacity - available_out;
      break;
    } else if (result == BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT) {
      size_t bytes_written = output_capacity - available_out;
      size_t new_output_capacity = output_capacity * 2;
      uint8_t *new_output_ptr = realloc(output_ptr, new_output_capacity);
      if (new_output_ptr == NULL) {
        free(input_ptr);
        free(output_ptr);
        BrotliDecoderDestroyInstance(state);
        return __builtin_wasm_ref_null_extern();
      }
      output_ptr = new_output_ptr;
      next_out = output_ptr + bytes_written;
      available_out = new_output_capacity - bytes_written;
      output_capacity = new_output_capacity;
    } else {
      free(input_ptr);
      free(output_ptr);
      BrotliDecoderDestroyInstance(state);
      return __builtin_wasm_ref_null_extern();
    }
  }

  __externref_t output = copy_bytes_to_js(output_ptr, output_size);
  free(input_ptr);
  free(output_ptr);
  BrotliDecoderDestroyInstance(state);
  return output;
}

WASM_EXPORT("version")
__externref_t version() { return parse_version(BrotliEncoderVersion()); }
