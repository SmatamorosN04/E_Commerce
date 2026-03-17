import {FileDown, Calendar, Table as TableIcon, Loader2, ChevronsRight, FileText, Loader} from "lucide-react";
import * as XLSX from 'xlsx';
import {useState} from "react";

export const ExportReportCard = ( { salesData}: {salesData: any[]}) => {
  const [exporting, setExporting] = useState<string | null>(null);


    const handleExport = async (format: 'excel' | 'csv')=> {
       setExporting(format)
        try {
           const response = await fetch('http://localhost:3001/api/reports/sales');
           const data = await response.json();

           if (!data || data.length === 0){
               alert("No hay datos para exporotar en este periodo");
               return
           }

           const reportData = data.map((item: any) =>({
               "Numero de Factura": item.factura,
               "Fecha": new Date(item.fecha).toLocaleDateString('es-NI'),
               "cliente": item.cliente,
               "Metodo de pago": item.pago,
               "Total (C$)": item.total,
               "Utilidad Real (C$)": item.utilidad_total,
           }));

           const worksheet = XLSX.utils.json_to_sheet(reportData);
           const workbook = XLSX.utils.book_new();
           XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas generadas");

           const filename = `Reporte_Ventas_${new Date().toISOString().split('T')[0]}`;

           if( format === 'excel') {
               XLSX.writeFile(workbook, `${filename}.xlsx`);
           } else {
               XLSX.writeFile(workbook, `${filename}.csv`, { bookType: 'csv'});
           }
        }catch (error) {
            console.error("Error al exportar:", error);
            alert("Error al conectar con el servidor de reportes");
        } finally {
            setExporting(null);
        }
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
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
                            <span className="text-[10ox] uppercase font-black opacity-60">Formato de Excel</span>
                        </div>
                    </div>
                    {exporting === 'excel' ? <Loader2 className="animate-spin " size={18} /> : <ChevronsRight size={18} className="opacity-40 group-hover:opacity-100"/>}
                </button>

                <button
                disabled={!!exporting}
                onClick={() => handleExport('csv')}
                className="w-full flex items-center justify-between p-5 bg-gary-50 hover:bg-blue-600 hover:text-white rounded-3xl transition-all group disabled:opacity-50"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-xl group-hover:bg-emerald-500 transition-colors">
                            <FileText size={20} className="text-emerald-600 group-hover:text-white"/>
                        </div>
                        <div className="text-left">
                            <span className="block text-sm font-bold">Resumen Simple</span>
                            <span className="text-[10ox] uppercase font-black opacity-60">Formato .CSV</span>
                        </div>
                    </div>
                    {exporting === 'csv' ? <Loader2 className="animate-spin" size={18} /> : <ChevronsRight size={18} className="opacity-40 group-hover:opacity-100"/>}
                </button>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 ">
                <p className="text-[10px] text-amber-700 font-bolf leading-relaxed ">
                    Los arhivos generados incluyen calculos de precio automatizado y margen de utilidad por transaccion
                </p>
            </div>
        </div>
    )

}