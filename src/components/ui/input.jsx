import React from "react";

export function Input({
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
}
