"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Email,
    Apple,
    Google,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

export default function Home() {
    const [mode, setMode] = useState("signup");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        const endpoint =
            mode === "signup" ? "/api/auth/signup" : "/api/auth/login";

        const res = await fetch(`http://localhost:5000${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                mode === "signup"
                    ? {
                          email,
                          password,
                          role,
                          firstName,
                          lastName,
                          phoneNumber,
                      }
                    : { email, password, role }
            ),
        });

        const data = await res.json();

        if (res.ok) {
            const token = data.token;
            localStorage.setItem("token", token);

            const payload = JSON.parse(atob(token.split(".")[1]));
            const userRole = payload.role;

            if (userRole === "student") {
                router.push("/canvas/student");
            } else if (userRole === "teacher") {
                router.push("/canvas/teacher");
            }
        } else {
            alert(data.message || "Something went wrong!");
        }
    };
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-purple-900 via-black to-purple-900 animate-gradient">
            <div className="card w-full max-w-md bg-base-200 shadow-xl text-white">
                <div className="card-body">
                    <div className="flex justify-center mb-4">
                        <div className="join">
                            <button
                                onClick={() => setRole("teacher")}
                                className={`btn join-item ${
                                    role === "teacher"
                                        ? "btn-primary"
                                        : "btn-outline"
                                }`}
                            >
                                Admin
                            </button>
                            <button
                                onClick={() => setRole("student")}
                                className={`btn join-item ${
                                    role === "student"
                                        ? "btn-primary"
                                        : "btn-outline"
                                }`}
                            >
                                Student
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center mb-4">
                        <div className="join">
                            <button
                                onClick={() => setMode("signup")}
                                className={`btn join-item ${
                                    mode === "signup"
                                        ? "btn-accent"
                                        : "btn-outline"
                                }`}
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => setMode("login")}
                                className={`btn join-item ${
                                    mode === "login"
                                        ? "btn-accent"
                                        : "btn-outline"
                                }`}
                            >
                                Sign In
                            </button>
                        </div>
                    </div>

                    <h2 className="text-center text-xl font-bold mb-4">
                        {mode === "signup"
                            ? "🚀 Create an Account"
                            : "🔐 Sign Into Your Account"}
                    </h2>

                    {mode === "signup" && (
                        <>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="input input-bordered w-full mb-2"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="input input-bordered w-full mb-2"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                className="input input-bordered w-full mb-2"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </>
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full mb-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="relative mb-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 btn btn-sm btn-ghost"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>

                    <button
                        className="btn w-full mt-2 border-white hover:from-purple-900 hover:via-black hover:to-black hover:bg-gradient-to-r"
                        onClick={handleSubmit}
                    >
                        {mode === "signup" ? "Create Account" : "Login"}
                    </button>

                    <div className="divider text-white">OR</div>

                    <button
                        onClick={handleGoogleLogin}
                        className="btn btn-outline w-full border-white hover:from-purple-900 hover:via-black hover:to-black hover:bg-gradient-to-r"
                    >
                        <Google className="mr-2" /> Google
                    </button>

                    <p className="text-center text-sm text-gray-400 mt-4">
                        By creating an account, you agree to our{" "}
                        <span className="underline">Terms & Service</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
