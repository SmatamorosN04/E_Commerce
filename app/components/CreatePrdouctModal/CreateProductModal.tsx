'use client'
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateProductModal = ({ isOpen, onClose, onSuccess }: Props) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        base_price: 0,
        category_id: '', // Nuevo campo
        variant_name: 'Estándar', // Ahora editable
        initial_stock: 0,
        initial_cost: 0
    });

    // Cargar categorías al abrir el modal
    useEffect(() => {
        if (isOpen) {
            fetch('http://localhost:3001/api/categories') // Ajusta a tu ruta real
                .then(res => res.json())
                .then(data => setCategories(data))
                .catch(err => console.error("Error cargando categorías:", err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

            <div className="relative bg-white w-full max-w-md shadow-xl animate-in fade-in slide-in-from-top-4 duration-300 rounded-sm my-8">
                <div className="p-8 md:p-10">
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-900">Registro Maestro</h3>
                            <div className="h-[1px] w-8 bg-black mt-2" />
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                            <X className="w-4 h-4 stroke-[1.5px]" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            {/* SKU y Variante */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block group-focus-within:text-black">SKU</label>
                                    <input
                                        className="w-full border-b border-gray-100 py-2 text-xs outline-none focus:border-black uppercase transition-all"
                                        required
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block group-focus-within:text-black">Variante</label>
                                    <input
                                        className="w-full border-b border-gray-100 py-2 text-xs outline-none focus:border-black transition-all"
                                        required
                                        value={formData.variant_name}
                                        onChange={(e) => setFormData({ ...formData, variant_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Nombre */}
                            <div className="group">
                                <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block group-focus-within:text-black">Nombre del Producto</label>
                                <input
                                    className="w-full border-b border-gray-100 py-2 text-xs outline-none focus:border-black transition-all"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Categoría (Select) */}
                            <div className="group">
                                <label className="text-[9px] uppercase tracking-widest text-gray-400 mb-1 block group-focus-within:text-black">Categoría</label>
                                <select
                                    className="w-full border-b border-gray-100 py-2 text-xs outline-none focus:border-black bg-transparent transition-all"
                                    required
                                    value={formData.category_id || ''}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <option value="" disabled>Seleccionar categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Precios y Stock */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="group">
                                    <label className="text-[8px] uppercase tracking-widest text-gray-400 mb-1 block group-focus-within:text-black">P. Venta</label>
                                    <input
                                        type="number"
                                        className="w-full border-b border-gray-100 py-2 text-xs outline-none focus:border-black transition-all"
                                        required
                                        onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-[8px] uppercase tracking-widest text-gray-400 mb-1 block group-focus-within:text-black">P. Costo</label>
                                    <input
                                        type="number"
                                        className="w-full border-b border-gray-100 py-2 text-xs outline-none focus:border-black transition-all"
                                        required
                                        onChange={(e) => setFormData({ ...formData, initial_cost: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="group">
                                    <label className="text-[8px] uppercase tracking-widest text-gray-400 mb-1 block group-focus-within:text-black">Stock</label>
                                    <input
                                        type="number"
                                        className="w-full border-b border-gray-100 py-2 text-xs outline-none focus:border-black transition-all"
                                        required
                                        onChange={(e) => setFormData({ ...formData, initial_stock: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full  rounded-md bg-black text-white py-4 text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200"
                            >
                                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Finalizar Registro"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};