import type { TableHTMLAttributes } from "react";
import "./styles.css";

type TableContainerProps = TableHTMLAttributes<HTMLTableElement>;

/**
 * TableContainer — root wrapper for the Table component set. Renders a responsive scrollable container around a `<table>`.
 *
 * Accepts all standard HTML `<table>` attributes.
 *
 * @returns TableContainer JSX element.
 *
 * @example
 * ```tsx
 * <TableContainer>
 *   <TableCaption>Users</TableCaption>
 *   <TableHeader>
 *     <th>Name</th>
 *     <th>Email</th>
 *     <th>Status</th>
 *   </TableHeader>
 *   <TableBody emptyMessage="No users found">
 *     {users.map(u => (
 *       <tr key={u.id}>
 *         <td>{u.name}</td>
 *         <td>{u.email}</td>
 *         <td>{u.status}</td>
 *       </tr>
 *     ))}
 *   </TableBody>
 *   <TableFooter><Pagination /></TableFooter>
 * </TableContainer>
 * ```
 */

function TableContainer(props: TableContainerProps) {
	const { children, className: baseClassName, ...rest } = props;
	const className = `arkynTableContainer ${baseClassName}`;

	return (
		<div className={className.trim()} {...rest}>
			<table>{children}</table>
		</div>
	);
}

export { TableContainer };
