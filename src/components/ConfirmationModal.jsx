import React from "react";
import { X, Mail, AlertTriangle } from "lucide-react";

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 animate-slideUp border-t-4 border-gov-accent">
                <div className="bg-gradient-to-r from-gov-dark to-gov-light p-6 rounded-t-lg text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gov-accent/30 rounded-lg">
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
                    <div className="bg-gov-accent/10 border-l-4 border-gov-accent p-4 rounded-lg">
                        <p className="text-sm text-gov-dark font-bold">
                            ⚠️ Anda akan mengirim email ke <span className="text-lg text-gov-light">{data?.recipientCount || 0}</span> badan publik.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Mail className="text-gov-light mt-0.5" size={20} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-600 uppercase font-bold">Nama Pemohon</p>
                                <p className="text-sm text-gov-dark font-semibold">{data?.namaPemohon || "-"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="text-gov-light mt-0.5" size={20} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-600 uppercase font-bold">Tujuan Permintaan</p>
                                <p className="text-sm text-gov-dark">{data?.tujuan || "-"}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Mail className="text-gov-light mt-0.5" size={20} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-600 uppercase font-bold">File KTP</p>
                                <p className="text-sm text-gov-dark font-semibold">{data?.ktpFileName || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gov-bg border-2 border-gov-border rounded-lg p-4">
                        <p className="text-xs text-gov-dark mb-3 font-bold">📋 Daftar Penerima:</p>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                            {data?.recipients?.map((r, i) => (
                                <p key={i} className="text-xs text-gov-dark bg-white p-2 rounded border border-gov-border">
                                    <span className="font-bold">•</span> {r.nama_badan_publik} <br/> <span className="text-gray-600">{r.email}</span>
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border-2 border-gov-border text-gov-dark rounded-lg font-bold hover:bg-gov-bg transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-gov-dark to-gov-light text-white rounded-lg font-bold hover:from-gov-light hover:to-gov-dark transition shadow-lg"
                    >
                        ✓ Ya, Kirim Sekarang
                    </button>
                </div>
            </div>
        </div>
    );
};
