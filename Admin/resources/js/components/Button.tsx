import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  variant?: "red" | "green" | "blue" | "orange" | "primary";
  form?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<string, string> = {
  red: "bg-red-500 text-white hover:bg-red-600",
  green: "bg-green-500 text-white hover:bg-green-600",
  blue: "bg-blue-500 text-white hover:bg-blue-600",
  orange: "bg-orange-500 text-white hover:bg-orange-600",
  primary: "bg-primary text-white hover:bg-primary/90",
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  variant = "primary",
  form,
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded transition text-sm font-semibold shadow-sm ${variantStyles[variant] || variantStyles.primary} ${className}`}
    disabled={disabled}
    form={form}
    {...props}
  >
    {children}
  </button>
);

export default Button;
