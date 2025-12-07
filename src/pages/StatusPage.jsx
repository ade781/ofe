import React from "react";
import { Header } from "../components/Header";
import { BpTable } from "../components/BpTable";

export const StatusPage = ({ user, bpData, bpLoading, bpError, onLogout, onNavigate }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4">
            <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6">
                <Header />

                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-slate-500">Status koneksi pengguna</p>
                        <p className="text-xl font-semibold text-slate-800">{user.username}</p>
                        <p className="text-xs text-slate-500">Role: {user.role}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onNavigate("dashboard")}
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Kembali ke Dashboard
                        </button>
                        <button
                            onClick={() => onNavigate("settings")}
                            className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Settings
                        </button>
                        <button
                            onClick={onLogout}
                            className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <BpTable data={bpData} loading={bpLoading} error={bpError} showSelection={false} />
            </div>
        </div>
    );
};
