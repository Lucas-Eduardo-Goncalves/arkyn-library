import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// export default defineConfig({
//   build: {
//     lib: {
//       entry: resolve(__dirname, "src/index.ts"),
//       formats: ["es"],
//     },
//     rollupOptions: {
//       external: (id) => !id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0"),
//       output: {
//         preserveModules: true,        // ← chave da mudança
//         preserveModulesRoot: "src",   // ← remove o prefixo "src/" dos paths gerados
//         entryFileNames: "[name].js",  // ← nomenclatura limpa
//         dir: "./dist",
//       },
//     },
//     minify: false,  // com preserveModules, minificar por arquivo geralmente é contraproducente
//                     // o bundler do consumidor fará a minificação
//   },
// });

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
    rollupOptions: {
      external: (id) =>
        !id.startsWith(".") && !id.startsWith("/") && !id.startsWith("\0"),
      output: {
        preserveModules: false,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        dir: "./dist",
      },
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "@arkyn/components",
      fileName: "bundle",
      formats: ["es"],
    },
  },
});
