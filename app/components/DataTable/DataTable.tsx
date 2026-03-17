interface Column {
    header: string;
    accessor: string;
    align?: 'left' | 'right';
    render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    emptyMessage?: string;
}

export const DataTable = ({ columns, data, emptyMessage = "No hay registro"}: DataTableProps) => {
    if (data.length === 0) {
        return (
            <div className="p-20 text-center text-gray-400 italic font-medium">
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                            key={index}
                            className={`px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest ${col.align === 'right' ? 'text-right' : ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="duivide-y divide-gray-50">
                {data.map((item, rowIndex) => (
                    <tr key={item.id || rowIndex} className="hover:bg-gray-50/50 transition-colors group">
                        {columns.map((col, colIndex) => (
                            <td
                            key={colIndex}
                            className={`px-8 py-5 text-sm ${col.align === 'right' ? 'text-right' : ''}`}
                            >
                                {col.render
                                ? col.render(item[col.accessor], item)
                                : (item[col.accessor] || '---')}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
