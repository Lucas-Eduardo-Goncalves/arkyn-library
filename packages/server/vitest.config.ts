import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { mainFields: ["module"] },
  test: { testTimeout: 1000000 },
});
