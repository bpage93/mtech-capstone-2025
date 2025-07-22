export default function NavigationButton({ children }) {
	return (
		<a href="#">
			<div className="flex justify-center items-center text-center w-full py-3 bg-white/8 font-semibold rounded-lg">{children}</div>
		</a>
	);
}
