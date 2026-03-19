'use client';
import { X, ArrowRight, Instagram, MessageCircle, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const MenuDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {

    // Definimos las rutas principales de "La Abuela"
    const menuItems = [
        { name: 'Inicio', href: '/' },
        { name: 'Catálogo', href: '/shop' },
        { name: 'Sobre Nosotros', href: '/about' },
        { name: 'Contacto', href: '/contact' },
    ];

    const brands = [
        { name: 'Bajaj', href: '/shop?brand=BAJAJ' },
        { name: 'TVS', href: '/shop?brand=TVS' },
        { name: 'Torito', href: '/shop?brand=TORITO' },
    ];

    return (
        <>
            {/* Overlay con blur para un look premium */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed inset-y-0 left-0 w-full max-w-[320px] bg-white z-[110] p-8 flex flex-col transition-transform duration-500 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>

                {/* Header del Menú */}
                <div className="flex justify-between items-center mb-16">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400">Menú</span>
                    <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
                        <X className="w-6 h-6 stroke-[1px] text-gray-900" />
                    </button>
                </div>

                {/* Navegación de Páginas */}
                <nav className="space-y-8 flex-grow">
                    <div className="flex flex-col space-y-6">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className="group flex items-center justify-between"
                            >
                                <span className="text-2xl font-light tracking-tighter text-gray-900 group-hover:text-[#DD8560] transition-colors">
                                    {item.name}
                                </span>
                                <ArrowRight className="w-4 h-4 text-[#DD8560] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </Link>
                        ))}
                    </div>

                    {/* Separador sutil */}
                    <div className="h-px bg-gray-100 w-full my-8" />

                    {/* Navegación de Marcas */}
                    <div className="space-y-4">
                        <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 mb-6">Nuestras Marcas</p>
                        {brands.map((brand) => (
                            <Link
                                key={brand.name}
                                href={brand.href}
                                onClick={onClose}
                                className="block text-sm tracking-[0.2em] uppercase font-medium text-gray-600 hover:text-black transition-colors"
                            >
                                {brand.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer del Menú: Información de Ticuantepe */}
                <div className="pt-8 border-t border-gray-100 space-y-6">
                    <div className="space-y-3">
                        <a href="https://wa.me/50587731532" className="flex items-center gap-3 text-xs text-gray-500 hover:text-green-600 transition-colors">
                            <MessageCircle className="w-4 h-4 stroke-[1.5px]" />
                            Chat WhatsApp
                        </a>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                            <MapPin className="w-4 h-4 stroke-[1.5px]" />
                            Ticuantepe, Managua
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Instagram className="w-4 h-4 text-gray-400 hover:text-black cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>
        </>
    );
};