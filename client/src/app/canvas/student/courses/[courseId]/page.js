"use client";
import { useTitleContext } from "@/app/canvas/contexts/TitleContext";
import { useEffect } from "react";
import { usePathname } from "next/navigation"; // Next.js navigation hook
import PageLoader from "@/app/components/PageLoader";

export default function CoursePage() {
	const { title, updateTitle } = useTitleContext();
	const pathname = usePathname(); // Proper way to get path in Next.js

	useEffect(() => {
		// This runs only on client side after component mounts
		const courseId = pathname.split("/").pop(); // Extract courseId from the path
		updateTitle(`Course ${courseId}`);
	}, [pathname, updateTitle]);

	return (
		<PageLoader>
			<div>
				<h1>Course Page</h1>
				<p>title: {title}</p>
			</div>
		</PageLoader>
	);
}
