import { Award, TrendingUp, DollarSign} from "lucide-react";

interface TopProduct {
    name:string;
    variant_name: string;
    cantidad_vendida: number;
    ingresos_totales: number;
    margen_total: number;
}

export const TopProductsTable = ({ items }: { items: TopProduct[]}) => {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 border- border-gray-100 shadow-sm h-full">
            <div className="flex justify-between  items-center mb-8 ">
                <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Top Productos</h3>
                    <p className="text-xs text-gray-400 font-medium"> Basado en el margen de utiliddad neta </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Award size={24}/>
                </div>
            </div>

            <div className="overflox-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left">
                            <th className="pb-4 text-[10px] uppercase tracking-widest text-gray-400 font-black" >Producto</th>
                            <th className="pb-4 text-[10px] uppercase tracking-widest text-gray-400 font-black text-center">Ventas</th>
                            <th className="pb-4 text-[10px] uppercase tracking-widest text-gray-400 font-black text-right">Ingresos</th>
                            <th className="pb-4 text-[10px] uppercase tracking-widest text-gray-400 font-black text-right">Margen Real</th>
                        </tr>
                    </thead>
                        <tbody className="divide-y divide-gray-50">
                        {items.map((product, index) => (
                            <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-500 font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-none">{product.name}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 font-medium italic">{product.variant_name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-center">
                                    <span className="text-xs font-black text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                                        {product.cantidad_vendida}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <p className="text-xs font-bold text-gray-900">C$ {Number(product.ingresos_totales).toLocaleString()}</p>
                                </td>

                                <td className="py-4 text-right">
                                   <div className="flex items-center justify-en gap-1.5 text-emerald-600">
                                       <TrendingUp size={14}/>
                                       <p className="text-sm font-black">C${Number(product.margen_total).toLocaleString()}</p>
                                   </div>
                                </td>
                           </tr>
                        ))}
                        </tbody>
                </table>
            </div>
            {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10">
                    <p className="text-sm text-gray-400 font-medium italic"> No hay datos de ventas aun.</p>
                </div>
            )}
        </div>
    )
}