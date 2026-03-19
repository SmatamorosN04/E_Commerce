'use client';
import { X, ChevronDown, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL


export const MenuDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState<'BAJAJ' | 'TVS' | 'TORITO'>('BAJAJ');
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (isOpen) {
            fetch(`${API_URL}/api/categories`)
                .then(res => res.json())
                .then(data => setCategories(data))
                .catch(err => console.error("Error cargando categorías:", err));
        }
    }, [isOpen]);

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-100 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

            <div className={`fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-110 p-6 flex flex-col transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                <button onClick={onClose} className="mb-6"><X className="w-6 h-6 stroke-[1px]" /></button>

                {/* Tabs de Marcas */}
                <div className="flex border-b border-gray-100 mb-8 text-xs tracking-[0.2em] text-gray-400">
                    {(['BAJAJ', 'TVS', 'TORITO'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 pb-4 uppercase ${activeTab === tab ? 'text-gray-900 border-b-2 border-[#DD8560] font-medium' : ''}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* 2. Lista de Categorías DINÁMICAS desde tu DB */}
                <nav className="flex-grow space-y-6 overflow-y-auto">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.id} className="flex justify-between items-center group cursor-pointer">
                <span className="text-gray-900 text-sm tracking-[0.1em] font-light uppercase">
                  {cat.name}
                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-400 italic">Cargando categorías...</p>
                    )}
                </nav>

                <div className="border-t border-gray-100 pt-8 mt-auto space-y-4">
                    <a href="tel:+50587731532" className="flex items-center gap-4 text-sm text-gray-600 font-light">
                        <Phone className="w-5 h-5 stroke-[1px]" />
                        +505 8773-1532
                    </a>
                    <div className="flex items-center gap-4 text-sm text-gray-600 font-light">
                        <MapPin className="w-5 h-5 stroke-[1px]" />
                        Ticuantepe, Managua
                    </div>
                </div>
            </div>
        </>
    );
};