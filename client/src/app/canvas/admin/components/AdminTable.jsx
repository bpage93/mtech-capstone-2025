import Loading from "@/app/canvas/loading";
import { useState, useEffect } from "react";

export default function AdminTable({ data, setData, currentPage, setCurrentPage, pagination, oneToManyTables, mode, availableModes, getData }) {
	const [selectedData, setSelectedData] = useState({ index: 0, key: "id" });
	const [editing, setEditing] = useState(false);
	const [creating, setCreating] = useState(false);
	const [editButtonsDisabled, setEditButtonsDisabled] = useState(false);
	const [showWarning, setShowWarning] = useState(false);
	const [warning, setWarning] = useState("");
	const token = localStorage.getItem("jwtToken");

	async function handleSaveChanges(newValue) {
		setEditButtonsDisabled(true);
		const updatedData = [...data];
		const oldValue = data[selectedData.index][selectedData.key].value;
		updatedData[selectedData.index][selectedData.key].value = newValue;

		if (updatedData[selectedData.index][selectedData.key].creation) {
		} else {
			if (!newValue) {
				setShowWarning(true);
				setWarning("Value cannot be empty");
				setEditButtonsDisabled(false);
				updatedData[selectedData.index][selectedData.key].value = oldValue;
				return;
			}
			if (newValue === oldValue) {
				setEditButtonsDisabled(false);
				setEditing(false);
				setCreating(false);
				return;
			}

			const primaryKey = updatedData[selectedData.index][selectedData.key].primary_key;
			const table = updatedData[selectedData.index][selectedData.key].table;
			const field = selectedData.key;
			const value = newValue;

			const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/database/update`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ primaryKey, table, field, value, newValue }),
			});

			if (updateResponse.status === 400) {
				setWarning("Value cannot be empty");
				setShowWarning(true);
			}

			if (updateResponse.status === 500 && !oldValue) {
				handleTableCreation(value, primaryKey, table, field);
				return;
			}

			setEditButtonsDisabled(false);

			if (!updateResponse.ok) {
				updatedData[selectedData.index][selectedData.key].value = oldValue;
				return;
			}
		}
		setShowWarning(false);
		setData(updatedData);
		setEditing(false);
		setCreating(false);
	}

	async function handleTableCreation(value, primaryKey = "", table = "", field = "") {
		setEditButtonsDisabled(true);

		if (!primaryKey || !table || !field) {
			primaryKey = data[selectedData.index][selectedData.key].primary_key;
			table = data[selectedData.index][selectedData.key].table;
			field = selectedData.key;
		}

		if (table === "enrollment") {
			console.log({ value });
			const user_id = data[selectedData.index].role.primary_key;
			const creationResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/database/create/enrollment`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ primaryKey, table, field, value, user_id }),
			});
			if (creationResponse.ok) {
				getData();
				console.log("success");
			}
		}

        setEditButtonsDisabled(false);
        setCreating(false);
        setEditing(false);
	}

	async function handleRowCreation() {
		const creationRow = data[data.length - 1];
		console.log({ creationRow });
		let rowCanBeCreated = true;
		for (const value of Object.values(creationRow)) {
			if (!value.value) rowCanBeCreated = false;
		}
		console.log(rowCanBeCreated);

		if (mode === availableModes.users) {
			const user = {};
			user.role = creationRow.role.value;
			user.email = creationRow.email.value;
			user.firstname = creationRow.firstname.value;
			user.lastname = creationRow.lastname.value;
			user.telephone = creationRow.telephone.value;
			user.username = creationRow.username.value;
			user.street = creationRow.street.value;
			user.city = creationRow.city.value;
			user.state = creationRow.state.value;
			user.zip = creationRow.zip.value;
			user.password = "password";

			let emptyValues = false;
			for (const value of Object.values(user)) {
				if (!value) {
					emptyValues = true;
					break;
				}
			}

			if (emptyValues) return;

			const userCreationResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ user }),
			});

			if (userCreationResponse.ok) {
				getData();
			}
		} else if (mode === availableModes.courses) {
			const course = {};
			course.title = creationRow.title.value;
			course.description = creationRow.description.value;
			course.schedule = creationRow.schedule.value;
			course.classroom_number = creationRow.classroom_number.value;
			course.maximum_capacity = creationRow.maximum_capacity.value;
			course.credit_hours = creationRow.credit_hours.value;
			course.tuition_cost = creationRow.tuition_cost.value;

			let emptyValues = false;
			for (const value of Object.values(course)) {
				if (!value) {
					emptyValues = true;
					break;
				}
			}

			if (emptyValues) return;

			const courseCreationResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/create`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ course }),
			});

			if (courseCreationResponse.ok) {
				getData();
			}
		}
	}

	useEffect(() => {
		if (editing || creating) return;
		setShowWarning(false);
		setEditButtonsDisabled(false);
	}, [editing, creating]);

	return !data || data?.length === 0 ? (
		<Loading />
	) : editing || creating ? (
		<EditTableData data={data} selectedData={selectedData} setCreating={setCreating} editing={editing} setEditing={setEditing} handleSaveChanges={handleSaveChanges} editButtonsDisabled={editButtonsDisabled} setEditButtonsDisabled={setEditButtonsDisabled} showWarning={showWarning} setShowWarning={setShowWarning} warning={warning} setWarning={setWarning} handleTableCreation={handleTableCreation} />
	) : (
		<div className="flex shadow-md bg-[#160f33] text-violet-100 min-h-full">
			{/* Header Data */}
			<div className="bg-[#18153a] flex flex-col font-bold text-xl max-w-60 sticky">
				{/* Pagination */}
				<div className="flex items-center justify-center px-5 h-13">
					<Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} pagination={pagination} />
				</div>
				{data?.length > 0 &&
					Object.keys(data[0]).map((key, index) => {
						return (
							<h3 key={index} className="flex items-center justify-center px-5 h-13 text-center truncate">
								{key}
							</h3>
						);
					})}
			</div>

			{/* Body Data */}
			<div className="flex overflow-x-auto w-full">
				{data?.length > 0 &&
					data.map((row, index) => {
						const isCreationRow = data[index][Object.keys(data[index])[0]].creation;
						const rowSelected = selectedData.index === index;
						return (
							<div key={index} className="flex flex-col font-medium text-lg w-full min-w-40 border-l border-white/10">
								{isCreationRow ? (
									<button className={`bg-emerald-600 flex items-center justify-center px-4 h-13 sticky`} aria-label="add new column" onClick={handleRowCreation}>
										<div className="w-8 h-8">
											<img src="/svgs/add_2.svg" alt="" className="w-full h-full" />
										</div>
									</button>
								) : (
									<h3 className={`${rowSelected ? "bg-indigo-800" : "bg-[#18153a]"} flex items-center justify-center px-4 h-13 sticky`}>{index + 1}</h3>
								)}
								{Object.entries(row).map(([key, data], j) => {
									const dataSelected = selectedData.index === index && selectedData.key === key;
									return (
										<div key={j} className={`${dataSelected ? "bg-indigo-900" : ""} flex items-center justify-center px-4 h-13 hover:bg-indigo-900`} onClick={() => setSelectedData({ index, key })}>
											<div className="flex justify-center items-center min-w-0 w-full gap-x-2">
												{data.value && <span className="truncate flex-1 text-center">{data.value}</span>}
												{dataSelected && (
													<div className="flex gap-x-1">
														{(data.value || data.creation) && (
															<button type="button" className="w-7 h-7 p-1 hover:cursor-pointer rounded-lg bg-indigo-700" aria-label="Edit this data" onClick={() => setEditing(true)}>
																<img src="/svgs/edit.svg" alt="Edit" className="w-full h-full" />
															</button>
														)}
														{oneToManyTables.includes(data.table) && (
															<>
																<button type="button" className="w-7 h-7 p-1 hover:cursor-pointer rounded-lg bg-emerald-700" aria-label="Create this data" onClick={() => setCreating(true)}>
																	<img src="/svgs/add_2.svg" alt="Edit" className="w-full h-full" />
																</button>
																{data.value && (
																	<button type="button" className="w-7 h-7 p-1 hover:cursor-pointer rounded-lg bg-rose-700" aria-label="Edit this data" onClick={() => setEditing(true)}>
																		<img src="/svgs/delete.svg" alt="Edit" className="w-full h-full" />
																	</button>
																)}
															</>
														)}
													</div>
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

function EditTableData({ data, selectedData, editing, setEditing, setCreating, handleSaveChanges, editButtonsDisabled, setEditButtonsDisabled, showWarning, setShowWarning, warning, setWarning, handleTableCreation }) {
	const [inputValue, setInputValue] = useState(editing ? data[selectedData.index][selectedData.key].value ? data[selectedData.index][selectedData.key].value : "" : "");

	console.log(selectedData);

	return (
		<div className="bg-[#160f33] relative w-full h-full flex justify-center items-center text-md">
			<button
				className="absolute left-0 top-0 m-5 p-1 w-11 h-11 hover:cursor-pointer bg-indigo-900 rounded-full shadow-md/40"
				onClick={() => {
					setEditing(false);
					setCreating(false);
				}}
			>
				<img src="/svgs/arrow_back.svg" alt="" className="w-full h-full" />
			</button>
			<div className="flex flex-col gap-y-2 w-1/2">
				<textarea
					value={inputValue}
					placeholder="Your changes here..."
					className="text-lg w-full min-h-20 h-60 max-h-100 bg-indigo-950 px-3 py-2 rounded-lg shadow-md border border-indigo-900 focus:outline-0"
					onChange={(e) => {
						setInputValue(e.target.value);
					}}
				/>
				{showWarning && (
					<span id="warning-field" className="text-yellow-600">
						{warning}
					</span>
				)}
				<div className="flex gap-2">
					<button
						disabled={editButtonsDisabled}
						className={`bg-sky-700 border-2 border-sky-700 px-3 py-1 rounded-md hover:cursor-pointer shadow-md disabled:bg-gray-700 disabled:border-gray-700 disabled:cursor-not-allowed`}
						onClick={() => {
							if (editing) {
								handleSaveChanges(inputValue);
							} else {
								handleTableCreation(inputValue);
							}
						}}
					>
						{editing ? "Save Changes" : "Create"}
					</button>
					<button
						disabled={editButtonsDisabled}
						className={`bg-rose-700 border-2 border-rose-700 px-3 py-1 rounded-md hover:cursor-pointer shadow-md disabled:bg-gray-700 disabled:border-gray-700 disabled:cursor-not-allowed`}
						onClick={() => {
							setEditing(false);
							setCreating(false);
						}}
					>
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
