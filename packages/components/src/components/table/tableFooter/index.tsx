import { HTMLAttributes } from "react";
import "./styles.css";

type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;

/**
 * TableFooter component - used to render the footer section of a table with content container
 *
 * @param props - TableFooter component properties
 *
 * **...All valid HTML properties for tfoot element**
 *
 * @returns TableFooter JSX element
 *
 * @example
 * ```tsx
 * // Basic table footer with pagination
 * <TableFooter>
 *   <div>Showing 1-10 of 100 results</div>
 *   <Pagination />
 * </TableFooter>
 *
 * // Table footer with custom styling
 * <TableFooter className="custom-footer">
 *   <Button>Load More</Button>
 * </TableFooter>
 *
 * // Complete table usage
 * <TableContainer>
 *   <TableHeader>
 *     <th>Name</th>
 *     <th>Email</th>
 *   </TableHeader>
 *   <TableBody>
 *     // table rows...
 *   </TableBody>
 *   <TableFooter>
 *     <div className="pagination-info">
 *       Total: 250 items
 *     </div>
 *   </TableFooter>
 * </TableContainer>
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
