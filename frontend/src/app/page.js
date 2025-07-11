"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

export default function Home() {
    const router = useRouter();

    const [mode, setMode] = useState("signup"); // signup or login
    const [role, setRole] = useState("student"); // student or teacher
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleToggle = (_, newMode) => {
        if (newMode) setMode(newMode);
    };

    const handleRoleToggle = (_, newRole) => {
        if (newRole) setRole(newRole);
    };

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!data.token) {
                alert("Login failed.");
                return;
            }

            localStorage.setItem("token", data.token);
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            const userRole = payload.role;

            if (userRole === "student") {
                router.push("/canvas/student");
            } else if (userRole === "teacher") {
                router.push("/canvas/teacher");
            } else {
                alert("Unknown role.");
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong.");
        }
    };

    useEffect(() => {
        fetch("http://localhost:5000/api") // Make sure this matches your backend port
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) =>
                console.error("Frontend-backend connection error:", err)
            );
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(to right, #1f003b, #000000)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
            }}
        >
            <Paper
                elevation={10}
                sx={{
                    width: 500,
                    p: 4,
                    borderRadius: 4,
                    background: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(10px)",
                    color: "white",
                }}
            >
                <ToggleButtonGroup
                    value={role}
                    exclusive
                    onChange={handleRoleToggle}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="teacher" sx={{ color: "white" }}>
                        Teacher
                    </ToggleButton>
                    <ToggleButton value="student" sx={{ color: "white" }}>
                        Student
                    </ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={handleToggle}
                    fullWidth
                    sx={{ mb: 2 }}
                >
                    <ToggleButton value="signup" sx={{ color: "white" }}>
                        Sign Up
                    </ToggleButton>
                    <ToggleButton value="login" sx={{ color: "white" }}>
                        Sign In
                    </ToggleButton>
                </ToggleButtonGroup>

                <Typography variant="h6" sx={{ mb: 2 }}>
                    {mode === "signup"
                        ? "Create an account"
                        : "Sign into your account"}
                </Typography>

                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    {mode === "signup" && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                variant="filled"
                                InputProps={{ sx: { color: "white" } }}
                                InputLabelProps={{ sx: { color: "white" } }}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                variant="filled"
                                InputProps={{ sx: { color: "white" } }}
                                InputLabelProps={{ sx: { color: "white" } }}
                            />
                        </Box>
                    )}

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
                        label="Phone Number"
                        variant="filled"
                        InputProps={{ sx: { color: "white" } }}
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

                    <Button
                        variant="contained"
                        onClick={handleLogin}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            background:
                                "linear-gradient(to right, #8e2de2, #4a00e0)",
                            fontWeight: "bold",
                        }}
                    >
                        {mode === "signup" ? "Create an account" : "Login"}
                    </Button>

                    <Divider sx={{ my: 2 }}>OR SIGN IN WITH</Divider>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Google />}
                            sx={{ color: "white", borderColor: "white" }}
                        >
                            Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Apple />}
                            sx={{ color: "white", borderColor: "white" }}
                        >
                            Apple
                        </Button>
                    </Box>
                </Box>

                <Typography
                    variant="caption"
                    sx={{
                        mt: 2,
                        display: "block",
                        textAlign: "center",
                        color: "gray",
                    }}
                >
                    By creating an account, you agree to our Terms & Service.
                </Typography>
            </Paper>
        </Box>
    );
}
