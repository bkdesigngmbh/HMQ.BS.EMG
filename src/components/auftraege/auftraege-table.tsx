"use client";

import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/shared/data-table";
import { AuftragStatusBadge } from "@/components/shared/status-badge";
import { FileText } from "lucide-react";
import type { Auftrag } from "@/types/database";

interface AuftraegeTableProps {
  auftraege: Auftrag[];
  isLoading?: boolean;
}

export function AuftraegeTable({ auftraege, isLoading = false }: AuftraegeTableProps) {
  const router = useRouter();

  const columns: Column<Auftrag>[] = [
    {
      header: "Auftragsnummer",
      accessorKey: "auftragsnummer",
      sortable: true,
      cell: (auftrag) => (
        <span className="font-mono font-medium">{auftrag.auftragsnummer}</span>
      ),
    },
    {
      header: "Auftragsort",
      accessorKey: "auftragsort",
      sortable: true,
      cell: (auftrag) => auftrag.auftragsort || "-",
    },
    {
      header: "Bezeichnung",
      accessorKey: "bezeichnung",
      sortable: true,
      cell: (auftrag) => (
        <span className="max-w-xs truncate block">
          {auftrag.bezeichnung || "-"}
        </span>
      ),
    },
    {
      header: "Status",
      sortable: true,
      sortFn: (a, b) => a.status.localeCompare(b.status, "de-CH"),
      cell: (auftrag) => (
        <AuftragStatusBadge status={auftrag.status} size="sm" />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={auftraege}
      isLoading={isLoading}
      emptyMessage="Keine Aufträge vorhanden"
      emptyDescription="Erstellen Sie einen neuen Auftrag, um zu beginnen."
      emptyIcon={<FileText className="h-6 w-6 text-muted-foreground" />}
      onRowClick={(auftrag) => router.push(`/auftraege/${auftrag.id}`)}
    />
  );
}
