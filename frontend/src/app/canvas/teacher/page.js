// frontend/src/app/canvas/teacher/page.js
"use client";

import { useTitleContext } from "../contexts/TitleContext";
import { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    CardActions,
    Paper,
} from "@mui/material";

export default function TeacherCanvasPage() {
    const [courseTitle, setCourseTitle] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [courseCredits, setCourseCredits] = useState("");
    const [courses, setCourses] = useState([]);
    const { updateTitle } = useTitleContext();

    useEffect(() => {
        updateTitle("Teacher Dashboard");
    });

    // Load courses from localStorage on first load
    useEffect(() => {
        const storedCourses = localStorage.getItem("allCourses");
        if (storedCourses) {
            setCourses(JSON.parse(storedCourses));
        }
    }, []);

    // Save courses to localStorage every time it changes
    useEffect(() => {
        localStorage.setItem("allCourses", JSON.stringify(courses));
    }, [courses]);

    const handleAddCourse = () => {
        const newCourse = {
            id: Date.now(),
            title: courseTitle,
            description: courseDescription || "No description provided.",
            creditHours: parseInt(courseCredits) || 0,
        };

        setCourses((prev) => [...prev, newCourse]);
        setCourseTitle("");
        setCourseDescription("");
        setCourseCredits("");
    };

    const handleDeleteCourse = (id) => {
        const filtered = courses.filter((course) => course.id !== id);
        setCourses(filtered);
    };

    return (
        <Box className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-black text-white">
            <Typography variant="h4" className="mb-6 font-bold">
                📘 Teacher Course Manager
            </Typography>

            {/* Course Form */}
            <Paper className="p-4 mb-6 bg-white/10">
                <Typography
                    variant="h6"
                    className="mb-4 font-semibold text-white"
                >
                    Add a New Course
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <TextField
                        label="Course Title"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={courseDescription}
                        onChange={(e) => setCourseDescription(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Credit Hours"
                        value={courseCredits}
                        onChange={(e) => setCourseCredits(e.target.value)}
                        type="number"
                        fullWidth
                    />
                </div>

                <Button
                    variant="contained"
                    onClick={handleAddCourse}
                    disabled={!courseTitle || !courseCredits}
                    sx={{
                        background:
                            "linear-gradient(to right, #8e2de2, #4a00e0)",
                    }}
                >
                    Add Course
                </Button>
            </Paper>

            {/* Course List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <Card
                        key={course.id}
                        className="bg-white/10 text-white shadow-md"
                    >
                        <CardContent>
                            <Typography variant="h6">{course.title}</Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-300"
                            >
                                {course.description}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="text-gray-400 mt-1"
                            >
                                Credit Hours: {course.creditHours}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => handleDeleteCourse(course.id)}
                            >
                                Delete
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </div>
        </Box>
    );
}
