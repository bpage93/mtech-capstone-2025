"use client";
import { Avatar } from "@mui/material";
import NavigationButton from "./components/NavigationButton";
import { useEffect, useState } from "react";
import { TitleWrapper, useTitleContext } from "./contexts/TitleContext";
import { Title } from "@mui/icons-material";

export default function ({ children }) {
	return (
		<TitleWrapper>
			<div className="w-full h-full min-h-dvh flex p-4 gap-x-5 text-white bg-gradient-to-r from-[#450082] to-[#12001e]">
				<div className="flex flex-col w-70 p-5 gap-y-4 bg-black/20 rounded-2xl">
					<div className="flex w-full gap-x-3 items-center">
						<Avatar></Avatar>
						<div className="text-xl font-bold">Generic Name</div>
					</div>
					<NavigationButton>Dashboard</NavigationButton>
					<NavigationButton>Courses</NavigationButton>
					<NavigationButton>Profile</NavigationButton>
				</div>
				<div className="flex flex-col gap-y-5 w-full">
					<TitleDisplay />
					<div>{children}</div>
				</div>
			</div>
		</TitleWrapper>
	);
}

function TitleDisplay() {
	const { title } = useTitleContext();
	return <h2 className = "flex items-center text-2xl font-bold p-3 bg-black/20 rounded-2xl">{ title }</h2>;
}