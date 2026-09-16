import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getVersion, HELP_TEXT, runCli } from "../index";

function packageJsonVersion(): string {
	const packageJsonPath = join(__dirname, "..", "..", "package.json");
	return JSON.parse(readFileSync(packageJsonPath, "utf8")).version;
}

describe("getVersion (DX-08)", () => {
	it("should return the version from this package's own package.json", () => {
		expect(getVersion()).toBe(packageJsonVersion());
	});

	it("should match the semver shape", () => {
		expect(getVersion()).toMatch(/^\d+\.\d+\.\d+/);
	});
});

describe("runCli", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;

	afterEach(() => {
		logSpy?.mockRestore();
		errorSpy?.mockRestore();
		process.exitCode = undefined;
	});

	describe("--version / -v (DX-08)", () => {
		it("should print the package version for --version", () => {
			logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			runCli(["--version"]);

			expect(logSpy).toHaveBeenCalledWith(packageJsonVersion());
		});

		it("should print the package version for -v", () => {
			logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			runCli(["-v"]);

			expect(logSpy).toHaveBeenCalledWith(packageJsonVersion());
		});

		it("should not set a non-zero exit code for --version", () => {
			logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			runCli(["--version"]);

			expect(process.exitCode).toBeUndefined();
		});

		it("should print only the version, not the help text", () => {
			logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			runCli(["--version"]);

			expect(logSpy).toHaveBeenCalledTimes(1);
			expect(logSpy).not.toHaveBeenCalledWith(HELP_TEXT);
		});
	});

	describe("-h / --help", () => {
		it("should print the help text for --help", () => {
			logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			runCli(["--help"]);

			expect(logSpy).toHaveBeenCalledWith(HELP_TEXT);
		});

		it("should print the help text when no command is given", () => {
			logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

			runCli([]);

			expect(logSpy).toHaveBeenCalledWith(HELP_TEXT);
		});

		it("should document --version in the help text", () => {
			expect(HELP_TEXT).toContain("--version");
		});
	});

	describe("unknown command", () => {
		it("should print an error and set a non-zero exit code", () => {
			logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
			errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

			runCli(["bogus"]);

			expect(errorSpy).toHaveBeenCalledWith(
				expect.stringContaining("Unknown command: bogus"),
			);
			expect(process.exitCode).toBe(1);
		});
	});
});
