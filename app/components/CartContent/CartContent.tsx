'use client';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';

const cartItems = [
    {
        id: '1',
        brand: 'BAJAJ GENUINE',
        name: 'Kit Pistón y Anillos Pulsar 200 NS',
        price: 35.00,
        quantity: 1,
        img: '/bg.jpg'
    }
];

export const CartContent = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            <div className={`fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[110] p-6 flex flex-col transition-transform duration-300 ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>

                <div className="flex items-center justify-between mb-8">
                    <button onClick={onClose}>
                        <X className="w-6 h-6 stroke-[1px] text-gray-800" />
                    </button>
                    <h2 className="text-xs tracking-[0.3em] uppercase text-gray-900 font-light">
                        Carrito
                    </h2>
                    <div className="w-6" /> {/* Espaciador para centrar el título */}
                </div>

                {/* Lista de Productos */}
                <div className="grow overflow-y-auto pr-2 no-scrollbar space-y-6">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-28 bg-gray-50 flex-shrink-0">
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col justify-between py-1 flex-1">
                                    <div>
                                        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1 block font-medium">
                                            {item.brand}
                                        </span>
                                        <h3 className="text-[11px] text-gray-800 font-light leading-snug uppercase line-clamp-2">
                                            {item.name}
                                        </h3>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-4">
                                            <button className="text-gray-400 hover:text-gray-900"><Minus className="w-3.5 h-3.5" /></button>
                                            <span className="text-xs font-light">{item.quantity}</span>
                                            <button className="text-gray-400 hover:text-gray-900"><Plus className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <span className="text-sm font-medium text-[#DD8560]">
                                            ${item.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 text-sm font-light mt-10">Tu carrito está vacío</p>
                    )}
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6">
                    <div className="flex justify-between text-xs uppercase tracking-[0.2em] mb-4">
                        <span className="text-gray-500 font-light">Sub Total</span>
                        <span className="text-[#DD8560] font-medium text-sm">${subTotal.toFixed(2)}</span>
                    </div>

                    <button className="w-full h-12 bg-black text-white flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors uppercase tracking-[0.2em] text-[10px] font-light">
                        <ShoppingBag className="w-4 h-4 stroke-[1.2px]" />
                        Buy Now
                    </button>

                    <div className="flex justify-center mt-6">
                        <div className="w-12 h-px bg-gray-200" />
                    </div>
                </div>
            </div>
        </>
    );
};