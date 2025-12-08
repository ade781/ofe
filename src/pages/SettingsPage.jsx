import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Save, Lock, Mail } from "lucide-react";

export const SettingsPage = ({ user, onLogout, onNavigate }) => {
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
        <DashboardLayout user={user} onLogout={onLogout} onNavigate={onNavigate}>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg border-2 border-gov-border shadow-lg mt-6">
                <h2 className="text-2xl font-bold text-gov-dark mb-6 flex items-center gap-3">
                    <Save size={24} className="text-gov-accent" /> Pengaturan Email Sistem
                </h2>

                <div className="bg-gov-accent/15 border-2 border-gov-accent text-gov-dark p-4 rounded-lg mb-6 text-sm font-semibold flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <div>
                        Gunakan <b>App Password</b> dari Google Account (16 digit), bukan password login biasa. <br />
                        Lihat panduan di <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="underline text-gov-light font-bold">support.google.com</a>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gov-dark mb-2">📧 Email Gmail</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-gov-light" size={20} />
                            <input
                                type="email"
                                className="pl-12 w-full px-4 py-3 border-2 border-gov-border rounded-lg focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="emailmu@gmail.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gov-dark mb-2">🔐 App Password (16 Digit)</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gov-light" size={20} />
                            <input
                                type="text"
                                className="pl-12 w-full px-4 py-3 border-2 border-gov-border rounded-lg focus:ring-2 focus:ring-gov-light focus:border-gov-light outline-none transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="xxxx xxxx xxxx xxxx"
                                required
                            />
                        </div>
                        <p className="text-xs text-gray-600 mt-2 font-semibold">✓ Password tersimpan secara permanen di sistem.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-gov-dark to-gov-light text-white py-3.5 rounded-lg font-bold hover:from-gov-light hover:to-gov-dark transition disabled:opacity-60"
                    >
                        {loading ? "⏳ Menyimpan..." : "💾 Simpan Pengaturan"}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};