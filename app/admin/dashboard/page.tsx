'use client'
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/app/components/AdminSidebar/AdminSidebar";
import { TrendingUp, AlertTriangle, DollarSign, PackageCheck, ArrowUpRight, Loader2 } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function DashboardPage() {
    // 1. Definición de estados (Siempre al principio)
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({
        totalInventoryValue: 0,
        monthlySales: 0,
        lowStockItems: [],
        salesHistory: []
    });

    // 2. Efecto de carga de datos
    useEffect(() => {
        setIsClient(true); // Marcamos que ya estamos en el cliente

        const fetchDashboardData = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/dashboard/stats');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("DEBUG -> Error en fetch:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // 3. LA LÍNEA CRÍTICA (33-45): Validación de renderizado
    // Solo permitimos el renderizado si ya estamos en el cliente
    if (!isClient) return null;

    // Si aún está cargando, mostramos el spinner dentro del layout para evitar saltos visuales
    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50/50">
                <AdminSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
            </div>
        );
    }

    // 4. Renderizado Final (Solo ocurre cuando isClient=true y loading=false)
    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <AdminSidebar />
            <main className="flex-1 p-6 md:p-12 pt-20 lg:pt-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-xl uppercase tracking-[0.4em] font-light text-gray-900">Panel de Control</h1>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Repuestos La Abuela — Insights en tiempo real</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* KPI 1 */}
                        <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Valor de Inventario</p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                C$ {Number(data?.totalInventoryValue || 0).toLocaleString()}
                            </h2>
                        </div>

                        {/* KPI 2 */}
                        <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Ventas del Mes</p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                C$ {Number(data?.monthlySales || 0).toLocaleString()}
                            </h2>
                        </div>

                        {/* KPI 3 */}
                        <div className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm border-l-4 border-l-amber-400">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 text-amber-600">Stock Crítico</p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {data?.lowStockItems?.length || 0} SKU's
                            </h2>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}