"use client";
import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardActions,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";

export default function StudentCanvasPage() {
    const [courses, setCourses] = useState([]);
    const [fadeOutId, setFadeOutId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    const handleAddCourse = () => {
        const newCourse = {
            id: Date.now(),
            title: `Course ${courses.length + 1}`,
            description: "This is a placeholder course description.",
        };
        setCourses([...courses, newCourse]);
    };

    const confirmDeleteCourse = (id) => {
        setCourseToDelete(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        setFadeOutId(courseToDelete);

        // Delay to allow animation to finish
        setTimeout(() => {
            setCourses((prev) =>
                prev.filter((course) => course.id !== courseToDelete)
            );
            setFadeOutId(null);
            setConfirmOpen(false);
            setCourseToDelete(null);
        }, 300); // Match fade duration
    };

    return (
        <Box className="p-6">
            <Typography variant="h4" className="text-white font-bold mb-4">
                🎓 Welcome to the Student Canvas Page!
            </Typography>

            <Button
                variant="contained"
                onClick={handleAddCourse}
                sx={{
                    mb: 4,
                    background: "linear-gradient(to right, #8e2de2, #4a00e0)",
                }}
            >
                Add Course
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="group transition-transform duration-300 hover:scale-[1.02]"
                    >
                        <Card
                            className={`relative bg-gradient-to-br from-purple-800 to-indigo-900 text-white shadow-xl rounded-xl transition-opacity duration-300 transform ${
                                fadeOutId === course.id
                                    ? "opacity-0 scale-95"
                                    : "opacity-100 scale-100"
                            }`}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    className="font-bold mb-2"
                                >
                                    {course.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="text-gray-300 mb-1"
                                >
                                    {course.description}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    className="text-gray-400"
                                >
                                    Credit Hours: {course.creditHours || 3}
                                </Typography>
                            </CardContent>

                            <CardActions className="p-4">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    onClick={() =>
                                        confirmDeleteCourse(course.id)
                                    }
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </div>
                ))}
            </div>

            <Dialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                PaperProps={{ sx: { backgroundColor: "#222", color: "#fff" } }}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText className="!text-white">
                        Are you sure you want to delete this course?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>
                        Cancel
                    </Button>
                    <Button color="error" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
