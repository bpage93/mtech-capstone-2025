"use client";

import { useTitleContext } from "../contexts/TitleContext";
import { useState, useEffect } from "react";
import AdminTable from "./components/AdminTable";

export default function AdminCanvasPage() {
	const { updateTitle } = useTitleContext();
	const availableModes = ["Users", "Courses"];
    const [mode, setMode] = useState(availableModes[0]);
    const [currentPage, setCurrentPage] = useState(3);
    const [maxPage, setMaxPage] = useState(10);
    const [users, setUsers] = useState(null);

    // temporary user data
    const tempUsers = [
		{
			user_id: 9,
			role: "student",
			email: "email@fake.com",
			firstname: "Nathan",
			lastname: "Adams",
			telephone: "9999999999",
			username: "nathanadams",
		},
		{
			user_id: 8,
			role: "admin",
			email: "admin@gmail.com",
			firstname: "John",
			lastname: "Smith",
			telephone: "1234567890",
			username: "johnsmith",
		},
		{
			user_id: 4,
			role: "student",
			email: "student@gmail.com",
			firstname: "Wheres",
			lastname: "Waldo",
			telephone: "09876543221",
			username: "whereswaldo",
		},
		{
			user_id: 4,
			role: "student",
			email: "student@gmail.com",
			firstname: "Wheres",
			lastname: "Waldo",
			telephone: "09876543221",
			username: "whereswaldo",
		},
		{
			user_id: 4,
			role: "student",
			email: "student@gmail.com",
			firstname: "Wheres",
			lastname: "Waldo",
			telephone: "09876543221",
			username: "whereswaldo",
		},
	];

	useEffect(() => {
        updateTitle("Admin Dashboard");
        setUsers(tempUsers);
	}, []);

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
                <AdminTable users={users} currentPage={currentPage} setCurrentPage={setCurrentPage} maxPage={maxPage} setMaxPage={setMaxPage} />
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
