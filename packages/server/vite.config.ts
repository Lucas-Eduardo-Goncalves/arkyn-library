import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    minify: true,
    outDir: "./dist",
    rollupOptions: {
      external: [],
      output: { format: "esm" },
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@arkyn/server",
      fileName: "bundle",
    },
  },
});
