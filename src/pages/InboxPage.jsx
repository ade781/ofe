import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Mail, RefreshCw } from "lucide-react";
import { useToast } from "../components/Toast";

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const InboxPage = ({ user, onLogout, onNavigate }) => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedReply, setSelectedReply] = useState(null);
    const { showToast, ToastContainer } = useToast();

    const fetchReplies = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/emails/replies/sent-emails?user_id=${user.id}`);
            const data = await res.json();
            if (res.ok) {
                setReplies(data.replies || []);
            } else {
                const reason = data.error ? `${data.message}: ${data.error}` : data.message;
                showToast("error", reason || "Gagal memuat balasan");
            }
        } catch (err) {
            console.error("Fetch replies error", err);
            showToast("error", err.message || "Gagal memuat balasan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReplies();
    }, [user?.id]);

    const handleRefresh = async () => {
        if (!user?.id) return;
        setRefreshing(true);
        try {
            const res = await fetch("/api/emails/refresh-replies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id }),
            });
            const data = await res.json();
            if (res.ok) {
                showToast("success", `Menemukan ${data.newReplies || 0} balasan baru`);
            } else {
                const reason = data.error ? `${data.message}: ${data.error}` : data.message;
                showToast("error", reason || "Gagal menyegarkan balasan");
            }
        } catch (err) {
            console.error("Refresh replies failed", err);
            showToast("error", err.message || "Gagal menyegarkan balasan");
        } finally {
            setRefreshing(false);
            fetchReplies();
        }
    };

    return (
        <>
            <ToastContainer />
            <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-cyan-100/80">Kotak Masuk</p>
                                <h2 className="text-2xl font-bold">Balasan dari permintaan email</h2>
                                <p className="text-sm text-cyan-100 opacity-90">Hanya menampilkan balasan email yang dikirim lewat aplikasi</p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 border border-white/70 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 transition disabled:opacity-60"
                            >
                                <RefreshCw size={16} />
                                {refreshing ? "Menyegarkan..." : "Periksa Balasan Baru"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-xs uppercase text-slate-400 tracking-wide">Total balasan tersimpan</p>
                                <p className="text-2xl font-semibold text-slate-900">{replies.length}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Mail className="text-cyan-500" />
                                <span>Balasan untuk email yang dikirim lewat aplikasi</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                                <span className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full"></span>
                                <p className="mt-3">Memuat balasan...</p>
                            </div>
                        ) : replies.length === 0 ? (
                            <div className="text-center text-slate-500 py-14 space-y-2">
                                <Mail size={56} className="mx-auto opacity-30" />
                                <p>Tidak ada balasan yang tersimpan.</p>
                                <p className="text-xs text-slate-400">Tekan tombol "Periksa Balasan Baru" untuk mengambil data terbaru.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {replies.map((reply) => (
                                    <button
                                        key={reply.id}
                                        onClick={() => setSelectedReply(reply)}
                                        className="w-full text-left px-2 py-4 hover:bg-slate-50 transition border-b border-slate-100 last:border-b-0"
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="min-w-0 space-y-1">
                                                <p className="text-sm font-semibold text-slate-900">{reply.subject || "(tanpa subjek)"}</p>
                                                <p className="text-xs text-slate-500 truncate">{reply.from_email || reply.from_name || "Pengirim tidak diketahui"}</p>
                                            </div>
                                            <span className="text-xs text-slate-400">{formatDate(reply.received_at)}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 mt-1 max-h-12 overflow-hidden text-ellipsis">{reply.message || "Tidak ada isi pesan"}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DashboardLayout>

            {selectedReply && (
                <ReplyDetailModal reply={selectedReply} onClose={() => setSelectedReply(null)} />
            )}
        </>
    );
};

const ReplyDetailModal = ({ reply, onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-start p-5 border-b border-slate-200">
                <div>
                    <p className="text-xs uppercase text-slate-400">Balasan dari</p>
                    <p className="text-lg font-semibold text-slate-900">{reply.from_email || reply.from_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDate(reply.received_at)}</p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
                    ✕
                </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
                <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide">Subjek</p>
                    <p className="text-base font-semibold text-slate-800">{reply.subject || "(tanpa subjek)"}</p>
                </div>
                <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide mb-2">Isi Pesan</p>
                    <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap border border-slate-200">
                        {reply.message || "Tidak ada isi pesan"}
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
);
