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

export default function ProductCard({product}: {product:Product}){
    const totalStock = product.variants.reduce((acc, curr) => acc + curr.stock, 0);
    const tempImageUrl ="/bg.jpg";

    return (
        <div className="group cursor-pointer flex flex-col items-center w-full">
            {/* Contenedor de Imagen: Aspect Ratio 3:4 es clave para el look Fashion */}
            <div className="relative aspect-[3/4] w-full bg-[#F3F4F6] overflow-hidden mb-3 rounded-sm">

                {/* Badge Agotado: Más pequeño en móvil */}
                {totalStock === 0 && (
                    <div className="absolute top-0 right-0 z-10 bg-white/80 backdrop-blur-sm px-2 py-1 m-1.5 border border-gray-100">
                        <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-medium text-red-500">
                            Agotado
                        </span>
                    </div>
                )}

                <img
                    src={tempImageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay: Solo visible en desktop (hover) o mediante interacción */}
                <div className="hidden md:flex absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/40 to-transparent items-end justify-center pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white text-[10px] uppercase tracking-[0.2em] font-medium">
                        Ver Detalles
                    </span>
                </div>
            </div>

            {/* Información del Producto */}
            <div className="text-center w-full px-0.5">
                {/* Nombre: min-h ayuda a que los precios se alineen aunque el nombre sea de 1 sola línea */}
                <h3 className="text-[11px] md:text-sm text-gray-800 font-light leading-tight uppercase tracking-tight line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] flex items-center justify-center">
                    {product.name}
                </h3>

                <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 mb-1 tracking-widest font-light">
                    {product.sku}
                </p>

                {/* Precio: El color #DD8560 es el toque final */}
                <span className="text-sm md:text-lg font-medium text-[#DD8560] tracking-tight">
                    ${parseFloat(product.base_price).toFixed(2)}
                </span>
            </div>
        </div>
    );
}