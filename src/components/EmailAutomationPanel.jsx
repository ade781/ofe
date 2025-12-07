import React, { useState } from "react";
import { Send, Upload, AlertCircle } from "lucide-react";

export const EmailAutomationPanel = ({ selectedCount, onSend, sending }) => {
    const [formData, setFormData] = useState({
        namaPemohon: "",
        tujuan: "",
        ktpFile: null
    });

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFormData({ ...formData, ktpFile: e.target.files[0] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedCount === 0) return alert("Pilih minimal satu badan publik!");
        if (!formData.ktpFile) return alert("File KTP Wajib dilampirkan!");

        onSend(formData);
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Send size={20} className="text-blue-600" />
                Otomatisasi Pengiriman Email
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom Kiri: Input Data */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pemohon</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Contoh: Budi Santoso"
                            value={formData.namaPemohon}
                            onChange={e => setFormData({ ...formData, namaPemohon: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tujuan Permintaan</label>
                        <textarea
                            required
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24"
                            placeholder="Contoh: Mengerjakan tugas kuliah / Penelitian skripsi"
                            value={formData.tujuan}
                            onChange={e => setFormData({ ...formData, tujuan: e.target.value })}
                        />
                    </div>
                </div>

                {/* Kolom Kanan: Upload & Action */}
                <div className="space-y-4 flex flex-col justify-between">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload KTP (Wajib)</label>
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center text-slate-500">
                                <Upload size={24} className="mb-2" />
                                <span className="text-xs">
                                    {formData.ktpFile ? formData.ktpFile.name : "Klik untuk upload KTP (JPG/PDF)"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <p>
                            Sistem akan mengirimkan email secara otomatis ke <b>{selectedCount}</b> badan publik yang dipilih dengan template standar PPID. Pastikan data benar.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={sending || selectedCount === 0}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                        {sending ? "Mengirim..." : `Kirim Email Masal (${selectedCount})`}
                    </button>
                </div>
            </form>
        </div>
    );
};