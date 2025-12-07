import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { BpTable } from "../components/BpTable";
import { EmailAutomationPanel } from "../components/EmailAutomationPanel";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { SendingModal } from "../components/SendingModal";
import { useToast } from "../components/Toast";

export const AdminPage = ({ user, bpData, bpLoading, bpError, onLogout, onNavigate, onRefreshBp }) => { // 1. Terima onNavigate dan refresh
    const [selectedIds, setSelectedIds] = useState([]);
    const [sending, setSending] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);
    const [sendingStatus, setSendingStatus] = useState({ show: false, status: "sending", progress: 0 });
    const { showToast, ToastContainer } = useToast();

    // ... (kode handleSelect, handleSelectAll, handleSendEmail tetap sama) ...
    // Saya persingkat untuk fokus ke navigasi, jangan hapus logika yang sudah ada
    const handleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const handleSelectAll = (isChecked) => {
        const rows = bpData || [];
        setSelectedIds(isChecked ? rows.map(d => d.id) : []);
    };

    useEffect(() => {
        if (!bpData || bpData.length === 0) {
            setSelectedIds([]);
            return;
        }

        setSelectedIds((prev) => prev.filter((id) => bpData.some((row) => row.id === id)));
    }, [bpData]);

    const handleSendEmail = async (formData) => {
        if (!user?.id) {
            showToast("error", "User ID tidak ditemukan");
            return;
        }
        if (selectedIds.length === 0) {
            showToast("warning", "Pilih minimal satu badan publik");
            return;
        }

        const recipients = bpData
            .filter(row => selectedIds.includes(row.id) && row.email)
            .map(row => ({
                id: row.id,
                nama_badan_publik: row.nama_badan_publik,
                email: row.email,
                pertanyaan: row.pertanyaan,
            }));

        if (recipients.length === 0) {
            showToast("error", "Data badan publik belum lengkap (email kosong)");
            return;
        }

        // Show confirmation modal
        setPendingFormData({ ...formData, recipients, recipientCount: recipients.length, ktpFileName: formData.ktpFile?.name });
        setShowConfirm(true);
    };

    const confirmSend = async () => {
        setShowConfirm(false);
        setSending(true);
        setSendingStatus({ show: true, status: "sending", progress: 0 });

        try {
            const payload = new FormData();
            payload.append("nama_pemohon", pendingFormData.namaPemohon);
            payload.append("tujuan", pendingFormData.tujuan);
            payload.append("recipients", JSON.stringify(pendingFormData.recipients));
            payload.append("user_id", user.id);
            payload.append("ktp_file", pendingFormData.ktpFile);

            // Simulate progress
            const progressInterval = setInterval(() => {
                setSendingStatus(prev => {
                    const newProgress = Math.min(prev.progress + 15, 90);
                    return { ...prev, progress: newProgress };
                });
            }, 300);

            const res = await fetch("/api/send-bulk-email", {
                method: "POST",
                body: payload,
            });

            clearInterval(progressInterval);
            setSendingStatus(prev => ({ ...prev, progress: 100 }));

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Gagal mengirim email");

            setTimeout(() => {
                setSendingStatus({ show: true, status: "success", progress: 100 });
                showToast("success", `Email terkirim ke ${data.processed || 0} penerima${data.failed ? ` (gagal: ${data.failed})` : ""}`);

                setTimeout(() => {
                    setSendingStatus({ show: false, status: "sending", progress: 0 });
                    setSelectedIds([]);
                    onRefreshBp?.();
                }, 2000);
            }, 500);
        } catch (err) {
            setSendingStatus({ show: true, status: "error", progress: 0 });
            showToast("error", err.message || "Terjadi kesalahan saat mengirim email");
            setTimeout(() => {
                setSendingStatus({ show: false, status: "sending", progress: 0 });
            }, 3000);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <ConfirmationModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmSend}
                data={pendingFormData}
            />
            <SendingModal
                isOpen={sendingStatus.show}
                status={sendingStatus.status}
                progress={sendingStatus.progress}
            />
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
        </>
    );
};