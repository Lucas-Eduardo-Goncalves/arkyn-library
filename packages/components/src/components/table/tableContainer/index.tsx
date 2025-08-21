import { TableHTMLAttributes } from "react";
import "./styles.css";

type TableContainerProps = TableHTMLAttributes<HTMLTableElement>;

/**
 * TableContainer component - wraps table content in a styled container with responsive behavior
 *
 * @param props - TableContainer component properties
 *
 * **...All valid HTML properties for table element**
 *
 * @returns TableContainer JSX element
 *
 * @example
 * ```tsx
 * // Basic table container
 * <TableContainer>
 *   <TableHeader>
 *     <th>Name</th>
 *     <th>Email</th>
 *   </TableHeader>
 *   <TableBody>
 *     <tr>
 *       <td>John Doe</td>
 *       <td>john@example.com</td>
 *     </tr>
 *   </TableBody>
 * </TableContainer>
 *
 * // Table container with custom styling
 * <TableContainer className="custom-table">
 *   <TableCaption>
 *     User Management Table
 *   </TableCaption>
 *   <TableHeader>
 *     <th>ID</th>
 *     <th>User</th>
 *     <th>Status</th>
 *   </TableHeader>
 *   <TableBody emptyMessage="No users found">
 *     // table rows...
 *   </TableBody>
 *   <TableFooter>
 *     <Pagination />
 *   </TableFooter>
 * </TableContainer>
 *
 * // Responsive table with overflow handling
 * <TableContainer style={{ maxWidth: '100%', overflowX: 'auto' }}>
 *   <TableHeader>
 *     <th>Product</th>
 *     <th>Description</th>
 *     <th>Price</th>
 *     <th>Stock</th>
 *     <th>Actions</th>
 *   </TableHeader>
 *   <TableBody>
 *     // table rows...
 *   </TableBody>
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
