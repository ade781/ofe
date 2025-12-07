import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useBadanPublik } from "./hooks/useBadanPublik";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { UserPage } from "./pages/UserPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StatusPage } from "./pages/StatusPage";
import { BpDataPage } from "./pages/BpDataPage";
import { EmailHistoryPage } from "./pages/EmailHistoryPage";
import { InboxPage } from "./pages/InboxPage";

function App() {
  const { user, status, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  const { bp, reset, refresh } = useBadanPublik(isLoggedIn);
  useEffect(() => {
    if (!isAdmin && currentPage === "data") {
      setCurrentPage("dashboard");
    }
  }, [isAdmin, currentPage]);

  const handleLogin = async (username, password) => {
    await login(username, password);
  };

  const handleLogout = () => {
    reset();
    logout();
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page) => {
    if (page === "data" && !isAdmin) return;
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} status={status} />;
  }

  // --- URUTAN ROUTING YANG BENAR ---

  // 1. Cek halaman spesifik dulu (Settings, Status, Data)
  if (currentPage === "settings") {
    return (
      <SettingsPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
    );
  }

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

  if (currentPage === "data") {
    return (
      <BpDataPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === "history") {
    return (
      <EmailHistoryPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === "inbox") {
    return (
      <InboxPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  // 2. Baru cek Dashboard Default (Admin / User)
  if (isAdmin) {
    return (
      <AdminPage
        user={user}
        bpData={bp.data}
        bpLoading={bp.loading}
        bpError={bp.error}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onRefreshBp={refresh}
      />
    );
  }

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