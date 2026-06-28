import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: "wrap-in-layer",
          Once(root: any, { AtRule }: any) {
            const layer = new AtRule({ name: "layer", params: "arkyn" });
            layer.append(root.nodes.slice());
            root.removeAll();
            root.append(layer);
          },
        },
      ],
    },
  },
  build: {
    minify: true,
    outDir: "./dist",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@arkyn/components",
      cssFileName: "style",
    },
    rollupOptions: {
      external: (id) =>
        !id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0"),
      output: [
        {
          dir: "./dist",
          entryFileNames: "index.js",
        },
        {
          dir: "./dist/modules",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
        },
      ],
    },
  },
});
