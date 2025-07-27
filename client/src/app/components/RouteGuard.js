"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function RouteGuard({ children }) {
	const router = useRouter();
	const { user, validateAccess } = useAuth();
	const [authorized, setAuthorized] = useState(false);

	useEffect(() => {
		async function checkAccess() {
			const currentRoute = window.location.pathname;
			const hasAccess = await validateAccess(currentRoute);

			if (!hasAccess) {
				router.push("/");
			} else {
				setAuthorized(true);
			}
		}

		checkAccess();
	}, []);

	return authorized ? children : null;
}
