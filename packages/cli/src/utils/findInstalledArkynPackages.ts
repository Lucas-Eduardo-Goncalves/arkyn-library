interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	[key: string]: unknown;
}

const SELF_PACKAGE = "@arkyn/cli";

export function findInstalledArkynPackages(pkg: PackageJson): string[] {
	const names = new Set<string>();

	for (const name of Object.keys(pkg.dependencies ?? {})) {
		if (name.startsWith("@arkyn/")) names.add(name);
	}

	for (const name of Object.keys(pkg.devDependencies ?? {})) {
		if (name.startsWith("@arkyn/")) names.add(name);
	}

	names.delete(SELF_PACKAGE);

	return [...names].sort();
}
