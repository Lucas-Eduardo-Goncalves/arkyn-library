import { existsSync } from "node:fs";
import { join } from "node:path";

export interface ArkynAgentsDoc {
	name: string;
	relativePath: string;
}

// A single "segment" of a package name: cannot start/end with a separator,
// cannot be empty, and only contains characters npm allows in a package name.
const NAME_SEGMENT = "[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?";
const UNSCOPED_NAME_PATTERN = new RegExp(`^${NAME_SEGMENT}$`);
const SCOPED_NAME_PATTERN = new RegExp(`^@${NAME_SEGMENT}/${NAME_SEGMENT}$`);

/**
 * Validates that a package name is safe to use when building filesystem
 * paths or Markdown content: no path traversal segments (`..`), no leading
 * `/` (absolute paths), no more than one `@scope/name` separator, and no
 * characters outside what npm allows in a real package name. This guards
 * against a malicious/malformed `package.json` steering `resolveAgentsDocs`
 * outside of `node_modules` or injecting content into `AGENTS.md`.
 */
export function isValidPackageName(name: string): boolean {
	if (typeof name !== "string" || name.length === 0) return false;

	return UNSCOPED_NAME_PATTERN.test(name) || SCOPED_NAME_PATTERN.test(name);
}

export function resolveAgentsDocs(
	cwd: string,
	packageNames: string[],
	exists: (absolutePath: string) => boolean = existsSync,
): ArkynAgentsDoc[] {
	return packageNames
		.filter((name) => {
			if (isValidPackageName(name)) return true;

			console.warn(
				`arkyn init: skipping "${name}" — not a valid package name.`,
			);
			return false;
		})
		.map((name) => {
			const parts = ["node_modules", ...name.split("/"), "AGENTS.md"];

			return {
				name,
				relativePath: parts.join("/"),
				absolutePath: join(cwd, ...parts),
			};
		})
		.filter((doc) => exists(doc.absolutePath))
		.map(({ name, relativePath }) => ({ name, relativePath }));
}
