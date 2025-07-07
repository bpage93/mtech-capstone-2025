// frontend/src/app/page.js
"use client";

import { useRouter } from "next/navigation";

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

export default function Home() {
    const [mode, setMode] = useState("signup");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("student");
    const router = useRouter();

    const handleToggle = (_, newMode) => {
        if (newMode) setMode(newMode);
    };

    const handleUserToggle = (newRole) => {
        if (newRole) setRole(newRole);
    };

    const handleStudentBtn = () => {
        router.push("/canvas/student");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(270deg, #1f003b, #000000)",
                backgroundSize: "400% 400%",
                animation: "bg-pan 15s ease infinite",
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
                <div className="flex justify-center">
                    <ToggleButtonGroup
                        value={role}
                        exclusive
                        onChange={(_, newRole) => newRole && setRole(newRole)}
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
                        onChange={(_, newMode) => newMode && setMode(newMode)}
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
                </div>

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
                        onClick={handleStudentBtn}
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

                    <Divider
                        sx={{
                            my: 2,
                        }}
                    >
                        OR SIGN IN WITH
                    </Divider>

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
