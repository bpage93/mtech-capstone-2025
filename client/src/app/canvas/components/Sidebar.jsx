"use client";
import { useRouter } from "next/navigation";

export default function Sidebar () {
    const router = useRouter();
    return (
        <div className="w-64 bg-base-200 rounded-box shadow p-4 flex flex-col gap-2">
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => router.push("/canvas/student")}
            >
                🏠 Dashboard
            </button>
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => router.push("/canvas/courses")}
            >
                📚 Courses
            </button>
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => router.push("/canvas/assignments")}
            >
                📝 Assignments
            </button>
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => router.push("/canvas/messages")}
            >
                📨 Messages
            </button>
            <button
                className="btn btn-outline w-full justify-start text-white"
                onClick={() => router.push("/canvas/settings")}
            >
                ⚙️ Settings
            </button>
        </div>
    );
}
