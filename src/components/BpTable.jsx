import React from "react";
import { Edit, Trash2 } from "lucide-react"; // Import Icon

export const BpTable = ({
    data = [],
    loading = false,
    error = "",
    selectedIds = [],
    onSelect = () => { },
    onSelectAll = () => { },
    enableActions = false, // Props baru untuk mengaktifkan mode CRUD
    onEdit = () => { },    // Fungsi Edit
    onDelete = () => { },   // Fungsi Delete
    showSelection = true
}) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gov-dark">
                    Daftar Badan Publik ({data?.length || 0})
                </p>
                {loading && <span className="text-xs text-gov-light font-semibold">⏳ Memuat...</span>}
            </div>
            {error && <p className="text-sm text-red-600 font-semibold">⚠️ {error}</p>}
            <div className="overflow-auto border-2 border-gov-border rounded-lg max-h-[600px]">
                <table className="min-w-full text-sm text-gov-dark bg-white">
                    <thead className="bg-gradient-to-r from-gov-dark to-gov-light text-white sticky top-0 z-10">
                        <tr>
                            {showSelection && (
                                <th className="px-4 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => onSelectAll(e.target.checked)}
                                        checked={data && data.length > 0 && selectedIds && selectedIds.length === data.length}
                                        className="w-4 h-4 accent-gov-accent"
                                    />
                                </th>
                            )}
                            <th className="px-4 py-3 text-left font-bold">ID</th>
                            <th className="px-4 py-3 text-left font-bold">Nama Badan Publik</th>
                            <th className="px-4 py-3 text-left font-bold">Email Tujuan</th>
                            <th className="px-4 py-3 text-left font-bold">Informasi yang Diminta</th>
                            <th className="px-4 py-3 text-left font-bold">Status</th>
                            {enableActions && <th className="px-4 py-3 text-center font-bold">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {(!data || data.length === 0) ? (
                            <tr>
                                <td className="px-4 py-4 text-center text-gray-500" colSpan={(showSelection ? (enableActions ? 7 : 6) : (enableActions ? 6 : 5))}>
                                    {loading ? "Memuat..." : "Belum ada data"}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={row.id} className={`border-t border-gov-border transition ${selectedIds.includes(row.id) ? 'bg-gov-light/20 border-gov-accent' : 'hover:bg-gov-bg'}`}>
                                    {showSelection && (
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(row.id)}
                                                onChange={() => onSelect(row.id)}
                                                className="w-4 h-4 accent-gov-accent"
                                            />
                                        </td>
                                    )}
                                    <td className="px-4 py-3 text-xs font-semibold text-gray-600">{row.id}</td>
                                    <td className="px-4 py-3 font-bold text-gov-dark">{row.nama_badan_publik}</td>
                                    <td className="px-4 py-3 text-gray-700">{row.email || <span className="text-red-600 text-xs font-semibold">Email Kosong</span>}</td>
                                    <td className="px-4 py-3 text-gray-700 max-w-[240px] truncate text-xs" title={row.pertanyaan}>
                                        {row.pertanyaan || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${row.sent_count > 0 ? 'bg-gov-accent text-gov-dark' : 'bg-gray-300 text-gray-700'}`}>
                                            {row.sent_count > 0 ? `✓ ${row.sent_count}x` : 'Pending'}
                                        </span>
                                    </td>

                                    {enableActions && (
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => onEdit(row)} className="p-2 text-gov-light hover:bg-gov-light hover:text-white rounded-lg transition font-bold" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => onDelete(row.id)} className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition font-bold" title="Hapus">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};