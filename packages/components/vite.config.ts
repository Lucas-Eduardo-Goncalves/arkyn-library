import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  build: {
    minify: true,
    outDir: "./dist",
    rollupOptions: {
      external: [
        "@react-input/mask",
        "framer-motion",
        "lucide-react",
        "react",
        "react-dom",
        "react/jsx-runtime",
      ],
      output: { format: "esm" },
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@arkyn/components",
      fileName: "bundle",
    },
  },
});
