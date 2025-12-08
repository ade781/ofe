import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Mail, RefreshCw, User, ArrowRight } from "lucide-react";
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
            // Endpoint ini mengambil balasan + data email terkirim (recipient_name, dll)
            const res = await fetch(`/api/emails/replies/sent-emails?user_id=${user.id}`);
            const data = await res.json();
            if (res.ok) {
                setReplies(data.replies || []);
            } else {
                console.warn("Gagal memuat balasan:", data.message);
            }
        } catch (err) {
            console.error("Fetch replies error", err);
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

        // Timeout safety: Jika request pending > 30 detik, stop loading UI
        const timeoutId = setTimeout(() => {
            if (refreshing) {
                setRefreshing(false);
                showToast("info", "Proses sinkronisasi berjalan di latar belakang...");
            }
        }, 30000);

        try {
            const res = await fetch("/api/emails/refresh-replies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id }),
            });

            const data = await res.json();
            clearTimeout(timeoutId);

            if (res.ok) {
                showToast("success", `Sinkronisasi selesai. ${data.newReplies || 0} balasan baru.`);
                fetchReplies(); // Ambil data terbaru setelah sukses
            } else {
                throw new Error(data.message || "Gagal menyegarkan");
            }
        } catch (err) {
            console.error("Refresh replies failed", err);
            // Jangan tampilkan error toast jika hanya timeout network biasa, cukup log saja
            if (err.name !== 'AbortError') {
                showToast("error", "Gagal sinkronisasi. Cek koneksi atau coba lagi nanti.");
            }
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-cyan-200">Kotak Masuk</p>
                                <h2 className="text-2xl font-bold">Balasan Email</h2>
                                <p className="text-sm text-cyan-100 opacity-90 mt-1">
                                    Memantau balasan dari Badan Publik yang Anda hubungi.
                                </p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className={`mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 border border-white/30 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 transition ${refreshing ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                                {refreshing ? "Menyinkronkan..." : "Sinkronisasi Email"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-slate-800">Daftar Balasan</h3>
                                <p className="text-sm text-slate-500">Klik pesan untuk melihat detail</p>
                            </div>
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                {replies.length} Pesan
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                                <span className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3"></span>
                                <p>Memuat data...</p>
                            </div>
                        ) : replies.length === 0 ? (
                            <div className="text-center text-slate-400 py-16">
                                <Mail size={48} className="mx-auto mb-3 opacity-20" />
                                <p>Belum ada balasan masuk.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {replies.map((reply) => (
                                    <button
                                        key={reply.id}
                                        onClick={() => setSelectedReply(reply)}
                                        className="w-full text-left p-4 hover:bg-slate-50 transition group"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                                                <span className="truncate max-w-[200px]">
                                                    {reply.from_name || reply.from_email}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                                {formatDate(reply.received_at)}
                                            </span>
                                        </div>

                                        <h4 className="text-base font-semibold text-slate-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {reply.subject || "(Tanpa Subjek)"}
                                        </h4>

                                        <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                                            {reply.message || "Tidak ada pratinjau pesan."}
                                        </p>

                                        {/* Menampilkan Data Dikirim ke Siapa */}
                                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100 border-dashed">
                                            <span className="flex items-center gap-1">
                                                <ArrowRight size={12} />
                                                Dikirim ke: <span className="font-medium text-slate-600">{reply.recipient_name || reply.recipient_email || "Tidak diketahui"}</span>
                                            </span>
                                        </div>
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            Balasan Masuk
                        </span>
                        <span className="text-xs text-slate-400">{formatDate(reply.received_at)}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">
                        {reply.subject || "(Tanpa Subjek)"}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                        <span className="font-medium text-slate-900">{reply.from_name || reply.from_email}</span>
                        <span className="text-slate-400">&lt;{reply.from_email}&gt;</span>
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
                >
                    ✕
                </button>
            </div>

            {/* Content Modal */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Info Konteks Pengiriman (Data yang berhasil dikirim) */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <ArrowRight size={14} />
                        Konteks Pengiriman Awal
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-500 text-xs">Penerima Tujuan</p>
                            <p className="font-medium text-slate-800">{reply.recipient_name || "-"}</p>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs">Email Tujuan</p>
                            <p className="font-medium text-slate-800">{reply.recipient_email || "-"}</p>
                        </div>
                    </div>
                </div>

                {/* Isi Pesan Balasan */}
                <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Isi Pesan</h4>
                    <div className="bg-white border border-slate-200 rounded-xl p-5 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                        {reply.message || "Tidak ada konten pesan."}
                    </div>
                </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium text-sm transition shadow-lg shadow-slate-200"
                >
                    Tutup
                </button>
            </div>
        </div>
    </div>
);