"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PageLoader() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleComplete = () => setLoading(false);

        router.events?.on("routeChangeStart", handleStart);
        router.events?.on("routeChangeComplete", handleComplete);
        router.events?.on("routeChangeError", handleComplete);

        return () => {
            router.events?.off("routeChangeStart", handleStart);
            router.events?.off("routeChangeComplete", handleComplete);
            router.events?.off("routeChangeError", handleComplete);
        };
    }, [router]);

    return loading ? (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
    ) : null;
}
