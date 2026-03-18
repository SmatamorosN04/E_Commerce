'use client'
import {useState, useEffect, useMemo} from "react";
import { InventoryTable } from "../../components/InventoryTable/InventoryTable";
import { StockMovementModal } from "../../components/StockMovementModal/StockMovementModal";
import {Layers, Package, Plus, RefreshCcw, Search} from "lucide-react";
import {CreateProductModal} from "@/app/components/CreatePrdouctModal/CreateProductModal";
import Link from "next/dist/client/link";
import {AdminSidebar} from "@/app/components/AdminSidebar/AdminSidebar";

export default function InventoryPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredVariants = useMemo(() => {
        return variants.filter((v: any) =>
            v.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (v.category_name && v.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, variants]);

    const handleDeleteProduxt = async (productId: string | undefined, name: string) => {
        // 1. Validaciones de seguridad
        if (!productId || productId === "undefined") {
            console.error("Error: ID de producto no encontrado para:", name);
            alert("No se puede procesar la solicitud: ID inválido.");
            return;
        }

        // 2. Confirmación con el usuario (Mensaje más acorde al Soft Delete)
        const confirmed = window.confirm(
            `¿ESTÁS SEGURO DE RETIRAR "${name.toUpperCase()}" DEL CATÁLOGO?\n\nEl producto ya no aparecerá en el inventario, pero se conservará el historial de ventas.`
        );

        if (confirmed) {
            try {

                const res = await fetch(`http://localhost:3001/api/inventory/products/${productId}`, {
                    method: 'DELETE',
                });

                const data = await res.json();

                if (res.ok) {
                     loadData();
                } else {
                    // Si el backend devuelve un error (ej. 404 o 500)
                    alert(data.message || 'Hubo un problema al retirar el producto.');
                }
            } catch (error) {
                console.error('Error en la comunicación con el servidor:', error);
                alert('Error de conexión. Verifica que el servidor esté encendido.');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50/50">

            <AdminSidebar />

            <main className="flex-1 p-8 overflow-y-auto">

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

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative mb-8  z-1 ">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Search className="h-3.5 w-3.5 ml-2 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="BUSCAR POR NOMBRE, SKU O CATEGORÍA..."
                            className="w-full bg-white border border-gray-100 py-4 pl-10 pr-4 text-[10px] uppercase tracking-[0.2em] outline-none focus:border-black transition-all shadow-sm rounded-sm placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <div className="mt-2 flex justify-end">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest animate-in fade-in slide-in-from-top-1 duration-300">
                                    Mostrando {filteredVariants.length} {filteredVariants.length === 1 ? 'coincidencia' : 'coincidencias'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* TARJETAS DE ACCIÓN */}
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

                        <Link
                            href={'/admin/inventory/bulk-upload'}
                            className="bg-white border border-gray-300 flex rounded-md items-stretch gap-4 hover:border-black transition-all group text-left overflow-hidden shadow-sm"
                        >
                            <div className="w-10 bg-gray-100 group-hover:bg-black group-hover:text-white flex items-center justify-center text-black transition-colors shrink-0">
                                <Layers className="w-5 h-5 stroke-1"/>
                            </div>
                            <div className="flex flex-col justify-center py-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Procesamiento</p>
                                <p className="text-sm font-bold uppercase tracking-tight pr-2">Carga Masiva</p>
                            </div>
                        </Link>
                    </div>

                    <div className="overflow-x-auto bg-white border border-gray-100 rounded-md shadow-sm">
                        <InventoryTable
                            variants={filteredVariants}
                            onAdjust={(v) => setSelectedVariant(v)}
                            onDelete={handleDeleteProduxt}

                        />
                        {filteredVariants.length === 0 && searchTerm !== "" && (
                            <div className="p-20 text-center">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                                    No se encontraron coincidencias para "{searchTerm}"
                                </p>
                            </div>
                        )}
                    </div>
                </section>
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