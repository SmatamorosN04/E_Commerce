'use client'
import { useState, useMemo, useEffect } from 'react';
import {X, ChevronLeft, MapPin, Send, Loader2, MessageCircle} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // ¡IMPORTANTE IMPORTAR ESTE CSS!
import toast from 'react-hot-toast';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapControllerProps {
    position: L.LatLngExpression;
    setPosition: (pos: L.LatLngExpression) => void;
}

function MapController({ position, setPosition }: MapControllerProps) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, 16, { animate: true }); // Zoom más cercano al usar GPS
        }
    }, [position, map]);

    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },

        dragend() {
            const center = map.getCenter();
            setPosition(center);
        }
    });

    return <Marker position={position}></Marker>;
}


interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: any[];
    total: number;
}

export const CheckoutModal = ({ isOpen, onClose, cart, total }: CheckoutModalProps) => {
    const centroManagua: L.LatLngExpression = [12.1364, -86.2514];

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [mapPosition, setMapPosition] = useState<L.LatLngExpression>(centroManagua);
    const [formData, setFormData] = useState({
        nombre: '',
        whatsapp: '',
    });

    const obtenerUbicacionActual = () => {
        if (!navigator.geolocation) {
            toast.error("Tu navegador no soporta geolocalización");
            return;
        }

        toast.loading("Obteniendo ubicación...", { id: 'geo' });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const nuevaPos = { lat: latitude, lng: longitude };
                setMapPosition(nuevaPos);
                toast.success("Ubicación encontrada", { id: 'geo' });
            },
            (error) => {
                console.error(error);
                toast.error("No se pudo obtener la ubicación. Por favor, selecciónala manualmente.", { id: 'geo' });
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
    };
    if (!isOpen) return null;

    const handleNext = () => {
        if (!formData.nombre || !formData.whatsapp) {
            toast.error("Por favor llena Nombre y WhatsApp");
            return;
        }
        setStep(2);
    };
    const handleBack = () => setStep(1);


    // --- FUNCIÓN FINAL: Generar Mensaje de WhatsApp ---
    const handleFinalizarPedido = () => {
        setLoading(true);
        // El formato de coordenadas lat/lng de Leaflet
        const { lat, lng } = mapPosition as L.LatLngLiteral;

        // Creamos un link de Google Maps con las coordenadas precisas
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        // Generamos el mensaje formateado para Nicaragua
        const itemsMsg = cart.map(item => `- ${item.quantity}x ${item.name}`).join('%0A');
        const mensaje = `Hola *Repuestos La Abuela*!%0A%0ASoy ${formData.nombre}. Quiero confirmar mi pedido:%0A%0A*Detalle del Carrito:*%0A${itemsMsg}%0A%0A*Total: $${total.toFixed(2)}*%0A%0A* Ubicación Precisa:*%0A${googleMapsUrl}%0A%0A(Mi WhatsApp: ${formData.whatsapp})`;

        const numeroWhatsApp = '50587731532';

        setTimeout(() => {
            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, '_blank');
            toast.success("PEDIDO GENERADO. CONTACTANDO POR WHATSAPP...");
            setLoading(false);
            onClose();
            setStep(1);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md border border-black overflow-hidden flex flex-col h-[650px] transition-all animate-in fade-in zoom-in-95 duration-200">

                <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
                    {step === 2 && (
                        <button onClick={handleBack} className="hover:text-[#DD8560] transition-colors p-2 -ml-2">
                            <ChevronLeft className="w-5 h-5 text-gray-500" />
                        </button>
                    )}
                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-900 flex-grow text-center">
                        {step === 1 ? 'Datos de Contacto' : 'Ubica tu casa en el Mapa'}
                    </h2>
                    <button onClick={onClose} className="p-2 -mr-2 hover:rotate-90 transition-transform">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="flex-grow flex flex-col">

                    {step === 1 && (
                        <div className="p-8 space-y-8 flex-grow animate-in slide-in-from-left duration-300">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 border-l-2 border-[#DD8560] pl-3">
                                Para iniciar, necesitamos contactarte para coordinar el pago y el delivery en Managua.
                            </p>

                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-gray-400">Nombre Completo</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.nombre}
                                    placeholder="Ej: Sergio López"
                                    className="w-full border-b border-gray-200 py-3 focus:border-black outline-none text-sm transition-colors"
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1 pt-2">
                                <label className="text-[9px] uppercase tracking-widest text-gray-400">WhatsApp / Teléfono</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.whatsapp}
                                    placeholder="8888-8888"
                                    className="w-full border-b border-gray-200 py-3 focus:border-black outline-none text-sm transition-colors"
                                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                                />
                            </div>

                            <div className="pt-8 mt-auto flex-shrink-0">
                                <button
                                    onClick={handleNext}
                                    className="w-full border border-black py-4 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all font-medium"
                                >
                                    <MapPin className="w-3 h-3 text-gray-600" />
                                    Continuar a la Ubicación
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 relative">
                            <button
                                onClick={obtenerUbicacionActual}
                                className="absolute bottom-24 right-4 z-[50] bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all"
                                title="Usar mi ubicación actual"
                            >
                                <MapPin className="w-5 h-5 text-[#DD8560]" />
                            </button>
                            <div className="absolute top-4 left-4 right-4 z-10 bg-black/70 text-white p-3 backdrop-blur-sm">
                                <p className="text-[8px] uppercase tracking-[0.2em] text-center">
                                    Haz clic o arrastra para mover el <span className='text-[#DD8560]'>PIN</span> a tu casa.
                                </p>
                            </div>

                            <div className="flex-grow bg-gray-50 relative">
                                <MapContainer
                                    center={centroManagua}
                                    zoom={14} // Zoom ideal para ver calles de Managua
                                    scrollWheelZoom={true}
                                    style={{ height: '100%', width: '100%' }}
                                    className='z-0' // Z-index bajo para que los modales queden encima
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <MapController position={mapPosition} setPosition={setMapPosition} />
                                </MapContainer>
                            </div>

                            <div className="p-6 border-t border-gray-100 flex-shrink-0">
                                <button
                                    onClick={handleFinalizarPedido}
                                    disabled={loading}
                                    className="w-full h-14 bg-black text-white flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] hover:bg-[#1a1a1a] transition-all disabled:opacity-50 font-semibold group"
                                >
                                    <MessageCircle className="w-5 h-5 fill-white" />
                                    Proceder a whatsapp
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};