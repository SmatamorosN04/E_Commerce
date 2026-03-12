import {ReactNode} from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'outline' | 'ghost';
    className?: string;
    onClick?: () => void;
}

export const Button = ({ children, variant = 'primary', className = '', onClick}: ButtonProps) => {
    const baseStyles = "px-8 py-3 cursor-pointer uppercase tracking-[0.2em] text-xs transition-all duration-300 rounded-full flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-black text-white hover:bg-gray-800",
        outline: "border border-gray-300 text-gray-800 hover:border-black",
        ghost: "bg-black/20 backdrop-blur-md text-white border border-white/30 hover:bg-black/40"
    };
    return (
        <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
}