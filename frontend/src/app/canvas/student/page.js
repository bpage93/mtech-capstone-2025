// frontend/src/app/canvas/student/page.js
"use client";

import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography, Paper } from "@mui/material";

export default function StudentCanvasPage() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const storedCourses = localStorage.getItem("allCourses");
        if (storedCourses) {
            setCourses(JSON.parse(storedCourses));
        }
    }, []);

    return (
        <Box className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-black text-white">
            <Typography variant="h4" className="mb-6 font-bold">
                🎓 Available Courses
            </Typography>

            {courses.length === 0 ? (
                <Paper className="p-6 text-center text-gray-300 bg-white/10">
                    No courses available yet. Please check back later!
                </Paper>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                        <Card
                            key={course.id}
                            className="bg-white/10 text-white shadow-md hover:scale-[1.01] transition-transform"
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    className="font-semibold"
                                >
                                    {course.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="text-gray-300 mt-2"
                                >
                                    {course.description}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="text-gray-400 mt-2"
                                >
                                    Credit Hours: {course.creditHours}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </Box>
    );
}
