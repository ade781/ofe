import React from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { BpTable } from "../components/BpTable";

export const UserPage = ({ user, bpData, bpLoading, bpError, onLogout, onNavigate }) => {
    return (
        <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-gov-light to-gov-light2 border-l-4 border-gov-accent p-6 rounded-lg shadow-lg text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-gov-accent">Dashboard Pengguna</p>
                            <h2 className="text-2xl font-bold mt-1">Selamat datang, {user.username}</h2>
                            <p className="text-sm mt-2 text-gray-100">Berikut adalah data badan publik yang tersedia</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border-2 border-gov-border shadow-md p-6">
                    <BpTable data={bpData} loading={bpLoading} error={bpError} showSelection={false} />
                </div>
            </div>
        </DashboardLayout>
    );
};