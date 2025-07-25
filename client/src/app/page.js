// ✅ FILE: app/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "/components/AuthForm";
import { Email, Apple, Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Home() {
	const [mode, setMode] = useState("signup");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zip, setZip] = useState();
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();

	const { user, validateAccess } = useAuth();

	useEffect(() => {
		(async () => {
			const currentRoute = window.location.pathname;
			const returnedUserData = await validateAccess(currentRoute);
			if (returnedUserData && returnedUserData != undefined) {
				router.push(`/canvas/${returnedUserData.role}`);
			}
		})();
    }, []);

	useEffect(() => {
		document.getElementById("field-warning").classList.add("hidden");
	}, [mode]);

	async function handleSubmit(e) {
		e.preventDefault();
        setIsSubmitting(true);
		document.getElementById("field-warning").classList.add("hidden");
		if (mode === "signup") {
			// client-side input validation
			const fields = { firstName, lastName, phoneNumber, email, username, street, city, state, zip, password };
			for (let field in fields) {
				if (fields.hasOwnProperty(field)) {
					fields.field = fields[field].trim();
				}
				if (!fields[field]) {
					document.getElementById("field-warning").classList.remove("hidden");
					document.getElementById("field-warning").innerText = "Must fill out all fields";
					setIsSubmitting(false);
					return;
				}
			}
			if (phoneNumber.length != 10) {
				document.getElementById("field-warning").classList.remove("hidden");
				document.getElementById("field-warning").innerText = "Phone Number must be 10 digits";
				setIsSubmitting(false);
				return;
			}
			// add user to database
			await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
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
						zip,
					},
				}),
			}).then((res) => {
				if (res.status === 200) {
					router.push("/canvas/student");
				} else if (res.status === 409) {
					document.getElementById("field-warning").classList.remove("hidden");
					document.getElementById("field-warning").innerText = "Email is already associated with an existing user";
					setIsSubmitting(false);
					return;
				}
			});
		} else if (mode === "login") {
			const fields = { email, password };
			for (let field in fields) {
				if (fields.hasOwnProperty(field)) {
					fields.field = fields[field].trim();
				}
				if (!fields[field]) {
					document.getElementById("field-warning").classList.remove("hidden");
					document.getElementById("field-warning").innerText = "Must fill out all fields";
					setIsSubmitting(false);
					return;
				}
			}
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						credentials: {
							email,
							password,
						},
					}),
				});

				if (res.ok) {
					const data = await res.json();
					localStorage.setItem("jwtToken", data.token);
					router.push(`/canvas/${data.role}`);
				} else if (res.status === 400) {
					document.getElementById("field-warning").classList.remove("hidden");
					document.getElementById("field-warning").innerText = "Must fill out all fields";
					setIsSubmitting(false);
					return;
				} else if (res.status === 401) {
					document.getElementById("field-warning").classList.remove("hidden");
					document.getElementById("field-warning").innerText = "Incorrect email or password";
					setIsSubmitting(false);
					return;
				}
			} catch (error) {
				console.error("Error:", error);
				setIsSubmitting(false);
			}
		}
	}

	const handleGoogleLogin = () => {
		window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
	};

	const usStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

	function formatPhoneNumber(value) {
		const numbers = value.replace(/\D/g, "");
		if (numbers.length <= 3) return numbers;
		if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
		return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
	}

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

				<form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
					{mode === "signup" && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							<input type="text" required placeholder="First Name" className="input w-full" maxLength={20} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
							<input type="text" required placeholder="Last Name" className="input w-full" maxLength={20} value={lastName} onChange={(e) => setLastName(e.target.value)} />
							<input type="tel" required placeholder="(123) 456-7890" className="input w-full" value={formatPhoneNumber(phoneNumber)} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))} />
							<input type="text" required placeholder="Username" className="input w-full" maxLength={20} value={username} onChange={(e) => setUsername(e.target.value)} />
							<input type="text" required placeholder="Street" className="input w-full" autoComplete="street-address" value={street} onChange={(e) => setStreet(e.target.value)} />
							<input type="text" required placeholder="City" className="input w-full" value={city} onChange={(e) => setCity(e.target.value)} />
							<select className="select select-bordered w-full" value={state} onChange={(e) => setState(e.target.value)}>
								<option value="">Select State</option>
								{usStates.map((state) => (
									<option key={state} value={state}>
										{state}
									</option>
								))}
							</select>
							<input
								type="text"
								required
								placeholder="Zip Code"
								className="input w-full"
								value={zip}
								onChange={(e) => {
									const value = e.target.value.replace(/\D/g, "");
									setZip(value.length <= 5 ? value : `${value.slice(0, 5)}-${value.slice(5, 9)}`);
								}}
								maxLength={10}
							/>
						</div>
					)}

					<div className={`grid grid-cols-1 ${mode === "signup" && "sm:grid-cols-2"} gap-3`}>
						<input type="email" required placeholder="Email" className="input w-full" maxLength={50} value={email} onChange={(e) => setEmail(e.target.value)} />
						<div className="relative flex items-center w-full">
							<input type={showPassword ? "text" : "password"} required maxLength={50} placeholder="Password" className="inpu w-full pr-10" value={password} onChange={(e) => setPassword(e.target.value)} />
							<button onClick={() => setShowPassword(!showPassword)} type="button" className="absolute right-3" aria-label={showPassword ? "Hide password" : "Show password"}>
								<img src={`/svgs/eye${showPassword ? "" : "-off"}.svg`} alt="" className="w-6 h-6"></img>
							</button>
						</div>
					</div>

					<div id="field-warning" className="text-red-500 text-sm hidden">
						Must fill out all fields
					</div>

					<button disabled={isSubmitting} type="submit" className="btn w-full border-white mt-1 hover:from-purple-900 hover:via-black hover:to-black hover:bg-gradient-to-r">
						{mode === "signup" ? "Create Account" : "Login"}
					</button>
				</form>

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
