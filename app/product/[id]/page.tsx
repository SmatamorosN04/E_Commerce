'use client'
import { useState, useEffect, use } from 'react'; // 1. Importamos 'use' de React
import { ShoppingCart, ChevronRight, ShieldCheck, Truck, Loader2 } from 'lucide-react';
import { Navbar } from "@/app/components/NavBar/NavBar";
import { Footer } from "@/app/components/Footer/Footer";

// 2. Definimos params como una Promesa en la interfaz
export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // 3. Desenvolvemos params usando React.use()
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return; // Seguridad

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`);

                // Verificamos si la respuesta es correcta antes de parsear JSON
                if (!res.ok) throw new Error("Producto no encontrado en la API");

                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Error al cargar el producto:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]); // 4. El efecto depende del ID ya resuelto

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center text-[10px] uppercase tracking-[0.4em] animate-pulse text-gray-400">
            Obteniendo especificaciones...
        </div>
    );

    if (!product) return (
        <div className="p-20 text-center uppercase tracking-widest text-xs text-gray-500">
            Producto no encontrado (ID: {productId}).
        </div>
    );

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
                <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 mb-8">
                    <span>Catálogo</span> <ChevronRight className="w-3 h-3" />
                    <span className="text-black font-medium">{product?.category}</span>
                </nav>

                <h1 className="text-2xl uppercase tracking-widest">{product.name}</h1>
                <p className="text-[#DD8560] font-bold text-xl mt-4">${parseFloat(product.base_price).toFixed(2)}</p>
            </div>
            <Footer />
        </main>
    );
}