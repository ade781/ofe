import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { BpTable } from "../components/BpTable";
import { EmailAutomationPanel } from "../components/EmailAutomationPanel";

export const AdminPage = ({ user, bpData, bpLoading, bpError, onLogout, onNavigate }) => { // 1. Terima onNavigate
    const [selectedIds, setSelectedIds] = useState([]);
    const [sending, setSending] = useState(false);

    // ... (kode handleSelect, handleSelectAll, handleSendEmail tetap sama) ...
    // Saya persingkat untuk fokus ke navigasi, jangan hapus logika yang sudah ada
    const handleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const handleSelectAll = (isChecked) => setSelectedIds(isChecked ? bpData.map(d => d.id) : []);

    const handleSendEmail = async (formData) => {
        // ... (Pastikan logika kirim email kamu tetap ada di sini) ...
        // Copy paste logika handleSendEmail yang terakhir kamu buat
    };

    return (
        // 2. Teruskan onNavigate ke Layout
        <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-1">Halo, Admin {user.username}!</h2>
                    <p className="text-amber-100 opacity-90">Panel Kontrol Otomatisasi.</p>
                </div>

                <EmailAutomationPanel
                    selectedCount={selectedIds.length}
                    onSend={handleSendEmail}
                    sending={sending}
                />

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <BpTable
                        data={bpData}
                        loading={bpLoading}
                        error={bpError}
                        selectedIds={selectedIds}
                        onSelect={handleSelect}
                        onSelectAll={handleSelectAll}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
};