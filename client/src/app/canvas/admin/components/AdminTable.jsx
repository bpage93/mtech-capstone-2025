import Loading from "@/app/canvas/loading";
import { useState, useEffect } from "react";

export default function AdminTable({ data, setData, currentPage, setCurrentPage, pagination }) {
	const [selectedData, setSelectedData] = useState({ index: 0, key: "id" });
	const [editing, setEditing] = useState(false);

	useEffect(() => {
		if (!data?.length) return;
		const key = Object.keys(data[0])[0];
		console.log(key);
		setSelectedData({ index: 0, key });
	}, [data]);

	function handleSaveChanges(newValue) {
		setEditing(false);

		const updated = [...data];
		updated[selectedData.index][selectedData.key] = newValue;

		setData(updated);
	}

	return !data || data?.length === 0 ? (
		<Loading />
	) : editing ? (
		<EditTableData data={data} selectedData={selectedData} setEditing={setEditing} handleSaveChanges={handleSaveChanges} />
	) : (
		<div className="flex shadow-md bg-[#160f33] text-violet-100 min-h-full">
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
						const rowSelected = selectedData.index === index;
						return (
							<div key={index} className="flex flex-col font-medium text-lg w-full min-w-40 border-l border-white/10">
								<h3 className={`${rowSelected ? "bg-indigo-800" : "bg-[#18153a]"} flex items-center justify-center px-4 h-13 sticky`}>{index + 1}</h3>
								{Object.entries(row).map(([key, data], j) => {
									const dataSelected = selectedData.index === index && selectedData.key === key;
									return (
										<div key={j} className={`${dataSelected ? "bg-indigo-900" : ""} flex items-center justify-center px-4 h-13 hover:bg-indigo-900`} onClick={() => setSelectedData({ index, key })}>
											<div className="flex items-center min-w-0 w-full gap-x-2">
												<span className="truncate flex-1 text-center">{data.value}</span>
												{dataSelected && (
													<button type="button" className="flex-shrink-0 w-7 h-7 p-1 hover:cursor-pointer rounded-lg bg-indigo-700" aria-label="Edit this data" onClick={() => setEditing(true)}>
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

function EditTableData({ data, selectedData, setEditing, handleSaveChanges }) {
	const [inputValue, setInputValue] = useState(data[selectedData.index][selectedData.key].value);
	console.log(selectedData);
	return (
		<div className="bg-[#160f33] relative w-full h-full flex justify-center items-center">
			<button className="absolute left-0 top-0 m-5 p-1 w-11 h-11 hover:cursor-pointer bg-indigo-900 rounded-full shadow-md/40" onClick={() => setEditing(false)}>
				<img src="/svgs/arrow_back.svg" alt="" className="w-full h-full" />
			</button>
			<div className="flex flex-col gap-y-2 w-1/2">
				<textarea value={inputValue} placeholder="Your changes here..." className="w-full min-h-20 h-60 max-h-100 bg-indigo-950 px-3 py-2 rounded-lg shadow-md border border-indigo-900 focus:outline-0" onChange={(e) => setInputValue(e.target.value)} />
				<div className="flex gap-2">
					<button className="bg-sky-700 border-2 border-sky-700 px-3 py-1 rounded-md hover:cursor-pointer shadow-md" onClick={() => handleSaveChanges(inputValue)}>
						Save Changes
					</button>
					<button className="bg-rose-700 border-2 border-rose-700 px-3 py-1 rounded-md hover:cursor-pointer shadow-md" onClick={() => setEditing(false)}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
}

//
//
//
//
//
//

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
