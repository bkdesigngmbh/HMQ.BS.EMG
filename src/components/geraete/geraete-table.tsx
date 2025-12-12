"use client";

import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Box } from "lucide-react";
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
      accessorKey: "name",
      sortable: true,
      cell: (geraet) => (
        <span className="font-medium">{geraet.name}</span>
      ),
    },
    {
      header: "Client",
      accessorKey: "client",
      sortable: true,
      cell: (geraet) => geraet.client || "-",
    },
    {
      header: "Seriennummer",
      accessorKey: "seriennummer",
      sortable: true,
    },
    {
      header: "Geräteart",
      sortable: true,
      sortFn: (a, b) => {
        const aName = a.geraeteart?.bezeichnung || "";
        const bName = b.geraeteart?.bezeichnung || "";
        return aName.localeCompare(bName, "de-CH");
      },
      cell: (geraet) => geraet.geraeteart?.bezeichnung || "-",
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
      header: "Status",
      sortable: true,
      sortFn: (a, b) => {
        const aName = a.status?.bezeichnung || "";
        const bName = b.status?.bezeichnung || "";
        return aName.localeCompare(bName, "de-CH");
      },
      cell: (geraet) =>
        geraet.status ? (
          <StatusBadge status={geraet.status.bezeichnung} color={geraet.status.farbe} />
        ) : (
          "-"
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={geraete}
      isLoading={isLoading}
      emptyMessage="Keine Geräte vorhanden"
      emptyDescription="Erstellen Sie ein neues Gerät, um zu beginnen."
      emptyIcon={<Box className="h-6 w-6 text-muted-foreground" />}
      onRowClick={(geraet) => router.push(`/geraete/${geraet.id}`)}
    />
  );
}
