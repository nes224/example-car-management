import type { ReactNode } from "react"

export type Column<T> = {
    header: string
    render: (row: T) => ReactNode
}

type Props<T> = {
    columns: Column<T>[]
    rows: T[]
    rowKey: (row: T) => string | number
    loading?: boolean

}

export default function DataTable<T>({ columns, rows, rowKey, loading = false }: Props<T>) {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-center text-medium">
                <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.header} className="px-4 py-3 font-medium">
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td>
                                กำลังโหลด...
                            </td>
                        </tr>
                    ): rows.length === 0 ? (
                        <tr>
                            <td>
                                ไม่มีข้อมูล
                            </td>
                        </tr>
                    ): (
                        rows.map((row) => (
                            <tr key={rowKey(row)} className="border-t border-gray-300">
                                {columns.map((col) => (
                                    <td key={col.header} className="px-3 py-1">
                                        {col.render(row)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}