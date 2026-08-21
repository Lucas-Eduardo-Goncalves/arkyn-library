import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildAgentsBlock, mergeAgentsBlock } from "../utils/agentsBlock";
import {
	findInstalledArkynPackages,
	type PackageJson,
} from "../utils/findInstalledArkynPackages";
import { resolveAgentsDocs } from "../utils/resolveAgentsDocs";

export function runInit(cwd: string): void {
	const packageJsonPath = join(cwd, "package.json");

	if (!existsSync(packageJsonPath)) {
		console.error(
			`No package.json found in ${cwd}. Run this command from your project root.`,
		);
		process.exitCode = 1;
		return;
	}

	const rawPackageJson = readFileSync(packageJsonPath, "utf8");

	let pkg: PackageJson;
	try {
		pkg = JSON.parse(rawPackageJson) as PackageJson;
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		console.error(`Failed to parse ${packageJsonPath}: ${reason}`);
		process.exitCode = 1;
		return;
	}

	const packageNames = findInstalledArkynPackages(pkg);

	if (packageNames.length === 0) {
		console.log(
			"No @arkyn/* packages found in dependencies or devDependencies.",
		);
		return;
	}

	const docs = resolveAgentsDocs(cwd, packageNames);

	if (docs.length === 0) {
		console.log(
			`Found ${packageNames.join(", ")}, but none of them ship an AGENTS.md yet.`,
		);
		return;
	}

	const agentsPath = join(cwd, "AGENTS.md");
	const existing = existsSync(agentsPath)
		? readFileSync(agentsPath, "utf8")
		: null;

	const block = buildAgentsBlock(docs);
	writeFileSync(agentsPath, mergeAgentsBlock(existing, block));

	console.log(
		`Updated AGENTS.md with docs for: ${docs.map((doc) => doc.name).join(", ")}`,
	);
}
