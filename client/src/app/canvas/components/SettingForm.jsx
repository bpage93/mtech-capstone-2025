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
        <form className="flex flex-col gap-6 w-full p-6 rounded-xl shadow-lg bg-base-200 text-base-content">
            <h2 className="text-2xl font-bold">Account Settings</h2>

            {/* Name */}
            <div className="form-control flex flex-col">
                <label className="label">
                    <span className="label-text">Name</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered max-w-sm mt-2"
                />
            </div>

            {/* Email */}
            <div className="form-control flex flex-col">
                <label className="label">
                    <span className="label-text">Email</span>
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered max-w-sm mt-2"
                />
            </div>

            {/* Password */}
            <div className="form-control flex flex-col">
                <label className="label">
                    <span className="label-text">New Password</span>
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered max-w-sm mt-2"
                />
            </div>

            {/* Role */}
            <div className="form-control flex flex-col ">
                <label className="label">
                    <span className="label-text">Role</span>
                </label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="select select-bordered max-w-sm mt-2"
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </div>

            {/* Theme */}
            <div className="form-control flex flex-col mt-2">
                <label className="label">
                    <span className="label-text">Theme</span>
                </label>
                <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="select select-bordered max-w-sm mt-2"
                >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="cupcake">Cupcake</option>
                    <option value="synthwave">Synthwave</option>
                </select>
            </div>

            {/* Submit */}
            <button
                type="button"
                onClick={handleSave}
                className="btn btn-primary max-w-sm mt-4"
            >
                Save Settings
            </button>
        </form>
    );
}
