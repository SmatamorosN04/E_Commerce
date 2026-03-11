import { Button } from '../Button/Button'

export default function Hero() {
    return (
        <section className="relative h-[85vh] w-full bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070"
                    alt="Moto Parts"
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-20 max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-serif italic text-white tracking-tight mb-2">
                    Calidad <span className="block text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mt-2">En cada pieza</span>
                </h1>
                <p className="text-gray-300 text-sm md:text-base uppercase tracking-widest mb-8 max-w-md leading-relaxed">
                    Repuestos originales y alto rendimiento para tu mototaxi. Mantén tu herramienta de trabajo al 100%.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="ghost" className="border-white/50 text-white">
                        Ver Catálogo
                    </Button>
                </div>
            </div>
        </section>
    );
}