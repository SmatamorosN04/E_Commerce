'use client'
import { useState, useEffect } from "react";
import { InventoryTable } from "../../components/InventoryTable/InventoryTable";
import { StockMovementModal } from "../../components/StockMovementModal/StockMovementModal";
import {Layers, Package, Plus, RefreshCcw} from "lucide-react";
import {CreateProductModal} from "@/app/components/CreatePrdouctModal/CreateProductModal";

export default function InventoryPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">

                    <div className="bg-white p-6 border border-gray-100 flex items-center gap-4 rounded-md shadow-sm">
                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center text-black shrink-0 rounded-sm">
                            <Package className="w-5 h-5 stroke-1" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Total Items</p>
                            <p className="text-xl font-bold leading-none mt-1">{variants.length}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-white border border-gray-300 flex rounded-md items-stretch gap-4 hover:border-black transition-all group text-left overflow-hidden shadow-sm"
                    >
                        <div className="w-10 bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-black transition-colors shrink-0">
                            <Plus className="w-5 h-5 stroke-1"/>
                        </div>
                        <div className="flex flex-col justify-center py-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Individual</p>
                            <p className="text-sm font-bold uppercase tracking-tight pr-2">Nuevo Producto</p>
                        </div>
                    </button>

                    <button
                        onClick={() => console.log("Abrir carga masiva")}
                        className="bg-white border border-gray-300 flex rounded-md items-stretch gap-4 hover:border-black transition-all group text-left overflow-hidden shadow-sm"
                    >
                        <div className="w-10 bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-black transition-colors shrink-0">
                            <Layers className="w-5 h-5 stroke-1"/>
                        </div>
                        <div className="flex flex-col justify-center py-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Procesamiento</p>
                            <p className="text-sm font-bold uppercase tracking-tight pr-2">Carga Masiva</p>
                        </div>
                    </button>
                </div>

                <div className="overflow-x-auto bg-white border border-gray-100 rounded-md">
                    <InventoryTable
                        variants={variants}
                        onAdjust={(v) => setSelectedVariant(v)}
                    />
                </div>
            </main>

            <CreateProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={loadData}
            />

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