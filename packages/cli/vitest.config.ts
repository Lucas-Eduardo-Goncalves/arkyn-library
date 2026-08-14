import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: { mainFields: ["module"] },
	test: {
		testTimeout: 10000,
		hookTimeout: 10000,
		teardownTimeout: 5000,
	},
});
