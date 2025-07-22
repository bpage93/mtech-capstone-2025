import { useEffect, useState } from "react";

export default function ViewUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	function fetchUsers() {
		setLoading(true);
		setError(null);
		fetch("http://localhost:5000/api/users/get")
			.then((res) => {
				if (!res.ok) {
					throw new Error("Network response was not ok");
				}
				return res.json();
			})
			.then((data) => {
				setUsers(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching users:", err);
				setError(err.message);
				setLoading(false);
			});
    }

	return (
		<div className="flex flex-col gap-y-3 p-4 w-full">
			<button onClick={fetchUsers} disabled={loading} className="bg-gray-700/50 rounded-lg p-3 hover:cursor-pointer hover:bg-gray-700/70 transition-colors disabled:opacity-50">
				{loading ? "Loading..." : "View Users"}
			</button>

			{error && <div className="text-red-500 p-3 bg-red-100 rounded-lg">Error: {error}</div>}

			{users.length > 0 && (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white rounded-lg overflow-hidden">
						<thead className="bg-gray-800 text-white">
							<tr>
								<th className="py-3 px-4 text-left">ID</th>
								<th className="py-3 px-4 text-left">Role</th>
								<th className="py-3 px-4 text-left">First Name</th>
								<th className="py-3 px-4 text-left">Last Name</th>
								<th className="py-3 px-4 text-left">Email</th>
								<th className="py-3 px-4 text-left">Username</th>
								<th className="py-3 px-4 text-left">Phone Number</th>
								<th className="py-3 px-4 text-left">Password</th>
							</tr>
						</thead>
						<tbody className="text-gray-700">
							{users.map((user) => (
								<tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
									<td className="py-3 px-4">{user.id}</td>
									<td className="py-3 px-4">{user.role || "N/A"}</td>
									<td className="py-3 px-4">{user.firstname || "N/A"}</td>
									<td className="py-3 px-4">{user.lastname || "N/A"}</td>
									<td className="py-3 px-4">{user.email || "N/A"}</td>
									<td className="py-3 px-4">{user.username || "N/A"}</td>
									<td className="py-3 px-4">{user.telephone || "N/A"}</td>
									<td className="py-3 px-4">{user.password || "N/A"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
