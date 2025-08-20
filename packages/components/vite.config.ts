import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
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
        "react-router",
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
