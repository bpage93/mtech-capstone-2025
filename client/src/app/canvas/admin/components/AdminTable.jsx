export default function AdminTable({ users }) {
	return (
		<div className="flex bg-[#160f33] overflow-auto">
			{/* Headers */}
			<div className="bg-[#18153a] flex flex-col text-violet-200 font-bold text-xl w-full max-w-60">
				<h3 className="flex items-center justify-center px-3 h-13"></h3>
				{users &&
					Object.keys(users[0]).map((key) => {
						return <h3 className="flex items-center justify-center px-3 h-13 border-r-2 border-indigo-900">{key}</h3>;
					})}
			</div>
			{/* User Data */}
			{users &&
				users.map((user, index) => {
					return (
						<div className="flex flex-col font-medium text-lg w-full text-violet-100">
							<h3 className="bg-[#18153a] flex items-center justify-center px-3 h-13 text-violet-200 border-b-2 border-indigo-900">{index + 1}</h3>
							{Object.values(user).map((data) => {
								return <span className="flex items-center justify-center px-3 h-13">{data}</span>;
							})}
						</div>
					);
				})}
		</div>
	);
}
