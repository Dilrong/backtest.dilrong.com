import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "disabled";
  fullWidth?: boolean;
}

export default function Button({
  variant = "secondary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseClass = "px-4 py-2 rounded-lg transition-all";
  const variants = {
    primary: "bg-blue-600 hover:brightness-110 text-white",
    secondary: "bg-gray-700 hover:brightness-110 text-gray-200",
    disabled: "bg-gray-500 text-gray-400 cursor-not-allowed",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={variant === "disabled"}
      {...props}
    />
  );
}
