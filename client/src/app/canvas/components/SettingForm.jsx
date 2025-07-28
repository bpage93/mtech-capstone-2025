// ✅ FILE: components/SettingsForm.jsx
"use client";

export default function SettingsForm({
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    theme,
    setTheme,
    handleSave,
}) {
    return (
        <form className="flex flex-col gap-4">
            <div>
                <label className="label">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-[300px]"
                />
            </div>

            <div>
                <label className="label">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>

            <div>
                <label className="label">New Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full"
                />
            </div>

            <div>
                <label className="label">Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </div>

            <div>
                <label className="label">Theme</label>
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="select select-bordered w-full"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="cupcake">Cupcake</option>
                    <option value="synthwave">Synthwave</option>
                </select>
            </div>

            <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary mt-4"
            >
                Save Settings
            </button>
        </form>
    );
}
