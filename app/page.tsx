'use client'
import { Navbar } from '@/app/components/NavBar/NavBar';
import Hero from '../app/components/Hero/Hero';
import { CategoryTabs } from '@/app/components/CategoryTabs/CategoryTabs';
import { SectionTitle } from '@/app/components/SectionTitle/SectionTitle';
import { Features } from '@/app/components/Features/Features';
import { Footer } from '@/app/components/Footer/Footer';
import {useEffect, useState} from "react";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import {BrandLogos} from "@/app/components/BrandLogos/BrandLogos";

export default function HomePage() {
  const categories = ['TODO', 'MOTOR', 'FRENOS', 'ELÉCTRICO', 'ACCESORIOS'];
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error cargando productos", err);
          setLoading(false)
        });
  }, []);

  return (
      <main className="bg-white min-h-screen">
        <Navbar />

        <Hero />

        <section className="py-20">
          <SectionTitle title="Nuevos Repuestos" />

          <CategoryTabs
              categories={categories}
              activeCategory="TODO"
              onSelect={(cat) => console.log(cat)}
          />

          <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.length > 0 ? (
                products.map((products: any) =>(
                    <ProductCard key={products.id} product={products}/>
                ))
            ) : (
                <p className="col-span full text-center text-gray-500 py-20">No hay productos registrados aun.</p>
            )}
          </div>
          <div className="mt-16 text-center">
            <button className="text-gray-900 border-b border-gray-900 pb-1 uppercase tracking-widest text-xs">
              Explorar Más →
            </button>
          </div>
        </section>
        <BrandLogos/>
        <Features />

        <Footer />
      </main>
  );
}