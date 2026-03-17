'use client'
import { useState, useEffect } from "react";
import { AdminSidebar } from "@/app/components/AdminSidebar/AdminSidebar";
import { ExportReportCard } from "../../components/ExportReportCard/ExportReportCard";
import { DataTable } from "../../components/DataTable/DataTable"
import {
    Activity, ShoppingCart, ArrowDownCircle,
    ArrowUpCircle, List, Loader2, Clock, AlertCircle, CheckCircle2
} from "lucide-react";

export default function HistoryPage() {
    const [activeTab, setActiveTab] = useState<'ventas' | 'compras' | 'logs'>('ventas');
    const [sales, setSales] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hacemos ambos fetch al mismo tiempo para ahorrar tiempo
                const [resSales, resLogs] = await Promise.all([
                    fetch('http://localhost:3001/api/reports/sales'),
                    fetch('http://localhost:3001/api/logs')
                ]);

                const dataSales = await resSales.json();
                const dataLogs = await resLogs.json();

                setSales(Array.isArray(dataSales) ? dataSales : []);
                setLogs(Array.isArray(dataLogs) ? dataLogs : []);
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- CONFIGURACIÓN DE COLUMNAS PARA LOGS ---
// Configuración de Columnas para los logs de INVENTARIO
    const logsColumns = [
        {
            header: 'Movimiento',
            accessor: 'action', // El alias que pusimos en el SQL (type AS action)
            render: (val: string) => {
                const colors: { [key: string]: string } = {
                    'Entrada': 'bg-emerald-100 text-emerald-700',
                    'Salida': 'bg-rose-100 text-rose-700',
                    'Venta': 'bg-blue-100 text-blue-700',
                    'Ajuste': 'bg-amber-100 text-amber-700'
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${colors[val] || 'bg-gray-100 text-gray-600'}`}>
                    {val}
                </span>
                );
            }
        },
        {
            header: 'Descripción',
            accessor: 'description',
            render: (val: string) => <span className="font-medium text-gray-700">{val || "Sin descripción"}</span>
        },
        {
            header: 'Cant.',
            accessor: 'quantity',
            align: 'right' as const,
            render: (val: number, item: any) => (
                <span className={`font-black ${item.action === 'Entrada' ? 'text-emerald-600' : 'text-gray-900'}`}>
                {item.action === 'Entrada' ? '+' : '-'}{val}
            </span>
            )
        },
        {
            header: 'Fecha',
            accessor: 'created_at',
            align: 'right' as const,
            render: (val: string) => (
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-600">{new Date(val).toLocaleDateString()}</span>
                    <span className="text-[10px] text-gray-400 font-medium italic">{new Date(val).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            )
        }
    ];
    // --- COLUMNAS PARA VENTAS (Igual que antes) ---
    const salesColumns = [
        { header: 'Factura', accessor: 'factura', render: (val: any) => <span className="font-bold text-gray-900">#{val?.substring(0, 8).toUpperCase()}</span> },
        { header: 'Fecha', accessor: 'fecha', render: (val: any) => <span>{new Date(val).toLocaleDateString()}</span> },
        { header: 'Total', accessor: 'total', align: 'right' as const, render: (val: any) => <span className="font-black">C$ {Number(val).toLocaleString()}</span> },
        { header: 'Utilidad', accessor: 'utilidad_total', align: 'right' as const, render: (val: any) => <span className="font-black text-emerald-600">C$ {Number(val).toLocaleString()}</span> }
    ];

    const totalVentas = sales.reduce((acc, curr) => acc + Number(curr.total || 0), 0);
    const totalUtilidad = sales.reduce((acc, curr) => acc + Number(curr.utilidad_total || 0), 0);

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            <AdminSidebar />
            <main className="flex-1 p-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Ingresos</p>
                        <h2 className="text-3xl font-black text-gray-900 mt-1 italic">C$ {totalVentas.toLocaleString()}</h2>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Utilidad</p>
                        <h2 className="text-3xl font-black text-emerald-600 mt-1">C$ {totalUtilidad.toLocaleString()}</h2>
                    </div>
                    <ExportReportCard salesData={sales} />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-2xl w-fit">
                    {(['ventas', 'compras', 'logs'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all capitalize ${
                                activeTab === tab ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-800'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Main Table Content */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-[500px]">
                            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Obteniendo registros...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'ventas' && <DataTable columns={salesColumns} data={sales} emptyMessage="No hay ventas registradas" />}
                            {activeTab === 'compras' && (
                                <div className="p-20 text-center text-gray-400 font-medium italic">
                                    <ShoppingCart className="mx-auto mb-4 opacity-10" size={64}/>
                                    Próximamente: Historial de Compras a Proveedores
                                </div>
                            )}
                            {activeTab === 'logs' && <DataTable columns={logsColumns} data={logs} emptyMessage="No hay actividad en el sistema" />}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}