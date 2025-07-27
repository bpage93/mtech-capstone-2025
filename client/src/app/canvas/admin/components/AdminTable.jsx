import Loading from "@/app/canvas/loading";
import { useState, useEffect } from "react";

export default function AdminTable({ data, currentPage, setCurrentPage, pagination }) {
	const [selectedData, setSelectedData] = useState([0, "id"]);

	return !data || data?.length === 0 ? (
		<Loading />
	) : (
		<div className="flex shadow-md bg-[#160f33] text-violet-100">
			{/* Header Data */}
			<div className="bg-[#18153a] flex flex-col font-bold text-xl max-w-60 sticky">
				{/* Pagination */}
				<div className="flex items-center justify-center px-5 h-13">
					<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagination={pagination} />
				</div>
				{data?.length > 0 &&
					Object.keys(data[0]).map((key, index) => (
						<h3 key={index} className="flex items-center justify-center px-5 h-13 text-center truncate">
							{key}
						</h3>
					))}
			</div>

			{/* Body Data */}
			<div className="flex overflow-x-auto w-full">
				{data?.length > 0 &&
					data.map((row, index) => {
						const rowSelected = selectedData[0] === index;
						return (
							<div key={index} className="flex flex-col font-medium text-lg w-full min-w-40">
								<h3 className={`${rowSelected ? "bg-indigo-800" : "bg-[#18153a]"} flex items-center justify-center px-4 h-13 sticky`}>{index + 1}</h3>
								{Object.entries(row).map(([key, data], j) => {
									const dataSelected = selectedData[0] === index && selectedData[1] === key;
									return (
										<div key={j} className={`${dataSelected ? "bg-indigo-900" : ""} flex items-center justify-center px-4 h-13 border-l border-white/10 hover:bg-indigo-900`} onClick={() => setSelectedData([index, key])}>
											<div className="flex items-center min-w-0 w-full gap-x-2">
												<span className="truncate flex-1 text-center">{data}</span>
												{dataSelected && (
													<button type="button" className="flex-shrink-0 w-7 h-7 p-1 hover:cursor-pointer rounded-lg bg-indigo-700" aria-label="Edit this data">
														<img src="/svgs/edit.svg" alt="Edit" className="w-full h-full" />
													</button>
												)}
											</div>
										</div>
									);
								})}
							</div>
						);
					})}
			</div>
		</div>
	);
}

function Pagination({ currentPage, setCurrentPage, pagination }) {
	const [inputPageValue, setInputPageValue] = useState(currentPage);

	useEffect(() => {
		setInputPageValue(currentPage);
	}, [currentPage]);

	function handleSubmission(e) {
		e.preventDefault();
		try {
			let wantedValue = parseInt(inputPageValue.replace(/\D/g, ""));
			if (wantedValue > pagination.total_pages) {
				wantedValue = pagination.total_pages;
			} else if (wantedValue < 1) {
				wantedValue = 1;
			}
			setCurrentPage(wantedValue);
		} catch {
			return;
		}
	}

	return (
		<div className="flex justify-center items-center px-2 rounded-full bg-indigo-800">
			{pagination.has_prev_page && <IconButton svgPath="/svgs/first_page.svg" label="navigate to the first page" handleClick={() => setCurrentPage(1)} />}
			{pagination.has_prev_page && <IconButton svgPath="/svgs/chevron_backward.svg" label="navigate one page backward" handleClick={() => setCurrentPage(parseInt(currentPage) - 1)} />}
			<form onSubmit={handleSubmission}>
				<input className="mx-1 w-7 h-7 text-center hover:bg-indigo-700 rounded-full" type="text" placeholder="1" value={inputPageValue} onChange={(e) => setInputPageValue(e.target.value.replace(/\D/g, ""))} />
			</form>
			{pagination.has_next_page && <IconButton svgPath="/svgs/chevron_forward.svg" label="navigate one page forward" handleClick={() => setCurrentPage(parseInt(currentPage) + 1)} />}
			{pagination.has_next_page && <IconButton svgPath="/svgs/last_page.svg" label="navigate to the last page" handleClick={() => setCurrentPage(pagination.total_pages)} />}
		</div>
	);
}

function IconButton({ svgPath, label, handleClick }) {
	return (
		<button aria-label={label} className="w-7 h-7 cursor-pointer hover:bg-indigo-700 rounded-full" onClick={handleClick}>
			<img src={svgPath} width={100} />
		</button>
	);
}
