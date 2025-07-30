"use client";

import { useEffect, useState } from "react";
import { useTitleContext } from "../../contexts/TitleContext";
import { useParams } from "next/navigation";
import Loading from "@/app/canvas/loading";

export default function CoursePage() {
	const [token, setToken] = useState(null);
	const { updateTitle } = useTitleContext();
	const [course, setCourse] = useState(null);
	const params = useParams();
	const courseId = params.id;

	useEffect(() => {
		if (!course) return;
		updateTitle(`${course.title} Course`);
		console.log(course);
	}, [updateTitle, course]);

	useEffect(() => {
		const storedToken = localStorage.getItem("jwtToken");
		setToken(storedToken);
		if (!storedToken) return;
		(async () => {
			const courseSearch = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/view/${courseId}`, {
				headers: {
					Authorization: `Bearer ${storedToken}`,
				},
			});
			if (!courseSearch.ok) return;
			const returnedCourse = await courseSearch.json();
			setCourse(returnedCourse.course);
		})();
	}, []);

	return (
		<div className="bg-[#160f33] h-full w-full rounded-lg overflow-y-auto p-4">
			{!course ? (
				<Loading />
			) : (
				<>
					<div className="flex flex-wrap justify-center w-full">
						<InfoCard title={"Schedule"} text={course.schedule} />
						<InfoCard title={"Classroom"} text={course.classroom_number} />
						<InfoCard title={"Credit Hours"} text={course.credit_hours} />
						<InfoCard title={"Tuition"} text={course.tuition_cost} />
					</div>
					<InfoCard title={"Description"} text={course.description} fullWidth={true} />
				</>
			)}
		</div>
	);
}

function InfoCard({ title, text, fullWidth = false }) {
	return (
		<div className={`${fullWidth ? "w-full" : "w-full sm:w-1/2 lg:w-1/4"} h-fit flex flex-col items-center text-center p-2 my-4 grow gap-y-2`}>
			<h5 className="text-2xl lg:text-3xl font-semibold text-indigo-100">{title}</h5>
			<p className="text-xl lg:text-2xl text-gray-200">{text}</p>
		</div>
	);
}
