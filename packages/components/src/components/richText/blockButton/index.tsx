import type { LucideIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { useSlate } from "slate-react";

import { isBlockActive } from "../../../services/isBlockActive";
import { toggleBlock } from "../../../services/toggleBlock";
import { textAlignTypes } from "../../../templates/richTextTemplates";
import type {
	RichTextAlignFormatType,
	RichTextElementFormatType,
} from "../../../types/richTextTypes";

import "./styles.css";

type BlockButtonProps = {
	format: RichTextElementFormatType | RichTextAlignFormatType;
	icon: LucideIcon;
};

function BlockButton({ format, icon: Icon }: BlockButtonProps) {
	const editor = useSlate();

	const blockType = textAlignTypes.includes(format) ? "align" : "type";
	const isActive = isBlockActive(editor, format, blockType);

	const activeClass = isActive ? "activeTrue" : "activeFalse";

	function handleMouseDown(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		toggleBlock(editor, format);
	}

	return (
		<button
			type="button"
			className={`arkynRichTextBlockButton ${activeClass}`}
			onMouseDown={handleMouseDown}
		>
			<Icon />
		</button>
	);
}

export { BlockButton };
