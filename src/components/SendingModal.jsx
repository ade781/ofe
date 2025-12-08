import React from "react";
import { Send, CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

export const SendingModal = ({ isOpen, status, progress }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-8 text-center animate-slideUp border-t-4 border-gov-accent">
                {status === "sending" && (
                    <>
                        <div className="relative mb-6">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gov-dark to-gov-light rounded-full flex items-center justify-center animate-pulse">
                                <Mail size={40} className="text-white animate-bounce" />
                            </div>
                            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-gov-accent/40 animate-ping"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-gov-dark mb-2">📬 Mengirim Email...</h3>
                        <p className="text-gray-600 mb-6">Mohon tunggu, email sedang dikirim ke badan publik</p>

                        <div className="w-full bg-gov-border rounded-full h-3 overflow-hidden mb-3">
                            <div
                                className="h-full bg-gradient-to-r from-gov-dark to-gov-accent transition-all duration-500 ease-out"
                                style={{ width: `${progress || 0}%` }}
                            ></div>
                        </div>
                        <p className="text-sm font-bold text-gov-light">{progress || 0}% selesai</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gov-accent to-green-600 rounded-full flex items-center justify-center mb-6 animate-scaleIn">
                            <CheckCircle size={50} className="text-gov-dark" />
                        </div>
                        <h3 className="text-2xl font-bold text-gov-dark mb-2">✓ Email Terkirim!</h3>
                        <p className="text-gray-600">Semua email berhasil dikirim ke badan publik</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 animate-shake">
                            <XCircle size={50} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-red-600 mb-2">✗ Pengiriman Gagal</h3>
                        <p className="text-gray-600">Terjadi kesalahan saat mengirim email</p>
                    </>
                )}
            </div>
        </div>
    );
};
