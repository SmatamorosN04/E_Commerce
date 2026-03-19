import Link from 'next/link';
interface Variant {
    variant_id: string;
    name: string;
    stock: number;
}

interface Product {
    id: string;
    sku: string;
    name: string;
    base_price: string;
    category: string;
    variants: Variant[];
}
export default function ProductCard({ product, view = 'grid' }: { product: Product, view?: 'grid' | 'list' }) {
    const totalStock = product.variants.reduce((acc, curr) => acc + curr.stock, 0);
    const tempImageUrl = "/bg.jpg"; //
    const productHref = `/product/${product.id}`;

    if (view === 'list') {
        return (
            <Link href={productHref} className="group cursor-pointer flex gap-4 w-full animate-in fade-in duration-500">
                <div className="relative aspect-3/4 w-32 md:w-48 bg-[#F3F4F6] overflow-hidden rounded-sm flex-shrink-0">
                    {totalStock === 0 && (
                        <div className="absolute top-0 left-0 z-10 bg-white/80 backdrop-blur-sm px-2 py-1 m-1.5 border border-gray-100">
                            <span className="text-[8px] uppercase tracking-widest font-medium text-red-500">Agotado</span>
                        </div>
                    )}
                    <img src={tempImageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                {/* Info a la derecha estilo Open Fashion */}
                <div className="flex flex-col justify-center py-2 flex-1">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">{product.category}</span>
                    <h3 className="text-xs md:text-sm text-gray-800 font-light uppercase tracking-tight line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                    <p className="text-[9px] text-gray-400 mb-3 tracking-widest">{product.sku}</p>
                    <span className="text-base md:text-xl font-medium text-[#DD8560]">
                        ${parseFloat(product.base_price).toFixed(2)}
                    </span>

                    {/* Botón rápido visible solo en lista móvil/desktop */}
                    <button className="mt-4 text-[10px] uppercase tracking-widest border-b border-gray-200 self-start pb-1 hover:border-black transition-colors">
                        Ver Detalles
                    </button>
                </div>
            </Link>
        );
    }

    return (
        <Link href={productHref} className="group cursor-pointer flex flex-col items-center w-full animate-in fade-in duration-500">
            <div className="relative aspect-[3/4] w-full bg-[#F3F4F6] overflow-hidden mb-3 rounded-sm">
                {totalStock === 0 && (
                    <div className="absolute top-0 right-0 z-10 bg-white/80 backdrop-blur-sm px-2 py-1 m-1.5 border border-gray-100">
                        <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-medium text-red-500">Agotado</span>
                    </div>
                )}
                <img src={tempImageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="hidden md:flex absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent items-end justify-center pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white text-[10px] uppercase tracking-[0.2em] font-medium">Ver Detalles</span>
                </div>
            </div>
            <div className="text-center w-full px-0.5">
                <h3 className="text-[11px] md:text-sm text-gray-800 font-light leading-tight uppercase tracking-tight line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] flex items-center justify-center">
                    {product.name}
                </h3>
                <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 mb-1 tracking-widest font-light">{product.sku}</p>
                <span className="text-sm md:text-lg font-medium text-[#DD8560] tracking-tight">
                    ${parseFloat(product.base_price).toFixed(2)}
                </span>
            </div>
        </Link>
    );
}