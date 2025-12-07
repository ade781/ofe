import React, { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Eye } from "lucide-react";
import { ReplyModal } from "../components/ReplyModal";

export const StatusPage = ({ user, bpData, bpLoading, onLogout, onNavigate }) => {
    // State untuk mengontrol Modal
    const [selectedBp, setSelectedBp] = useState(null);

    const handleView = (bp) => {
        setSelectedBp(bp); // Set data BP yang diklik
    };

    const handleCloseModal = () => {
        setSelectedBp(null); // Tutup modal
    };

    return (
        <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Status & Balasan Email</h2>

                    <div className="overflow-auto rounded-lg border border-slate-200">
                        <table className="min-w-full text-sm text-left text-slate-800">
                            <thead className="bg-slate-100 font-semibold text-slate-700">
                                <tr>
                                    <th className="px-4 py-3 w-16">ID</th>
                                    <th className="px-4 py-3">Nama Badan Publik</th>
                                    <th className="px-4 py-3">Email Tujuan</th>
                                    <th className="px-4 py-3">Informasi</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-center">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bpLoading ? (
                                    <tr><td colSpan="6" className="text-center py-4">Memuat...</td></tr>
                                ) : bpData.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-slate-500">{row.id}</td>
                                        <td className="px-4 py-3 font-medium">{row.nama_badan_publik}</td>
                                        <td className="px-4 py-3 text-blue-600">{row.email}</td>
                                        <td className="px-4 py-3 text-slate-600 truncate max-w-[200px]" title={row.pertanyaan}>
                                            {row.pertanyaan}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {row.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleView(row)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                title="Lihat Balasan"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Render Modal jika ada BP yang dipilih */}
            {selectedBp && (
                <ReplyModal
                    bpId={selectedBp.id}
                    bpName={selectedBp.nama_badan_publik}
                    onClose={handleCloseModal}
                />
            )}
        </DashboardLayout>
    );
};