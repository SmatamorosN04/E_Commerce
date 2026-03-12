'use client'
import { useState, useEffect } from "react";
import { InventoryTable } from "../../components/InventoryTable/InventoryTable";
import { StockMovementModal } from "../../components/StockMovementModal/StockMovementModal";
import { Package, RefreshCcw } from "lucide-react";

export default function IventoryPage() {
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/inventory/variants');
            const data = await res.json();
            setVariants(data);
        } catch (error) {
            console.error("Error cargando inventario", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <header className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-xl uppercase tracking-[0.4em] font-light text-gray-900">Gestion de Inventario</h1>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Control de Stock y trazabilidad inmutable</p>
                </div>
                <button
                    onClick={loadData}
                    className="p-2 text-gray-400 hover:text-black transition-colors"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </header>

            <main className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 border border-gray-100 flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-black">
                            <Package className="w-5 h-5 stroke-1" />
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-gray-400">Total Items</p>
                            <p className="text-lg font-bold">{variants.length}</p>
                        </div>
                    </div>
                </div>

                <InventoryTable
                    variants={variants}
                    onAdjust={(v) => setSelectedVariant(v)}
                />
            </main>

            <StockMovementModal
                isOpen={!!selectedVariant}
                onClose={() => setSelectedVariant(null)}
                onSuccess={loadData}
                variantId={selectedVariant?.variant_id || ""}
                productId={selectedVariant?.product_id || ""}
                sku={selectedVariant?.sku || ""}
                productName={selectedVariant?.product_name || ""}
            />
        </div>
    );
}