'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { AdminSidebar } from "@/app/components/AdminSidebar/AdminSidebar";

interface BulkItem {
    sku: string;
    name: string;
    base_price: string;
    initial_stock: string;
    initial_cost: string;
    category_name: string; // Cambiado de ID a Nombre
}

export default function BulkUploadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
    const [items, setItems] = useState<BulkItem[]>([
        { sku: '', name: '', base_price: '', initial_stock: '', initial_cost: '', category_name: '' }
    ]);

    // Cargar categorías para hacer el match de nombres a IDs
    useEffect(() => {
        fetch('http://localhost:3001/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Error cargando categorías", err));
    }, []);

    const addRow = () => {
        setItems([...items, { sku: '', name: '', base_price: '', initial_stock: '', initial_cost: '', category_name: '' }]);
    };

    const removeRow = (index: number) => {
        if (items.length === 1) return;
        setItems(items.filter((_, i) => i !== index));
    };

    const handleChange = (index: number, field: keyof BulkItem, value: string) => {
        const newItems = [...items];
        newItems[index][field] = field === 'sku' ? value.toUpperCase() : value;
        setItems(newItems);
    };

    const handleSaveAll = async () => {
        setLoading(true);

        const formattedItems = items.map(item => {
            const foundCat = categories.find(c =>
                c.name.toLowerCase() === item.category_name.toLowerCase().trim()
            );

            return {
                sku: item.sku,
                name: item.name,
                base_price: Number(item.base_price) || 0,
                initial_stock: Number(item.initial_stock) || 0,
                initial_cost: Number(item.initial_cost) || 0,
                category_id: foundCat ? foundCat.id : null,
                variant_name: 'Estándar'
            };
        });

        try {
            const res = await fetch('http://localhost:3001/api/products/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: formattedItems })
            });

            if (res.ok) {
                router.push('/admin/inventory');
            } else {
                alert("Error al procesar la carga masiva. Revisa los nombres de las categorías.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* 1. Sidebar integrado */}
            <AdminSidebar />

            {/* 2. Contenido principal con padding para el botón móvil */}
            <main className="flex-1 p-6 md:p-12 pt-20 lg:pt-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Link href="/admin/inventory" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-gray-400 hover:text-black mb-10 transition-colors">
                        <ArrowLeft className="w-3 h-3" /> Volver al inventario
                    </Link>

                    <header className="mb-10">
                        <h1 className="text-xl uppercase tracking-[0.4em] font-light text-gray-900">Entrada Maestro</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Procesamiento de repuestos por lote</p>
                    </header>

                    <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-32">SKU</th>
                                    <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold">Nombre Repuesto</th>
                                    <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-40">Categoría</th>
                                    <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-28">P. Venta</th>
                                    <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-28">P. Costo</th>
                                    <th className="px-4 py-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold w-24 text-center">Stock</th>
                                    <th className="px-4 py-4 text-right"></th>
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
                                                placeholder="Artículo..."
                                                value={item.name}
                                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2">
                                            <input
                                                className="w-full bg-transparent border-b border-transparent focus:border-black p-2 text-xs outline-none font-bold text-blue-600"
                                                placeholder="Ej: Motor"
                                                list="category-list"
                                                value={item.category_name}
                                                onChange={(e) => handleChange(index, 'category_name', e.target.value)}
                                            />
                                            <datalist id="category-list">
                                                {categories.map(c => <option key={c.id} value={c.name} />)}
                                            </datalist>
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
                                                className="w-full bg-transparent border-b border-transparent focus:border-black p-2 text-xs outline-none text-center font-bold"
                                                placeholder="0"
                                                value={item.initial_stock}
                                                onChange={(e) => handleChange(index, 'initial_stock', e.target.value)}
                                            />
                                        </td>
                                        <td className="p-2 text-right">
                                            <button
                                                onClick={() => removeRow(index)}
                                                className="p-2 text-gray-200 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-8 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-6">
                            <button
                                onClick={addRow}
                                className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 hover:text-black transition-all"
                            >
                                <Plus className="w-3.5 h-3.5" /> Añadir Repuesto
                            </button>

                            <button
                                onClick={handleSaveAll}
                                disabled={loading}
                                className="w-full md:w-auto bg-black text-white px-12 py-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-4 disabled:bg-gray-200"
                            >
                                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                                Registrar Lote Completo
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-amber-600">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-[9px] uppercase tracking-widest font-bold">Verifica los nombres de categoría antes de procesar el lote.</span>
                    </div>
                </div>
            </main>
        </div>
    );
}