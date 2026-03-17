import {ArrowDownRight, ArrowRight} from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    change: string;
    isPositive?: boolean;
    icon: React.ReactNode;
}

export const StatCards = ({ title, value, change, isPositive = true, icon}: StatCardProps) => {
    return (
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="p3 bg-gray-50 rounded-2xl border border-gray-50 text-gray-600">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                    isPositive ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'
                }`}>
                    {isPositive ? <ArrowRight size={12}/> : <ArrowDownRight size={12}/>}
                    {change}
                </div>
            </div>
            <div >
                <p className="text-xs font-bold text-rgay-400 uppercase tracking-wider">{title}</p>
                <h2 className="text-2xl font-black text-gray-900 mt-1">{value}</h2>
            </div>
        </div>
    )
}