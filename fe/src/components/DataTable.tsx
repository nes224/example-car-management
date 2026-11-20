import type { ReactNode } from "react"

export type Column<T> = {
    header: string
    render: (row: T) => ReactNode
}

type Props<T> = {
    columns: Column<T>[]
    rows: T[]
    rowKey: (row: T) => string | number

}

export default function DataTable<T>({ columns, rows, rowKey }: Props<T>) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={rowKey(row)}>
                            {columns.map((col) => (
                                <td key={col.header}>

                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}