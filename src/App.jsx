import React, { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      const res = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login gagal");
      }

      setUser(data.user);
      setStatus({ loading: false, message: "Login berhasil" });
    } catch (err) {
      setStatus({ loading: false, message: err.message || "Gagal menghubungi server" });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsername("");
    setPassword("");
    setStatus({ loading: false, message: "" });
  };

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  const AdminHome = () => (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 space-y-1">
        <p className="text-sm text-amber-700">Dashboard Admin</p>
        <p className="text-lg font-semibold text-amber-900">Halo, {user.username}</p>
        <p className="text-sm text-amber-800">Anda memiliki akses khusus admin.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Backend OBE terhubung. Tambahkan menu manajemen (user, data, laporan) di sini sesuai kebutuhan.
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 active:bg-slate-200 transition"
      >
        Keluar
      </button>
    </div>
  );

  const UserHome = () => (
    <div className="space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 space-y-1">
        <p className="text-sm text-emerald-700">Dashboard User</p>
        <p className="text-lg font-semibold text-emerald-900">Selamat datang, {user.username}</p>
        <p className="text-sm text-emerald-800">Ini adalah halaman user biasa.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Anda bisa menambahkan fitur user lain (profil, aktivitas, laporan) di sini.
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 active:bg-slate-200 transition"
      >
        Keluar
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-100 p-8 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Otomatisasi</p>
          <h1 className="text-2xl font-semibold text-slate-800">Frontend (OFE)</h1>
          <p className="text-sm text-slate-500">Terhubung ke backend OBE @ http://localhost:8081</p>
        </div>

        {!isLoggedIn ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {status.loading ? "Memproses..." : "Login"}
            </button>
          </form>
        ) : isAdmin ? (
          <AdminHome />
        ) : (
          <UserHome />
        )}

        {status.message && (
          <p className="text-sm text-center text-slate-700 mt-2">{status.message}</p>
        )}
      </div>
    </div>
  );
}

export default App;
