'use client'
import { useEffect, useState, Suspense } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import { LayoutGrid, List, ChevronDown } from "lucide-react";
import { Navbar } from "@/app/components/NavBar/NavBar";
import { Footer } from "@/app/components/Footer/Footer";
import { useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL


function ShopContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q');

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando productos", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = products.filter((p: any) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh] text-xs tracking-widest uppercase text-gray-400 italic">
            Cargando Catalogo...
        </div>
    );

    return (
        <>
            <header className="max-w-7xl mx-auto px-6 pt-12 pb-6">
                {searchQuery && (
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                        Resultados para: <span className="text-black font-medium">"{searchQuery}"</span>
                    </p>
                )}
                <h1 className="text-sm tracking-[0.4em] uppercase font-light border-b border-gray-100 pb-4">
                    {searchQuery ? 'Búsqueda de Repuestos' : 'Catálogo Completo'}
                </h1>

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-900 uppercase tracking-widest font-medium">
                            {filteredProducts.length} Artículos
                        </span>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-300'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-300'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="hidden md:flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors">
                            <span className="text-[10px] uppercase tracking-widest text-gray-600">Recientes</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className={
                    viewMode === 'grid'
                        ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12"
                        : "flex flex-col gap-10 max-w-2xl mx-auto"
                }>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item: any) => (
                            <ProductCard key={item.id} product={item} view={viewMode} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-xs tracking-[0.2em] text-gray-400 uppercase italic">
                                No se encontraron productos.
                            </p>
                        </div>
                    )}
                </div>

                {filteredProducts.length > 0 && (
                    <div className="flex justify-center items-center gap-4 mt-20 mb-10">
                        <button className="w-8 h-8 flex items-center justify-center bg-zinc-800 text-white text-xs">1</button>
                        <button className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs hover:text-black">2</button>
                        <span className="text-gray-300">...</span>
                    </div>
                )}
            </div>
        </>
    );
}

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh] text-xs tracking-widest uppercase text-gray-400 italic">
                    Cargando catálogo dinámico...
                </div>
            }>
                <ShopContent />
            </Suspense>

            <Footer />
        </main>
    );
}