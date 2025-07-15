"use client";

import {
    Box,
    Button,
    TextField,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    InputAdornment,
    IconButton,
    Divider,
    Paper,
} from "@mui/material";
import {
    Email,
    Apple,
    Google,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const handleToggle = (_, newMode) => {
        if (newMode) setMode(newMode);
    };

    const handleRoleToggle = (_, newRole) => {
        if (newRole) setRole(newRole);
    };

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
                    ? { email, password, role, firstName, lastName, address }
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

    return (
        <Box className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-black p-4">
            <Paper
                elevation={12}
                className="w-96 sm:w-[28rem] p-8 rounded-xl bg-white bg-opacity-70 text-white"
                sx={{ background: "rgba(255, 255, 255, 0.1)" }}
            >
                {/* {mode === "signup" &&} */}
                <div className="mb-4 flex justify-center">
                    <ToggleButtonGroup
                        value={role}
                        exclusive
                        onChange={handleRoleToggle}
                    >
                        <ToggleButton value="teacher" sx={{ color: "white" }}>
                            👩‍🏫 Admin
                        </ToggleButton>
                        <ToggleButton value="student" sx={{ color: "white" }}>
                            🎓 Student
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>

                {/* Mode Toggle */}
                <div className="mb-4 flex justify-center">
                    <ToggleButtonGroup
                        value={mode}
                        exclusive
                        onChange={handleToggle}
                    >
                        <ToggleButton value="signup" sx={{ color: "white" }}>
                            Sign Up
                        </ToggleButton>
                        <ToggleButton value="login" sx={{ color: "white" }}>
                            Sign In
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>

                <Typography
                    variant="h5"
                    className="text-center mb-4 text-white"
                >
                    {mode === "signup"
                        ? "🚀 Create an Account"
                        : "🔐 Sign Into Your Account"}
                </Typography>

                <div className="space-y-4">
                    {mode === "signup" && (
                        <>
                            <TextField
                                fullWidth
                                label="First Name"
                                variant="filled"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: "white" }} />
                                        </InputAdornment>
                                    ),
                                    sx: { color: "white" },
                                }}
                                InputLabelProps={{ sx: { color: "white" } }}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                variant="filled"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: "white" }} />
                                        </InputAdornment>
                                    ),
                                    sx: { color: "white" },
                                }}
                                InputLabelProps={{ sx: { color: "white" } }}
                            />
                            <TextField
                                fullWidth
                                label="Phone"
                                variant="filled"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: "white" }} />
                                        </InputAdornment>
                                    ),
                                    sx: { color: "white" },
                                }}
                                InputLabelProps={{ sx: { color: "white" } }}
                            />
                        </>
                    )}

                    {/* Always shown */}
                    <TextField
                        fullWidth
                        label="Email"
                        variant="filled"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email sx={{ color: "white" }} />
                                </InputAdornment>
                            ),
                            sx: { color: "white" },
                        }}
                        InputLabelProps={{ sx: { color: "white" } }}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        variant="filled"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff
                                                sx={{ color: "white" }}
                                            />
                                        ) : (
                                            <Visibility
                                                sx={{ color: "white" }}
                                            />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { color: "white" },
                        }}
                        InputLabelProps={{ sx: { color: "white" } }}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="btn btn-primary w-full mt-6 font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 border-none"
                >
                    {mode === "signup" ? "Create Account" : "Login"}
                </button>

                {/* Divider */}
                <Divider sx={{ my: 3, borderColor: "#666" }}>OR</Divider>

                {/* Social Buttons */}
                <div className="flex flex-col gap-3">
                    <button className="btn btn-outline w-full border-white  ">
                        <Google className="mr-2" /> Google
                    </button>
                    <button
                        className="btn btn-outline w-full border-white bg-white"
                        sx={{ background: "rgba(255, 255, 255, 0.1)" }}
                    >
                        <Apple className="mr-2" /> Apple
                    </button>
                </div>

                <p className="text-center text-sm text-gray-400 mt-4">
                    By creating an account, you agree to our{" "}
                    <span className="underline">Terms & Service</span>.
                </p>
            </Paper>
        </Box>
    );
}
