'use client'
import { useState, useEffect } from "react";
import { X, Loader2 } from 'lucide-react';

interface Props {
    variantId: string;
    productId: string;
    sku: string;
    productName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const StockMovementModal = ({ variantId, productId, sku, productName, isOpen, onClose, onSuccess }: Props) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        quantity: 1,
        type: 'IN', // Solo usaremos 'IN' o 'PRICE'
        reason: '',
        unit_cost: 0
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ quantity: 1, type: 'IN', reason: '', unit_cost: 0 });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNumberChange = (field: string, value: string, isFloat: boolean = false) => {
        if (value === '') {
            setFormData(prev => ({ ...prev, [field]: 0 }));
            return;
        }
        const parsedValue = isFloat ? parseFloat(value) : parseInt(value);
        setFormData(prev => ({
            ...prev, [field]: isNaN(parsedValue) ? 0 : parsedValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const isPriceUpdate = formData.type === 'PRICE';

        const payload = {
            variant_id: variantId,
            product_id: productId,
            quantity: isPriceUpdate ? 0 : Number(formData.quantity),
            type: isPriceUpdate ? 'Ajuste' : 'Entrada', // Mapeo directo para DB
            reason: formData.reason,
            unit_cost: Number(formData.unit_cost || 0),
            is_price_update: isPriceUpdate
        };

        try {
            const response = await fetch('http://localhost:3001/api/inventory/movement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error || "Error en la operacion"}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-md shadow-2xl">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-900">Gestion de Inventario</h3>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">{productName} — {sku}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Tipo de movimiento</label>
                            <select
                                className="w-full border-b border-gray-200 py-2 text-xs uppercase outline-none focus:border-black bg-transparent"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="IN">Entrada de Stock (Compra)</option>
                                <option value="PRICE">Actualizar Precio de Venta</option>
                            </select>
                        </div>

                        {formData.type === 'IN' && (
                            <div className="animate-in slide-in-from-top-2">
                                <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Cantidad a sumar</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full border-b border-gray-200 py-2 text-xs outline-none focus:border-black"
                                    value={formData.quantity || ""}
                                    onChange={(e) => handleNumberChange('quantity', e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">
                                {formData.type === 'PRICE' ? 'Nuevo Precio Público (C$)' : 'Costo Unitario de Compra (C$)'}
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full border-b border-gray-200 py-2 text-xs outline-none focus:border-black"
                                value={formData.unit_cost || ""}
                                onChange={(e) => handleNumberChange('unit_cost', e.target.value, true)}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Nota / Referencia</label>
                            <input
                                type="text"
                                placeholder="Ej: Factura #123 o Ajuste por inflación"
                                className="w-full border-b border-gray-200 py-2 text-xs outline-none focus:border-black"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Procesar Cambio"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};