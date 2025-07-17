"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { query } from "@/../../server/database/postgresQuery";
import { Email, Apple, Google, Visibility, VisibilityOff } from "@mui/icons-material";

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
	const [zip, setZip] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        document.getElementById("field-warning").classList.add("hidden");
    }, [mode])

    async function handleSubmit () {
        if (mode === "signup") {
            console.log("function called");
            // validate input
			const fieldsList = [firstName, lastName, phoneNumber, email, username, street, city, state, zip, password];
			for (let field of fieldsList) {
				if (!field) {
					document.getElementById("field-warning").classList.remove("hidden");
					return;
				}
            }
            // add user to database
			fetch("http://localhost:5000/api/users/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					user: {
						email,
						firstname: firstName,
						lastname: lastName,
						telephone: phoneNumber,
						username,
						password,
						street,
						city,
						state,
						zip
					}
				})
			});
		}
		const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
		};

	const handleGoogleLogin = () => {
		window.location.href = "http://localhost:5000/api/auth/google";
	};

    const handleLogin = () => {
        window.location.href = "/api/auth/login";
    };

	return (
		<div className="min-h-screen flex items-center justify-center animate-gradient-circular p-4 bg-gradient-to-r from-purple-900 via-black to-purple-900 animate-gradient">
			<div className="flex flex-col gap-y-3 rounded-xl p-5 w-full max-w-md bg-base-200 shadow-xl text-white">
				<h2 className="text-center text-2xl my-2 font-bold">{mode === "signup" ? "Create an Account" : "Sign Into Your Account"}</h2>

				<div className="flex justify-center mb-1 join">
					<button onClick={() => setMode("signup")} className={`btn join-item ${mode === "signup" ? "btn-accent" : "btn-outline"}`}>
						Sign Up
					</button>
					<button onClick={() => setMode("login")} className={`btn join-item ${mode === "login" ? "btn-accent" : "btn-outline"}`}>
						Sign In
					</button>
				</div>

				{mode === "signup" && (
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<input type="text" placeholder="First Name" className="input input-bordered w-full" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
						<input type="text" placeholder="Last Name" className="input input-bordered w-full" value={lastName} onChange={(e) => setLastName(e.target.value)} />
						<input type="number" placeholder="Phone Number" className="input input-bordered w-full" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
						<input type="text" placeholder="Username" className="input input-bordered w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
						<input type="text" placeholder="Street" className="input input-bordered w-full" value={street} onChange={(e) => setStreet(e.target.value)} />
						<input type="text" placeholder="City" className="input input-bordered w-full" value={city} onChange={(e) => setCity(e.target.value)} />
						<input type="text" placeholder="State" className="input input-bordered w-full" value={state} onChange={(e) => setState(e.target.value)} />
						<input type="number" placeholder="Zip Code" className="input input-bordered w-full" value={zip} onChange={(e) => setZip(e.target.value)} />
					</div>
				)}

				<input type="email" placeholder="Email" className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} />

				<div className="relative">
					<input type={showPassword ? "text" : "password"} placeholder="Password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
					<button type="button" className="absolute right-2 top-2 btn btn-sm btn-ghost" onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? "🙈" : "👁️"}
					</button>
				</div>

				<div id="field-warning" className="text-red-500 text-sm hidden">
					Must fill out all fields
				</div>

				<button className="btn w-full border-white hover:from-purple-900 hover:via-black hover:to-black hover:bg-gradient-to-r" onClick={handleSubmit}>
					{mode === "signup" ? "Create Account" : "Login"}
				</button>

				<div className="divider">OR</div>

				<button onClick={handleGoogleLogin} className="btn btn-outline w-full border-white hover:from-purple-900 hover:via-black hover:to-black hover:bg-gradient-to-r">
					<Google className="mr-2" /> Google
				</button>

				<p className="text-center text-sm text-gray-400 mt-4">
					By creating an account, you agree to our <span className="underline">Terms & Service</span>.
				</p>
			</div>
		</div>
	);
}
