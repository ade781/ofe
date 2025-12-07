import React, { useEffect, useState } from "react";
import { X, Mail } from "lucide-react";

export const ReplyModal = ({ bpId, bpName, onClose }) => {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!bpId) return;

        // Fetch balasan dari backend
        fetch(`/api/replies/${bpId}`)
            .then(res => res.json())
            .then(data => {
                setReplies(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [bpId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Riwayat Balasan</h3>
                        <p className="text-sm text-slate-500">{bpName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    {loading ? (
                        <p className="text-center text-slate-500 py-4">Memuat data...</p>
                    ) : replies.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 flex flex-col items-center">
                            <Mail size={48} className="mb-2 opacity-20" />
                            <p>Belum ada balasan email yang masuk.</p>
                        </div>
                    ) : (
                        replies.map((reply) => (
                            <div key={reply.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-blue-600 text-sm">{reply.from_email}</span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(reply.received_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <h4 className="font-medium text-slate-800 text-sm mb-2">{reply.subject}</h4>
                                <div className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 p-3 rounded border border-slate-100">
                                    {reply.message}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-white rounded-b-xl flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium text-sm transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};