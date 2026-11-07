type Options = {
  /**
   * Integer from 2 to 11 (inclusive).
   *
   * @default 11
   */
  quality?: number | undefined;
  /**
   * Integer from 10 to 24 (inclusive).
   *
   * @default 22
   */
  window?: number | undefined;
  mode?: "generic" | "text" | "font" | undefined;
};

export type { Options };
