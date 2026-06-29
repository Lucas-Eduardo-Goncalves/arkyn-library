import type { HTMLAttributes } from "react";
import "./styles.css";

type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableHeader — `<thead>` section with an automatic spacing row below the header row.
 *
 * Pass `<th>` elements as children — they are wrapped in a `<tr>` automatically.
 * Accepts all standard HTML `<thead>` attributes.
 *
 * @returns TableHeader JSX element.
 *
 * @example
 * ```tsx
 * <TableHeader>
 *   <th>Name</th>
 *   <th>Email</th>
 *   <th>Actions</th>
 * </TableHeader>
 * ```
 */

function TableHeader(props: TableHeaderProps) {
	const { className: baseClassName, children, ...rest } = props;
	const className = `arkynTableHeader ${baseClassName}`;

	return (
		<thead className={className.trim()} {...rest}>
			<tr>{children}</tr>
			<tr className="spacingRow" />
		</thead>
	);
}

export { TableHeader };
