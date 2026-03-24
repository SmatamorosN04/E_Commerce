'use client';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from "react";
import Link from 'next/link';
import { MenuDrawer } from "../MenuDrawer/MenuDrawer";
import { SearchDrawer } from "../SearchDrawer/SearchDrawer";
import { useCart } from "@/app/context/CartContext";
import dynamic from "next/dynamic";


const CartContent = dynamic(
    () => import("../CartContent/CartContent").then((mod) => mod.CartContent),
    {
        ssr: false,
        loading: () => null
    }
);

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`flex items-center justify-between px-6 py-4 sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm'
                    : 'bg-white py-5'
            }`}>
                <div className="flex-1">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors group"
                    >
                        <Menu className="w-6 h-6 text-gray-800 group-hover:scale-90 transition-transform" />
                    </button>
                </div>

                {/* Logo Principal con Link */}
                <div className="flex-1 text-center">
                    <Link href="/">
                        <h1 className="text-xl md:text-2xl font-serif tracking-[0.2em] font-bold italic text-black cursor-pointer hover:opacity-70 transition-opacity">
                            Repuestos la Abuela
                        </h1>
                    </Link>
                </div>

                {/* Iconos de Acción */}
                <div className="flex-1 flex justify-end gap-2 md:gap-4 text-gray-800">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <Search className="w-6 h-6 stroke-[1.5px]" />
                    </button>

                    <button
                        className="relative p-2 hover:bg-gray-50 rounded-full transition-colors group"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform stroke-[1.5px]" />
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-[#DD8560] text-white text-[9px] rounded-full flex items-center justify-center font-bold animate-in fade-in zoom-in duration-300">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            <MenuDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />
            <CartContent
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
            <SearchDrawer
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
};