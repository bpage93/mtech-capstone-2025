"use client";

import { useEffect, useState } from "react";
import { useTitleContext } from "../contexts/TitleContext";
import { useRouter } from "next/navigation";
import Loading from "@/app/canvas/loading";

export default function CoursesPage() {
	const { updateTitle } = useTitleContext();
	const [courses, setCourses] = useState();
	const token = localStorage.getItem("jwtToken");

	useEffect(() => {
		updateTitle("Student Dashboard");
	}, [updateTitle]);

	useEffect(() => {
		(async () => {
			const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/view/enrolled`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const { enrolledCourses } = await coursesResponse.json();
			setCourses(enrolledCourses);
		})();
	}, []);

	useEffect(() => {
		console.log(courses);
	}, [courses]);

	return (
		<>
			{!courses ? (
				<Loading />
			) : (
				<div className="bg-[#160f33] h-full w-full rounded-lg overflow-y-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full h-fit p-4">
						{courses &&
							courses.length > 0 &&
							courses.map((course) => {
								return <CourseCard key={course.id} course={course} />;
							})}
					</div>
				</div>
			)}
		</>
	);
}

function CourseCard({ course }) {
	const router = useRouter();

	return (
		<div className="w-full h-50 bg-indigo-950 rounded-lg p-3 flex flex-col">
			<h4 className="text-2xl font-semibold truncate text-indigo-100 min-h-fit hover:underline hover:cursor-pointer" onClick={() => router.push(`${window.location.origin}/canvas/courses/${course.id}`)}>
				{course.title}
			</h4>
			<div className="flex w-full gap-x-2 text-gray-500 text-sm min-h-fit">
				<span className="truncate">{course.schedule}</span>
				<span className="truncate">{course.classroom_number}</span>
			</div>
			<p className="line-clamp-5 text-gray-400">{course.description}</p>
		</div>
	);
}
