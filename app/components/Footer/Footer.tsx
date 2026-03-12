export const Footer = () => {
    return (
        <footer className="pt-20 pb-10 px-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <h2 className="text-2xl font-serif italic font-bold tracking-tighter mb-8">
                   <span className="font-light not-italic tracking-[0.3em] text-sm ml-2">Repuestos</span> la Abuela
                </h2>

                <div className="flex flex-col md:flex-row gap-10 text-center mb-16 text-gray-600 text-xs tracking-widest uppercase">
                    <p>Ubicación:Alcaldia de Ticuantepe 25 mts al oeste</p>
                    <p>WhatsApp: +505 87731532</p>
                    <p>Horario: Todo el dia </p>
                </div>

                <div className="w-full h-px bg-gray-100 mb-8" />

                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                    © 2026 Repuestos la Abuela. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};