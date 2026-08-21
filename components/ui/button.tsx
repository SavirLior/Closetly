import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "sm" | "md" | "lg" | "icon";
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`button button--${variant} button--${size} ${className}`} {...props}>
      {children}
    </button>
  );
}
