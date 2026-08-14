import { runInit } from "./commands/init";

const HELP_TEXT = `Usage: arkyn <command> [flags]

Commands:
  init --agents   Create or update AGENTS.md in the current project, referencing
                  the AGENTS.md docs shipped by installed @arkyn/* packages.

Flags:
  -h, --help      Show this help message
`;

function main() {
	const [command, ...flags] = process.argv.slice(2);

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

main();
