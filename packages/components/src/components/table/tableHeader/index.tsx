import { HTMLAttributes } from "react";
import "./styles.css";

type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableHeader component - used to render the header section of a table with automatic spacing
 *
 * @param props - TableHeader component properties
 *
 * **...All valid HTML properties for thead element**
 *
 * @returns TableHeader JSX element
 *
 * @example
 * ```tsx
 * // Basic table header
 * <TableHeader>
 *   <th>Name</th>
 *   <th>Email</th>
 *   <th>Actions</th>
 * </TableHeader>
 *
 * // Table header with custom styling
 * <TableHeader className="custom-header">
 *   <th>Product</th>
 *   <th>Price</th>
 *   <th>Stock</th>
 * </TableHeader>
 *
 * // Complete table usage
 * <TableContainer>
 *   <TableHeader>
 *     <th>ID</th>
 *     <th>User</th>
 *     <th>Status</th>
 *   </TableHeader>
 *   <TableBody>
 *     // table rows...
 *   </TableBody>
 * </TableContainer>
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
