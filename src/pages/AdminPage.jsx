import React from "react";
import { Header } from "../components/Header";
import { BpTable } from "../components/BpTable";

export const AdminPage = ({ user, bpData, bpLoading, bpError, onLogout }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4">
            <div className="w-full max-w-4xl bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-100 p-8 space-y-6">
                <Header />

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 space-y-1">
                    <p className="text-sm text-amber-700">Dashboard Admin</p>
                    <p className="text-lg font-semibold text-amber-900">Halo, {user.username}</p>
                    <p className="text-sm text-amber-800">Anda memiliki akses khusus admin.</p>
                </div>

                <BpTable data={bpData} loading={bpLoading} error={bpError} />

                <button
                    type="button"
                    onClick={onLogout}
                    className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 active:bg-slate-200 transition"
                >
                    Keluar
                </button>
            </div>
        </div>
    );
};
