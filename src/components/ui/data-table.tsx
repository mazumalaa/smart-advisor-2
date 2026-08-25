import * as React from "react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
}

export function DataTable<T>({ data, columns, className }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-gray-200 bg-surface", className)}>
      <table className="w-full text-left text-sm text-muted">
        <thead className="bg-gray-50 text-xs uppercase border-b border-gray-200">
          <tr>
            {columns.map((col, idx) => (
              <th key={String(col.key) + idx} className="px-6 py-4 font-semibold text-foreground">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center">
                Tidak ada data.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="hover:bg-gray-50/50 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td key={String(col.key) + colIndex} className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                    {col.render ? col.render(row) : String(row[col.key as keyof T])}
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
