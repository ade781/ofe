import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useBadanPublik } from "./hooks/useBadanPublik";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { UserPage } from "./pages/UserPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatusPage } from "./pages/StatusPage"; 
function App() {
  const { user, status, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  const { bp, reset } = useBadanPublik(isLoggedIn);

  const handleLogin = async (username, password) => {
    await login(username, password);
  };

  const handleLogout = () => {
    reset();
    logout();
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} status={status} />;
  }

  // --- LOGIKA ROUTING (URUTAN PENTING) ---

  // 1. Cek Settings dulu
  if (currentPage === "settings") {
    return (
      <SettingsPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  // 2. Cek Status dulu (SEBELUM cek isAdmin)
  if (currentPage === "status") {
    return (
      <StatusPage
        user={user}
        bpData={bp.data}
        bpLoading={bp.loading}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  // 3. Baru cek Admin (Dashboard Default)
  if (isAdmin) {
    return (
      <AdminPage
        user={user}
        bpData={bp.data}
        bpLoading={bp.loading}
        bpError={bp.error}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  // 4. Dashboard User Biasa
  return (
    <UserPage
      user={user}
      bpData={bp.data}
      bpLoading={bp.loading}
      bpError={bp.error}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
    />
  );
}

export default App;