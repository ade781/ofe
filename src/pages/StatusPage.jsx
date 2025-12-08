import React from "react";
import { Header } from "../components/Header";
import { BpTable } from "../components/BpTable";
import { ArrowLeft } from "lucide-react";

export const StatusPage = ({ user, bpData, bpLoading, bpError, onLogout, onNavigate }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gov-dark via-gov-light to-gov-light2 px-4 py-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gov-accent opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gov-accent opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="w-full max-w-5xl bg-white shadow-2xl rounded-lg border-t-4 border-gov-accent p-8 space-y-6 relative z-10">
                <Header />

                <div className="flex items-center justify-between gap-4 p-4 bg-gov-bg border-2 border-gov-border rounded-lg">
                    <div>
                        <p className="text-xs font-bold text-gov-light uppercase tracking-widest">Status Koneksi</p>
                        <p className="text-2xl font-bold text-gov-dark mt-1">{user.username}</p>
                        <p className="text-sm text-gray-600 mt-1">👤 Role: <span className="font-semibold">{user.role === 'admin' ? 'Administrator' : 'Pengguna Umum'}</span></p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => onNavigate("dashboard")}
                            className="flex items-center gap-2 rounded-lg border-2 border-gov-light bg-gov-light text-white px-4 py-2.5 text-sm font-bold hover:bg-gov-dark transition"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </button>
                        <button
                            onClick={() => onNavigate("settings")}
                            className="rounded-lg border-2 border-gov-border px-4 py-2.5 text-sm font-bold text-gov-dark hover:bg-gov-bg transition"
                        >
                            ⚙️ Settings
                        </button>
                        <button
                            onClick={onLogout}
                            className="rounded-lg border-2 border-red-500 bg-red-500 text-white px-4 py-2.5 text-sm font-bold hover:bg-red-700 transition"
                        >
                            🚪 Keluar
                        </button>
                    </div>
                </div>

                <BpTable data={bpData} loading={bpLoading} error={bpError} showSelection={false} />
            </div>
        </div>
    );
};
