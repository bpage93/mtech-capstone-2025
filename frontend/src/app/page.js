// ✅ FILE: app/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "/components/AuthForm";

export default function Home() {
    const [mode, setMode] = useState("signup");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState();
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (
            mode === "signup" &&
            (!firstName || !lastName || !email || !password)
        ) {
            const fieldsList = [
                firstName,
                lastName,
                phoneNumber,
                email,
                username,
                street,
                state,
                zip,
                password,
            ];
            for (let field of fieldsList) {
                if (!field) {
                    document
                        .getElementById("field-warning")
                        .classList.remove("hidden");
                    return;
                }
            }
        }
        const endpoint =
            mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
        // Perform fetch/axios here
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <div className="min-h-screen flex items-center justify-center animate-gradient-circular p-4 bg-gradient-to-r from-purple-[#4b0082] via-[#121212] to-purple-900 animate-gradient">
            <div className="flex flex-col gap-y-3 rounded-xl p-5 w-full max-w-md bg-base-200 shadow-xl text-white">
                <AuthForm
                    mode={mode}
                    setMode={setMode}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    username={username}
                    setUsername={setUsername}
                    street={street}
                    setStreet={setStreet}
                    city={city}
                    setCity={setCity}
                    state={state}
                    setState={setState}
                    zip={zip}
                    setZip={setZip}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    handleSubmit={handleSubmit}
                    handleGoogleLogin={handleGoogleLogin}
                />
            </div>
        </div>
    );
}
