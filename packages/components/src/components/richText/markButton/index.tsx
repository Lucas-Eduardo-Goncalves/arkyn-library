import type { LucideIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { useSlate } from "slate-react";

import { isMarkActive } from "../../../services/isMarkActive";
import { toggleMark } from "../../../services/toggleMark";
import type { RichTextMarkFormatType } from "../../../types/richTextTypes";

import "./styles.css";

type MarkButtonProps = {
	format: RichTextMarkFormatType;
	icon: LucideIcon;
};

function MarkButton({ format, icon: Icon }: MarkButtonProps) {
	const editor = useSlate();

	const isActive = isMarkActive(editor, format);
	const activeClass = isActive ? "activeTrue" : "activeFalse";

	function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		toggleMark(editor, format);
	}

	return (
		<button
			type="button"
			className={`arkynRichTextMarkButton ${activeClass}`}
			onMouseDown={handleMouseDown}
		>
			<Icon />
		</button>
	);
}

export { MarkButton };
