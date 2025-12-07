import { useState, useEffect, useCallback } from "react";
import { parseJsonSafe } from "../utils/parseJson";

const getEmptyState = () => ({ loading: false, data: [], error: "" });

export const useBadanPublik = (isLoggedIn) => {
    const [bp, setBp] = useState(getEmptyState());

    const fetchBp = useCallback(async () => {
        setBp({ loading: true, data: [], error: "" });
        try {
            const res = await fetch("/badan-publik");
            const data = await parseJsonSafe(res);
            if (!res.ok) throw new Error(data.message || data.raw || "Gagal memuat badan publik");
            setBp({ loading: false, data: data.data || [], error: "" });
        } catch (err) {
            setBp({ loading: false, data: [], error: err.message || "Gagal memuat badan publik" });
        }
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            setBp(getEmptyState());
            return;
        }

        fetchBp();
    }, [isLoggedIn, fetchBp]);

    const reset = () => setBp(getEmptyState());

    return { bp, reset, refresh: fetchBp };
};
