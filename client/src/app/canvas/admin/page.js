"use client";

import { useTitleContext } from "../contexts/TitleContext";
import { useState, useEffect } from "react";
import AdminTable from "./components/AdminTable";
import { useRouter } from "next/navigation";

export default function AdminCanvasPage() {
	const { updateTitle } = useTitleContext();
	const availableModes = {
		users: "Users",
		courses: "Courses",
	};
	const [mode, setMode] = useState(availableModes.users);
	const [currentPage, setCurrentPage] = useState(1);
	const [tableData, setTableData] = useState(null);
	const [pagination, setPagination] = useState({});

	const router = useRouter();

	useEffect(() => {
		updateTitle("Admin Dashboard");
	}, [updateTitle]);

	useEffect(() => {
		setCurrentPage(0);
	}, [mode]);

	useEffect(() => {
		setTableData(null);
		if (currentPage < 1) {
			setCurrentPage(1);
			return;
		}
		const token = localStorage.getItem("jwtToken");
		async function getData() {
			const dataRequest = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${mode === availableModes.users ? "users" : "courses"}/view?page=${currentPage}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (dataRequest.ok) {
				const { data, pagination } = await dataRequest.json();
				console.log(data);
				setTableData(data);
				setPagination(pagination);
			} else if (dataRequest.status === 403 || dataRequest.status === 401) {
				router.push("/");
			}
		}
		getData();
	}, [currentPage, availableModes.users, mode]);

	return (
		<div className="flex flex-col h-full rounded-lg overflow-hidden">
			<div className="flex">
				{Object.values(availableModes).map((m) => {
					return (
						<TabButton key={m} mode={mode} setMode={setMode}>
							{m}
						</TabButton>
					);
				})}
			</div>

			<div className="bg-[#140D2E] h-full overflow-y-auto">
				<AdminTable data={tableData} setData={setTableData} currentPage={currentPage} setCurrentPage={setCurrentPage} pagination={pagination} />
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
