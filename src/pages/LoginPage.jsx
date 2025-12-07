import React from "react";
import { LoginForm } from "../components/LoginForm";
import { Header } from "../components/Header";
import { StatusMessage } from "../components/StatusMessage";

export const LoginPage = ({ onLogin, status }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4">
            <div className="w-full max-w-lg bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-slate-100 p-8 space-y-6">
                <Header />
                <LoginForm onSubmit={onLogin} isLoading={status.loading} />
                <StatusMessage message={status.message} />
            </div>
        </div>
    );
};
