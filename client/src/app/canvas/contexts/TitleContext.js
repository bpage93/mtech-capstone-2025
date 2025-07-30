// contexts/AppContext.js
import { createContext, useContext, useState } from "react";

const TitleContext = createContext();

export function TitleWrapper({ children }) {
	const [title, setTitle] = useState("");

	// Provide both the value and the updater function
	const contextValue = {
		title, // current title value
		updateTitle: (newTitle) => setTitle(newTitle), // function to update title
	};

	return <TitleContext.Provider value={contextValue}>{children}</TitleContext.Provider>;
}

export function useTitleContext() {
	const context = useContext(TitleContext);
	if (context === undefined) {
		throw new Error("useTitleContext must be used within a TitleWrapper");
	}
	return context;
}
