"use client";

import { useTitleContext } from "../contexts/TitleContext";
import { useState, useEffect } from "react";

export default function TeacherCanvasPage() {
	const { updateTitle } = useTitleContext();

	useEffect(() => {
		updateTitle("Admin Dashboard");
	});

    return (
        <div></div>
	);
}
