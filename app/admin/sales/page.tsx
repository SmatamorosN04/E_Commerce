'use client'

import {useEffect, useState} from "react";
import {AdminSidebar} from "@/app/components/AdminSidebar/AdminSidebar";
import {AlertCircle, CheckCircle2, Loader2, Plus, Receipt, Search, ShoppingBag, Trash2} from "lucide-react";

export default function SalesPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Efectivo");
    const [costumerName, setCostumerName] = useState("")
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        fetchProducts();
    },[]);

    const fetchProducts = async () => {
        try{
            const res = await fetch('http://localhost:3001/api/products');
            const data = await res.json();
            console.log("¿Qué trae el primer producto?:", data[0]);
            setProducts(data);
        }catch (error: any) {
            console.error('Error cargando productos:', error);
            setMessage({ type: 'error', text: "No se pudo conectar con el servidor "});
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product: any) => {
        const variant = product.variants[0];
        const variantId = variant.variant_id;
        const stockDisponible = variant.stock;
        const exists = cart.find(item => item.variant_id === variantId);


        if (exists) {
            if (exists.quantity >= stockDisponible) {
                setMessage({
                    type: 'error',
                    text: `No puedes agregar más. Solo hay ${stockDisponible} en inventario.`
                });
                return;
            }
            setCart(cart.map(item =>
                item.variant_id === variantId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            if (stockDisponible > 0) {
                setCart([...cart, {
                    variant_id: variantId,
                    name: product.name,
                    price: Number(product.base_price || 0),
                    quantity: 1
                }]);
            }
        }
        setMessage(null);
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.variant_id !== id));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleProcessSale = async () => {
        if (cart.length === 0) return;
        setProcessing(true);
        setMessage(null);

        const salePayload = {
            items: cart.map(item => ({
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        try {
            const res = await fetch('http://localhost:3001/api/sales/create',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(salePayload)
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'venta registrada y stock actualizado.'});
                setCart([]);
                setCostumerName("");
                fetchProducts();
            } else{
                throw new Error(result.error || "Error en el servidor");
            }
        } catch (err: any){
            setMessage({ type: 'error', text: err.message});
        } finally {
            setProcessing(false)
        }
    };

    const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-[#F9FAFB] font-sans">
            <AdminSidebar/>

            <main className="flex-1 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-8">
                    <header className="mb-10">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ventas en Local </h1>
                        <div className="mt-6 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={22}/>
                            <input
                                type="text"
                                placeholder="Buscar por nombre o SKU"
                                className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-4xl shadow-sm outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-700"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </header>
                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>

                    ): (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {filteredProducts.map((product) => (
                                <button
                                key={product.id}
                                onClick={() => addToCart(product)}
                                disabled={product.stock_actual <= 0}
                                className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex justify-between items-center group disabled:opacity-50"
                                >
                                    <div className="text-left">
                                        <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                                        <p className="text-xs text-gray-400 font-black uppercase mt-1 tracking-widest">
                                            {product.sku} - <span className={product.variants[0].stock < 5 ? 'text-rose-500' : 'text-emerald-500'}>En Stock: {product.variants[0].stock}</span>
                                        </p>
                                        <p className="text-xl font-black text-gray-900 mt-3 italic"> C$ {Number(product.base_price).toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 text-gray-300 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Plus size={24} strokeWidth={3} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-2xl sticky top-10 flex flex-col h-[calc()100vh-80px]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gay-900 text-white rounded-2xl">
                                <Receipt size={24}/>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Resumen</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                    <ShoppingBag size={48} strokeWidth={3}/>
                                    <p className="font-bold mt-4"> Carrito Vacio</p>
                                </div>
                            ): cart.map(item => (
                                <div key={item.variant_id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-gray-400 font-black uppercase " >{item.quantity} x C${ item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-sm text-gray-900">C$ {item.price * item.quantity}</span>
                                        <button onClick={() => removeFromCart(item.variant_id)} className="p-2 text-rose-300 hover:text-rose-600 transition-all">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-900 rounded-3xl p-6 text-white mb-6 ">
                            <div className="flex justify-between items-center ">
                                <span className="text-xs font-bold uppercase opacity-50 tracking-widest">Total</span>
                                <span className="text-3xl font-black italic tracking-tighter ">C$ {total.toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                        disabled={cart.length === 0 || processing}
                        onClick={handleProcessSale}
                        className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                            cart.length === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02]'
                        }`}
                        >
                            {loading ? <Loader2 className="animate-spin"/> : 'Confirmar Factura'}
                        </button>

                        {message && (
                            <div className={`mt-4 p-4 rounded-2xl flex items-center gap-3 animate-pulse ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20} />}
                                <p className="text-xs font-bold">{message.text}</p>
                            </div>
                        )}

                    </div>
                </div>
            </main>

        </div>
    )

}