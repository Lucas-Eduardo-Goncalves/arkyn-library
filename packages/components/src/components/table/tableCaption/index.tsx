import { HTMLAttributes } from "react";
import "./styles.css";

type TableCaptionProps = HTMLAttributes<HTMLElement>;

/**
 * TableCaption component - used to provide a title or description for a table with proper styling
 *
 * @param props - TableCaption component properties
 *
 * **...All valid HTML properties for caption element**
 *
 * @returns TableCaption JSX element
 *
 * @example
 * ```tsx
 * // Basic table caption
 * <TableContainer>
 *   <TableCaption>
 *     User Management
 *   </TableCaption>
 *   <TableHeader>
 *     <th>Name</th>
 *     <th>Email</th>
 *   </TableHeader>
 *   <TableBody>
 *     // table rows...
 *   </TableBody>
 * </TableContainer>
 *
 * // Table caption with custom styling
 * <TableContainer>
 *   <TableCaption className="highlighted-caption">
 *     Sales Report - Q4 2024
 *   </TableCaption>
 *   <TableHeader>
 *     <th>Product</th>
 *     <th>Revenue</th>
 *   </TableHeader>
 *   <TableBody>
 *     // table rows...
 *   </TableBody>
 * </TableContainer>
 *
 * // Caption with rich content
 * <TableContainer>
 *   <TableCaption>
 *     <h3>Employee Directory</h3>
 *     <p>Updated: {new Date().toLocaleDateString()}</p>
 *   </TableCaption>
 *   <TableHeader>
 *     <th>Employee ID</th>
 *     <th>Name</th>
 *     <th>Department</th>
 *   </TableHeader>
 *   <TableBody>
 *     // table rows...
 *   </TableBody>
 * </TableContainer>
 * ```
 */

function TableCaption(props: TableCaptionProps) {
  const { className: baseClassName, children, ...rest } = props;
  const className = `arkynTableCaption ${baseClassName}`;

  return (
    <caption className={className.trim()} {...rest}>
      <div className="arkynTableCaptionContent">{children}</div>
    </caption>
  );
}

export { TableCaption };
