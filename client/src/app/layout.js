import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageLoader from "./canvas/components/PageLoader";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Canvas",
	description: "School management system",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<PageLoader />
				{children}
			</body>
		</html>
	);
}
