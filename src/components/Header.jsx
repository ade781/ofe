import React from "react";

export const Header = () => {
    return (
        <div className="text-center space-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Otomatisasi</p>
            <h1 className="text-2xl font-semibold text-slate-800">Frontend (OFE)</h1>
            <p className="text-sm text-slate-500">Terhubung ke backend OBE @ http://localhost:8082</p>
        </div>
    );
};
