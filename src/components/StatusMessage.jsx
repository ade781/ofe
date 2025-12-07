import React from "react";

export const StatusMessage = ({ message }) => {
    if (!message) return null;
    return <p className="text-sm text-center text-slate-700 mt-2">{message}</p>;
};
