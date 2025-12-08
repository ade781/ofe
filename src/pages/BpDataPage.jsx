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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gov-dark">📋 Manajemen Data Badan Publik</h2>
                        <p className="text-sm text-gray-600 mt-1">Kelola database badan publik sistem</p>
                    </div>
                    <button
                        onClick={() => { setEditingData(null); setIsModalOpen(true); }}
                        className="bg-gradient-to-r from-gov-dark to-gov-light text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:from-gov-light hover:to-gov-dark transition font-bold shadow-lg whitespace-nowrap"
                    >
                        <Plus size={20} /> Tambah Data
                    </button>
                </div>

                <div className="bg-white rounded-lg border-2 border-gov-border shadow-md p-6">
                    <BpTable
                        data={data}
                        loading={loading}
                        enableActions={true}
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