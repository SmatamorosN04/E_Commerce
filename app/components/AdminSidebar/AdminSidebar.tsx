'use client'
import { useState } from "react"; // Estado para abrir/cerrar
import { usePathname } from "next/dist/client/components/navigation";
import {
    Layers,
    LayoutDashboard,
    Package,
    ShoppingCart,
    History,
    Wrench,
    ChevronsRight,
    Settings,
    LogOut,
    Menu, // Icono para abrir
    X     // Icono para cerrar
} from "lucide-react";
import Link from "next/dist/client/link";

export const AdminSidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); // Control del menú móvil

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Inventario', icon: Package, path: '/admin/inventory' },
        { name: 'Carga Masiva', icon: Layers, path: '/admin/inventory/bulk-upload' },
        { name: 'Ventas', icon: ShoppingCart, path: '/admin/sales' },
        { name: ' Historial', icon: History, path: '/admin/history' },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Botón flotante para Celulares (Hamburguesa) */}
            <button
                onClick={toggleMenu}
                className="lg:hidden fixed top-5 left-5 z-60 bg-black p-2 rounded-sm shadow-lg text-white"
            >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Backdrop: Oscurece el fondo al abrir en móvil */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-45 lg:hidden"
                    onClick={toggleMenu}
                />
            )}

            {/* Sidebar con lógica de posicionamiento */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col h-screen transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:sticky lg:top-0
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-8 flex items-center gap-3">
                    <div className="w-8 h-8 bg-black flex items-center justify-center rounded-sm shadow-lg shadow-black/10">
                        <Wrench className="w-4 h-4 text-white"/>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-[0.3em] leading-none text-gray-900">Repuestos</span>
                        <span className="text-[7px] uppercase tracking-[0.2em] text-gray-400 mt-1">La Abuela</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return(
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)} // Cierra el menú al navegar
                                className={`flex items-center justify-between px-4 py-3 rounded-sm transition-all group ${
                                    isActive ? 'bg-black text-white shadow-md'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-black'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'group-hover:text-black'}`} />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">{item.name}</span>
                                </div>
                                {isActive && <ChevronsRight className="w-3 h-3 text-white"/>}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-50 space-y-1">
                    <button className="w-full flex items-center gap-3 text-gray-400 hover:text-black transition-colors px-4 py-3">
                        <Settings className="w-4 h-4"/>
                        <span className="text-[10px] uppercase tracking-widest font-bold">Configuración</span>
                    </button>
                    <button className="w-full flex items-center gap-3 text-red-400 hover:text-red-600 transition-colors px-4 py-3">
                        <LogOut className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    )
}