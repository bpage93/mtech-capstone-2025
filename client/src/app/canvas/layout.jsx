"use client";

import { TitleWrapper, useTitleContext } from "./contexts/TitleContext";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import Sidebar from "./components/Sidebar";

export default function Layout({ children }) {
    return (
        <TitleWrapper>
            <LoadingProvider>
                <MainLayout>{children}</MainLayout>
            </LoadingProvider>
        </TitleWrapper>
    );
}

function MainLayout({ children }) {
    const { title } = useTitleContext();
    const { isPageLoading } = useLoading();

    return (
        <div className="w-full min-h-dvh flex p-4 text-white bg-gradient-to-r from-[#450082] to-[#12001e] animate-circular-gradient gap-4 relative">
            {/* 🐒 Monkey Spinner Loading Screen */}
            {isPageLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-[#450082] to-[#12001e] text-white rounded-box transition-opacity duration-1000 ease-in overflow-hidden">
                    {/* Confetti Dots */}
                    <div className="absolute w-full h-full flex items-center justify-center gap-2 z-0">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                // className="w-4 h-4 rounded-full bg-pink-400 animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                        ))}
                    </div>

                    {/* 🍌 Spinning Banana */}
                    <div className="z-10 text-4xl banana-spinner">🍌</div>

                    {/* 🙈 Message */}
                    <p className="z-10 text-4xl font-bold animate-bounce tracking-wide drop-shadow mb-2">
                        Hang tight! The app is monkeying around! 🙈
                    </p>
                </div>
            )}

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex flex-col gap-4 w-full max-h-screen  pr-2">
                <div className="card bg-base-300 p-4 rounded-box shadow-md">
                    <TitleDisplay title={title} />
                </div>
                <div className="card bg-base-100 p-6 rounded-box shadow grow overflow-y-auto overflow-x-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

function TitleDisplay({ title }) {
    return (
        <h2 className="flex items-center text-2xl font-bold p-3 bg-black/20 rounded-2xl">
            {title}
        </h2>
    );
}
