'use client'
import { useEffect, useState} from "react";
import ProductCard from "../components/ProductCard/ProductCard";

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false)
            })
            .catch((err) => {
                console.error("Error cargando productos", err);
                setLoading(false)
            });
    }, []);

    if (loading) return <div className="p-10 text-center">Cargando Catalogo..</div>;

    return (
        <main className="min-h-screen bg-gray-50 p-6 md:p-12">
            <header className="max-w-7xl mx-auto mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 ">Catalogo de Productos</h1>
                <p className="text-gray-600">Explora lo que tenemos disponible para ti</p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                {products.length > 0 ? (
                    products.map((products: any) =>(
                        <ProductCard key={products.id} product={products}/>
                    ))
                ) : (
                    <p className="col-span full text-center text-gray-500 py-20">No hay productos registrados aun.</p>
                )}
            </div>
        </main>
    );

}