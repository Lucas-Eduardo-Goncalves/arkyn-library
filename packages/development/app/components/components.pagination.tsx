import { Pagination } from "@arkyn/components/pagination";
import { useState } from "react";

export default function PaginationRoute() {
	const [page1, setPage1] = useState(1);
	const [page2, setPage2] = useState(5);
	const [page3, setPage3] = useState(3);

	return (
		<>
			<div className="exampleContainer foreground">
				<Pagination
					totalCountRegisters={100}
					currentPage={page1}
					registerPerPage={10}
					onChange={setPage1}
				/>
			</div>

			<div className="exampleContainer foreground">
				<Pagination
					totalCountRegisters={250}
					currentPage={page2}
					registerPerPage={20}
					siblingsCount={2}
					onChange={setPage2}
				/>
			</div>

			<div className="exampleContainer foreground">
				<Pagination
					totalCountRegisters={50}
					currentPage={page3}
					registerPerPage={10}
					onChange={setPage3}
				/>
			</div>

			<div className="exampleContainer">
				<Pagination
					totalCountRegisters={100}
					currentPage={page1}
					registerPerPage={10}
					onChange={setPage1}
				/>
			</div>
		</>
	);
}
