import { HTMLAttributes } from "react";

import { ChevronButton } from "./chevronButton";
import { CurrentButton } from "./currentButton";
import { PageButton } from "./pageButton";
import { PaginationService } from "./paginationService";
import { Spread } from "./spread";

import "./styles.css";

/**
 * Props for the Pagination component.
 */
type PaginationProps = {
  /**
   * Number of sibling pages to show on each side of the current page.
   * @default 1
   */
  siblingsCount?: number;
  /**
   * Total number of records/items to paginate.
   */
  totalCountRegisters: number;
  /**
   * The currently active page number (1-indexed).
   */
  currentPage: number;
  /**
   * Number of records to display per page.
   * @default 10
   */
  registerPerPage?: number;
  /**
   * Callback function triggered when the page changes.
   * @param page - The new page number
   */
  onChange?: (page: number) => void;
} & Omit<HTMLAttributes<HTMLDivElement>, "onChange">;

/**
 * Pagination component for navigating through paginated data.
 *
 * @component
 * @example
 * ```tsx
 * <Pagination
 *   totalCountRegisters={100}
 *   currentPage={1}
 *   registerPerPage={10}
 *   siblingsCount={1}
 *   onChange={(page) => console.log('Page changed to:', page)}
 * />
 * ```
 *
 * @param props - The component props
 * @returns A pagination navigation component with page numbers and navigation buttons
 */

function Pagination(props: PaginationProps) {
  const {
    totalCountRegisters: baseTotalCountRegisters,
    siblingsCount: baseSiblingsCount,
    currentPage: baseCurrentPage,
    registerPerPage: baseRegisterPerPage,
    onChange: baseOnChange,
    ...rest
  } = props;

  const {
    currentPage,
    siblingsCount,
    previousPages,
    nextPages,
    lastPage,
    handlePageChange,
    handleMinusChange,
    handlePlusChange,
  } = new PaginationService({
    totalCountRegisters: baseTotalCountRegisters,
    currentPage: baseCurrentPage,
    registerPerPage: baseRegisterPerPage,
    siblingsCount: baseSiblingsCount,
    onChange: baseOnChange,
  });

  return (
    <div className="arkynPagination" {...rest}>
      <ChevronButton
        orientation="left"
        handlePageChange={handleMinusChange}
        disabled={currentPage <= 1}
      />

      {currentPage > 1 + siblingsCount && (
        <>
          <PageButton page={1} handlePageChange={() => handlePageChange(1)} />
          {currentPage > 2 + siblingsCount && <Spread />}
        </>
      )}

      {previousPages.map((page, index) => (
        <PageButton
          key={index}
          page={page}
          handlePageChange={handleMinusChange}
        />
      ))}

      <CurrentButton currentPage={currentPage} />

      {nextPages.map((page, index) => (
        <PageButton
          key={index}
          page={page}
          handlePageChange={handlePlusChange}
        />
      ))}

      {currentPage + siblingsCount < lastPage && (
        <>
          {currentPage + 1 + siblingsCount < lastPage && <Spread />}
          <PageButton
            page={lastPage}
            handlePageChange={() => handlePageChange(lastPage)}
          />
        </>
      )}

      <ChevronButton
        orientation="right"
        handlePageChange={handlePlusChange}
        disabled={currentPage >= lastPage}
      />
    </div>
  );
}

export { Pagination };
