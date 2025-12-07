import { useState, useEffect } from "react";
import { parseJsonSafe } from "../utils/parseJson";

export const useBadanPublik = (isLoggedIn) => {
    const [bp, setBp] = useState({ loading: false, data: [], error: "" });

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchBp = async () => {
            setBp({ loading: true, data: [], error: "" });
            try {
                const res = await fetch("/badan-publik");
                const data = await parseJsonSafe(res);
                if (!res.ok) throw new Error(data.message || data.raw || "Gagal memuat badan publik");
                setBp({ loading: false, data: data.data || [], error: "" });
            } catch (err) {
                setBp({ loading: false, data: [], error: err.message || "Gagal memuat badan publik" });
            }
        };

        fetchBp();
    }, [isLoggedIn]);

    const reset = () => {
        setBp({ loading: false, data: [], error: "" });
    };

    return { bp, reset };
};
