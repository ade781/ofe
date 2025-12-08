import React from "react";

export const StatusMessage = ({ message }) => {
    if (!message) return null;
    return <p className="text-sm text-center text-gov-dark font-semibold mt-3">{message}</p>;
};
