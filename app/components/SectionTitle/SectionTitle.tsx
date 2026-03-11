export const SectionTitle = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center mb-10">
        <h2 className="text-xl tracking-[0.4em] uppercase font-light text-gray-900 mb-2">
            {title}
        </h2>
        <div className="flex items-center gap-2">
            <div className="w-12 h-px bg-gray-200" />
            <div className="w-2 h-2 rotate-45 border border-red-400" />
            <div className="w-12 h-px bg-gray-200" />
        </div>
    </div>
);