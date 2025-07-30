"use client";

import { useEffect, useState } from "react";
import { useTitleContext } from "../contexts/TitleContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Loading from "@/app/canvas/loading";

export default function CoursesPage() {
	const { updateTitle } = useTitleContext();
	const [loading, setLoading] = useState(false);
	const [courses, setCourses] = useState();
	const [enrolledCourses, setEnrolledCourses] = useState();
	const [token, setToken] = useState(null);
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		updateTitle("Available Courses");
	}, [updateTitle]);

	async function fetchCourses() {
		setLoading(true);
		let storedToken = token;
		if (!token) {
			storedToken = localStorage.getItem("jwtToken");
			if (!storedToken) router.push("/");
		}
		const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/view/all`, {
			headers: {
				Authorization: `Bearer ${storedToken}`,
			},
		});
		const { courses } = await coursesResponse.json();
		setCourses(courses);

		if (user.role === "student") {
			const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/courses/view/enrolled`, {
				headers: {
					Authorization: `Bearer ${storedToken}`,
				},
			});
			const { enrolledCourses } = await coursesResponse.json();
			setEnrolledCourses(enrolledCourses);
			console.log(enrolledCourses);
		}
		setLoading(false);
	}

	useEffect(() => {
		const storedToken = localStorage.getItem("jwtToken");
		if (!storedToken) router.push("/");
		setToken(storedToken);
		fetchCourses();
	}, []);

	async function unenrollFromCourse(courseId) {
		setLoading(true);
		const unenrollmentResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/enrollment/unenroll`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				course_id: courseId,
			}),
		});
		if (!unenrollmentResponse.ok) {
			console.log("failed to unenroll");
			setLoading(false);
			return;
		}
		fetchCourses();
	}

	async function enrollToCourse(courseId) {
		setLoading(true);
		const enrollmentResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/enrollment/enroll`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				course_id: courseId,
			}),
		});
		if (!enrollmentResponse.ok) {
			console.log("Failed to enroll");
			setLoading(false);
			return;
		}
		fetchCourses();
	}

	return (
		<>
			{!courses || loading ? (
				<Loading />
			) : (
				<div className="bg-[#160f33] h-full w-full rounded-lg overflow-y-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full h-fit p-4">
						{courses &&
							courses.length > 0 &&
							courses.map((course) => {
								return <CourseCard key={course.id} course={course} enrolledCourses={enrolledCourses} unenrollFromCourse={unenrollFromCourse} enrollToCourse={enrollToCourse} />;
							})}
					</div>
				</div>
			)}
		</>
	);
}

function CourseCard({ course, enrolledCourses, unenrollFromCourse, enrollToCourse }) {
	const router = useRouter();
	const { user } = useAuth();
	const [enrolled, setEnrolled] = useState(false);

	useEffect(() => {
		if (!enrolledCourses) return;

		const isEnrolled = enrolledCourses.some((enrolledCourse) => enrolledCourse.id === course.id);
		setEnrolled(isEnrolled);
	}, [enrolledCourses, course.id]);

	return (
		<div className="w-full h-50 bg-indigo-950 rounded-lg p-3 flex flex-col text-left">
			<h4 className="text-2xl font-semibold truncate text-indigo-100 min-h-fit hover:underline hover:cursor-pointer" onClick={() => router.push(`${window.location.href}/${course.id}`)}>
				{course.title}
			</h4>
			<div className="flex w-full gap-x-2 text-gray-500 text-sm min-h-fit">
				<span className="truncate">{course.schedule}</span>
				<span className="truncate">{course.classroom_number}</span>
			</div>
			<p className="line-clamp-4 text-gray-400">{course.description}</p>
			{user.role === "student" && (
				<div className="flex justify-center">
					{!enrolled && (
						<button className="hover:cursor-pointer hover:underline w-fit font-bold text-emerald-600" onClick={() => enrollToCourse(course.id)}>
							Enroll for course
						</button>
					)}
					{enrolled && (
						<button className="hover:cursor-pointer hover:underline w-fit font-bold text-rose-600" onClick={() => unenrollFromCourse(course.id)}>
							Unenroll from course
						</button>
					)}
				</div>
			)}
		</div>
	);
}
