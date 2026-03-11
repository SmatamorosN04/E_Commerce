export const BrandLogos = () => {
    const brands = [
        { name: "BAJAJ", className: "font-bold" },
        { name: "TVS", className: "font-extrabold italic" },
        { name: "TORITO", className: "font-black" },
        { name: "RE", className: "font-serif font-bold" },
        { name: "CHAMPION", className: "font-sans font-light tracking-[0.3em]" }
    ];

    return (
        <section className="py-12 border-t border-gray-100 mt-10">
            <div className="flex justify-center mb-10">
                <div className="w-32 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 md:gap-x-20 opacity-40 grayscale hover:opacity-70 transition-opacity duration-500">
                    {brands.map((brand) => (
                        <span
                            key={brand.name}
                            className={`text-xl md:text-2xl tracking-[0.15em] text-gray-800 ${brand.className}`}
                        >
              {brand.name}
            </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-center mt-10">
                <div className="w-12 h-px bg-gray-200" />
                <div className="w-1 h-1 rotate-45 border border-gray-300 mx-2" />
                <div className="w-12 h-px bg-gray-200" />
            </div>
        </section>
    );
};