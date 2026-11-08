#pragma once

#include <stdint.h>

#define WASM_EXPORT(name) __attribute__((export_name(name)))
#define WASM_IMPORT(module, name)                                              \
  __attribute__((import_module(module), import_name(name)))

WASM_IMPORT("env", "getByteLength")
int get_byte_length(__externref_t target);

WASM_IMPORT("env", "copyBytesFromJs")
void copy_bytes_from_js(void *ptr, __externref_t target);

WASM_IMPORT("env", "serializeOptions")
uint32_t serialize_options(__externref_t target);

WASM_IMPORT("env", "copyBytesToJs")
__externref_t copy_bytes_to_js(void *ptr, int size);

WASM_IMPORT("env", "parseVersion")
__externref_t parse_version(uint32_t version);
