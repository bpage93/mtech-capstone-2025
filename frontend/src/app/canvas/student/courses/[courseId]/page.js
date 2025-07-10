"use client";
import { useParams } from "next/navigation";

export default function CoursePage() {
	const params = useParams(); // You need to call the hook first
	const { courseId } = params;

	return <div>Dynamic ID: {courseId}</div>;
}
