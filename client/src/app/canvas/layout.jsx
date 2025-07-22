"use client";

import { TitleWrapper, useTitleContext } from "./contexts/TitleContext";
import { useEffect, useState } from "react";
import RouteGuard from "../components/RouteGuard";

export default function Layout({ children }) {
	const [isPageLoading, setIsPageLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsPageLoading(false);
		}, 1500); // Show spinner for 1.5s

		return () => clearTimeout(timer);
	}, []);

	return (
		<RouteGuard>
			<TitleWrapper>
				<div className="w-full min-h-dvh flex p-4 text-white bg-gradient-to-r from-[#450082] to-[#12001e] animate-circular-gradient gap-4 relative">
					{/* 🎉 FUN SPINNER ON REFRESH */}
					{isPageLoading && (
						<div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-[#450082] to-[#12001e] text-white rounded-box transition-opacity duration-1000 ease-in overflow-hidden">
							{/* 🎉 Confetti Background */}
							<div className="absolute w-full h-full flex items-center justify-center gap-2 z-0">
								{Array.from({ length: 8 }).map((_, i) => (
									<div
										key={i}
										className={`
        w-4 h-4 text-4xl rounded-full bg-pink-400
        animate-bounce
        ${i === 1 ? "animation-delay-200" : i === 2 ? "animation-delay-400" : ""}
      `}
										style={{ animationDelay: `${i * 0.2}s` }}
									></div>
								))}
							</div>

							{/* 🍌 Spinning Banana */}
							<div className="z-10 text-4xl banana-spinner ">🍌</div>

							{/* 🙈 Monkey Message */}
							<p className="z-10 text-4xl font-bold animate-bounce tracking-wide drop-shadow mb-2">Hang tight! The app is monkeying around! 🙈</p>
						</div>
					)}

					{/* Sidebar */}
					<div className="w-64 bg-base-200 rounded-box shadow p-4 flex flex-col gap-2">
						<button className="btn btn-outline w-full justify-start text-white">🏠 Dashboard</button>
						<button className="btn btn-outline w-full justify-start text-white">📚 Courses</button>
						<button className="btn btn-outline w-full justify-start text-white">📝 Assignments</button>
						<button className="btn btn-outline w-full justify-start text-white">📨 Messages</button>
						<button className="btn btn-outline w-full justify-start text-white">⚙️ Settings</button>
					</div>

					{/* Main content */}
					<div className="flex flex-col gap-4 w-full">
						<div className="card bg-base-300 p-4 rounded-box shadow-md">
							<TitleDisplay />
						</div>

						<div className="card bg-base-100 p-6 rounded-box shadow grow">{children}</div>
					</div>
				</div>
			</TitleWrapper>
		</RouteGuard>
	);

	function TitleDisplay() {
		const { title } = useTitleContext();
		return <h2 className="flex items-center text-2xl font-bold p-3 bg-black/20 rounded-2xl">{title}</h2>;
	}
}
