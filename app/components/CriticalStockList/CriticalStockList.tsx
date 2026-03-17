import {Package} from "lucide-react";

export const CriticalStockList = ({ items }: { items: any[] }) => (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-8 tracking-tight">Stock Crítico</h3>
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.sku} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                        <Package className="w-7 h-7 text-blue-500" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-base font-bold text-gray-900 leading-tight">{item.product_name}</h4>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">{item.sku} • {item.variant_name}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black text-rose-500">{item.stock}</p>
                        <p className="text-[10px] text-gray-300 font-bold uppercase italic">Unidades</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);