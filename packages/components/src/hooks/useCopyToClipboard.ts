/**
 * copyWithFallback, copies `text` using a hidden `<textarea>` + `document.execCommand("copy")`.
 *
 * Used internally by `useCopyToClipboard` when `navigator.clipboard` is unavailable or rejects,
 * e.g. insecure contexts (non-HTTPS) or older browsers.
 *
 * @param text - Text to copy.
 * @returns `true` if the copy command succeeded, `false` otherwise.
 */

function copyWithFallback(text: string) {
	const textarea = document.createElement("textarea");
	textarea.value = text;
	textarea.style.position = "fixed";
	textarea.style.opacity = "0";
	document.body.appendChild(textarea);
	textarea.select();

	try {
		return document.execCommand("copy");
	} finally {
		document.body.removeChild(textarea);
	}
}

/**
 * useCopyToClipboard, copies text to the clipboard and reports whether it succeeded.
 *
 * Tries `navigator.clipboard.writeText` first. If it's unavailable or rejects, falls back
 * to a hidden `<textarea>` with `document.execCommand("copy")`. Never throws; any failure
 * simply resolves to `false`.
 *
 * @returns An object with `copyToClipboard`, an async function that copies `text` and resolves
 * to `true` on success, `false` on failure.
 *
 * @example
 * ```tsx
 * function CopyButton({ value }) {
 *   const { copyToClipboard } = useCopyToClipboard();
 *
 *   async function handleClick() {
 *     const success = await copyToClipboard(value);
 *     if (success) console.log("Copied!");
 *   }
 *
 *   return <button onClick={handleClick}>Copy</button>;
 * }
 * ```
 */

function useCopyToClipboard() {
	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			try {
				return copyWithFallback(text);
			} catch {
				return false;
			}
		}
	}

	return { copyToClipboard };
}

export { useCopyToClipboard };
