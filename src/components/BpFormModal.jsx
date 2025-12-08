import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export const BpFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nama: "", kategori: "", email: "", website: "", pertanyaan: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nama: initialData.nama_badan_publik || "",
                kategori: initialData.kategori || "",
                email: initialData.email || "",
                website: initialData.website || "",
                pertanyaan: initialData.pertanyaan || ""
            });
        } else {
            setFormData({ nama: "", kategori: "", email: "", website: "", pertanyaan: "" });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg border-t-4 border-gov-accent">
                <div className="flex justify-between items-center p-6 border-b-2 border-gov-border bg-gov-bg">
                    <h3 className="text-xl font-bold text-gov-dark">
                        {initialData ? "✏️ Edit Badan Publik" : "➕ Tambah Badan Publik Baru"}
                    </h3>
                    <button onClick={onClose}><X className="text-gov-light hover:text-gov-dark transition" size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gov-dark uppercase mb-2 tracking-widest">Nama Badan Publik</label>
                        <input required type="text" className="w-full border-2 border-gov-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition"
                            value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gov-dark uppercase mb-2 tracking-widest">Kategori</label>
                            <input type="text" className="w-full border-2 border-gov-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition"
                                value={formData.kategori} onChange={e => setFormData({ ...formData, kategori: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gov-dark uppercase mb-2 tracking-widest">Email</label>
                            <input required type="email" className="w-full border-2 border-gov-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gov-dark uppercase mb-2 tracking-widest">Website</label>
                        <input type="text" className="w-full border-2 border-gov-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition"
                            value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gov-dark uppercase mb-2 tracking-widest">Template Pertanyaan</label>
                        <textarea className="w-full border-2 border-gov-border rounded-lg p-3 text-sm h-24 focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition"
                            value={formData.pertanyaan} onChange={e => setFormData({ ...formData, pertanyaan: e.target.value })} />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-gov-dark hover:bg-gov-bg rounded-lg font-bold border-2 border-gov-border transition">Batal</button>
                        <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-gov-dark to-gov-light text-white rounded-lg hover:from-gov-light hover:to-gov-dark flex items-center gap-2 font-bold transition">
                            <Save size={18} /> Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};