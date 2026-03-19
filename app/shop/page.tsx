'use client'
import { useEffect, useState, Suspense } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import { LayoutGrid, List, ChevronDown } from "lucide-react";
import { Navbar } from "@/app/components/NavBar/NavBar";
import { Footer } from "@/app/components/Footer/Footer";
import { useSearchParams } from 'next/navigation';
import {CatalogSkeleton} from "@/app/components/CatalogSkeleton/CatalogSkeleton";
import {CatalogHeader} from "@/app/components/CataologHeader/CatalogHeader";
import {FilterBar} from "@/app/components/FilterBar/FilterBar";
import {ProductGrid} from "@/app/components/ProductGrid/ProductGrid";

const API_URL = process.env.NEXT_PUBLIC_API_URL


function ShopContent() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q');

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8;



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
        let result = products;
        if (searchQuery) {
            result = products.filter((p: any) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredProducts(result);
        setCurrentPage(1);
    }, [searchQuery, products]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (loading) return <CatalogSkeleton />;

    return (
        <div className="animate-fade-in transition-all duration-500">
            <header className="max-w-7xl mx-auto px-6 pt-12">
                <CatalogHeader searchQuery={searchQuery} />
                <FilterBar
                    count={filteredProducts.length}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 min-h-[50vh]">
                {/* Ahora pasamos 'currentItems' en lugar de todos los productos */}
                <ProductGrid
                    products={currentItems}
                    viewMode={viewMode}
                />

                {/* --- COMPONENTE DE PAGINACIÓN MEJORADO --- */}
                {filteredProducts.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-3 mt-24 mb-10">
                        {/* Botones de números */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => {
                                    setCurrentPage(page);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-10 h-10 flex items-center justify-center text-[10px] tracking-widest transition-all duration-300 ${
                                    currentPage === page
                                        ? 'bg-zinc-900 text-white'
                                        : 'text-zinc-400 hover:text-black hover:bg-zinc-50'
                                }`}
                            >
                                {page < 10 ? `0${page}` : page}
                            </button>
                        ))}

                        <span className="text-zinc-200 px-2">/</span>

                        {/* Botón Siguiente */}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => {
                                setCurrentPage(prev => prev + 1);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`text-[10px] tracking-widest uppercase transition-all ${
                                currentPage === totalPages
                                    ? 'text-zinc-200 cursor-not-allowed'
                                    : 'text-zinc-400 hover:text-black'
                            }`}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </main>
        </div>
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