"use client";

import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
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
      cell: (auftrag) => (
        <span className="font-mono font-medium">{auftrag.auftragsnummer}</span>
      ),
    },
    {
      header: "Auftragsort",
      cell: (auftrag) => auftrag.auftragsort || "-",
    },
    {
      header: "Bezeichnung",
      cell: (auftrag) => (
        <span className="max-w-xs truncate block">
          {auftrag.bezeichnung || "-"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (auftrag) => (
        <Badge variant={auftrag.status === "aktiv" ? "default" : "secondary"}>
          {auftrag.status === "aktiv" ? "Aktiv" : "Inaktiv"}
        </Badge>
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
      onRowClick={(auftrag) => router.push(`/auftraege/${auftrag.id}`)}
    />
  );
}
