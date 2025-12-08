import React from "react";

export const Header = () => {
    return (
        <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
                <div className="text-3xl font-bold text-gov-dark">🏛️</div>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-gov-light font-semibold">Sistem Otomatisasi</p>
            <h1 className="text-3xl font-bold text-gov-dark">Portal Pemerintahan</h1>
            <p className="text-sm text-gray-600">Manajemen Badan Publik Terintegrasi</p>
        </div>
    );
};
