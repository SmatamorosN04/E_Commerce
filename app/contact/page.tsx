'use client'
import { useState } from 'react';
import { Navbar } from "@/app/components/NavBar/NavBar";
import { Footer } from "@/app/components/Footer/Footer";
import { MapPin, MessageCircle, Send, ArrowRight } from "lucide-react";

export default function ContactPage() {
    // Número de teléfono de Repuestos La Abuela
    const WHATSAPP_NUMBER = "50587731532";
    const WHATSAPP_MESSAGE = encodeURIComponent("Hola Repuestos La Abuela, estoy interesado en consultar sobre un repuesto.");

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-20 space-y-4">
                    <h1 className="text-4xl uppercase tracking-[0.2em] font-light text-black">Contáctanos</h1>
                    <div className="w-12 h-px bg-[#DD8560] mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    {/* Sección Informativa y Botón de WhatsApp Directo */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Atención Inmediata</h2>

                            <p className="text-gray-600 text-sm leading-relaxed tracking-wide max-w-md">
                                ¿Buscas una pieza específica para tu Bajaj, TVS o Torito? <br />
                                Chatea directamente con nuestro equipo técnico para confirmar stock y precios en tiempo real.
                            </p>

                            {/* BOTÓN DE ACCIÓN PRIMARIA: WHATSAPP */}
                            <a
                                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-4 bg-[#25D366] text-white px-10 py-5 uppercase text-[10px] tracking-[0.3em] font-bold hover:bg-[#128C7E] transition-all transform hover:-translate-y-1 shadow-lg shadow-green-100 group"
                            >
                                <MessageCircle className="w-5 h-5 fill-white" />
                                Chat por WhatsApp
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        <div className="pt-10 border-t border-gray-100 space-y-8">
                            <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Nuestra Ubicación</h2>

                            <div className="flex items-start gap-6">
                                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 stroke-[1px] text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Visítanos</p>
                                    <p className="text-sm font-medium italic text-gray-800 leading-relaxed">
                                        Ticuantepe, Managua, Nicaragua.<br />
                                        De la Gasolinera 2c al Sur.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de Correo Tradicional */}
                    <div className="bg-gray-50 p-8 md:p-12">
                        <h2 className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-10">Envíanos un Correo</h2>

                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 ml-1">Tu Nombre</label>
                                    <input
                                        type="text"

                                        className="w-full bg-transparent border-b border-gray-200 py-3 text-[11px] tracking-widest focus:border-[#DD8560] outline-none transition-colors uppercase"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 ml-1">Tu Email</label>
                                    <input
                                        type="email"
                                        placeholder="CORREO@EJEMPLO.COM"
                                        className="w-full bg-transparent border-b border-gray-200 py-3 text-[11px] tracking-widest focus:border-[#DD8560] outline-none transition-colors uppercase"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 ml-1">Tu Mensaje</label>
                                    <textarea
                                        placeholder="ESCRIBE AQUÍ LO QUE NECESITAS..."
                                        rows={4}
                                        className="w-full bg-transparent border-b border-gray-200 py-3 text-[11px] tracking-widest focus:border-[#DD8560] outline-none transition-colors resize-none uppercase"
                                    ></textarea>
                                </div>
                            </div>

                            <button className="w-full bg-black text-white py-5 text-[10px] tracking-[0.3em] uppercase hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 group">
                                <Send className="w-4 h-4 stroke-[1.5px] group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}