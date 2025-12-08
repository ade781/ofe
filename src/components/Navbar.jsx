import React from "react";
import { Menu, User } from "lucide-react";

export const Navbar = ({ toggleSidebar, user }) => {
    return (
        <header className="bg-gradient-to-r from-gov-dark to-gov-light border-b-4 border-gov-accent h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-md">
            {/* Tombol Toggle Sidebar (Mobile Only) */}
            <button
                onClick={toggleSidebar}
                className="p-2 mr-4 text-white rounded-lg lg:hidden hover:bg-gov-light2 transition"
            >
                <Menu size={24} />
            </button>

            {/* Judul Halaman / Breadcrumb */}
            <div className="flex flex-col">
                <h1 className="text-lg font-bold text-white">Dashboard</h1>
                <p className="text-xs text-gov-accent hidden sm:block">Portal Pemerintahan</p>
            </div>

            {/* Bagian Kanan Navbar */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 pl-4 border-l border-gov-accent">
                    <div className="w-8 h-8 rounded-full bg-gov-accent flex items-center justify-center text-gov-dark border-2 border-white">
                        <User size={18} className="font-bold" />
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-white leading-none">{user?.username}</p>
                        <p className="text-xs text-gov-accent">{user?.role === "admin" ? "Administrator" : "Pengguna"}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};