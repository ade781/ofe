import React from "react";
import { X, Mail, AlertTriangle } from "lucide-react";

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-slideUp">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 rounded-t-2xl text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Konfirmasi Pengiriman Email</h3>
                        </div>
                        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-lg transition">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                        <p className="text-sm text-amber-800 font-medium">
                            ⚠️ Anda akan mengirim email ke <span className="font-bold">{data?.recipientCount || 0}</span> badan publik.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Mail className="text-blue-600 mt-0.5" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Nama Pemohon</p>
                                <p className="text-sm text-slate-800 font-medium">{data?.namaPemohon || "-"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="text-blue-600 mt-0.5" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 uppercase font-semibold">Tujuan Permintaan</p>
                                <p className="text-sm text-slate-800">{data?.tujuan || "-"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="text-blue-600 mt-0.5" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 uppercase font-semibold">File KTP</p>
                                <p className="text-sm text-slate-800 font-medium">{data?.ktpFileName || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-slate-600 mb-2 font-semibold">Daftar Penerima:</p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {data?.recipients?.map((r, i) => (
                                <p key={i} className="text-xs text-slate-700">• {r.nama_badan_publik} ({r.email})</p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
                    >
                        Ya, Kirim Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};
