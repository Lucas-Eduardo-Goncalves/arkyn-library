import "./styles.css";

type CurrentButtonProps = {
	currentPage: number;
};

function CurrentButton({ currentPage }: CurrentButtonProps) {
	return (
		<button type="button" className="arkynPaginationCurrentButton" disabled>
			{currentPage}
		</button>
	);
}

export { CurrentButton };
