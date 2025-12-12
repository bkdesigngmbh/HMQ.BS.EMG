"use client";

import { memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GeraetCard } from "./geraet-card";

interface Geraet {
  id: string;
  name: string;
  client: string | null;
  geraeteart: { bezeichnung: string } | null;
  status: { id: string; bezeichnung: string; farbe: string } | null;
}

interface GeraetePoolProps {
  geraete: Geraet[];
}

export const GeraetePool = memo(function GeraetePool({
  geraete,
}: GeraetePoolProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Verfügbare Geräte</h2>
        <span className="text-sm text-muted-foreground">
          {geraete.length} Gerät{geraete.length !== 1 ? "e" : ""} verfügbar
        </span>
      </div>

      <div className="flex flex-wrap gap-3 p-4 border-2 border-dashed rounded-lg min-h-[100px] bg-muted/30">
        {geraete.length === 0 ? (
          <p className="text-muted-foreground text-sm w-full text-center py-4">
            Keine Geräte verfügbar - alle im Einsatz
          </p>
        ) : (
          geraete.map((geraet) => (
            <DraggableGeraet key={geraet.id} geraet={geraet} />
          ))
        )}
      </div>
    </div>
  );
});

const DraggableGeraet = memo(function DraggableGeraet({
  geraet,
}: {
  geraet: Geraet;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: geraet.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <GeraetCard geraet={geraet} />
    </div>
  );
});
