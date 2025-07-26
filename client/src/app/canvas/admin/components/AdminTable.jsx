import Loading from "@/app/canvas/loading";
import { useState, useEffect } from "react";

export default function AdminTable({ data, currentPage, setCurrentPage, pagination }) {
	return !data || data === undefined ? (
		<Loading />
	) : (
		<div className="flex shadow-md bg-[#160f33] text-violet-100 overflow-auto">
			{/* Header Data */}
			<div className="bg-[#18153a] flex flex-col font-bold text-xl w-full max-w-60">
				{/* Pagination */}
				<div className="flex items-center justify-center px-5 h-13">
					<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagination={pagination} />
				</div>
				{data?.length > 0 &&
					Object.keys(data[0]).map((key, index) => {
						return (
							<h3 key={index} className="flex items-center justify-center px-5 h-13">
								{key}
							</h3>
						);
					})}
			</div>
			{/* Body Data */}
			{data.map((user, index) => {
				return (
					<div key={index} className="flex flex-col font-medium text-lg w-full">
						<h3 className="bg-[#18153a] flex items-center justify-center px-3 h-13">{index + 1}</h3>
						{Object.values(user).map((data, index) => {
							return (
								<span key={index} className="flex items-center justify-center px-3 h-13 border-l border-white/10">
									{data}
								</span>
							);
						})}
					</div>
				);
			})}
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
		<div className="flex justify-center items-center px-2 rounded-full bg-indigo-900">
			{pagination.has_prev_page && <IconButton svgPath="/svgs/first_page.svg" label="navigate to the first page" handleClick={() => setCurrentPage(1)} />}
			{pagination.has_prev_page && <IconButton svgPath="/svgs/chevron_backward.svg" label="navigate one page backward" handleClick={() => setCurrentPage(parseInt(currentPage) - 1)} />}
			<form onSubmit={handleSubmission}>
				<input className="mx-2 w-7 text-center" type="text" placeholder="1" value={inputPageValue} onChange={(e) => setInputPageValue(e.target.value.replace(/\D/g, ""))} />
			</form>
			{pagination.has_next_page && <IconButton svgPath="/svgs/chevron_forward.svg" label="navigate one page forward" handleClick={() => setCurrentPage(parseInt(currentPage) + 1)} />}
			{pagination.has_next_page && <IconButton svgPath="/svgs/last_page.svg" label="navigate to the last page" handleClick={() => setCurrentPage(pagination.total_pages)} />}
		</div>
	);
}

function IconButton({ svgPath, label, handleClick }) {
	return (
		<button aria-label={label} className="w-7 h-7 cursor-pointer hover:bg-indigo-800 rounded-full" onClick={handleClick}>
			<img src={svgPath} width={100} />
		</button>
	);
}
