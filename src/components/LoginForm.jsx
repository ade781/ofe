import React, { useState } from "react";

export const LoginForm = ({ onSubmit, isLoading }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(username, password);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gov-dark">Username</label>
                <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gov-border text-sm focus:outline-none focus:ring-2 focus:ring-gov-light focus:border-gov-light transition"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gov-dark">Password</label>
                <input
                    type="password"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-gov-border text-sm focus:outline-none focus:ring-2 focus:ring-gov-light focus:border-gov-light transition"
                    placeholder="••••••••"
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
                className="w-full py-3 rounded-lg bg-gradient-to-r from-gov-dark to-gov-light text-white text-sm font-bold hover:from-gov-light hover:to-gov-dark active:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
            >
                {isLoading ? "Memproses..." : "Login ke Portal"}
            </button>
        </form>
    );
};
