'use client'

import {ChevronDown, LayoutGrid, List} from "lucide-react";

interface FilterBarProps {
    count: number;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
}

export const FilterBar = ({count, viewMode, setViewMode}: FilterBarProps) => (
    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-900 uppercase tracking-widest font-bold ">
                {count} Articulos Encontrados
            </span>
        </div>

        <div className="flex items-center gap-5">
            <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black': 'text-gray-300 hover:text-gray-500'}`}
                >
                    <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-300 hover:text-gray-500'}`}
                >
                    <List className="w-4 h-4" />
                </button>
            </div>

            <button className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2  rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                <span className="text-[10px] uppercase tracking-widest text-gray-600 font-medium">Ordernar por: Recientes</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
        </div>
    </div>
)