"use client";
import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const LoadingContext = createContext();

export function useLoading() {
    return useContext(LoadingContext);
}

export function LoadingProvider({ children }) {
    const [isPageLoading, setIsPageLoading] = useState(false);
    const router = useRouter();

    const triggerLoadingAndNavigate = (path) => {
        setIsPageLoading(true);
        setTimeout(() => {
            setIsPageLoading(false);
            router.push(path)
        }, 1500);
    };

    return (
        <LoadingContext.Provider
            value={{ isPageLoading, triggerLoadingAndNavigate }}
        >
            {children}
        </LoadingContext.Provider>
    );
}
