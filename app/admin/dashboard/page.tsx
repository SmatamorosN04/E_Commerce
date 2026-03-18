'use client'
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/app/components/AdminSidebar/AdminSidebar";
import {
    Loader2, Plus, Calendar, Package, ShoppingCart,
    TrendingUp, DollarSign, Download, Settings, Bell
} from "lucide-react";

import { StatCards } from "@/app/components/StatCard/StatCard";
import { PerformanceChart } from "@/app/components/PerformanceChart/PerformanceChart";
import { PaymentMethodChart } from "@/app/components/PaymentMethodChart/PaymentMethodChart";
import { InventoryTable } from "@/app/components/InventoryTable/InventoryTable";
import { ExportReportCard } from "@/app/components/ExportReportCard/ExportReportCard";
import { TopProductsTable } from "@/app/components/TopProductTable/TopProductTable";
import Link from "next/dist/client/link";

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const totalSales = data?.salesHistory?.reduce((acc: number, day: any) => acc + (Number(day.sales) || 0), 0) || 0;
    const totalProfit = data?.salesHistory?.reduce((acc: number, day: any) => acc + (Number(day.profit) || 0), 0) || 0;

    const marginPercentage = totalSales > 0
        ? ((totalProfit / totalSales) * 100).toFixed(1)
        : "0.0";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/dashboard/stats');
                const result = await res.json();
                console.dir(result);
                setData(result);
            } catch (err) {
                console.error("Error al cargar datos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) return (
        <div className="flex h-screen items-center justify-center bg-[#F9FAFB]">
            <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-sm font-bold text-gray-500 animate-pulse">Cargando métricas de La Abuela...</p>
            </div>
        </div>
    );



    return (
        <div className="flex min-h-screen bg-[#F9FAFB] font-sans selection:bg-blue-100">
            <AdminSidebar />

            <main className="flex-1 p-6 md:p-10 max-w-400 mx-auto">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            Sistema en tiempo real
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard Central</h1>
                        <p className="text-base text-gray-400 font-medium mt-1">
                            Bienvenido, <span className="text-gray-900 font-bold">Sergio Matamoros</span>. Revisa el estado de tu negocio.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all">
                            <Calendar size={18} className="text-gray-400" />
                            {new Date().toLocaleDateString('es-NI', { month: 'short', year: 'numeric' })}
                        </button>
                        <button className="p-3 bg-white border border-gray-200 text-gray-400 rounded-2xl hover:text-blue-600 transition-all">
                            <Bell size={22} />
                        </button>
                        <Link href={'/admin/sales'} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                            <Plus size={22} strokeWidth={3} />
                            <span className="font-bold">Nueva Venta</span>
                        </Link>
                    </div>
                </header>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <StatCards
                        title="Valor Inventario"
                        value={`C$ ${Number(data?.totalInventoryValue || 0).toLocaleString('es-NI')}`}
                        change="Stock Actual"
                        icon={<Package size={22} />}
                    />

                    <StatCards
                        title="Ventas Mensuales"
                        value={`C$ ${(totalSales || 0).toLocaleString('es-NI')}`}
                        change={`En los últimos ${data?.salesHistory?.length || 0} días`}
                        icon={<ShoppingCart size={22} />}
                    />

                    <StatCards
                        title="Ganancia Real"
                        value={`C$ ${(data.monthlyProfit || 0).toLocaleString('es-NI')}`}
                        change={`${((data?.monthlyProfit / data?.monthlySales) * 100 || 0).toFixed(1)}% de margen`}icon={<TrendingUp size={22} />}
                        isPositive={parseFloat(marginPercentage) > 0}
                    />


                    <StatCards
                        title="Productos Críticos"
                        value={data.lowStockItems.length}
                        change={data.lowStockItems.length > 0 ? "Atención" : "Todo bien"}
                        icon={<DollarSign size={22} />}
                        isPositive={data.lowStockItems.length === 0}
                    />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                    <div className="lg:col-span-2 bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <PerformanceChart data={data.salesHistory} />
                    </div>
                    <div className="lg:col-span-1">
                        <PaymentMethodChart
                            data={data.paymentStats}
                            total={data.monthlySales}
                        />
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                    <div className="lg:col-span-2">
                        <TopProductsTable items={data.topProducts || []} />
                    </div>
                    <div className="lg:col-span-1">
                        <ExportReportCard salesData={[]} />
                    </div>
                </section>

                <section className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-xl font-black text-gray-900">Items en Alerta de Stock</h3>
                        <button className="text-blue-600 text-sm font-bold hover:underline">Ver todo el inventario</button>
                    </div>
                    <InventoryTable
                        variants={data.lowStockItems}
                        onAdjust={(variant) => console.log("Ajuste", variant)}
                    />
                </section>
            </main>
        </div>
    );
}