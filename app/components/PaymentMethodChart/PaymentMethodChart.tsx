
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MoreHorizontal } from "lucide-react";

const COLORS = ['#2563eb', '#fbbf24', '#10b981', '#8b5cf6'];

export const PaymentMethodChart = ({ data, total }: { data: any[], total: number }) => (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Ventas por origen</h3>
            <MoreHorizontal className="text-gray-300 cursor-pointer" />
        </div>

        <div className="relative flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} innerRadius={75} outerRadius={95} paddingAngle={8} dataKey="value" cornerRadius={10}>
                        {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-gray-900">{total.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Ventas Totales</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
            {data.map((item, idx) => (
                <div key={item.name} className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-[11px] font-bold text-gray-400 uppercase">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900 ml-4">{item.percentage}%</span>
                </div>
            ))}
        </div>
    </div>
);