"use client";

import { TitleWrapper, useTitleContext } from "./contexts/TitleContext";
import Sidebar from "./components/Sidebar";
import RouteGuard from "../components/RouteGuard";
import Loading from "./loading";
import { Suspense } from "react";

export default function Layout({ children }) {
	return (
		<RouteGuard>
			<TitleWrapper>
				<MainLayout>
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</MainLayout>
			</TitleWrapper>
		</RouteGuard>
	);
}

function MainLayout({ children }) {
	const { title } = useTitleContext();

	return (
		<div className="w-full min-h-dvh flex p-4 text-white bg-gradient-to-r from-[#450082] to-[#12001e] animate-circular-gradient gap-4 relative">
			{/* Sidebar */}
			<Sidebar />

			{/* Main Content Area */}
			<div className="flex flex-col gap-4 w-full max-h-screen  pr-2">
				<div className="card bg-base-300 p-4 rounded-box shadow-md">
					<TitleDisplay title={title} />
				</div>
				<div className="card bg-base-100 p-6 rounded-box shadow grow overflow-y-auto overflow-x-auto">{children}</div>
			</div>
		</div>
	);
}

function TitleDisplay({ title }) {
	return <h2 className="flex items-center text-2xl font-bold p-3 bg-black/20 rounded-2xl">{title}</h2>;
}
