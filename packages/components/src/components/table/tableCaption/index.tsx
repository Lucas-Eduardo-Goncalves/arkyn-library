import { HTMLAttributes } from "react";
import "./styles.css";

type TableCaptionProps = HTMLAttributes<HTMLElement>;

/**
 * TableCaption — title / description placed above a table. Renders as a `<caption>` element.
 *
 * Accepts all standard HTML element attributes.
 *
 * @returns TableCaption JSX element.
 *
 * @example
 * ```tsx
 * <TableContainer>
 *   <TableCaption>Orders — Q2 2025</TableCaption>
 *   <TableHeader>...</TableHeader>
 *   <TableBody>...</TableBody>
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
