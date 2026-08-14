import { existsSync } from "node:fs";
import { join } from "node:path";

export interface ArkynAgentsDoc {
	name: string;
	relativePath: string;
}

export function resolveAgentsDocs(
	cwd: string,
	packageNames: string[],
	exists: (absolutePath: string) => boolean = existsSync,
): ArkynAgentsDoc[] {
	return packageNames
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
