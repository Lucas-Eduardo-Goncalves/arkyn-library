import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { runInit } from "../init";

describe("runInit", () => {
	let dir: string;

	beforeEach(() => {
		dir = mkdtempSync(join(tmpdir(), "arkyn-cli-init-"));
	});

	afterEach(() => {
		rmSync(dir, { recursive: true, force: true });
		process.exitCode = undefined;
		vi.restoreAllMocks();
	});

	it("should report a clear, informative error instead of throwing on malformed package.json", () => {
		const packageJsonPath = join(dir, "package.json");
		writeFileSync(packageJsonPath, "{ this is not valid json", "utf8");

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		expect(() => runInit(dir)).not.toThrow();

		expect(errorSpy).toHaveBeenCalledTimes(1);
		const [message] = errorSpy.mock.calls[0];
		expect(message).toContain(packageJsonPath);
		expect(message).toContain("Failed to parse");
		expect(process.exitCode).toBe(1);
	});

	it("should report an error for empty package.json content", () => {
		const packageJsonPath = join(dir, "package.json");
		writeFileSync(packageJsonPath, "", "utf8");

		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		expect(() => runInit(dir)).not.toThrow();

		expect(errorSpy).toHaveBeenCalledTimes(1);
		expect(errorSpy.mock.calls[0][0]).toContain(packageJsonPath);
		expect(process.exitCode).toBe(1);
	});

	it("should behave normally (no functional change) for valid package.json with no @arkyn/* deps", () => {
		writeFileSync(
			join(dir, "package.json"),
			JSON.stringify({ dependencies: { react: "^19.0.0" } }),
			"utf8",
		);

		const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		runInit(dir);

		expect(logSpy).toHaveBeenCalledWith(
			"No @arkyn/* packages found in dependencies or devDependencies.",
		);
		expect(errorSpy).not.toHaveBeenCalled();
		expect(process.exitCode).toBeUndefined();
	});
});
