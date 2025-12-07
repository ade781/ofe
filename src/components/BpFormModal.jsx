import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export const BpFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        nama: "", kategori: "", email: "", website: "", pertanyaan: ""
    });

    // Isi form jika sedang mode Edit
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-slate-800">
                        {initialData ? "Edit Badan Publik" : "Tambah Badan Publik"}
                    </h3>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Badan Publik</label>
                        <input required type="text" className="w-full border rounded p-2 text-sm"
                            value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kategori</label>
                            <input type="text" className="w-full border rounded p-2 text-sm"
                                value={formData.kategori} onChange={e => setFormData({ ...formData, kategori: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email</label>
                            <input required type="email" className="w-full border rounded p-2 text-sm"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Website</label>
                        <input type="text" className="w-full border rounded p-2 text-sm"
                            value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Template Pertanyaan</label>
                        <textarea className="w-full border rounded p-2 text-sm h-24"
                            value={formData.pertanyaan} onChange={e => setFormData({ ...formData, pertanyaan: e.target.value })} />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                            <Save size={16} /> Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};