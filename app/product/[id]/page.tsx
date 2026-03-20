'use client'
import { useState, useEffect, use } from 'react';
import { ShoppingCart, ChevronRight, ShieldCheck, Truck, Minus, Plus } from 'lucide-react';
import { Navbar } from "@/app/components/NavBar/NavBar";
import { Footer } from "@/app/components/Footer/Footer";
import Image from 'next/image';
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import toast from "react-hot-toast";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const productId = resolvedParams.id;

    const { addToCart } = useCart();

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`);
                if (!res.ok) throw new Error("Producto no encontrado");
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;
        const inventarioReal = Number(product.stock_actual);
        console.log(product.stock_actual);


        if (inventarioReal <= 0) {
            toast.error('LO SENTIMOS, ESTE REPUESTO ESTÁ AGOTADO', {
                style: { border: '1px solid #000', borderRadius: '0px', fontSize: '10px', letterSpacing: '0.2em' }
            });
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            base_price: parseFloat(product.base_price),
            stock: inventarioReal,
            quantity: quantity,
            image_url: product.image_url || "/bg.jpg",
            brand: product.brand || "Genuino"
        });

    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-[10px] uppercase tracking-[0.4em] animate-pulse text-gray-400">
            Cargando detalles...
        </div>
    );

    if (!product) return (
        <div className="p-20 text-center uppercase tracking-widest text-xs text-gray-500">
            Producto no encontrado.
        </div>
    );

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
                <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 mb-10">
                    <Link href={'/shop'} className="cursor-pointer hover:text-black transition-colors">Catálogo</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-black font-medium">{product.category_name || 'General'}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="relative aspect-[4/5] bg-[#F9F9F9] overflow-hidden group">
                        <Image
                            src={product.image_url || "/bg.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </div>

                    <div className="flex flex-col">
                        <h1 className="text-3xl uppercase tracking-[0.2em] font-light text-black">
                            {product.name}
                        </h1>

                        <p className="text-[#DD8560] font-semibold text-2xl mt-4 tracking-wider">
                            ${parseFloat(product.base_price).toFixed(2)}
                        </p>

                        <div className="mt-8 space-y-6">
                            <p className="text-gray-600 leading-relaxed text-sm tracking-wide">
                                {product.description || "Sin descripción disponible para este producto de La Abuela."}
                            </p>

                            <div className="flex items-center gap-6 pt-6">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400">Cantidad</span>
                                <div className="flex items-center border border-gray-200">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm">{quantity}</span>
                                    <button
                                        onClick={() => {
                                            if (quantity < product.stock_actual) {
                                            setQuantity(prev => prev + 1);
                                        } else {
                                            toast.error(`Solo hay ${product.stock_actual} unidades en inventario`, {
                                            duration: 2000,
                                            style: { fontSize: '10px', borderRadius: '0px' }
                                        });
                                        }
                                        }}

                                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-black cursor-pointer text-white py-5 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.3em] hover:bg-[#222] transition-all mt-4 group"
                            >
                                <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Añadir a la bolsa
                            </button>

                            <div className="grid grid-cols-2 gap-4 pt-10 border-t border-gray-100 mt-10">
                                <div className="flex items-center gap-3">
                                    <Truck className="w-5 h-5 text-gray-400" />
                                    <span className="text-[9px] uppercase tracking-tighter text-gray-500">Envío Gratis en Managua</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                                    <span className="text-[9px] uppercase tracking-tighter text-gray-500">Garantía La Abuela</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}