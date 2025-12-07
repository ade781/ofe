import React from "react";

export const BpTable = ({ data, loading, error, selectedIds, onSelect, onSelectAll }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">
                    Daftar Badan Publik ({data.length})
                </p>
                {loading && <span className="text-xs text-slate-500">Memuat...</span>}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="overflow-auto border border-slate-200 rounded-lg max-h-[600px]">
                <table className="min-w-full text-sm text-slate-800">
                    <thead className="bg-slate-100 text-left sticky top-0 z-10">
                        <tr>
                            <th className="px-3 py-2 w-10">
                                <input
                                    type="checkbox"
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                />
                            </th>
                            <th className="px-3 py-2">ID</th>
                            <th className="px-3 py-2">Nama Badan Publik</th>
                            <th className="px-3 py-2">Email Tujuan</th>
                            <th className="px-3 py-2">Informasi yang Diminta</th>
                            <th className="px-3 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td className="px-3 py-3 text-center text-slate-500" colSpan={6}>
                                    {loading ? "Memuat..." : "Belum ada data"}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id} className={`border-t border-slate-100 hover:bg-slate-50 ${selectedIds.includes(row.id) ? 'bg-blue-50' : ''}`}>
                                    <td className="px-3 py-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(row.id)}
                                            onChange={() => onSelect(row.id)}
                                        />
                                    </td>
                                    <td className="px-3 py-2">{row.id}</td>
                                    <td className="px-3 py-2 font-medium">{row.nama_badan_publik}</td>
                                    <td className="px-3 py-2 text-slate-600">{row.email || <span className="text-red-500 text-xs">Email Kosong</span>}</td>
                                    <td className="px-3 py-2 text-slate-700 max-w-[240px] truncate" title={row.pertanyaan}>
                                        {row.pertanyaan || "-"}
                                    </td>
                                    <td className="px-3 py-2">
                                        <span className={`px-2 py-1 rounded text-xs ${row.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {row.status || "pending"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};