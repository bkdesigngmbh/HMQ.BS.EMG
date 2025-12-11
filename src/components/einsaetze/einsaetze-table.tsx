"use client";

import { useRouter } from "next/navigation";
import { DataTable, Column } from "@/components/shared/data-table";
import { StatusBadge, EinsatzStatusBadge } from "@/components/shared/status-badge";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils/date";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Column<any>[] = [
    {
      header: "Gerät",
      sortable: true,
      sortFn: (a, b) => a.geraet.name.localeCompare(b.geraet.name, "de-CH"),
      cell: (einsatz) => (
        <span className="font-medium">{einsatz.geraet.name}</span>
      ),
    },
    {
      header: "Auftrag",
      sortable: true,
      sortFn: (a, b) =>
        a.auftrag.auftragsnummer.localeCompare(b.auftrag.auftragsnummer, "de-CH"),
      cell: (einsatz) => (
        <span className="font-mono">{einsatz.auftrag.auftragsnummer}</span>
      ),
    },
    {
      header: "Ort",
      sortable: true,
      sortFn: (a, b) => {
        const aOrt = a.ort || a.auftrag.auftragsort || "";
        const bOrt = b.ort || b.auftrag.auftragsort || "";
        return aOrt.localeCompare(bOrt, "de-CH");
      },
      cell: (einsatz) => einsatz.ort || einsatz.auftrag.auftragsort || "-",
    },
    {
      header: "Von",
      sortable: true,
      sortFn: (a, b) => {
        const aDate = new Date(a.von_datum).getTime();
        const bDate = new Date(b.von_datum).getTime();
        return aDate - bDate;
      },
      cell: (einsatz) => formatDate(einsatz.von_datum),
    },
    {
      header: "Bis",
      sortable: true,
      sortFn: (a, b) => {
        const aDate = a.bis_effektiv
          ? new Date(a.bis_effektiv).getTime()
          : Infinity;
        const bDate = b.bis_effektiv
          ? new Date(b.bis_effektiv).getTime()
          : Infinity;
        return aDate - bDate;
      },
      cell: (einsatz) =>
        einsatz.bis_effektiv ? (
          formatDate(einsatz.bis_effektiv)
        ) : (
          <EinsatzStatusBadge isAktiv={true} size="sm" />
        ),
    },
    {
      header: "Geräte-Status",
      sortable: true,
      sortFn: (a, b) => {
        const aName = a.geraet.status?.name || "";
        const bName = b.geraet.status?.name || "";
        return aName.localeCompare(bName, "de-CH");
      },
      cell: (einsatz) =>
        einsatz.geraet.status ? (
          <StatusBadge
            status={einsatz.geraet.status.name}
            color={einsatz.geraet.status.farbe}
            size="sm"
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
      emptyIcon={<Calendar className="h-6 w-6 text-muted-foreground" />}
      onRowClick={(einsatz) => router.push(`/einsaetze/${einsatz.id}`)}
    />
  );
}
