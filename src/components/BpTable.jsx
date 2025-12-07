import React from "react";

export const BpTable = ({ data, loading, error }) => {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Daftar Badan Publik</p>
                {loading && <span className="text-xs text-slate-500">Memuat...</span>}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="overflow-auto border border-slate-200 rounded-lg">
                <table className="min-w-full text-sm text-slate-800">
                    <thead className="bg-slate-100 text-left">
                        <tr>
                            <th className="px-3 py-2">ID</th>
                            <th className="px-3 py-2">Nama</th>
                            <th className="px-3 py-2">Kategori</th>
                            <th className="px-3 py-2">Website</th>
                            <th className="px-3 py-2">Pertanyaan</th>
                            <th className="px-3 py-2">Email</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-3 py-2">Thread ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td className="px-3 py-3 text-center text-slate-500" colSpan={8}>
                                    {loading ? "" : "Belum ada data"}
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id} className="border-t border-slate-100">
                                    <td className="px-3 py-2">{row.id}</td>
                                    <td className="px-3 py-2">{row.nama_badan_publik}</td>
                                    <td className="px-3 py-2">{row.kategori}</td>
                                    <td className="px-3 py-2 text-blue-600 underline truncate max-w-[180px]">
                                        {row.website || "-"}
                                    </td>
                                    <td className="px-3 py-2 text-slate-700 max-w-[240px] whitespace-pre-wrap">
                                        {row.pertanyaan || "-"}
                                    </td>
                                    <td className="px-3 py-2">{row.email || "-"}</td>
                                    <td className="px-3 py-2">{row.status || "-"}</td>
                                    <td className="px-3 py-2">{row.thread_id || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
