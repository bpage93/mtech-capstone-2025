"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Sidebar() {
	const { user } = useAuth();
	const currentRoute = usePathname();
	const routes = {
		dashboard: `/canvas/${user.role}`,
		courses: "/canvas/courses",
		assignments: "/canvas/assignments",
		messages: "/canvas/messages",
		profile: "/canvas/profile",
	};

	return (
		<div className="min-w-64 bg-[#120C2A] rounded-xl shadow-md p-4 flex flex-col gap-y-3 text-[#efefef]">
			<NavButton svgPath="/svgs/dashboard.svg" altTitle="Go to dashboard" route={routes.dashboard} currentRoute={currentRoute}>
				Dashboard
			</NavButton>
			<NavButton svgPath="/svgs/books.svg" altTitle="Go to courses" route={routes.courses} currentRoute={currentRoute}>
				Courses
			</NavButton>
			<NavButton svgPath="/svgs/assignment.svg" altTitle="Go to assingments" route={routes.assignments} currentRoute={currentRoute}>
				Assignments
			</NavButton>
			<NavButton svgPath="/svgs/chat.svg" altTitle="Go to messages" route={routes.messages} currentRoute={currentRoute}>
				Messages
			</NavButton>
			<NavButton svgPath="/svgs/account_circle.svg" altTitle="Go to user profile" route={routes.profile} currentRoute={currentRoute}>
				Profile
			</NavButton>
		</div>
	);
	``;
}

function NavButton({ children, svgPath, altTitle = "", route, currentRoute }) {
	const router = useRouter();
	return (
		<button aria-label={altTitle} className={`${currentRoute.startsWith(route) ? "bg-indigo-600 shadow-md shadow-indigo-800" : "bg-indigo-950 shadow-md"} w-full px-4 py-3 rounded-lg flex items-center gap-x-3 font-medium`} onClick={() => router.push(route)}>
			<img src={svgPath} alt="" className="w-6 h-6" />
			<span>{children}</span>
		</button>
	);
}
