"use client";

import { useState, useEffect } from "react";
import { useTitleContext } from "../contexts/TitleContext";
import { useRouter } from "next/navigation";
import Loading from "@/app/canvas/loading";
import MainLoading from "@/app/canvas/loading";
import { Mic } from "@mui/icons-material";

export default function SettingsPage() {
	const { updateTitle } = useTitleContext();
	const [loading, setLoading] = useState(true);
	const [mainLoading, setMainLoading] = useState(true);
	const [token, setToken] = useState("");
	const [user, setUser] = useState();
	const [editingField, setEditingField] = useState();
	const [editingFieldValue, setEditingFieldValue] = useState();
	const router = useRouter();

	useEffect(() => {
		setMainLoading(false);
		updateTitle("Profile");
		const storedToken = localStorage.getItem("jwtToken");
		setToken(storedToken);
		fetchUser();
	}, []);

	async function fetchUser() {
		setLoading(true);
		let storedToken = token;
		if (!storedToken) {
			storedToken = localStorage.getItem("jwtToken");
			if (!storedToken) router.push("/");
		}

		const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/self`, {
			headers: {
				authorization: `Bearer ${storedToken}`,
			},
		});
		if (!userResponse.ok) return;
		const { user } = await userResponse.json();
		setUser(user);
		console.log(user);
		setLoading(false);
	}

	useEffect(() => {
		if (!editingField) return;
		document.getElementById("editing-value").focus();
	}, [editingField]);

	useEffect(() => {
		if (!editingField || editingFieldValue === undefined) return;

		setUser((prevUser) => ({
			...prevUser,
			[editingField]: editingFieldValue,
		}));
	}, [editingFieldValue]);

	async function saveUser() {
		setLoading(true);
		console.log(token);
		const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/self/update`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				user,
			}),
		});
		setLoading(false);
	}

	function logout() {
		setMainLoading(true);
		localStorage.setItem("jwtToken", "");
		router.push("/");
	}

	return (
		<>
			{mainLoading ? (
				<MainLoading />
			) : (
				<div className="bg-[#160f33] h-full w-full rounded-lg overflow-auto">
					{loading ? (
						<Loading />
					) : (
						<div className="min-w-100 w-full shrink xl:min-w-full overflow-x-auto p-4 flex flex-col gap-y-4">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-2">
								{user &&
									Object.entries(user).map(([field, value]) => {
										return (
											<div key={field} className="flex justify-between items-center min-w-fit w-full shadow/30 bg-indigo-950/40 rounded-lg hover:bg-indigo-950 border-b border-b-white/5 p-3">
												<div className="flex flex-col text-lg h-full shrink">
													<h6 className="text-gray-400 truncate">{field}</h6>
													{field === editingField ? <input id="editing-value" value={editingFieldValue} onChange={(e) => setEditingFieldValue(e.target.value)} onBlur={() => setEditingField(null)} /> : <span className="truncate">{value}</span>}
												</div>

												<button
													className="justify-center items-center flex hover:cursor-pointer bg-indigo-700 rounded-md p-1 w-10 h-10 shrink-0"
													aria-label="Edit this value"
													onClick={() => {
														setEditingField(field);
														setEditingFieldValue(value);
													}}
												>
													<img src="/svgs/edit.svg" alt="" />
												</button>
											</div>
										);
									})}
							</div>
							<button className="bg-indigo-800 hover:bg-indigo-700 hover:cursor-pointer w-60 h-12 rounded-lg text-lg font-medium" onClick={saveUser}>
								Save Changes
							</button>
							<button className="bg-rose-800 hover:bg-rose-700 hover:cursor-pointer w-60 h-12 rounded-lg text-lg font-medium flex justify-center items-center gap-x-1" onClick={logout}>
								<img src="/svgs/logout.svg" />
								<span>Logout</span>
							</button>
						</div>
					)}
				</div>
			)}
		</>
	);
}
