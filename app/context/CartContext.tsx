'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from "react-hot-toast";

interface CartItem {
    id: string;
    name: string;
    base_price: number;
    stock: number,
    quantity: number;
    image_url?: string;
    brand?: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number, stock: number) => void;
    clearCart: () => void;
    totalPrice: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('la-abuela-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Error cargando el carrito", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('la-abuela-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: CartItem) => {
        let successMessage = "";

       setCart(prev => {
            const existing = prev.find(item => item.id === product.id);

            if (existing) {
                const totalRequested = existing.quantity + product.quantity;

                if (totalRequested > existing.stock) {
                    toast.error(`Límite de stock alcanzado (${existing.stock})`, {
                        style: { border: '1px solid #000', borderRadius: '0px', fontSize: '10px' }
                    });
                    return prev;
                }
                successMessage = "CANTIDAD ACTUALIZADA";
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: totalRequested }
                        : item
                );
            }

            if (product.stock >= product.quantity) {
                successMessage = "PRODUCTO AGREGADO AL CARRITO";
                return [...prev, { ...product }];
            } else {
                toast.error("STOCK INSUFICIENTE");
                return prev;
            }
        });

        if (successMessage) {
            toast.success(successMessage, {
                style: { border: '1px solid #000', borderRadius: '0px', fontSize: '10px', letterSpacing: '0.2em' }
            });
        }
    };
    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number, stockMax: number) => {
        setCart(prev =>
            prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);

                if (newQty < 1) return item;

                if (newQty > stockMax) {
                    toast.error(`Solo hay ${stockMax} unidades disponibles`)
                    return item;
                }

                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((acc, item) => acc + (item.base_price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    // @ts-ignore
    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalPrice,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe ser usado dentro de un CartProvider");
    }
    return context;
};