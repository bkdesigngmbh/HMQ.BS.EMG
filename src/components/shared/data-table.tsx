"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "./loading-spinner";
import { EmptyState } from "./empty-state";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
}

type SortDirection = "asc" | "desc" | null;

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  emptyAction?: React.ReactNode;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "Keine Daten gefunden",
  emptyDescription,
  emptyIcon,
  emptyAction,
  onRowClick,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnIndex);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (sortColumn === null || sortDirection === null) {
      return data;
    }

    const column = columns[sortColumn];
    if (!column) return data;

    return [...data].sort((a, b) => {
      let comparison = 0;

      if (column.sortFn) {
        comparison = column.sortFn(a, b);
      } else if (column.accessorKey) {
        const aValue = a[column.accessorKey];
        const bValue = b[column.accessorKey];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          comparison = aValue.localeCompare(bValue, "de-CH");
        } else if (typeof aValue === "number" && typeof bValue === "number") {
          comparison = aValue - bValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else {
          comparison = String(aValue).localeCompare(String(bValue), "de-CH");
        }
      }

      return sortDirection === "desc" ? -comparison : comparison;
    });
  }, [data, sortColumn, sortDirection, columns]);

  if (isLoading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptyDescription}
        icon={emptyIcon}
      >
        {emptyAction}
      </EmptyState>
    );
  }

  const getSortIcon = (columnIndex: number) => {
    if (sortColumn !== columnIndex) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (sortDirection === "desc") {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className={cn(
                    column.className,
                    column.sortable && "cursor-pointer select-none hover:bg-muted/50"
                  )}
                  onClick={column.sortable ? () => handleSort(index) : undefined}
                >
                  <span className="flex items-center">
                    {column.header}
                    {column.sortable && getSortIcon(index)}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-muted/50"
                )}
              >
                {columns.map((column, index) => (
                  <TableCell key={index} className={column.className}>
                    {column.cell
                      ? column.cell(item)
                      : column.accessorKey
                      ? String(item[column.accessorKey] ?? "-")
                      : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
