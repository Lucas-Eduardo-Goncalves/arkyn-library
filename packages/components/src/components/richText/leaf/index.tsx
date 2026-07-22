import type { RenderLeafProps } from "slate-react";
import "./styles.css";

function Leaf({ attributes, children, leaf }: RenderLeafProps) {
	if (leaf.bold) children = <strong>{children}</strong>;
	if (leaf.code) children = <code>{children}</code>;
	if (leaf.italic) children = <em>{children}</em>;
	if (leaf.underline) children = <u>{children}</u>;
	if (leaf.link) {
		children = (
			<a className="arkynLeafLink" href={leaf.href}>
				{children}
			</a>
		);
	}

	return <span {...attributes}>{children}</span>;
}

export { Leaf };
