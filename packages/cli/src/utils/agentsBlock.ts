import type { ArkynAgentsDoc } from "./resolveAgentsDocs";

const START_MARKER = "<!-- arkyn:agents:start -->";
const END_MARKER = "<!-- arkyn:agents:end -->";

export function buildAgentsBlock(docs: ArkynAgentsDoc[]): string {
	const links = docs
		.map((doc) => `- [${doc.name}](${doc.relativePath})`)
		.join("\n");

	return [
		START_MARKER,
		"## Arkyn",
		"",
		"Consult each installed Arkyn package's AGENTS.md before using its components or utilities:",
		"",
		links,
		END_MARKER,
	].join("\n");
}

export function mergeAgentsBlock(
	existing: string | null,
	block: string,
): string {
	if (!existing) return `${block}\n`;

	const start = existing.indexOf(START_MARKER);
	const end = existing.indexOf(END_MARKER);

	if (start !== -1 && end !== -1) {
		return `${existing.slice(0, start)}${block}${existing.slice(
			end + END_MARKER.length,
		)}`;
	}

	const separator = existing.endsWith("\n") ? "\n" : "\n\n";
	return `${existing}${separator}${block}\n`;
}
