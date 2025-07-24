'use client';
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    async function validateAccess(route) {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            return false;
        }
        try {
            const res = await fetch(`http://localhost:5000/api/auth/token?route=${route}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                console.log("User data:", data.user);
                return data.user;
            }
            return false;
        } catch (error) {
            return false;
        }
    }
    return (
        <AuthContext.Provider value={{ user, validateAccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}