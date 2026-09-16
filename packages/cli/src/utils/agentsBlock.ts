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

type Span = { start: number; end: number };
type Token = { index: number; tag: "start" | "end" };
type Edit = { start: number; end: number; replacement: string };

/** The full line containing `text[markerIndex..markerIndex+markerLength]`, newline included. */
function lineSpan(
	text: string,
	markerIndex: number,
	markerLength: number,
): Span {
	const start = text.lastIndexOf("\n", markerIndex) + 1;
	const nextNewline = text.indexOf("\n", markerIndex + markerLength);
	const end = nextNewline === -1 ? text.length : nextNewline + 1;
	return { start, end };
}

function findAllOccurrences(
	text: string,
	marker: string,
	tag: Token["tag"],
): Token[] {
	const tokens: Token[] = [];
	let from = 0;

	for (;;) {
		const index = text.indexOf(marker, from);
		if (index === -1) return tokens;
		tokens.push({ index, tag });
		from = index + marker.length;
	}
}

function applyEdits(text: string, edits: Edit[]): string {
	const sorted = [...edits].sort((a, b) => a.start - b.start);

	let result = "";
	let cursor = 0;
	for (const edit of sorted) {
		result += text.slice(cursor, edit.start) + edit.replacement;
		cursor = edit.end;
	}
	result += text.slice(cursor);

	return result;
}

/**
 * Merges the managed Arkyn block into `existing` AGENTS.md content.
 *
 * `existing` may contain content written by hand by the user outside the
 * markers, so this only ever touches text bounded by `START_MARKER`/
 * `END_MARKER` (or a single orphaned marker line) — it never guesses at or
 * deletes arbitrary surrounding content.
 *
 * Markers are matched with a single left-to-right pass that pairs each
 * `START_MARKER` with the next unmatched `END_MARKER`:
 * - The first well-formed `START…END` pair found is replaced with the
 *   fresh block (this is the common "file already has a block" case).
 * - Any *other* well-formed pair (duplicated/multiple full blocks) is
 *   fully removed — everything between such a pair was written by this
 *   function in a previous run, never by hand.
 * - Any marker that can't be paired (a lone `START` with no `END` after
 *   it, a lone `END` with no `START` before it, or markers in the wrong
 *   order) is corrupted state: only *that marker's own line* is removed,
 *   never the content around it.
 * - If no well-formed pair remains after that cleanup, the fresh block is
 *   appended at the end, exactly like a file that never had a block.
 */
export function mergeAgentsBlock(
	existing: string | null,
	block: string,
): string {
	if (!existing) return `${block}\n`;

	const tokens = [
		...findAllOccurrences(existing, START_MARKER, "start"),
		...findAllOccurrences(existing, END_MARKER, "end"),
	].sort((a, b) => a.index - b.index);

	const validRegions: Span[] = [];
	const orphanLines: Span[] = [];
	let pendingStart: number | null = null;

	for (const token of tokens) {
		if (token.tag === "start") {
			if (pendingStart !== null) {
				orphanLines.push(lineSpan(existing, pendingStart, START_MARKER.length));
			}
			pendingStart = token.index;
			continue;
		}

		if (pendingStart !== null) {
			validRegions.push({
				start: pendingStart,
				end: token.index + END_MARKER.length,
			});
			pendingStart = null;
		} else {
			orphanLines.push(lineSpan(existing, token.index, END_MARKER.length));
		}
	}
	if (pendingStart !== null) {
		orphanLines.push(lineSpan(existing, pendingStart, START_MARKER.length));
	}

	if (validRegions.length === 0) {
		const cleaned = applyEdits(
			existing,
			orphanLines.map((span) => ({ ...span, replacement: "" })),
		).replace(/\n{3,}/g, "\n\n");

		if (cleaned.trim() === "") return `${block}\n`;

		const separator = cleaned.endsWith("\n") ? "\n" : "\n\n";
		return `${cleaned}${separator}${block}\n`;
	}

	const [primary, ...duplicates] = validRegions;
	const edits: Edit[] = [
		{ ...primary, replacement: block },
		...duplicates.map((span) => ({ ...span, replacement: "" })),
		...orphanLines.map((span) => ({ ...span, replacement: "" })),
	];

	return applyEdits(existing, edits).replace(/\n{3,}/g, "\n\n");
}
