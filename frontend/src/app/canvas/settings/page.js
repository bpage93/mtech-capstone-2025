"use client";

import { useLoading } from "../contexts/LoadingContext";
import { useTitleContext } from "../contexts/TitleContext";
import { useEffect } from "react";

export default function Settings() {
    const { updateTitle } = useTitleContext();
    const { triggerLoadingAndNavigate } = useLoading();

    useEffect(() => {
        updateTitle("⚙️ Settings");
    });

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Section */}
            <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                    <h2 className="card-title text-white">👤 Profile</h2>
                    <form className="form-control gap-4">
                        <input
                            type="text"
                            placeholder="Edit Name"
                            className="input input-bordered w-full"
                        />
                    </form>
                </div>
            </div>

            {/* User Section */}
            <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                    <h2 className="card-title text-white">🔐 Account</h2>
                    <form className="form-control gap-4">
                        <input
                            type="email"
                            placeholder="Edit Email"
                            className="input input-bordered w-full"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            className="input input-bordered w-full"
                        />
                        <button
                            onClick={() =>
                                triggerLoadingAndNavigate("/canvas/settings")
                            }
                            className="btn btn-primary w-fit mt-2"
                        >
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
