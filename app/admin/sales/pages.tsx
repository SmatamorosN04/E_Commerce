'use client'
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/app/components/AdminSidebar/AdminSidebar";
import {
    Search, Plus, Trash2, CreditCard,
    Banknote, Smartphone, Receipt, Loader2,
    CheckCircle2, AlertCircle, ShoppingBag
} from "lucide-react";

export default function SalesPage() {
    // Estados de datos
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState<any[]>([]);

    // Estados de UI
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Efectivo");
    const [customerName, setCustomerName] = useState("");
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    // Cargar productos al iniciar
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/products'); // Ajusta a tu endpoint
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error cargando productos", err);
        } finally {
            setLoading(false);
        }
    };

    // Lógica del Carrito
    const addToCart = (variant: any) => {
        const exists = cart.find(item => item.variant_id === variant.id);
        if (exists) {
            setCart(cart.map(item => item.variant_id === variant.id
                ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, {
                variant_id: variant.id,
                name: variant.product_name || variant.name,
                variant_name: variant.variant_name,
                price: variant.price,
                quantity: 1
            }]);
        }
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.variant_id !== id));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Envío al Backend
    const handleProcessSale = async () => {
        if (cart.length === 0) return;
        setProcessing(true);
        setMessage(null);

        try {
            const res = await fetch('http://localhost:3001/api/sales/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: customerName || "Consumidor Final",
                    payment_method: paymentMethod,
                    items: cart
                })
            });

            const result = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: "¡Venta procesada con éxito!" });
                setCart([]);
                setCustomerName("");
                fetchProducts(); // Recargar stock
            } else {
                throw new Error(result.message);
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setProcessing(false);
        }
    };

    // Filtrado en tiempo real
    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-[#F9FAFB] font-sans">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- COLUMNA IZQUIERDA: CATÁLOGO (8 Cols) --- */}
                <div className="lg:col-span-8">
                    <header className="mb-10">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Punto de Venta</h1>
                                <p className="text-gray-400 font-medium">Selecciona los repuestos para la factura</p>
                            </div>
                            <div className="bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                                <span className="text-blue-600 font-bold text-sm">Stock Sincronizado</span>
                            </div>
                        </div>

                        <div className="relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={22} />
                            <input
                                type="text"
                                placeholder="Escribe el nombre del repuesto o código SKU..."
                                className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm focus:ring-4 focus:ring-blue-50/50 outline-none font-bold text-gray-700 transition-all placeholder:text-gray-300"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </header>

                    {loading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {filteredProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock <= 0}
                                    className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex justify-between items-center group disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    <div className="text-left">
                                        <h4 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-black uppercase mt-1 tracking-widest">
                                            {product.sku} • <span className={product.stock < 5 ? 'text-rose-500' : 'text-emerald-500'}>Stock: {product.stock}</span>
                                        </p>
                                        <p className="text-xl font-black text-gray-900 mt-3 italic">C$ {Number(product.price).toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 text-gray-300 rounded-[1.5rem] group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Plus size={24} strokeWidth={3} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- COLUMNA DERECHA: CHECKOUT (4 Cols) --- */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-2xl sticky top-10 flex flex-col h-[calc(100vh-80px)]">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gray-900 text-white rounded-2xl shadow-lg">
                                <Receipt size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Checkout</h3>
                        </div>

                        {/* Cliente */}
                        <div className="mb-6">
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-2 block tracking-widest">Nombre del Cliente</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Lista del Carrito */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300 opacity-60">
                                    <ShoppingBag size={60} strokeWidth={1} />
                                    <p className="font-bold mt-4">Carrito vacío</p>
                                </div>
                            ) : cart.map(item => (
                                <div key={item.variant_id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-black uppercase italic">{item.quantity} x C$ {item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-black text-sm text-gray-900">C$ {item.price * item.quantity}</span>
                                        <button onClick={() => removeFromCart(item.variant_id)} className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totales */}
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white mb-6 shadow-xl shadow-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase opacity-60 tracking-widest">Total Final</span>
                                <span className="text-3xl font-black italic tracking-tighter">C$ {total.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Métodos de Pago */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <PaymentOption active={paymentMethod === 'Efectivo'} onClick={() => setPaymentMethod('Efectivo')} icon={<Banknote size={20}/>} label="Efectivo" />
                            <PaymentOption active={paymentMethod === 'Tarjeta'} onClick={() => setPaymentMethod('Tarjeta')} icon={<CreditCard size={20}/>} label="Tarjeta" />
                            <PaymentOption active={paymentMethod === 'Transferencia'} onClick={() => setPaymentMethod('Transferencia')} icon={<Smartphone size={20}/>} label="Transf." />
                        </div>

                        {/* Botón Acción */}
                        <button
                            disabled={cart.length === 0 || processing}
                            onClick={handleProcessSale}
                            className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                                cart.length === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02]'
                            }`}
                        >
                            {processing ? <Loader2 className="animate-spin" /> : 'Confirmar Venta'}
                        </button>

                        {/* Feedback de la operación */}
                        {message && (
                            <div className={`mt-4 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                                message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <p className="text-xs font-bold">{message.text}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function PaymentOption({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-[1.5rem] border-2 transition-all gap-2 ${
                active ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-inner' : 'bg-white border-gray-50 text-gray-300 hover:border-gray-100'
            }`}
        >
            {icon}
            <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
        </button>
    );
}