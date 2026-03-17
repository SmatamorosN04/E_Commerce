import {FileDown, Calendar, Table as TableIcon, Loader2, ChevronsRight, FileText, Loader} from "lucide-react";
import * as XLSX from 'xlsx';
import {useState} from "react";

export const ExportReportCard = ( { salesData}: {salesData: any[]}) => {
  const [exporting, setExporting] = useState<string | null>(null);


    const handleExport = async (format: 'excel' | 'csv') => {
        setExporting(format);
        try {
            const response = await fetch('http://localhost:3001/api/reports/sales');
            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                alert("No hay datos para exportar");
                return;
            }

            // 1. Mapeo Sincronizado con tus Alias de SQL (factura, fecha, total, utilidad_total)
            const reportData = data.map((item: any) => ({
                "N° Factura": item.factura || item.id?.substring(0, 8).toUpperCase(),
                "Fecha": item.fecha ? new Date(item.fecha).toLocaleDateString('es-NI') : 'N/A',
                "Cliente": item.cliente || "Consumidor Final",
                "Pago": item.pago || "Efectivo",
                "Total (C$)": Number(item.total || 0),
                "Ganancia (C$)": Number(item.utilidad_total || 0)
            }));

            const worksheet = XLSX.utils.json_to_sheet(reportData);

            const columnWidths = [
                { wch: 15 }, // Factura
                { wch: 12 }, // Fecha
                { wch: 20 }, // Cliente
                { wch: 12 }, // Pago
                { wch: 15 }, // Total
                { wch: 15 }, // Ganancia
            ];
            worksheet['!cols'] = columnWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas La Abuela");

            const extension = format === 'excel' ? '.xlsx' : '.csv';
            const filename = `Reporte_Ventas${new Date().toISOString().split('T')[0]}${extension}`;

            XLSX.writeFile(workbook, filename, {
                bookType: format === 'excel' ? 'xlsx' : 'csv',
                type: 'binary'
            });

        } catch (error) {
            console.error("Error al exportar:", error);
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <FileDown size={24}/>
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">Exportar Reportes </h3>
                    <p className="text-xs text-gray-400 font-medium italic">Historial contable</p>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                <button
                disabled={!!exporting}
                onClick={() => handleExport('excel')}
                className="w-full items-center justify-between p-5 bg-gray-50 hover:bg-emerald-600 hover:text-white rounded-3xl transition-all group disabled:opacity-50"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl group-hover:bg-emerald-500 transition-colors">
                            <TableIcon size={20} className="text-emerald-600 group-hover:text-white"/>
                        </div>
                        <div className="text-left">
                            <span className="block text-sm font-bold">Reporte General</span>
                            <span className="text-[10px] uppercase font-black opacity-60">Formato de Excel</span>
                        </div>
                    </div>
                    {exporting === 'excel' ? <Loader2 className="animate-spin " size={18} /> : <ChevronsRight size={18} className="opacity-40 group-hover:opacity-100"/>}
                </button>

                <button
                disabled={!!exporting}
                onClick={() => handleExport('csv')}
                className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-blue-600 hover:text-white rounded-3xl transition-all group disabled:opacity-50"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl group-hover:bg-emerald-500 transition-colors">
                            <FileText size={20} className="text-emerald-600 group-hover:text-white"/>
                        </div>
                        <div className="text-left">
                            <span className="block text-sm font-bold">Resumen Simple</span>
                            <span className="text-[10px] uppercase font-black opacity-60">Formato .CSV</span>
                        </div>
                    </div>
                    {exporting === 'csv' ? <Loader2 className="animate-spin" size={18} /> : <ChevronsRight size={18} className="opacity-40 group-hover:opacity-100"/>}
                </button>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 ">
                <p className="text-[10px] text-amber-700 font-bold leading-relaxed ">
                    Los arhivos generados incluyen calculos de precio automatizado y margen de utilidad por transaccion
                </p>
            </div>
        </div>
    )

}