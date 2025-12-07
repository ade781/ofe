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
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                    Daftar Badan Publik ({data?.length || 0})
                </p>
                {loading && <span className="text-xs text-slate-500">Memuat...</span>}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="overflow-auto border border-slate-200 rounded-lg max-h-[600px]">
                <table className="min-w-full text-sm text-slate-800">
                    <thead className="bg-slate-100 text-left sticky top-0 z-10">
                        <tr>
                            {showSelection && (
                                <th className="px-3 py-2 w-10">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => onSelectAll(e.target.checked)}
                                        checked={data && data.length > 0 && selectedIds && selectedIds.length === data.length}
                                    />
                                </th>
                            )}
                            <th className="px-3 py-2">ID</th>
                            <th className="px-3 py-2">Nama Badan Publik</th>
                            <th className="px-3 py-2">Email Tujuan</th>
                            <th className="px-3 py-2">Informasi yang Diminta</th>
                            <th className="px-3 py-2">Status</th>
                            {/* Kolom Aksi (Conditional) */}
                            {enableActions && <th className="px-3 py-2 text-center">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {(!data || data.length === 0) ? (
                            <tr>
                                <td className="px-3 py-3 text-center text-slate-500" colSpan={(showSelection ? (enableActions ? 7 : 6) : (enableActions ? 6 : 5))}>
                                    {loading ? "Memuat..." : "Belum ada data"}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id} className={`border-t border-slate-100 hover:bg-slate-50 ${selectedIds.includes(row.id) ? 'bg-blue-50' : ''}`}>
                                    {showSelection && (
                                        <td className="px-3 py-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(row.id)}
                                                onChange={() => onSelect(row.id)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-3 py-2">{row.id}</td>
                                    <td className="px-3 py-2 font-medium">{row.nama_badan_publik}</td>
                                    <td className="px-3 py-2 text-slate-600">{row.email || <span className="text-red-500 text-xs">Email Kosong</span>}</td>
                                    <td className="px-3 py-2 text-slate-700 max-w-[240px] truncate" title={row.pertanyaan}>
                                        {row.pertanyaan || "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${row.sent_count > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {row.sent_count > 0 ? `Terkirim ${row.sent_count}x` : 'Pending'}
                                        </span>
                                    </td>

                                    {/* Tombol Aksi */}
                                    {enableActions && (
                                        <td className="px-3 py-2">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => onEdit(row)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded transition" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => onDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition" title="Hapus">
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