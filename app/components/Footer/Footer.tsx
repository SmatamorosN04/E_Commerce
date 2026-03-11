export const Footer = () => {
    return (
        <footer className="pt-20 pb-10 px-10 border-t border-gray-100">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Logo Estilizado */}
                <h2 className="text-2xl font-serif italic font-bold tracking-tighter mb-8">
                 Abuela's   <span className="font-light not-italic tracking-[0.3em] text-sm ml-2">MOTOPARTS</span>
                </h2>

                <div className="flex flex-col md:flex-row gap-10 text-center mb-16 text-gray-600 text-xs tracking-widest uppercase">
                    <p>Ubicación:Ticuantepe, Managua, Nicaragua</p>
                    <p>WhatsApp: +505 8773-1532</p>
                    <p>Horario: Lun - Sáb 8am - 6pm</p>
                </div>

                <div className="w-full h-px bg-gray-100 mb-8" />

                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                    © 2026 Abuela's Motoparts. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};