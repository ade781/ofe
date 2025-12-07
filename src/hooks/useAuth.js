import { useState } from "react";
import { parseJsonSafe } from "../utils/parseJson";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState({ loading: false, message: "" });

    const login = async (username, password) => {
        setStatus({ loading: true, message: "" });

        try {
            const res = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await parseJsonSafe(res);

            if (!res.ok) {
                throw new Error(data.message || data.raw || "Login gagal");
            }

            setUser(data.user);
            setStatus({ loading: false, message: "Login berhasil" });
            return true;
        } catch (err) {
            setStatus({ loading: false, message: err.message || "Gagal menghubungi server" });
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setStatus({ loading: false, message: "" });
    };

    return { user, status, login, logout };
};
