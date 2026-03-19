'use client'
import ProductCard from "@/app/components/ProductCard/ProductCard";

interface ProductGridProps {
    products: any[]
    viewMode: 'grid' | 'list';
}

export const ProductGrid = ({ products, viewMode}: ProductGridProps) => {
    if (products.length === 0) {
        return(
            <div className="col-span-full text-center py-32 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-[10px] tracking-[0.3em] text-gray-400 upperase italic">
                    No se encontraron coincidencias
                </p>
            </div>
        );
    }

    return (
        <div className={
            viewMode === 'grid'
            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16"
            : 'flex flex-col gap-12 max-w-4xl mx-auto '
        }>
            {products.map((item) => (
                <div key={item.id} className='GROUP transition-all duration-500'>
                    <ProductCard product={item} view={viewMode} />
                </div>
            ))}

        </div>
    )
}