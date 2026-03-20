'use client';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart} from "@/app/context/CartContext";
import {useState} from "react";
import {CheckoutModal} from "@/app/components/CheckoutModal/CheckoutModal";

export const CartContent = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const { cart, addToCart, removeFromCart, totalPrice, updateQuantity } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false)


    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            <div className={`fixed inset-y-0 right-0 w-[90%] max-w-sm bg-white z-[110] p-6 flex flex-col shadow-2xl transition-transform duration-500 ease-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>

                <div className="flex items-center justify-between mb-10">
                    <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
                        <X className="w-6 h-6 stroke-[1px] text-gray-800" />
                    </button>
                    <h2 className="text-[10px] tracking-[0.4em] uppercase text-gray-900 font-light">
                        Tu Carrito
                    </h2>
                    <div className="w-6" />
                </div>

                <div className="grow overflow-y-auto pr-2 no-scrollbar space-y-8">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 animate-fade-in">
                                <div className="w-24 h-32 bg-[#F9F9F9] flex-shrink-0 relative">
                                    <img
                                        src={item.image_url || '/placeholder.jpg'}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col justify-between py-1 flex-1">
                                    <div className="relative pr-6">
                                        <h3 className="text-[11px] text-gray-800 font-medium tracking-wide uppercase line-clamp-2 leading-relaxed">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="absolute -top-2 -right-2 p-4 z-10 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                                            aria-label="Eliminar producto"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-center mt-auto">
                                        <div className="flex items-center gap-4 border border-gray-100 px-2 py-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1, item.stock)}
                                                disabled={item.quantity >= item.stock}
                                                className="text-gray-400 hover:text-gray-900"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>

                                            <span className="text-[11px] font-light w-4 text-center">{item.quantity}</span>

                                            <button
                                                onClick={() => addToCart({...item, stock: item.quantity ,quantity: 1})}
                                                className="text-gray-400 hover:text-gray-900"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <span className="text-xs font-semibold text-[#DD8560] tracking-wider">
                                            ${(item.base_price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div
                            className="h-full flex flex-col items-center justify-center opacity-40">
                            <ShoppingBag className="w-12 h-12 stroke-[0.5px] mb-4" />
                            <p className="text-[10px] uppercase tracking-widest">El carrito está vacío</p>
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="pt-8 border-t border-gray-100 mt-6 bg-white">
                        <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] mb-6">
                            <span className="text-gray-400">Total Estimado</span>
                            <span className="text-black font-bold text-sm">${totalPrice.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={() =>{
                                onClose()
                                setIsModalOpen(true)}}
                            className="w-full h-14 cursor-pointer bg-black text-white flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-all uppercase tracking-[0.3em] text-[9px] font-medium group">
                            <ShoppingBag className="w-4 h-4 stroke-[1.5px] group-hover:scale-110 transition-transform" />
                            Finalizar Compra
                        </button>

                        <p className="text-[8px] text-gray-400 uppercase tracking-widest text-center mt-4">
                            Tax y envío calculados al pagar
                        </p>
                    </div>
                )}
            </div>
            <CheckoutModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            cart={cart}
            total={totalPrice}
            ></CheckoutModal>
        </>
    );
};