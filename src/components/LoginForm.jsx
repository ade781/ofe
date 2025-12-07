import React, { useState } from "react";

export const LoginForm = ({ onSubmit, isLoading }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(username, password);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                    type="password"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
                {isLoading ? "Memproses..." : "Login"}
            </button>
        </form>
    );
};
