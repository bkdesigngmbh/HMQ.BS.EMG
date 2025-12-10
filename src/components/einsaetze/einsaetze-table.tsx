"use client";

import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
interface EinsaetzeTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  einsaetze: any[];
  isLoading?: boolean;
}

export function EinsaetzeTable({
  einsaetze,
  isLoading = false,
}: EinsaetzeTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("de-CH");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      header: "Gerät",
      cell: (einsatz) => (
        <span className="font-medium">{einsatz.geraet.name}</span>
      ),
    },
    {
      header: "Auftrag",
      cell: (einsatz) => (
        <span className="font-mono">{einsatz.auftrag.auftragsnummer}</span>
      ),
    },
    {
      header: "Ort",
      cell: (einsatz) => einsatz.ort || einsatz.auftrag.auftragsort || "-",
    },
    {
      header: "Von",
      cell: (einsatz) => formatDate(einsatz.von_datum),
    },
    {
      header: "Bis",
      cell: (einsatz) =>
        einsatz.bis_effektiv ? (
          formatDate(einsatz.bis_effektiv)
        ) : (
          <Badge variant="default">Laufend</Badge>
        ),
    },
    {
      header: "Status",
      cell: (einsatz) =>
        einsatz.geraet.status ? (
          <StatusBadge
            status={einsatz.geraet.status.name}
            color={einsatz.geraet.status.farbe}
          />
        ) : (
          "-"
        ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={einsaetze}
      isLoading={isLoading}
      emptyMessage="Keine Einsätze vorhanden"
      emptyDescription="Erstellen Sie einen neuen Einsatz, um zu beginnen."
      onRowClick={(einsatz) => router.push(`/einsaetze/${einsatz.id}`)}
    />
  );
}
