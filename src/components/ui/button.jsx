import React from "react";

export function Button({
  children,
  onClick,
  className = "",
  size = "md",
  type = "button",
}) {
  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-blue-600 hover:bg-blue-700 text-white rounded-md ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
