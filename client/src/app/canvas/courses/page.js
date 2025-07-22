"use client";

import { useEffect, useState } from "react";
import { useTitleContext } from "../contexts/TitleContext";

export default function CoursesPage() {
    const { updateTitle } = useTitleContext();
    const [category, setCategory] = useState("");

    useEffect(() => {
        updateTitle("📚 Courses");
    }, [updateTitle]);

    return (
        <div className="space-y-6">
            {/* Page heading */}
            <div className="text-3xl font-bold mb-4">Available Courses</div>

            {/* Search bar and filter */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="input input-bordered w-full sm:w-1/2"
                />
                <select
                    className="select select-bordered"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="student" disabled>
                        Filter by category
                    </option>
                    <option value="programming">Programming</option>
                    <option value="math">Math</option>
                    <option value="science">Science</option>
                </select>
            </div>

            {/* Example course cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((id) => (
                    <div key={id} className="card bg-base-200 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title">Course {id}</h2>
                            <p>
                                Short description of the course goes here.
                                Topics covered, etc.
                            </p>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
