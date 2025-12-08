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
        <div className="bg-white p-6 rounded-lg border-2 border-gov-border shadow-md mb-6">
            <h3 className="text-lg font-bold text-gov-dark mb-5 flex items-center gap-2">
                <Send size={20} className="text-gov-accent" />
                Otomatisasi Pengiriman Email
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom Kiri: Input Data */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gov-dark mb-2">Nama Pemohon</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2.5 border-2 border-gov-border rounded-lg text-sm focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition"
                            placeholder="Contoh: Budi Santoso"
                            value={formData.namaPemohon}
                            onChange={e => setFormData({ ...formData, namaPemohon: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gov-dark mb-2">Tujuan Permintaan</label>
                        <textarea
                            required
                            className="w-full px-4 py-2.5 border-2 border-gov-border rounded-lg text-sm focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition h-24"
                            placeholder="Contoh: Mengerjakan tugas kuliah / Penelitian skripsi"
                            value={formData.tujuan}
                            onChange={e => setFormData({ ...formData, tujuan: e.target.value })}
                        />
                    </div>
                </div>

                {/* Kolom Kanan: Upload & Action */}
                <div className="space-y-5 flex flex-col justify-between">
                    <div>
                        <label className="block text-sm font-bold text-gov-dark mb-2">Upload KTP (Wajib)</label>
                        <div className="border-2 border-dashed border-gov-accent rounded-lg p-5 text-center hover:bg-gov-bg transition cursor-pointer relative bg-white">
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center text-gov-light">
                                <Upload size={28} className="mb-2 text-gov-accent" />
                                <span className="text-xs font-semibold text-gov-dark">
                                    {formData.ktpFile ? `✓ ${formData.ktpFile.name}` : "Klik untuk upload KTP (JPG/PDF)"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gov-accent/10 border-2 border-gov-accent rounded-lg p-4 text-xs text-gov-dark flex items-start gap-3 font-semibold">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-gov-accent" />
                        <p>
                            Sistem akan mengirimkan email ke <b>{selectedCount}</b> badan publik dengan template PPID standar. Verifikasi data sebelum mengirim.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={sending || selectedCount === 0}
                        className="w-full py-3.5 bg-gradient-to-r from-gov-dark to-gov-light text-white rounded-lg font-bold hover:from-gov-light hover:to-gov-dark disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg"
                    >
                        {sending ? "⏳ Mengirim..." : `📬 Kirim Email (${selectedCount})`}
                    </button>
                </div>
            </form>
        </div>
    );
};