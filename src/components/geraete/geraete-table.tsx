"use client";

import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import type { Geraet, Geraeteart, Geraetestatus } from "@/types/database";

type GeraetMitRelationen = Geraet & {
  geraeteart: Geraeteart | null;
  status: Geraetestatus | null;
};

interface GeraeteTableProps {
  geraete: GeraetMitRelationen[];
  isLoading?: boolean;
}

export function GeraeteTable({ geraete, isLoading = false }: GeraeteTableProps) {
  const router = useRouter();

  const columns: Column<GeraetMitRelationen>[] = [
    {
      header: "Name",
      cell: (geraet) => (
        <span className="font-medium">{geraet.name}</span>
      ),
    },
    {
      header: "Seriennummer",
      accessorKey: "seriennummer",
    },
    {
      header: "Eigentum",
      cell: (geraet) => (
        <Badge variant={geraet.eigentum === "eigen" ? "default" : "secondary"}>
          {geraet.eigentum === "eigen" ? "Eigen" : "Miete"}
        </Badge>
      ),
    },
    {
      header: "Geräteart",
      cell: (geraet) => geraet.geraeteart?.name || "-",
    },
    {
      header: "Status",
      cell: (geraet) =>
        geraet.status ? (
          <StatusBadge status={geraet.status.name} color={geraet.status.farbe} />
        ) : (
          "-"
        ),
    },
    {
      header: "Client",
      cell: (geraet) => geraet.client || "-",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={geraete}
      isLoading={isLoading}
      emptyMessage="Keine Geräte vorhanden"
      emptyDescription="Erstellen Sie ein neues Gerät, um zu beginnen."
      onRowClick={(geraet) => router.push(`/geraete/${geraet.id}`)}
    />
  );
}
