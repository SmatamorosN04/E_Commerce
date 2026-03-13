'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface BulkItem {
    sku: string;
    name: string;
    base_price: string;
    initial_stock: string;
    initial_cost: string;
    category_id: string;
}

export default function BulkUploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<BulkItem[]>([
        { sku: '', name: '', base_price: '', initial_stock: '', initial_cost: '', category_id: '' }
    ]);

    // Agregar una nueva fila vacía
    const addRow = () => {
        setItems([...items, { sku: '', name: '', base_price: '', initial_stock: '', initial_cost: '', category_id: '' }]);
    };

    // Eliminar una fila específica
    const removeRow = (index: number) => {
        if (items.length === 1) return; // Mantener al menos una
        setItems(items.filter((_, i) => i !== index));
    };

    // Actualizar campo específico
    const handleChange = (index: number, field: keyof BulkItem, value: string) => {
        const newItems = [...items];
        newItems[index][field] = field === 'sku' ? value.toUpperCase() : value;
        setItems(newItems);
    };

    const handleSaveAll = async () => {
        setLoading(true);

        // Limpiar y formatear datos para el backend
        const formattedItems = items.map(item => ({
            ...item,
            base_price: Number(item.base_price) || 0,
            initial_stock: Number(item.initial_stock) || 0,
            initial_cost: Number(item.initial_cost) || 0,
            category_id: Number(item.category_id) || null,
            variant_name: 'Estándar'
        }));

        try {
            const res = await fetch('http://localhost:3001/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: formattedItems })
            });

            if (res.ok) {
                router.push('/admin/inventory');
            } else {
                alert("Error al procesar la carga masiva");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-10">
            <div className="max-w-6xl mx-auto">
                <Link href="/admin/inventory" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black mb-10 transition-colors">
                    <ArrowLeft className="w-3 h-3" /> Volver
                </Link>

                <header className="mb-10 flex justify-between items-end">
                    <div>
                        <h1 className="text-xl uppercase tracking-[0.4em] font-light text-gray-900">Entrada por Lote</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Editor de cuadrícula para carga masiva</p>
                    </div>
                </header>

                <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-32">SKU</th>
                                <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold">Nombre Repuesto</th>
                                <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-24 text-center">Cat. ID</th>
                                <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-28">P. Venta</th>
                                <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-28">P. Costo</th>
                                <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-24">Stock</th>
                                <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-16 text-right"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {items.map((item, index) => (
                                <tr key={index} className="group hover:bg-gray-50/30">
                                    <td className="p-2">
                                        <input
                                            className="w-full bg-transparent border-b border-transparent focus:border-black p-2 text-xs outline-none uppercase font-mono"
                                            placeholder="SKU"
                                            value={item.sku}
                                            onChange={(e) => handleChange(index, 'sku', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            className="w-full bg-transparent border-b border-transparent focus:border-black p-2 text-xs outline-none"
                                            placeholder="Nombre del artículo..."
                                            value={item.name}
                                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-transparent focus:border-black p-2 text-xs outline-none text-center"
                                            placeholder="ID"
                                            value={item.category_id}
                                            onChange={(e) => handleChange(index, 'category_id', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-transparent focus:border-black p-2 text-xs outline-none"
                                            placeholder="0.00"
                                            value={item.base_price}
                                            onChange={(e) => handleChange(index, 'base_price', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-transparent focus:border-black p-2 text-xs outline-none"
                                            placeholder="0.00"
                                            value={item.initial_cost}
                                            onChange={(e) => handleChange(index, 'initial_cost', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-transparent focus:border-black p-2 text-xs outline-none"
                                            placeholder="Cant."
                                            value={item.initial_stock}
                                            onChange={(e) => handleChange(index, 'initial_stock', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2 text-right">
                                        <button
                                            onClick={() => removeRow(index)}
                                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                        <button
                            onClick={addRow}
                            className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold text-gray-500 hover:text-black transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Agregar nueva fila
                        </button>

                        <button
                            onClick={handleSaveAll}
                            disabled={loading}
                            className="w-full md:w-auto bg-black text-white px-10 py-4 text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Procesar e Importar
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2 text-amber-600">
                    <AlertCircle className="w-3 h-3" />
                    <span className="text-[9px] uppercase tracking-widest font-bold">Asegúrate de que los IDs de categoría sean válidos antes de procesar.</span>
                </div>
            </div>
        </div>
    );
}