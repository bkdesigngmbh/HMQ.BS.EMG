"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeraeteTable } from "@/components/geraete/geraete-table";
import { AuftraegeTable } from "@/components/auftraege/auftraege-table";
import { GeraeteDialog } from "@/components/geraete/geraete-dialog";
import { AuftraegeDialog } from "@/components/auftraege/auftraege-dialog";
import { GeraeteBoard } from "@/components/dashboard/geraete-board";
import { Plus, Box, FileText } from "lucide-react";
import { createGeraet, updateGeraet } from "@/lib/actions/geraete";
import { createAuftrag, updateAuftrag } from "@/lib/actions/auftraege";
import {
  transformGeraetValues,
  type GeraetFormValues,
} from "@/lib/validations/geraet";
import {
  transformAuftragValues,
  type AuftragFormValues,
} from "@/lib/validations/auftrag";
import type { Geraeteart, Geraetestatus, Auftrag } from "@/types/database";

interface BoardGeraet {
  id: string;
  name: string;
  client: string | null;
  geraeteart: { bezeichnung: string } | null;
  status: { id: string; bezeichnung: string; farbe: string } | null;
}

interface BoardEinsatz {
  id: string;
  geraet: {
    id: string;
    name: string;
  };
}

interface BoardAuftrag {
  id: string;
  auftragsnummer: string;
  auftragsort: string | null;
  auftragsbezeichnung: string | null;
  einsaetze: BoardEinsatz[];
}

interface AuftraegeGeraeteContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geraete: any[];
  geraetearten: Geraeteart[];
  statusListe: Geraetestatus[];
  auftraege: Auftrag[];
  nextAuftragsnummer: string;
  geraeteFuerBoard: BoardGeraet[];
  auftraegeMitEinsaetze: BoardAuftrag[];
  imEinsatzStatusId: string;
}

export function AuftraegeGeraeteContent({
  geraete,
  geraetearten,
  statusListe,
  auftraege,
  nextAuftragsnummer,
  geraeteFuerBoard,
  auftraegeMitEinsaetze,
  imEinsatzStatusId,
}: AuftraegeGeraeteContentProps) {
  const router = useRouter();

  // Geräte Dialog State
  const [geraetDialogOpen, setGeraetDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingGeraet, setEditingGeraet] = useState<any>(null);
  const [geraetLoading, setGeraetLoading] = useState(false);

  // Aufträge Dialog State
  const [auftragDialogOpen, setAuftragDialogOpen] = useState(false);
  const [editingAuftrag, setEditingAuftrag] = useState<Auftrag | null>(null);
  const [auftragLoading, setAuftragLoading] = useState(false);

  // Handlers für Geräte
  const handleOpenNewGeraet = () => {
    setEditingGeraet(null);
    setGeraetDialogOpen(true);
  };

  const handleSaveGeraet = async (values: GeraetFormValues) => {
    setGeraetLoading(true);
    try {
      const transformedValues = transformGeraetValues(values);
      if (editingGeraet) {
        await updateGeraet(editingGeraet.id, transformedValues);
      } else {
        await createGeraet(transformedValues);
      }
      router.refresh();
    } finally {
      setGeraetLoading(false);
    }
  };

  // Handlers für Aufträge
  const handleOpenNewAuftrag = () => {
    setEditingAuftrag(null);
    setAuftragDialogOpen(true);
  };

  const handleSaveAuftrag = async (values: AuftragFormValues) => {
    setAuftragLoading(true);
    try {
      const transformedValues = transformAuftragValues(values);
      if (editingAuftrag) {
        await updateAuftrag(editingAuftrag.id, transformedValues);
      } else {
        await createAuftrag(transformedValues);
      }
      router.refresh();
    } finally {
      setAuftragLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Aufträge & Geräte"
        description="Gerätezuweisung per Drag & Drop und Verwaltung"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenNewGeraet}>
            <Box className="mr-2 h-4 w-4" />
            Neues Gerät
          </Button>
          <Button onClick={handleOpenNewAuftrag}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Auftrag
          </Button>
        </div>
      </PageHeader>

      {/* Drag & Drop Board */}
      <GeraeteBoard
        verfuegbareGeraete={geraeteFuerBoard}
        aktiveAuftraege={auftraegeMitEinsaetze}
        imEinsatzStatusId={imEinsatzStatusId}
        statusListe={statusListe}
      />

      {/* Tabs für Detailansichten */}
      <Tabs defaultValue="geraete" className="w-full">
        <TabsList>
          <TabsTrigger value="geraete" className="gap-2">
            <Box className="h-4 w-4" />
            Alle Geräte ({geraete.length})
          </TabsTrigger>
          <TabsTrigger value="auftraege" className="gap-2">
            <FileText className="h-4 w-4" />
            Alle Aufträge ({auftraege.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geraete" className="mt-4">
          <GeraeteTable geraete={geraete} />
        </TabsContent>

        <TabsContent value="auftraege" className="mt-4">
          <AuftraegeTable auftraege={auftraege} />
        </TabsContent>
      </Tabs>

      {/* Dialoge */}
      <GeraeteDialog
        open={geraetDialogOpen}
        onOpenChange={setGeraetDialogOpen}
        geraet={editingGeraet}
        geraetearten={geraetearten}
        statusListe={statusListe}
        onSave={handleSaveGeraet}
        isLoading={geraetLoading}
      />

      <AuftraegeDialog
        open={auftragDialogOpen}
        onOpenChange={setAuftragDialogOpen}
        auftrag={editingAuftrag}
        nextAuftragsnummer={nextAuftragsnummer}
        onSave={handleSaveAuftrag}
        isLoading={auftragLoading}
      />
    </div>
  );
}
