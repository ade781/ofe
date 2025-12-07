import React from "react";
import { Menu, User } from "lucide-react";

export const Navbar = ({ toggleSidebar, user }) => {
    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
            {/* Tombol Toggle Sidebar (Mobile Only) */}
            <button
                onClick={toggleSidebar}
                className="p-2 mr-4 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100"
            >
                <Menu size={24} />
            </button>

            {/* Judul Halaman / Breadcrumb */}
            <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Otomatisasi Frontend</p>
            </div>

            {/* Bagian Kanan Navbar */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                        <User size={18} />
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-slate-700 leading-none">{user?.username}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};