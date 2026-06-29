import type { HTMLAttributes } from "react";

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
 * Pagination — navigation control for paginated data sets.
 *
 * Renders page number buttons, prev/next arrows, and spread indicators (…)
 * when the page count exceeds the visible range.
 *
 * @param props.totalCountRegisters - Total number of records. Required.
 * @param props.currentPage - The currently active page (1-indexed). Required.
 * @param props.registerPerPage - Records per page. Default: 10
 * @param props.siblingsCount - Number of sibling pages visible on each side of the current page. Default: 1
 * @param props.onChange - Callback fired when the user selects a different page.
 *
 * **...Other valid HTML properties for `<div>`**
 *
 * @returns Pagination JSX element.
 *
 * @example
 * ```tsx
 * <Pagination
 *   totalCountRegisters={250}
 *   currentPage={page}
 *   registerPerPage={20}
 *   siblingsCount={1}
 *   onChange={(p) => setPage(p)}
 * />
 * ```
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
