import React from "react";
import { ArrowDownNarrowWide, ArrowUpWideNarrow, ArrowDownUp } from "lucide-react";
import Pagination from "./Pagination";

interface TableColumn {
  key: string;
  label?: string;
  header?: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  className?: string;
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  onSort?: (key: string) => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

const Table = ({ columns, data, className = "", sortConfig, onSort, pagination, emptyMessage }: TableProps & { emptyMessage?: string }) => {
  return (
    <div className={`flex flex-col overflow-y-auto ${className}`}>
      <div className="shadow-md mt-2 rounded-xl">
        <table className="w-full border-separate border-spacing-0 ">
          <thead className="bg-primary">
            <tr className="bg-primary border-accent border-b-2">
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 font-semibold text-white text-sm text-left uppercase tracking-wide ${
                    column.sortable && onSort ? 'cursor-pointer hover:bg-secondary transition-colors' : ''
                  } ${
                    index === 0 ? 'rounded-tl-xl' : ''
                  } ${
                    index === columns.length - 1 ? 'rounded-tr-xl' : ''
                  }`}
                  onClick={() => column.sortable && onSort && onSort(column.key)}
                >
                  <div className="flex justify-between items-center">
                    <span className="whitespace-nowrap">{column.label || column.header}</span>
                    {column.sortable && onSort && (
                      <div className="flex flex-col ml-2">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowDownNarrowWide size={18} className="text-white" />
                          ) : (
                            <ArrowUpWideNarrow size={18} className="text-white" />
                          )
                        ) : (
                          <ArrowDownUp size={18} className="text-white/50" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-background">
            {!data || data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="hover:bg-gray-200 px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage || 'No data available'}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-200 transition-colors duration-200"
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={column.key} 
                      className={`px-6 py-3 text-gray-700 text-sm border-b border-gray-200 ${
                        index === data.length - 1 ? 'border-b-0' : ''
                      } ${
                        index === data.length - 1 && colIndex === 0 ? 'rounded-bl-xl' : ''
                      } ${
                        index === data.length - 1 && colIndex === columns.length - 1 ? 'rounded-br-xl' : ''
                      }`}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
};

export default Table;