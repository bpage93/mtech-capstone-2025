"use client";

import { useEffect, useState } from "react";
import { useTitleContext } from "../contexts/TitleContext";

export default function AssignmentsPage() {
    const { updateTitle } = useTitleContext();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        updateTitle("📝 Assignments");

        setAssignments([
            {
                id: 1,
                title: "JavaScript Basics Quiz",
                due: "2025-07-21",
                status: "pending",
            },
            {
                id: 2,
                title: "CSS Flexbox Project",
                due: "2025-07-25",
                status: "submitted",
            },
        ]);
    }, [updateTitle]);

    // 🔁 This function will be called when the button is clicked
    const handleSubmit = (id) => {
        // Update the status of the clicked assignment
        const updated = assignments.map((a) =>
            a.id === id ? { ...a, status: "submitted" } : a
        );
        setAssignments(updated);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Your Assignments</h2>

            <div className="grid gap-4">
                {assignments.map((assignment) => (
                    <div
                        key={assignment.id}
                        className="card bg-base-200 shadow-md"
                    >
                        <div className="card-body">
                            <h3 className="card-title">{assignment.title}</h3>
                            <p>Due: {assignment.due}</p>
                            <p>
                                Status:{" "}
                                <span
                                    className={`badge ${
                                        assignment.status === "submitted"
                                            ? "badge-success"
                                            : "badge-warning"
                                    }`}
                                >
                                    {assignment.status}
                                </span>
                            </p>

                            {/* 📤 Show button only if it's pending */}
                            {assignment.status === "pending" && (
                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => handleSubmit(assignment.id)}
                                >
                                    Submit Assignment
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
