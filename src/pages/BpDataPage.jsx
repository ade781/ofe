import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { BpTable } from "../components/BpTable";
import { BpFormModal } from "../components/BpFormModal"; // Import modal
import { Plus } from "lucide-react";

export const BpDataPage = ({ user, onLogout, onNavigate }) => {
    // State lokal untuk data (fetch ulang saat ada perubahan)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState(null);

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/badan-publik");
            const json = await res.json();
            setData(json.data || []);
        } catch (err) {
            console.error("Gagal load data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle Create / Update
    const handleSave = async (formData) => {
        const url = editingData ? `/badan-publik/${editingData.id}` : "/badan-publik";
        const method = editingData ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert(editingData ? "Data diperbarui!" : "Data ditambahkan!");
                setIsModalOpen(false);
                fetchData(); // Refresh tabel
            } else {
                alert("Gagal menyimpan data");
            }
        } catch (err) {
            alert("Error koneksi");
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus data ini?")) return;

        try {
            const res = await fetch(`/badan-publik/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData(); // Refresh tabel
            } else {
                alert("Gagal menghapus");
            }
        } catch (err) {
            alert("Error koneksi");
        }
    };

    return (
        <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-800">Manajemen Data Badan Publik</h2>
                    <button
                        onClick={() => { setEditingData(null); setIsModalOpen(true); }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                    >
                        <Plus size={18} /> Tambah Data
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <BpTable
                        data={data}
                        loading={loading}
                        enableActions={true} // Aktifkan tombol edit/delete
                        onEdit={(row) => { setEditingData(row); setIsModalOpen(true); }}
                        onDelete={handleDelete}
                        showSelection={false}
                    />
                </div>

                <BpFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSave}
                    initialData={editingData}
                />
            </div>
        </DashboardLayout>
    );
};