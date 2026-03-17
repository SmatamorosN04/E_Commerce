'use client';
import {Bell} from "lucide-react";

interface Alert {
    product_name: string;
    sku: string;
    stock: number;
    deficit: number;
}

export const StockAlertBadge = ({alerts }: {alerts: Alert[]}) => {
    const count = alerts.length;

    return (
        <div className="relative group cursor-pointer">
            <Bell className={`w-5 h-5 ${count > 0 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}/>
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-4 h-4 rpounded-full flex items-center font-bold">
                    {count}
                </span>
            )}

            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 shadow-xl rounded-sm p-4 hidden group-hover:block z-50">
                <h4 className="max-h-40 overflow-y-auto">
                   <div className="max-h-40 overflow-y-auto">
                       {alerts.map((alert) => (
                           <div key={alert.sku} className="mb-2 last:mb-0">
                               <p className="text-[10px] font-medium uppercase">{alert.product_name}</p>
                               <div className="flex justify-between text-[9px] text-gray-400">
                                   <span>SKU: {alert.sku}</span>
                                   <span className="text-red-500">Quedan: {alert.stock}</span>
                               </div>
                           </div>
                       ))}
                   </div>
                </h4>
            </div>
        </div>
    )
}