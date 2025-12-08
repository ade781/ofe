import React from "react";
import { LoginForm } from "../components/LoginForm";
import { Header } from "../components/Header";
import { StatusMessage } from "../components/StatusMessage";

export const LoginPage = ({ onLogin, status }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gov-dark via-gov-light to-gov-light2 px-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gov-accent opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gov-accent opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-lg border-t-4 border-gov-accent p-8 space-y-6 relative z-10">
                <Header />
                <LoginForm onSubmit={onLogin} isLoading={status.loading} />
                <StatusMessage message={status.message} />
            </div>
        </div>
    );
};
