import { Children, HTMLAttributes } from "react";
import "./styles.css";

type TableBodyProps = HTMLAttributes<HTMLTableSectionElement> & {
  emptyMessage?: string;
};

/**
 * TableBody component - used to render the main content section of a table with empty state handling
 *
 * @param props - TableBody component properties
 * @param props.emptyMessage - Message to display when no children are provided. Default: "Nenhum dado adicionado."
 *
 * **...All valid HTML properties for tbody element**
 *
 * @returns TableBody JSX element
 *
 * @example
 * ```tsx
 * // Basic table body with data
 * <TableBody>
 *   <tr>
 *     <td>John Doe</td>
 *     <td>john@example.com</td>
 *   </tr>
 *   <tr>
 *     <td>Jane Smith</td>
 *     <td>jane@example.com</td>
 *   </tr>
 * </TableBody>
 *
 * // Empty table body with custom message
 * <TableBody emptyMessage="No users found. Please add some users to get started." />
 *
 * // Table body with dynamic content and custom styling
 * <TableBody className="striped-rows" emptyMessage="No products available">
 *   {products.map(product => (
 *     <tr key={product.id}>
 *       <td>{product.name}</td>
 *       <td>{product.price}</td>
 *       <td>{product.stock}</td>
 *     </tr>
 *   ))}
 * </TableBody>
 *
 * // Complete table usage
 * <TableContainer>
 *   <TableHeader>
 *     <th>Name</th>
 *     <th>Status</th>
 *     <th>Actions</th>
 *   </TableHeader>
 *   <TableBody emptyMessage="No data to display">
 *     {data.map(item => (
 *       <tr key={item.id}>
 *         <td>{item.name}</td>
 *         <td>{item.status}</td>
 *         <td>
 *           <Button>Edit</Button>
 *         </td>
 *       </tr>
 *     ))}
 *   </TableBody>
 * </TableContainer>
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
  const isEmpty = Children.count(children) === 0;

  return (
    <tbody className={className.trim()} {...rest}>
      {isEmpty ? (
        <tr className="arkynTableBodyEmptyLine">
          <td colSpan={100}>
            <div>{emptyMessage}</div>
          </td>
        </tr>
      ) : (
        children
      )}
    </tbody>
  );
}

export { TableBody };
