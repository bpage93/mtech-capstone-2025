"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function Sidebar() {
	const { user } = useAuth();
	const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
	const routes = {
		dashboard: `/canvas/${user.role}`,
		courses: "/canvas/courses",
		assignments: "/canvas/assignments",
		messages: "/canvas/messages",
		settings: "/canvas/settings",
	};
	useEffect(() => {
		setCurrentRoute(window.location.pathname);
	}, []);

    return (
		<div className="min-w-64 bg-[#120C2A] rounded-xl shadow-md p-4 flex flex-col gap-y-3 text-[#efefef]">
			<NavButton svgPath="/svgs/dashboard.svg" altTitle="Go to dashboard" route={routes.dashboard} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute}>
				Dashboard
			</NavButton>
			<NavButton svgPath="/svgs/books.svg" altTitle="Go to courses" route={routes.courses} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute}>
				Courses
			</NavButton>
			<NavButton svgPath="/svgs/assignment.svg" altTitle="Go to assingments" route={routes.assignments} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute}>
				Assignments
			</NavButton>
			<NavButton svgPath="/svgs/chat.svg" altTitle="Go to messages" route={routes.messages} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute}>
				Messages
			</NavButton>
			<NavButton svgPath="/svgs/settings.svg" altTitle="Go to settings" route={routes.settings} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute}>
				Settings
			</NavButton>
		</div>
	);
	``;
}

function NavButton({ children, svgPath, altTitle = "", route, currentRoute, setCurrentRoute }) {
	const router = useRouter();
    return (
        <button
            aria-label={altTitle}
            className={`${currentRoute === route ? "bg-indigo-600" : "bg-indigo-950"} shadow-md w-full px-4 py-3 rounded-lg flex items-center gap-x-3 font-medium`}
            onClick={() => {
                setCurrentRoute(route);
                router.push(route);
            }}
        >
            <img src={svgPath} alt="" className="w-6 h-6" />
            <span>{children}</span>
        </button>
    );
}
