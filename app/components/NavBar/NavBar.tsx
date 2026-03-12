'use client'
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { useState} from "react";
import { MenuDrawer} from "@/app/components/MenuDrawer/MenuDrawer";
import { CartContent} from "@/app/components/CartContent/CartContent";
import {SearchDrawer} from "@/app/components/SearchDrawer/SearchDrawer";


export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
       <>
           <nav className="flex items-center justify-between px-6 py-4 bg-white sticky top-0 z-50">
               <div className="flex-1">
                   <Menu className="w-6 h-6 text-gray-700 cursor-pointer"
                         onClick={() => setIsMenuOpen(true)}
                   />
               </div>

               <div className="flex-1 text-center">
                   <h1 className="text-2xl font-serif tracking-widest font-bold italic">
                       Repuestos la Abuela
                   </h1>
               </div>

               <div className="flex-1 flex justify-end gap-4 text-gray-700">
                   <Search
                       onClick={() => setIsSearchOpen(true)}
                       className="w-6 h-6 cursor-pointer hover:text-gray-400 transition-colors" />

                   <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                       <ShoppingBag className="w-6 h-6 group-hover:text-gray-400 transition-colors" />
                       <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#DD8560] text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                            0
                        </span>
                   </div>
               </div>
           </nav>
           <MenuDrawer
               isOpen={isMenuOpen}
               onClose={() => setIsMenuOpen(false)}
           />
           <CartContent
               isOpen={isCartOpen}
               onClose={() => setIsCartOpen(false)}
           />
           <SearchDrawer
           isOpen={isSearchOpen}
           onClose={() => setIsSearchOpen(false)}
           />

       </>


    );
};