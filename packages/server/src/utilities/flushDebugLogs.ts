/**
 * Writes colored `[name] message` lines to the console, but only when
 * `NODE_ENV === "development"` or `DEBUG_MODE === "true"`. No-op in production.
 *
 * @param props.name - Label shown before each line (e.g. `"API"`, `"Auth"`).
 * @param props.scheme - Color of the label tag: `"cyan"` info, `"green"` success, `"yellow"` warning, `"red"` error.
 * @param props.debugs - Lines of text to print, one per console entry.
 *
 * @example
 * ```typescript
 * flushDebugLogs({
 *   name: "API",
 *   scheme: "cyan",
 *   debugs: ["POST /api/users", "Status: 201"],
 * });
 * ```
 */

function flushDebugLogs(props: {
	scheme: "yellow" | "cyan" | "red" | "green";
	name: string;
	debugs: string[];
}): void {
	const isDebugMode =
		process.env.NODE_ENV === "development" ||
		process.env?.DEBUG_MODE === "true";

	if (isDebugMode) {
		const reset = "\x1b[0m";

		const colors = {
			yellow: "\x1b[33m",
			cyan: "\x1b[36m",
			red: "\x1b[31m",
			green: "\x1b[32m",
		};

		const debugName = `${colors[props.scheme]}[${props.name}]${reset}`;
		let consoleData = `\n`;

		props.debugs.forEach((debug, index) => {
			consoleData += `${debugName} ${debug.trim()}`;
			if (index < props.debugs.length - 1) consoleData += `\n`;
		});

		console.log(consoleData);
	}
}

export { flushDebugLogs };
