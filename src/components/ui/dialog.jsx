import * as React from "react";

export function Dialog({ children }) {
  return <>{children}</>;
}

export function DialogTrigger({ children, onClick }) {
  return (
    <button onClick={onClick} className="text-blue-600 underline">
      {children}
    </button>
  );
}

export function DialogContent({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
