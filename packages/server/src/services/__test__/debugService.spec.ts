import { beforeEach, describe, expect, it } from "vitest";

import { DebugService } from "../debugService";

describe("DebugService", () => {
	beforeEach(() => {
		DebugService.clearIgnoreFiles();
	});

	describe("setIgnoreFile", () => {
		it("should add a file to ignoreFiles array", () => {
			DebugService.setIgnoreFile("httpAdapter.ts");

			expect(DebugService.ignoreFiles).toContain("httpAdapter.ts");
		});

		it("should add multiple files to ignoreFiles array", () => {
			DebugService.setIgnoreFile("httpAdapter.ts");
			DebugService.setIgnoreFile("apiClient.ts");
			DebugService.setIgnoreFile("wrapper.ts");

			expect(DebugService.ignoreFiles).toHaveLength(3);
			expect(DebugService.ignoreFiles).toContain("httpAdapter.ts");
			expect(DebugService.ignoreFiles).toContain("apiClient.ts");
			expect(DebugService.ignoreFiles).toContain("wrapper.ts");
		});

		it("should allow duplicate file names", () => {
			DebugService.setIgnoreFile("httpAdapter.ts");
			DebugService.setIgnoreFile("httpAdapter.ts");

			expect(DebugService.ignoreFiles).toHaveLength(2);
		});

		it("should handle empty string", () => {
			DebugService.setIgnoreFile("");

			expect(DebugService.ignoreFiles).toContain("");
		});

		it("should handle file paths with directories", () => {
			DebugService.setIgnoreFile("src/adapters/httpAdapter.ts");

			expect(DebugService.ignoreFiles).toContain("src/adapters/httpAdapter.ts");
		});

		it("should handle files with different extensions", () => {
			DebugService.setIgnoreFile("adapter.js");
			DebugService.setIgnoreFile("helper.mjs");
			DebugService.setIgnoreFile("utils.cjs");

			expect(DebugService.ignoreFiles).toContain("adapter.js");
			expect(DebugService.ignoreFiles).toContain("helper.mjs");
			expect(DebugService.ignoreFiles).toContain("utils.cjs");
		});
	});

	describe("clearIgnoreFiles", () => {
		it("should clear all ignore files", () => {
			DebugService.setIgnoreFile("file1.ts");
			DebugService.setIgnoreFile("file2.ts");
			DebugService.setIgnoreFile("file3.ts");

			expect(DebugService.ignoreFiles).toHaveLength(3);

			DebugService.clearIgnoreFiles();

			expect(DebugService.ignoreFiles).toHaveLength(0);
			expect(DebugService.ignoreFiles).toEqual([]);
		});

		it("should be safe to call when array is already empty", () => {
			expect(() => DebugService.clearIgnoreFiles()).not.toThrow();
			expect(DebugService.ignoreFiles).toEqual([]);
		});

		it("should allow adding files after clearing", () => {
			DebugService.setIgnoreFile("original.ts");
			DebugService.clearIgnoreFiles();
			DebugService.setIgnoreFile("newFile.ts");

			expect(DebugService.ignoreFiles).toHaveLength(1);
			expect(DebugService.ignoreFiles).toContain("newFile.ts");
			expect(DebugService.ignoreFiles).not.toContain("original.ts");
		});

		it("should be safe to call multiple times", () => {
			DebugService.setIgnoreFile("file.ts");

			DebugService.clearIgnoreFiles();
			DebugService.clearIgnoreFiles();
			DebugService.clearIgnoreFiles();

			expect(DebugService.ignoreFiles).toEqual([]);
		});
	});

	describe("getCaller", () => {
		it("should return an object with functionName and callerInfo", () => {
			const result = DebugService.getCaller();

			expect(result).toHaveProperty("functionName");
			expect(result).toHaveProperty("callerInfo");
		});

		it("should return string values for functionName and callerInfo", () => {
			const result = DebugService.getCaller();

			expect(typeof result.functionName).toBe("string");
			expect(typeof result.callerInfo).toBe("string");
		});

		it("should not return empty strings", () => {
			const result = DebugService.getCaller();

			expect(result.functionName.length).toBeGreaterThan(0);
			expect(result.callerInfo.length).toBeGreaterThan(0);
		});

		it("should return relative path in callerInfo", () => {
			const result = DebugService.getCaller();

			expect(result.callerInfo).not.toContain(process.cwd());
		});

		it("should not include node_modules in callerInfo", () => {
			const result = DebugService.getCaller();

			expect(result.callerInfo).not.toContain("node_modules");
		});

		it("should not include node:internal in callerInfo", () => {
			const result = DebugService.getCaller();

			expect(result.callerInfo).not.toContain("node:internal");
		});

		describe("with named function", () => {
			function namedTestFunction() {
				return DebugService.getCaller();
			}

			it("should capture function name from named function", () => {
				const result = namedTestFunction();

				expect(result.functionName).not.toBe("Unknown function");
			});
		});

		describe("with ignore files configured", () => {
			it("should skip files in ignoreFiles array", () => {
				DebugService.setIgnoreFile("debugService.spec.ts");

				const result = DebugService.getCaller();

				expect(result.callerInfo).not.toContain("debugService.spec.ts");
			});

			it("should skip multiple ignored files", () => {
				DebugService.setIgnoreFile("debugService.spec.ts");
				DebugService.setIgnoreFile("runner.ts");

				const result = DebugService.getCaller();

				expect(result.callerInfo).not.toContain("debugService.spec.ts");
			});

			it("should work normally when ignore files do not match", () => {
				DebugService.setIgnoreFile("nonexistent-file.ts");

				const result = DebugService.getCaller();

				expect(result.callerInfo).not.toBe("Unknown caller");
				expect(result.callerInfo).toContain("debugService.spec.ts");
			});
		});

		describe("from different contexts", () => {
			it("should work when called from arrow function", () => {
				const arrowFn = () => DebugService.getCaller();

				const result = arrowFn();

				expect(result).toHaveProperty("functionName");
				expect(result).toHaveProperty("callerInfo");
			});

			it("should work when called from async function", async () => {
				async function asyncTestFn() {
					return DebugService.getCaller();
				}

				const result = await asyncTestFn();

				expect(result).toHaveProperty("functionName");
				expect(result).toHaveProperty("callerInfo");
			});

			it("should work when called from class method", () => {
				class TestClass {
					static testMethod() {
						return DebugService.getCaller();
					}
				}

				const result = TestClass.testMethod();

				expect(result).toHaveProperty("functionName");
				expect(result).toHaveProperty("callerInfo");
			});

			it("should work when called from nested function", () => {
				function outer() {
					function inner() {
						return DebugService.getCaller();
					}
					return inner();
				}

				const result = outer();

				expect(result).toHaveProperty("functionName");
				expect(result).toHaveProperty("callerInfo");
			});

			it("should work when called from callback", () => {
				let result: { functionName: string; callerInfo: string } | null = null;

				[1].forEach(() => {
					result = DebugService.getCaller();
				});

				expect(result).not.toBeNull();
				expect(result).toHaveProperty("functionName");
				expect(result).toHaveProperty("callerInfo");
			});
		});
	});

	describe("ignoreFiles property", () => {
		it("should be an array", () => {
			expect(Array.isArray(DebugService.ignoreFiles)).toBe(true);
		});

		it("should start empty after clearIgnoreFiles", () => {
			DebugService.clearIgnoreFiles();

			expect(DebugService.ignoreFiles).toEqual([]);
		});

		it("should be directly accessible", () => {
			DebugService.setIgnoreFile("test.ts");

			expect(DebugService.ignoreFiles[0]).toBe("test.ts");
		});

		it("should reflect all added files", () => {
			const files = ["a.ts", "b.ts", "c.ts", "d.ts", "e.ts"];

			files.forEach((file) => {
				DebugService.setIgnoreFile(file);
			});

			expect(DebugService.ignoreFiles).toEqual(files);
		});
	});

	describe("edge cases", () => {
		it("should handle special characters in file names", () => {
			DebugService.setIgnoreFile("file-with-dashes.ts");
			DebugService.setIgnoreFile("file_with_underscores.ts");
			DebugService.setIgnoreFile("file.multiple.dots.ts");

			expect(DebugService.ignoreFiles).toContain("file-with-dashes.ts");
			expect(DebugService.ignoreFiles).toContain("file_with_underscores.ts");
			expect(DebugService.ignoreFiles).toContain("file.multiple.dots.ts");
		});

		it("should handle unicode in file names", () => {
			DebugService.setIgnoreFile("文件.ts");
			DebugService.setIgnoreFile("αρχείο.ts");

			expect(DebugService.ignoreFiles).toContain("文件.ts");
			expect(DebugService.ignoreFiles).toContain("αρχείο.ts");
		});

		it("should handle very long file names", () => {
			const longFileName = `${"a".repeat(255)}.ts`;

			DebugService.setIgnoreFile(longFileName);

			expect(DebugService.ignoreFiles).toContain(longFileName);
		});

		it("should maintain order of added files", () => {
			DebugService.setIgnoreFile("first.ts");
			DebugService.setIgnoreFile("second.ts");
			DebugService.setIgnoreFile("third.ts");

			expect(DebugService.ignoreFiles[0]).toBe("first.ts");
			expect(DebugService.ignoreFiles[1]).toBe("second.ts");
			expect(DebugService.ignoreFiles[2]).toBe("third.ts");
		});
	});

	describe("singleton behavior", () => {
		it("should maintain state across multiple accesses", () => {
			DebugService.setIgnoreFile("persistent.ts");

			expect(DebugService.ignoreFiles).toContain("persistent.ts");
			expect(DebugService.ignoreFiles).toContain("persistent.ts");
		});

		it("should share state between different operations", () => {
			DebugService.setIgnoreFile("file1.ts");

			const ignoreFilesBeforeClear = [...DebugService.ignoreFiles];

			DebugService.clearIgnoreFiles();

			expect(ignoreFilesBeforeClear).toContain("file1.ts");
			expect(DebugService.ignoreFiles).not.toContain("file1.ts");
		});
	});
});
