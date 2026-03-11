interface CategoryTabsProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

export const CategoryTabs = ({ categories, activeCategory, onSelect }: CategoryTabsProps) => {
    return (
        <div className="flex justify-center gap-6  md:gap-10 mb-12 overflow-x-auto px-4 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`text-xs md:text-sm uppercase cursor-pointer  tracking-[0.2em] pb-2 transition-all whitespace-nowrap ${
                        activeCategory === cat
                            ? 'text-gray-900 border-b border-red-500 font-medium'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};