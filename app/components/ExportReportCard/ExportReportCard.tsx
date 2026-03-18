"use client";
import { FileDown, Table as TableIcon, Loader2, ChevronsRight, FileText } from "lucide-react";
import * as XLSX from 'xlsx';
import { useState } from "react";

export const ExportReportCard = ({ salesData }: { salesData: any[] }) => {
    const [exporting, setExporting] = useState<string | null>(null);

    const handleExport = async (format: 'excel' | 'csv') => {
        setExporting(format);
        try {
            // Priorizar salesData de las props, si no, intentar fetch (fallback)
            let data = salesData;

            if (!data || data.length === 0) {
                const response = await fetch('http://localhost:3001/api/sales/report');
                const result = await response.json();
                data = result.data || [];
            }

            if (data.length === 0) {
                alert("No hay datos cargados para exportar.");
                return;
            }

            // 2. Mapeo Profesional con Desglose de IVA
            const reportData = data.map((item: any) => {
                const total = Number(item.total_con_iva || item.total || 0);
                const subtotal = Number((total / 1.15).toFixed(2));
                const iva = Number((total - subtotal).toFixed(2));

                return {
                    "N° Factura": item.factura_id || item.id?.substring(0, 8).toUpperCase(),
                    "Fecha": item.fecha ? new Date(item.fecha).toLocaleDateString('es-NI') : 'N/A',
                    "Metodo Pago": item.payment_method || "Efectivo",
                    "Subtotal (C$)": subtotal,
                    "IVA 15% (C$)": iva,
                    "Total (C$)": total,
                    "Ganancia (C$)": Number(item.total_profit || item.utilidad_total || 0)
                };
            });

            // 3. Configuración de la Hoja
            const worksheet = XLSX.utils.json_to_sheet(reportData);

            // Ajuste de anchos de columna
            worksheet['!cols'] = [
                { wch: 18 }, // Factura
                { wch: 12 }, // Fecha
                { wch: 15 }, // Pago
                { wch: 15 }, // Subtotal
                { wch: 12 }, // IVA
                { wch: 15 }, // Total
                { wch: 15 }, // Ganancia
            ];

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas La Abuela");

            const extension = format === 'excel' ? '.xlsx' : '.csv';
            const filename = `Reporte_Ventas_${new Date().toISOString().split('T')[0]}${extension}`;

            XLSX.writeFile(workbook, filename, {
                bookType: format === 'excel' ? 'xlsx' : 'csv'
            });

        } catch (error) {
            console.error("Error al exportar:", error);
            alert("Error al generar el archivo.");
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <FileDown size={24}/>
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">Exportar Reportes</h3>
                    <p className="text-xs text-gray-400 font-medium italic">Historial contable y fiscal</p>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {/* Botón Excel */}
                <button
                    disabled={!!exporting}
                    onClick={() => handleExport('excel')}
                    className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-emerald-600 hover:text-white rounded-3xl transition-all group disabled:opacity-50"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl group-hover:bg-emerald-500 transition-colors shadow-sm">
                            <TableIcon size={20} className="text-emerald-600 group-hover:text-white"/>
                        </div>
                        <div className="text-left">
                            <span className="block text-sm font-bold">Reporte General</span>
                            <span className="text-[10px] uppercase font-black opacity-60">Formato Excel (.xlsx)</span>
                        </div>
                    </div>
                    {exporting === 'excel' ? <Loader2 className="animate-spin" size={18} /> : <ChevronsRight size={18} className="opacity-40 group-hover:opacity-100"/>}
                </button>

                <button
                    disabled={!!exporting}
                    onClick={() => handleExport('csv')}
                    className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-slate-800 hover:text-white rounded-3xl transition-all group disabled:opacity-50"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl group-hover:bg-slate-700 transition-colors shadow-sm">
                            <FileText size={20} className="text-slate-600 group-hover:text-white"/>
                        </div>
                        <div className="text-left">
                            <span className="block text-sm font-bold">Resumen Simple</span>
                            <span className="text-[10px] uppercase font-black opacity-60">Formato Plano (.csv)</span>
                        </div>
                    </div>
                    {exporting === 'csv' ? <Loader2 className="animate-spin" size={18} /> : <ChevronsRight size={18} className="opacity-40 group-hover:opacity-100"/>}
                </button>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed">
                    Nota: Los reportes incluyen desglose automático de IVA (15%) basado en el total facturado.
                </p>
            </div>
        </div>
    );
};