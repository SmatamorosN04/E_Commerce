'use client';
import { Edit3, AlertTriangle } from 'lucide-react';

interface Variant {
    id: string;
    product_name: string;
    sku: string;
    stock: number;
    min_threshold: number;
    unit_cost: number;
    category_name?: string; // Campo para la categoría
}

interface Props {
    variants: Variant[];
    onAdjust: (variant: Variant) => void;
}

export const InventoryTable = ({ variants = [], onAdjust }: Props) => {

    if (!Array.isArray(variants) || variants.length === 0) {
        return (
            <div className="p-10 text-center bg-white border border-gray-100 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest text-gray-400">No hay repuestos disponibles</p>
            </div>
        );
    }
    return (
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
            <div className="overflow-x-auto"> {/* Contenedor para evitar que se rompa en móvil */}
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Repuesto / SKU</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Categoría</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Stock Actual</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Costo Promedio</th>
                        <th className="px-6 py-4 text-[10px] text-center uppercase tracking-widest text-gray-400 font-bold">Acción</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {variants.map((v) => {
                        const isLow = v.stock <= (v.min_threshold || 0);
                        return (
                            <tr key={`${v.id}-${v.sku}`} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-xs font-bold uppercase tracking-tight text-gray-900">{v.product_name}</p>
                                    <p className="text-[10px] font-mono text-gray-400 mt-0.5">{v.sku}</p>
                                </td>
                                {/* Nueva columna de Categoría */}
                                <td className="px-6 py-4">
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-sm">
                                        {v.category_name || 'Sin Categoría'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>
                                                {v.stock} unidades
                                            </span>
                                        {isLow && <AlertTriangle className="w-3 h-3 text-red-500 animate-pulse" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500">
                                    C$ {v.unit_cost ? Number(v.unit_cost).toLocaleString('es-NI', { minimumFractionDigits: 2 }) : '0.00'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => onAdjust(v)}
                                        className="inline-flex items-center gap-2 rounded-md text-[9px] uppercase tracking-widest font-bold border border-gray-200 px-4 py-2 hover:bg-black hover:text-white transition-all"
                                    >
                                        <Edit3 className="w-3 h-3" /> Ajustar Stock
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};