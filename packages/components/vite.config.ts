import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { AtRule, type Root } from "postcss";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react({ jsxRuntime: "automatic" })],
	css: {
		postcss: {
			plugins: [
				{
					postcssPlugin: "wrap-in-layer",
					Once(root: Root) {
						const layerNode = new AtRule({
							name: "layer",
							params: "arkyn",
						});

						root.each((node) => {
							layerNode.append(node.clone());
						});

						root.removeAll();
						root.append(layerNode);
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
