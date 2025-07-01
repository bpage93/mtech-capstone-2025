export default function ({ children }) {
	return (
		<div className="w-full h-full flex">
			<div className="w-50 bg-white/50">h</div>
			<div className="w-full">{children}</div>
		</div>
	);
}
