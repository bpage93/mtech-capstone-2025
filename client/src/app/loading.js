"use client";

export default function Loading() {
    return (
        <div className="w-full min-h-dvh flex p-4 text-white bg-gradient-to-r from-[#450082] to-[#12001e] animate-circular-gradient gap-4 relative">
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
                <p className="z-10 text-4xl font-bold animate-bounce tracking-wide drop-shadow mb-2">Hang tight! The app is monkeying around! 🙈</p>
            </div>
        </div>
    )
}
