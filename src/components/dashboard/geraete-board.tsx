"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { GeraetePool } from "./geraete-pool";
import { AuftraegeDropZones } from "./auftraege-drop-zones";
import { GeraetCard } from "./geraet-card";
import { StandortDialog } from "./standort-dialog";
import { EinsatzBeendenDialog } from "./einsatz-beenden-dialog";

interface Geraet {
  id: string;
  name: string;
  client: string | null;
  geraeteart: { bezeichnung: string } | null;
  status: { id: string; bezeichnung: string; farbe: string } | null;
}

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

interface Status {
  id: string;
  bezeichnung: string;
  farbe: string | null;
}

interface GeraeteBoardProps {
  verfuegbareGeraete: Geraet[];
  aktiveAuftraege: Auftrag[];
  imEinsatzStatusId: string;
  statusListe: Status[];
}

export function GeraeteBoard({
  verfuegbareGeraete,
  aktiveAuftraege,
  imEinsatzStatusId,
  statusListe,
}: GeraeteBoardProps) {
  const [activeGeraet, setActiveGeraet] = useState<Geraet | null>(null);

  // Standort-Dialog State
  const [standortDialogOpen, setStandortDialogOpen] = useState(false);
  const [targetAuftrag, setTargetAuftrag] = useState<Auftrag | null>(null);
  const [draggedGeraet, setDraggedGeraet] = useState<Geraet | null>(null);

  // Beenden-Dialog State
  const [beendenDialogOpen, setBeendenDialogOpen] = useState(false);
  const [zuBeendenderEinsatz, setZuBeendenderEinsatz] = useState<{
    id: string;
    geraetName: string;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    const geraet = verfuegbareGeraete.find((g) => g.id === event.active.id);
    if (geraet) {
      setActiveGeraet(geraet);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveGeraet(null);

    if (!over) return;

    // Prüfe ob über einem Auftrag gedroppt wurde
    const auftrag = aktiveAuftraege.find((a) => a.id === over.id);
    if (auftrag) {
      const geraet = verfuegbareGeraete.find((g) => g.id === active.id);
      if (geraet) {
        // Dialog öffnen für Standort-Eingabe
        setDraggedGeraet(geraet);
        setTargetAuftrag(auftrag);
        setStandortDialogOpen(true);
      }
    }
  }

  function handleEinsatzKlick(einsatzId: string, geraetName: string) {
    setZuBeendenderEinsatz({ id: einsatzId, geraetName });
    setBeendenDialogOpen(true);
  }

  function handleStandortDialogClose() {
    setStandortDialogOpen(false);
    setDraggedGeraet(null);
    setTargetAuftrag(null);
  }

  function handleBeendenDialogClose() {
    setBeendenDialogOpen(false);
    setZuBeendenderEinsatz(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-8">
        {/* Verfügbare Geräte */}
        <GeraetePool geraete={verfuegbareGeraete} />

        {/* Aktive Aufträge als Drop-Zonen */}
        <AuftraegeDropZones
          auftraege={aktiveAuftraege}
          onEinsatzKlick={handleEinsatzKlick}
        />
      </div>

      {/* Drag Overlay - zeigt das gezogene Element */}
      <DragOverlay>
        {activeGeraet ? <GeraetCard geraet={activeGeraet} isDragging /> : null}
      </DragOverlay>

      {/* Standort-Dialog */}
      <StandortDialog
        open={standortDialogOpen}
        onClose={handleStandortDialogClose}
        geraet={draggedGeraet}
        auftrag={targetAuftrag}
        imEinsatzStatusId={imEinsatzStatusId}
      />

      {/* Einsatz-Beenden-Dialog */}
      <EinsatzBeendenDialog
        open={beendenDialogOpen}
        onClose={handleBeendenDialogClose}
        einsatzId={zuBeendenderEinsatz?.id || null}
        geraetName={zuBeendenderEinsatz?.geraetName || null}
        statusListe={statusListe}
      />
    </DndContext>
  );
}
