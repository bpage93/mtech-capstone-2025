"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function RouteGuard ({ children }) {
	const router = useRouter();
	const { user, validateAccess } = useAuth();

    useEffect(() => {
        async function checkAccess() {
            const currentRoute = window.location.pathname;
			const hasAccess = await validateAccess(currentRoute);

			if (!hasAccess) {
				router.push("/");
            }
        }

        checkAccess();
	}, []);

	return children;
}
