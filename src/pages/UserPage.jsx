import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { BpTable } from "../components/BpTable";

export const UserPage = ({ user, bpData, bpLoading, bpError, onLogout, onNavigate }) => { // 1. Terima onNavigate
    return (
        // 2. Teruskan onNavigate ke Layout
        <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
            <div className="space-y-6">
                <div className="bg-white border-l-4 border-emerald-500 p-4 rounded-r-lg shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">User Dashboard</p>
                            <h2 className="text-xl font-bold text-slate-800">Selamat datang, {user.username}</h2>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <BpTable data={bpData} loading={bpLoading} error={bpError} showSelection={false} />
                </div>
            </div>
        </DashboardLayout>
    );
};