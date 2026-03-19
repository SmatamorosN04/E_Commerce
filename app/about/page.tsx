'use client'
import { Navbar } from "@/app/components/NavBar/NavBar";
import { Footer } from "@/app/components/Footer/Footer";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-light tracking-tighter text-black leading-tight">
                            Calidad que mantiene <br />
                            <span className="italic">Nicaragua en movimiento.</span>
                        </h1>
                        <p className="text-gray-600 leading-relaxed tracking-wide text-sm md:text-base">
                            En **Repuestos La Abuela**, entendemos que tu vehículo es tu herramienta de trabajo y tu libertad. Desde Ticuantepe, nos dedicamos a proveer repuestos genuinos para Bajaj, TVS y Torito, asegurando que cada pieza cumpla con los estándares más exigentes de fábrica.
                        </p>
                    </div>
                    <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                        <Image
                            src="/about-hero.jpg" // Asegúrate de tener una imagen o usa /bg.jpg temporalmente
                            alt="Taller La Abuela"
                            fill
                            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-[#F9F9F9] py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {[
                        { title: "Originalidad", desc: "Solo trabajamos con piezas genuinas certificadas." },
                        { title: "Compromiso", desc: "Asesoría técnica para que lleves lo que realmente necesitas." },
                        { title: "Rapidez", desc: "Stock constante para que no te detengas ni un segundo." }
                    ].map((item) => (
                        <div key={item.title} className="space-y-4">
                            <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#DD8560]">{item.title}</h3>
                            <p className="text-sm text-gray-500 font-light px-8">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}