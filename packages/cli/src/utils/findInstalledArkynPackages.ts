import { isValidPackageName } from "./resolveAgentsDocs";

export interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	[key: string]: unknown;
}

const SELF_PACKAGE = "@arkyn/cli";

function collectArkynNames(
	deps: Record<string, string> | undefined,
	names: Set<string>,
): void {
	for (const name of Object.keys(deps ?? {})) {
		if (!name.startsWith("@arkyn/")) continue;

		if (!isValidPackageName(name)) {
			console.warn(
				`arkyn init: ignoring "${name}" — not a valid package name.`,
			);
			continue;
		}

		names.add(name);
	}
}

export function findInstalledArkynPackages(pkg: PackageJson): string[] {
	const names = new Set<string>();

	collectArkynNames(pkg.dependencies, names);
	collectArkynNames(pkg.devDependencies, names);

	names.delete(SELF_PACKAGE);

	return [...names].sort();
}
