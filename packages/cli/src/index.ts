import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { runInit } from "./commands/init";

const HELP_TEXT = `Usage: arkyn <command> [flags]

Commands:
  init --agents   Create or update AGENTS.md in the current project, referencing
                  the AGENTS.md docs shipped by installed @arkyn/* packages.

Flags:
  -h, --help      Show this help message
  -v, --version   Show the installed @arkyn/cli version
`;

/** Reads the version from this package's own package.json — never hardcoded. */
function getVersion(): string {
	const currentDir = dirname(fileURLToPath(import.meta.url));
	const packageJsonPath = join(currentDir, "..", "package.json");
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

	return packageJson.version;
}

function runCli(argv: string[]) {
	const [command, ...flags] = argv;

	if (command === "-v" || command === "--version") {
		console.log(getVersion());
		return;
	}

	if (!command || command === "-h" || command === "--help") {
		console.log(HELP_TEXT);
		return;
	}

	if (command === "init") {
		if (!flags.includes("--agents")) {
			console.error("arkyn init requires the --agents flag.\n");
			console.log(HELP_TEXT);
			process.exitCode = 1;
			return;
		}

		runInit(process.cwd());
		return;
	}

	console.error(`Unknown command: ${command}\n`);
	console.log(HELP_TEXT);
	process.exitCode = 1;
}

// Only auto-run when this file is the process entrypoint (the published
// `bin`), not when it's imported by a test.
const isDirectlyExecuted = import.meta.url === `file://${process.argv[1]}`;
if (isDirectlyExecuted) runCli(process.argv.slice(2));

export { getVersion, HELP_TEXT, runCli };
