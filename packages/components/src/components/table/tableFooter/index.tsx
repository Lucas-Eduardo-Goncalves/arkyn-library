import type { HTMLAttributes } from "react";
import "./styles.css";

type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableFooter — `<tfoot>` section with an automatic spacing row above the content.
 *
 * Children span all columns via `colSpan={100}`. Commonly used for `Pagination`.
 * Accepts all standard HTML `<tfoot>` attributes.
 *
 * @returns TableFooter JSX element.
 *
 * @example
 * ```tsx
 * <TableFooter>
 *   <Pagination currentPage={page} totalPages={totalPages} onChange={setPage} />
 * </TableFooter>
 * ```
 */

function TableFooter(props: TableFooterProps) {
	const { className: baseClassName, children, ...rest } = props;
	const className = `arkynTableFooter ${baseClassName}`;

	return (
		<tfoot className={className.trim()} {...rest}>
			<tr className="spacingRow" />
			<tr>
				<th colSpan={100}>
					<div className="arkynTableFooterContent">{children}</div>
				</th>
			</tr>
		</tfoot>
	);
}

export { TableFooter };
