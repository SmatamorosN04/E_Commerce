'use client'

interface CatalogHeaderProps {
    searchQuery: string | null;
}

export const CatalogHeader = ({ searchQuery }: CatalogHeaderProps) => (
    <div className="mb-8">
        {searchQuery && (
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 mb-3 animate-fade-in">
                Resultados de búsqueda para:
                <span className="text-zinc-900 font-bold ml-2 underline underline-offset-4">
                    "{searchQuery}"
                </span>
            </p>
        )}
        <h1 className="text-xl md:text-2xl tracking-[0.2em] uppercase font-light text-zinc-800">
            {searchQuery ? 'Explorando Repuestos' : 'Catálogo Premium'}
        </h1>
        <div className="w-12 h-[1px] bg-zinc-800 mt-4"></div>
    </div>
);