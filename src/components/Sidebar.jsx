import React from "react";
import { X, Home, Settings, Database, LogOut, Activity, Mail, Inbox, History } from "lucide-react";

export const Sidebar = ({ isOpen, setIsOpen, user, onLogout, onNavigate }) => {
    const menuItems = [
        { icon: <Home size={20} />, label: "Dashboard", target: "dashboard" },
        { icon: <Activity size={20} />, label: "Status Permohonan", target: "status" },
        { icon: <Inbox size={20} />, label: "Kotak Masuk", target: "inbox" },
        { icon: <History size={20} />, label: "Riwayat Email", target: "history" },
    ];

    if (user?.role === "admin") {
        menuItems.push({ icon: <Database size={20} />, label: "Data Badan Publik", target: "data" });
    }

    menuItems.push({ icon: <Settings size={20} />, label: "Pengaturan", target: "settings" });

    return (
        <>
            {/* Overlay untuk Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-gov-dark to-gov-dark text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-6 bg-gov-dark border-b-4 border-gov-accent">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🏛️</span>
                        <span className="text-sm font-bold tracking-widest">PORTAL GOV</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-gov-accent hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-4 py-6 space-y-4">
                    {/* User Info Kecil di Sidebar */}
                    <div className="px-4 py-4 mb-6 bg-gov-light2 rounded-lg border-l-4 border-gov-accent">
                        <p className="text-xs text-gov-accent font-semibold uppercase">Login sebagai</p>
                        <p className="font-bold text-white truncate mt-1">{user?.username || 'User'}</p>
                        <span className={`inline-block text-xs px-2.5 py-1 rounded-full mt-2 font-semibold ${user?.role === 'admin' ? 'bg-gov-accent text-gov-dark' : 'bg-emerald-500 text-white'}`}>
                            {user?.role === 'admin' ? '👤 Administrator' : '👤 Pengguna'}
                        </span>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    onNavigate(item.target);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center px-4 py-3 text-gov-accent transition-all rounded-lg hover:bg-gov-light2 hover:text-white hover:pl-6 active:bg-gov-light group text-left"
                            >
                                <span className="mr-3 text-gov-accent group-hover:text-white">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tombol Logout di Bawah Sidebar */}
                <div className="absolute bottom-0 w-full p-4 border-t border-gov-light2 bg-gov-dark">
                    <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-3 text-white bg-red-600 transition-all rounded-lg hover:bg-red-700 hover:pl-6 font-semibold"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span className="text-sm">Keluar</span>
                    </button>
                </div>
            </aside>
        </>
    );
};