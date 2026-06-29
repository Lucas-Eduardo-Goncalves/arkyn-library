import path from "node:path";

/**
 * Manages stack-trace configuration for debug output, allowing specific adapter/wrapper files
 * to be skipped so logs show the actual business-logic caller.
 *
 * @example
 * ```typescript
 * // Skip httpAdapter.ts so debug output shows the calling route instead
 * DebugService.setIgnoreFile("httpAdapter.ts");
 * ```
 */

class DebugService {
	/**
	 * The name of the file to ignore when analyzing the stack trace.
	 * When set, the `getCaller` function will skip stack frames containing this file name.
	 */
	static ignoreFiles: string[] = [];

	/**
	 * Adds a file name to the ignore list so it is skipped when resolving the caller in stack traces.
	 *
	 * @param file - File name to ignore (e.g. `"httpAdapter.ts"`).
	 */
	static setIgnoreFile(file: string): void {
		DebugService.ignoreFiles.push(file);
	}

	/** Resets the ignore list, restoring full stack trace analysis. */
	static clearIgnoreFiles(): void {
		DebugService.ignoreFiles = [];
	}

	/**
	 * Resolves the file path and function name of the code that triggered the current debug call,
	 * skipping internal node modules and any files registered with `setIgnoreFile`.
	 *
	 * @returns `{ functionName, callerInfo }` — caller function name and file path relative to `process.cwd()`.
	 */
	static getCaller() {
		const projectRoot = process.cwd();

		const err = new Error();
		const stack = err.stack || "";
		const stackLines = stack.split("\n").map((line) => line.trim());

		let callerIndex = 2;

		while (
			callerIndex < stackLines.length &&
			(stackLines[callerIndex].includes("node:internal") ||
				stackLines[callerIndex].includes("/node_modules/"))
		) {
			callerIndex++;
		}

		if (DebugService.ignoreFiles.length > 0) {
			while (
				callerIndex < stackLines.length &&
				DebugService.ignoreFiles.some((ignoreFile) =>
					stackLines[callerIndex].includes(ignoreFile),
				)
			) {
				callerIndex++;
			}
		}

		const callerLine = stackLines[callerIndex] || "";

		let functionName = "Unknown function";
		let callerInfo = "Unknown caller";

		const namedFunctionMatch = callerLine.match(/at\s+([^(\s]+)\s+\(([^)]+)\)/);
		if (namedFunctionMatch) {
			functionName = namedFunctionMatch[1];
			callerInfo = namedFunctionMatch[2];
		} else {
			const anonymousFunctionMatch = callerLine.match(/at\s+(.+)/);
			if (anonymousFunctionMatch) {
				callerInfo = anonymousFunctionMatch[1];

				const objectMethodMatch = callerInfo.match(/at\s+([^(\s]+)\s+/);
				if (objectMethodMatch && objectMethodMatch[1] !== "new") {
					functionName = objectMethodMatch[1];
				}
			}
		}

		if (callerInfo.includes("(")) {
			callerInfo = callerInfo.substring(
				callerInfo.indexOf("(") + 1,
				callerInfo.lastIndexOf(")"),
			);
		}

		callerInfo = callerInfo.split(":").slice(0, -2).join(":");

		try {
			callerInfo = path.relative(projectRoot, callerInfo);
		} catch (_e) {}

		return { functionName, callerInfo };
	}
}

export { DebugService };
