"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MapPin, Box } from "lucide-react";

interface Einsatz {
  id: string;
  geraet: {
    id: string;
    name: string;
  };
}

interface Auftrag {
  id: string;
  auftragsnummer: string;
  auftragsort: string | null;
  auftragsbezeichnung: string | null;
  einsaetze: Einsatz[];
}

interface AuftraegeDropZonesProps {
  auftraege: Auftrag[];
}

export function AuftraegeDropZones({ auftraege }: AuftraegeDropZonesProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Aktive Aufträge</h2>

      <div className="space-y-2">
        {auftraege.length === 0 ? (
          <p className="text-muted-foreground text-sm p-4 border rounded-lg text-center">
            Keine aktiven Aufträge vorhanden
          </p>
        ) : (
          auftraege.map((auftrag) => (
            <DroppableAuftrag key={auftrag.id} auftrag={auftrag} />
          ))
        )}
      </div>
    </div>
  );
}

function DroppableAuftrag({ auftrag }: { auftrag: Auftrag }) {
  const { isOver, setNodeRef } = useDroppable({
    id: auftrag.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex items-center justify-between p-4 border-2 rounded-lg transition-colors",
        isOver
          ? "border-primary bg-primary/5 border-solid"
          : "border-dashed border-muted-foreground/30 hover:border-muted-foreground/50"
      )}
    >
      {/* Links: Auftragsinfo */}
      <div className="flex-1">
        <p className="font-semibold">{auftrag.auftragsnummer}</p>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{auftrag.auftragsort || "Kein Ort"}</span>
          {auftrag.auftragsbezeichnung && (
            <>
              <span>-</span>
              <span>{auftrag.auftragsbezeichnung}</span>
            </>
          )}
        </div>
      </div>

      {/* Rechts: Zugewiesene Geräte */}
      <div className="flex gap-2 flex-wrap justify-end">
        {auftrag.einsaetze.length === 0 ? (
          <span className="text-sm text-muted-foreground italic">
            Gerät hierher ziehen...
          </span>
        ) : (
          auftrag.einsaetze.map((einsatz) => (
            <Badge
              key={einsatz.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Box className="h-3 w-3" />
              {einsatz.geraet.name}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
