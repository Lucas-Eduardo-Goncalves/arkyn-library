import { Children, type HTMLAttributes } from "react";
import "./styles.css";

type TableBodyProps = HTMLAttributes<HTMLTableSectionElement> & {
	/** Text displayed in a full-width row when no children are present. @default "Nenhum dado adicionado." */
	emptyMessage?: string;
};

/**
 * TableBody — `<tbody>` section with built-in empty state handling.
 *
 * When `children` is empty, renders a full-width row with `emptyMessage`.
 * Accepts all standard HTML `<tbody>` attributes.
 *
 * @param props.emptyMessage - Empty state text. Default: `"Nenhum dado adicionado."`
 *
 * **...Other valid HTML `<tbody>` properties**
 *
 * @returns TableBody JSX element.
 *
 * @example
 * ```tsx
 * <TableBody emptyMessage="No orders found">
 *   {orders.map(o => (
 *     <tr key={o.id}>
 *       <td>{o.number}</td>
 *       <td>{o.status}</td>
 *     </tr>
 *   ))}
 * </TableBody>
 * ```
 */

function TableBody(props: TableBodyProps) {
	const {
		emptyMessage = "Nenhum dado adicionado.",
		className: baseClassName,
		children,
		...rest
	} = props;

	const className = `arkynTableBody ${baseClassName}`;
	const childArray = Children.toArray(children).filter(Boolean);
	const isEmpty = childArray.length === 0;

	return (
		<tbody className={className.trim()} {...rest}>
			{isEmpty ? (
				<tr className="arkynTableBodyEmptyLine">
					<td colSpan={100}>
						<div>{emptyMessage}</div>
					</td>
				</tr>
			) : (
				childArray
			)}
		</tbody>
	);
}

export { TableBody };
