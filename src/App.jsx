import React from "react";
import { useAuth } from "./hooks/useAuth";
import { useBadanPublik } from "./hooks/useBadanPublik";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { UserPage } from "./pages/UserPage";

function App() {
  const { user, status, login, logout } = useAuth();
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === "admin";

  const { bp, reset } = useBadanPublik(isLoggedIn);

  const handleLogin = async (username, password) => {
    await login(username, password);
  };

  const handleLogout = () => {
    reset();
    logout();
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} status={status} />;
  }

  if (isAdmin) {
    return (
      <AdminPage
        user={user}
        bpData={bp.data}
        bpLoading={bp.loading}
        bpError={bp.error}
        onLogout={handleLogout}
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
    />
  );
}

export default App;
