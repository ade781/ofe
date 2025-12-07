import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { BpTable } from "../components/BpTable";
import { EmailAutomationPanel } from "../components/EmailAutomationPanel";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { SendingModal } from "../components/SendingModal";
import { useToast } from "../components/Toast";
import { Activity, History, Inbox, CheckCircle } from "lucide-react";

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

    const totalBp = bpData?.length || 0;
    const haveEmailCount = bpData?.filter(row => Boolean(row.email)).length || 0;
    const sentBpCount = bpData?.filter(row => (row.sent_count || 0) > 0).length || 0;
    const pendingBpCount = Math.max(totalBp - sentBpCount, 0);

    const topRecipients = useMemo(() => {
        if (!bpData || bpData.length === 0) return [];
        return [...bpData]
            .sort((a, b) => (b.sent_count || 0) - (a.sent_count || 0))
            .slice(0, 3);
    }, [bpData]);

    const statCards = useMemo(() => [
        {
            label: "Total Badan Publik",
            value: totalBp,
            helper: `${haveEmailCount} alamat email terisi`
        },
        {
            label: "Sudah Terkirim",
            value: sentBpCount,
            helper: `${pendingBpCount} menunggu pengiriman`
        },
        {
            label: "Dipilih (Email masal)",
            value: selectedIds.length,
            helper: "Pilih badan publik untuk email"
        }
    ], [haveEmailCount, pendingBpCount, selectedIds.length, sentBpCount, totalBp]);

    const quickLinks = [
        {
            label: "Status Permohonan",
            description: "Lihat balasan dari PPID",
            target: "status",
            icon: Activity
        },
        {
            label: "Riwayat Email",
            description: "Telusuri log pengiriman",
            target: "history",
            icon: History
        },
        {
            label: "Kotak Masuk",
            description: "Pantau balasan masuk",
            target: "inbox",
            icon: Inbox
        }
    ];

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
                    <div className="grid gap-4 md:grid-cols-3">
                        {statCards.map((card) => (
                            <div key={card.label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-2">{card.label}</p>
                                <p className="text-3xl font-semibold text-slate-900">{card.value}</p>
                                <p className="text-xs text-slate-500 mt-1">{card.helper}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <EmailAutomationPanel
                            selectedCount={selectedIds.length}
                            onSend={handleSendEmail}
                            sending={sending}
                        />

                        <div className="space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-slate-800">Tautan Cepat</h3>
                                    <span className="text-xs text-slate-500">Navigasi panel lain</span>
                                </div>
                                <div className="grid gap-3">
                                    {quickLinks.map((link) => (
                                        <QuickLinkButton
                                            key={link.label}
                                            icon={link.icon}
                                            label={link.label}
                                            description={link.description}
                                            onClick={() => onNavigate?.(link.target)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-slate-800 mb-3">Top Penerima (Terkirim)</h3>
                                <div className="space-y-3">
                                    {topRecipients.length === 0 ? (
                                        <p className="text-sm text-slate-500">Belum ada pengiriman tercatat.</p>
                                    ) : (
                                        topRecipients.map((row) => (
                                            <div key={row.id} className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">{row.nama_badan_publik}</p>
                                                    <p className="text-xs text-slate-500 truncate">{row.email || "Email kosong"}</p>
                                                </div>
                                                <div className="text-xs text-slate-600 flex items-center gap-1">
                                                    <CheckCircle size={16} className="text-emerald-500" />
                                                    {row.sent_count || 0}x
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

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

const QuickLinkButton = ({ icon: Icon, label, description, onClick }) => (
    <button
        onClick={onClick}
        className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition flex items-center gap-3 text-left"
    >
        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600">
            <Icon size={20} />
        </div>
        <div>
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500">{description}</p>
        </div>
    </button>
);