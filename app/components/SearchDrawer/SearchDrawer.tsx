'use client';
import { X, Search as SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const SearchDrawer = ({ isOpen, onClose }: { isOpen: boolean; // @ts-ignore
    onClose: () => void }) => {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
            onClose();
            setQuery('');
        }
    };

    return (
        <>
            <div className={`fixed inset-0 bg-black/40 z-[120] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

            <div className={`fixed inset-x-0 top-0 bg-white z-[130] p-8 transition-transform duration-500 ${isOpen ? 'translate-y-0' : '-translate-x-full md:-translate-y-full'}`}>
                <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center gap-6">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1px]" />
                        <input
                            type="text"
                            placeholder="¿QUÉ REPUESTO BUSCAS?"
                            className="w-full pl-10 pr-4 py-4 text-sm tracking-[0.2em] uppercase border-b border-gray-100 focus:border-[#DD8560] outline-none transition-all font-light"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button type="button" onClick={onClose}>
                        <X className="w-6 h-6 text-gray-400 hover:text-black transition-colors" />
                    </button>
                </form>
            </div>
        </>
    );
};