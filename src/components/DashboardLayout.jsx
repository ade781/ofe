import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export const DashboardLayout = ({ children, user, onLogout, onNavigate }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gov-bg overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                setIsOpen={setSidebarOpen}
                user={user}
                onLogout={onLogout}
                onNavigate={onNavigate}
            />

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Navbar
                    toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    user={user}
                />

                {/* Main Content Scrollable */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8 bg-gov-bg">
                    {children}
                </main>
            </div>
        </div>
    );
};