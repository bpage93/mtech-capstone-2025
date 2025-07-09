'use client';
import { useEffect, useState } from "react";

export default function CoursePage() {
	const [courseId, setCourseId] = useState("");

	useEffect(() => {
		// This code only runs on the client side
		setCourseId(window.location.pathname.split("/").pop());
	}, []);

	return (
		<div>
			<h1>Course Page</h1>
			<p>This is the course page for a specific course.</p>
			<p>Course ID: {courseId}</p>
			<p>More course details can be added here.</p>
		</div>
	);
}
