"use client";

import { TitleWrapper, useTitleContext } from "./contexts/TitleContext";
import { useEffect } from "react";

export default function Layout({ children }) {
    return (
        <TitleWrapper>
            <div className="w-full min-h-dvh flex p-4 text-white bg-gradient-to-r from-[#450082] to-[#12001e] animate-circular-gradient gap-4">
                {/* Sidebar */}
                <div className="w-64 bg-base-200 rounded-box shadow p-4 flex flex-col gap-2">
                    <button className="btn btn-outline w-full justify-start text-white">
                        🏠 Dashboard
                    </button>
                    <button className="btn btn-outline w-full justify-start text-white">
                        📚 Courses
                    </button>
                    <button className="btn btn-outline w-full justify-start text-white">
                        📝 Assignments
                    </button>
                    <button className="btn btn-outline w-full justify-start text-white">
                        📨 Messages
                    </button>
                    <button className="btn btn-outline w-full justify-start text-white">
                        ⚙️ Settings
                    </button>
                </div>

                {/* Main content */}
                <div className="flex flex-col gap-4 w-full">
                    <div className="card bg-base-300 p-4 rounded-box shadow-md">
                        <TitleDisplay />
                    </div>

                    <div className="card bg-base-100 p-6 rounded-box shadow grow">
                        {children}
                    </div>
                </div>
            </div>
        </TitleWrapper>
    );
    function TitleDisplay() {
        const { title } = useTitleContext();
        return (
            <h2 className="flex items-center text-2xl font-bold p-3 bg-black/20 rounded-2xl">
                {title}
            </h2>
        );
    }
}
