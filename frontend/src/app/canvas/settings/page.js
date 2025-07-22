// ✅ FILE: app/canvas/settings/page.js
"use client";

import { useState, useEffect } from "react";
import SettingsForm from "../components/SettingForm";

export default function SettingsPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [theme, setTheme] = useState("dark");

    // Apply theme to the <html> tag
    useEffect(() => {
        if (typeof window !== "undefined") {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    // Load saved theme on initial render
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) setTheme(savedTheme);
        }
    }, []);

    const handleSave = () => {
        console.log("Settings saved:", {
            name,
            email,
            password,
            role,
            theme,
        });
        // Later: Send to backend API
    };

    return (
        <div className="min-h-screen bg-base-200 flex justify-center items-center p-6">
            <div className="card bg-base-100 shadow-xl w-full max-w-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">⚙️ Settings</h2>
                <SettingsForm
                    name={name}
                    setName={setName}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    role={role}
                    setRole={setRole}
                    theme={theme}
                    setTheme={setTheme}
                    handleSave={handleSave}
                />
            </div>
        </div>
    );
}
