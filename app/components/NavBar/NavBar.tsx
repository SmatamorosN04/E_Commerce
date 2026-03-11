import { Menu, Search, ShoppingBag } from 'lucide-react';

export const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50">
            <div className="flex-1">
                <Menu className="w-6 h-6 text-gray-700 cursor-pointer" />
            </div>

            <div className="flex-1 text-center">
                <h1 className="text-2xl font-serif tracking-widest font-bold italic">
                    Abuela's Motorparts
                </h1>
            </div>

            <div className="flex-1 flex justify-end gap-4 text-gray-700">
                <Search className="w-6 h-6 cursor-pointer" />
                <ShoppingBag className="w-6 h-6 cursor-pointer" />
            </div>
        </nav>
    );
};