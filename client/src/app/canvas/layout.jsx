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
		<div className="w-full min-h-dvh flex p-3 bg-[#1B1340] gap-3 relative">
			<Sidebar />

			<div className="flex flex-col gap-4 w-full max-h-screen">
				<div className="flex flex-col gap-y-3 rounded-md h-full overflow-auto">
					<div className="bg-[#120C2A] rounded-xl p-3 h-full">
						<div className="px-4 py-2">
							<TitleDisplay title={title} />
						</div>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

function TitleDisplay({ title }) {
	return <h2 className="flex items-center text-2xl font-bold">{title}</h2>;
}
