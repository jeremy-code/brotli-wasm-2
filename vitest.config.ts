import { playwright } from "@vitest/browser-playwright";
import { defineConfig, type ViteUserConfig } from "vitest/config";

const vitestConfig: ViteUserConfig = defineConfig({
  test: {
    environment: "node",
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [{ browser: "chromium" }],
      headless: true,
      ui: false,
      screenshotFailures: false,
    },
  },
});

export default vitestConfig;
