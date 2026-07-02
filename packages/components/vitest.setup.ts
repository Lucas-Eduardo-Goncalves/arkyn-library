import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement `HTMLElement.isContentEditable`, which slate-react
// relies on internally to recognize DOM targets that belong to the editor
// (focus/blur/beforeinput handling all gate on it). Without this, typing,
// focus, and blur inside RichText's editable area silently never fire.
Object.defineProperty(HTMLElement.prototype, "isContentEditable", {
	configurable: true,
	get(this: HTMLElement) {
		let node: HTMLElement | null = this;
		while (node) {
			const value = node.getAttribute?.("contenteditable");
			if (value === "true" || value === "") return true;
			if (value === "false") return false;
			node = node.parentElement;
		}
		return false;
	},
});
