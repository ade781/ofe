import React, { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

export const Toast = ({ type = "info", message, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const configs = {
        success: {
            icon: <CheckCircle size={20} />,
            bg: "bg-gradient-to-r from-gov-accent to-green-600",
            text: "text-gov-dark"
        },
        error: {
            icon: <XCircle size={20} />,
            bg: "bg-gradient-to-r from-red-500 to-red-600",
            text: "text-white"
        },
        warning: {
            icon: <AlertTriangle size={20} />,
            bg: "bg-gradient-to-r from-gov-accent to-gov-light",
            text: "text-white"
        },
        info: {
            icon: <Info size={20} />,
            bg: "bg-gradient-to-r from-gov-light to-gov-light2",
            text: "text-white"
        }
    };

    const config = configs[type] || configs.info;

    return (
        <div className="fixed top-4 right-4 z-[60] animate-slideInRight">
            <div className={`${config.bg} ${config.text} px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px] max-w-md border border-opacity-30 border-white`}>
                <div className="flex-shrink-0">{config.icon}</div>
                <p className="flex-1 text-sm font-semibold">{message}</p>
                {onClose && (
                    <button onClick={onClose} className="flex-shrink-0 hover:bg-white/20 p-1 rounded transition">
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export const useToast = () => {
    const [toasts, setToasts] = React.useState([]);

    const showToast = (type, message, duration = 5000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, type, message, duration }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    type={toast.type}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </>
    );

    return { showToast, ToastContainer };
};
