type PaginationServiceConstructor = {
	currentPage: number;
	totalCountRegisters: number;
	registerPerPage?: number;
	siblingsCount?: number;
	onChange?: (page: number) => void;
};

class PaginationService {
	currentPage: number;
	totalCountRegisters: number;
	registerPerPage: number;
	siblingsCount: number;
	lastPage: number;
	onChange?: (page: number) => void;
	previousPages: number[];
	nextPages: number[];

	private generatePagesArray(from: number, to: number) {
		return [...new Array(to - from)]
			.map((_, index) => from + index + 1)
			.filter((page) => page > 0);
	}

	private generatePreviousPages(currentPage: number, siblingsCount: number) {
		if (!(currentPage > 1)) return [];
		return this.generatePagesArray(
			currentPage - 1 - siblingsCount,
			currentPage - 1,
		);
	}

	private generateNextPages(currentPage: number, siblingsCount: number) {
		if (!(currentPage < this.lastPage)) return [];
		return this.generatePagesArray(
			currentPage,
			Math.min(currentPage + siblingsCount, this.lastPage),
		);
	}

	constructor(props: PaginationServiceConstructor) {
		this.totalCountRegisters = props.totalCountRegisters;
		this.currentPage = props.currentPage;
		this.registerPerPage = props?.registerPerPage || 20;
		this.siblingsCount = props?.siblingsCount || 2;
		this.lastPage = Math.ceil(this.totalCountRegisters / this.registerPerPage);
		this.onChange = props?.onChange;
		this.previousPages = this.generatePreviousPages(
			this.currentPage,
			this.siblingsCount,
		);
		this.nextPages = this.generateNextPages(
			this.currentPage,
			this.siblingsCount,
		);
	}

	handlePageChange = (page: number) => {
		if (page < 1) return;
		if (page > this.lastPage) return;
		if (this.onChange) {
			this.currentPage = page;
			this.onChange(this.currentPage);
		}
	};

	handlePlusChange = () => {
		if (this.currentPage >= this.lastPage) return;
		if (this.onChange) {
			this.currentPage += 1;
			this.onChange(this.currentPage);
		}
	};

	handleMinusChange = () => {
		if (this.currentPage <= 1) return;
		if (this.onChange) {
			this.currentPage -= 1;
			this.onChange(this.currentPage);
		}
	};
}

export { PaginationService };
