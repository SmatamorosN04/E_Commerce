'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Definimos la estructura de un producto en el carrito
interface CartItem {
    id: string;
    name: string;
    base_price: number;
    quantity: number;
    image_url?: string;
    brand?: string; // Por si quieres mostrar la marca como en tu diseño
}

// 2. Definimos qué funciones y datos ofrece el carrito a toda la app
interface CartContextType {
    cart: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    totalPrice: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // 3. Persistencia: Cargar carrito al iniciar la web
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

    // 4. Persistencia: Guardar cada vez que el carrito cambie
    useEffect(() => {
        localStorage.setItem('la-abuela-cart', JSON.stringify(cart));
    }, [cart]);

    // Lógica para añadir productos (si ya existe, suma la cantidad)
    const addToCart = (product: CartItem) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            }
            return [...prev, product];
        });
    };

    // Lógica para borrar un producto
    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    // Lógica para sumar/restar cantidad desde el carrito lateral
    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    // Cálculos automáticos
    const totalPrice = cart.reduce((acc, item) => acc + (item.base_price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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