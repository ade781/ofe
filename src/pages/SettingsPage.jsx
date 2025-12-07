import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Save, Lock, Mail } from "lucide-react";

export const SettingsPage = ({ user, onLogout, onNavigate }) => { // 1. Terima onNavigate
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetch(`/api/settings?userId=${user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.email) setEmail(data.email);
                    if (data.password) setPassword(data.password);
                })
                .catch(err => console.log("Belum ada setting"));
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/settings/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    email: email,
                    appPassword: password
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Pengaturan berhasil disimpan! Password tersimpan secara permanen.");
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Gagal koneksi ke server");
        } finally {
            setLoading(false);
        }
    };

    return (
        // 2. Teruskan onNavigate ke Layout
        <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-10">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Save size={20} /> Pengaturan Email Pengirim
                </h2>

                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg mb-6 text-sm">
                    Gunakan <b>App Password</b> dari Google Account (16 digit), bukan password login biasa.
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Gmail</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input
                                type="email"
                                className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="emailmu@gmail.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">App Password (16 Digit)</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="xxxx xxxx xxxx xxxx"
                                required
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Password tersimpan permanen dan akan ditampilkan saat refresh.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};