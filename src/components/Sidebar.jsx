import React from "react";
import { X, Home, Settings, Database, LogOut } from "lucide-react";

export const Sidebar = ({ isOpen, setIsOpen, user, onLogout }) => {
    // Menu items bisa disesuaikan berdasarkan role nanti
    const menuItems = [
        { icon: <Home size={20} />, label: "Dashboard", href: "#" },
        { icon: <Database size={20} />, label: "Data Badan Publik", href: "#" },
        { icon: <Settings size={20} />, label: "Pengaturan", href: "#" },
    ];

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
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
                    <span className="text-xl font-bold tracking-wider">OFE SYSTEM</span>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-4 py-6 space-y-4">
                    {/* User Info Kecil di Sidebar */}
                    <div className="px-4 py-3 mb-6 bg-slate-800 rounded-lg">
                        <p className="text-xs text-slate-400 uppercase">Login sebagai</p>
                        <p className="font-semibold truncate">{user?.username || 'User'}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-white'}`}>
                            {user?.role || 'Guest'}
                        </span>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="flex items-center px-4 py-3 text-slate-300 transition-colors rounded-lg hover:bg-slate-800 hover:text-white group"
                            >
                                <span className="mr-3">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </div>

                {/* Tombol Logout di Bawah Sidebar */}
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-800">
                    <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-red-400 transition-colors rounded-lg hover:bg-slate-800 hover:text-red-300"
                    >
                        <LogOut size={20} className="mr-3" />
                        <span className="text-sm font-medium">Keluar</span>
                    </button>
                </div>
            </aside>
        </>
    );
};