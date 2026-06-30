import "./styles.css";

type PageButtonProps = {
	page: number;
	handlePageChange: () => void;
};

function PageButton(props: PageButtonProps) {
	const { page, handlePageChange } = props;
	return (
		<button
			type="button"
			className="arkynPaginationPageButton"
			onClick={handlePageChange}
		>
			{page}
		</button>
	);
}

export { PageButton };
