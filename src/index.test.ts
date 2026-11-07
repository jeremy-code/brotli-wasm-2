import { describe, expect, it } from "vitest";

import { brotliCompress, brotliDecompress, version } from "./index.ts";

/**
 * @see {@link https://github.com/google/brotli/blob/d89c4b1c52e25ddafe047bc78bbee5c1e24b1809/js/decode.ts#L77}
 * @see {@link https://www.rfc-editor.org/info/rfc7932/#section-9.1}
 */
function getBrotliWindowSizeParameter(data: Uint8Array) {
  const byte = data[0];
  const lastBit = byte & 0x01;
  if (lastBit === 0) {
    return 16;
  }
  let n = (byte >> 1) & 0b111;
  if (n !== 0) {
    return 17 + n;
  }
  n = (byte >> 4) & 7;
  if (n !== 0) {
    if (n === 1) {
      throw new Error("Large window is not enabled");
    }
    return 8 + n;
  }
  return 17;
}

describe("version", () => {
  it("returns the version", () => {
    expect(version()).toBeTypeOf("string");
    expect(version()).toMatchInlineSnapshot(`"1.2.1"`);
  });
});

describe("brotliCompress", () => {
  it("returns Uint8Array<ArrayBuffer>", () => {
    const compressedData = brotliCompress(
      new TextEncoder().encode("Hello world"),
    );
    expect(compressedData).toBeInstanceOf(Uint8Array);
    expect(compressedData.buffer).toBeInstanceOf(ArrayBuffer);
  });

  it("compresses empty data", () => {
    expect(brotliCompress(new Uint8Array())).toEqual(new Uint8Array([0x06]));
  });

  it("returns compressed data without options", () => {
    const data = new TextEncoder().encode("Hello world");
    const compressedData = brotliCompress(data);
    expect(compressedData).toEqual(
      new Uint8Array([0x0b, 0x05, 0x80, ...data, 0x03]),
    );
  });

  describe("window size", () => {
    it("defaults to lgwin of 22", () => {
      const data = new TextEncoder().encode("Hello world");
      expect(getBrotliWindowSizeParameter(brotliCompress(data))).toBe(22);
      expect(
        getBrotliWindowSizeParameter(
          brotliCompress(data, { mode: "text", quality: 2 }),
        ),
      ).toBe(22);
    });

    it("sets window size based on options", () => {
      const data = new TextEncoder().encode("Hello world");
      const compressedData = brotliCompress(data, {
        window: 10,
      });
      expect(compressedData).toBeInstanceOf(Uint8Array);
      expect(compressedData.buffer).toBeInstanceOf(ArrayBuffer);
      expect(compressedData).toEqual(
        new Uint8Array([0x21, 0x28, 0x00, 0x004, ...data, 0x03]),
      );
      expect(getBrotliWindowSizeParameter(compressedData)).toBe(10);
    });
  });
});

describe("brotliDecompress", () => {
  it("returns undefined for empty data", () => {
    expect(brotliDecompress(new Uint8Array())).toBeUndefined();
  });

  it("returns empty Uint8Array for compressed, empty data", () => {
    expect(brotliDecompress(new Uint8Array([0x06]))).toEqual(new Uint8Array());
  });

  it("returns uncompressed data", () => {
    const data = new TextEncoder().encode("Hello world");
    expect(
      brotliDecompress(new Uint8Array([0x0b, 0x05, 0x80, ...data, 0x03])),
    ).toEqual(data);
  });

  it("returns uncompressed data with window size", () => {
    const data = new TextEncoder().encode("Hello world");
    expect(
      brotliDecompress(
        new Uint8Array([0x21, 0x28, 0x00, 0x004, ...data, 0x03]),
      ),
    ).toEqual(data);
  });
});
