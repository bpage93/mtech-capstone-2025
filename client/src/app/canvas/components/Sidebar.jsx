"use client";
import { useLoading } from "../contexts/LoadingContext";

export default function Sidebar() {
    const { triggerLoadingAndNavigate } = useLoading();

    return (
        <div className="w-64 bg-base-200 rounded-box shadow p-4 flex flex-col gap-2">
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => triggerLoadingAndNavigate("/canvas/student")}
            >
                🏠 Dashboard
            </button>
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => triggerLoadingAndNavigate("/canvas/courses")}
            >
                📚 Courses
            </button>
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => triggerLoadingAndNavigate("/canvas/assignments")}
            >
                📝 Assignments
            </button>
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => triggerLoadingAndNavigate("/canvas/messages")}
            >
                📨 Messages
            </button>
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => triggerLoadingAndNavigate("/canvas/settings")}
            >
                ⚙️ Settings
            </button>
        </div>
    );
}
