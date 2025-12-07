import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { BpTable } from "../components/BpTable";

export const AdminPage = ({ user, bpData, bpLoading, bpError, onLogout }) => {
    return (
        <DashboardLayout user={user} onLogout={onLogout}>
            <div className="space-y-6">
                {/* Banner Selamat Datang */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-1">Halo, Admin {user.username}!</h2>
                    <p className="text-amber-100 opacity-90">
                        Selamat datang kembali di panel kontrol OFE. Anda memiliki akses penuh.
                    </p>
                </div>

                {/* Statistik Ringkas (Contoh) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-sm text-slate-500">Total Badan Publik</p>
                        <p className="text-2xl font-bold text-slate-800">{bpData.length}</p>
                    </div>
                    {/* Tambahkan widget lain sesuai kebutuhan */}
                </div>

                {/* Tabel Data */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">Daftar Badan Publik</h3>
                        <p className="text-sm text-slate-500">Data real-time dari backend.</p>
                    </div>
                    <BpTable data={bpData} loading={bpLoading} error={bpError} />
                </div>
            </div>
        </DashboardLayout>
    );
};