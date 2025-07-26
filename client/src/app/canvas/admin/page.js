"use client";

import { useTitleContext } from "../contexts/TitleContext";
import { useState, useEffect } from "react";
import AdminTable from "./components/AdminTable";

export default function AdminCanvasPage() {
	const { updateTitle } = useTitleContext();
	const availableModes = ["Users", "Courses"];
	const [mode, setMode] = useState(availableModes[0]);
	const [currentPage, setCurrentPage] = useState(1);
	const [users, setUsers] = useState(null);
	const [pagination, setPagination] = useState({});

	useEffect(() => {
		updateTitle("Admin Dashboard");
		setCurrentPage(1); // trigger loading of users
	}, []);

	useEffect(() => {
		console.log(currentPage);
		const token = localStorage.getItem("jwtToken");
		async function getUsers() {
			const usersRequest = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/view?page=${currentPage}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (usersRequest.ok) {
				const { users, pagination } = await usersRequest.json();
				setUsers(users);
				setPagination(pagination);
			}
		}
		getUsers();
	}, [currentPage]);

	return (
		<div className="flex flex-col h-full rounded-lg overflow-hidden">
			<div className="flex">
				{availableModes.map((m) => {
					return (
						<TabButton key={m} mode={mode} setMode={setMode}>
							{m}
						</TabButton>
					);
				})}
			</div>

			<div className="bg-[#140D2E] h-full">
				<AdminTable data={users} currentPage={currentPage} setCurrentPage={setCurrentPage} pagination={pagination} />
			</div>
		</div>
	);
}

function TabButton({ children, mode, setMode }) {
	return (
		<button className={`${mode === children ? "bg-indigo-600 shadow-indigo-800 shadow-lg/30" : "bg-[#18153a]"} w-full rounded-t-lg join px-4 py-3 z-1`} onClick={() => setMode(children)}>
			<span className="w-full text-center font-medium">{children}</span>
		</button>
	);
}
