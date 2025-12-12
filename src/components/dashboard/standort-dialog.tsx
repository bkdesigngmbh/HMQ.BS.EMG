"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Box, FileText } from "lucide-react";

interface Geraet {
  id: string;
  name: string;
  client: string | null;
}

interface Auftrag {
  id: string;
  auftragsnummer: string;
  auftragsort: string | null;
}

interface StandortDialogProps {
  open: boolean;
  onClose: () => void;
  geraet: Geraet | null;
  auftrag: Auftrag | null;
  imEinsatzStatusId: string;
}

export function StandortDialog({
  open,
  onClose,
  geraet,
  auftrag,
}: StandortDialogProps) {
  if (!geraet || !auftrag) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Einsatz erstellen
          </DialogTitle>
          <DialogDescription>
            {geraet.name} wird dem Auftrag {auftrag.auftragsnummer} zugewiesen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Zusammenfassung */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Gerät</p>
                <p className="font-medium">{geraet.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Auftrag</p>
                <p className="font-medium">{auftrag.auftragsnummer}</p>
              </div>
            </div>
          </div>

          {/* Standort Info */}
          {auftrag.auftragsort && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Auftragsort: {auftrag.auftragsort}</span>
            </div>
          )}

          {/* Placeholder für Teil 2 */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
            <p className="text-sm">
              Standort-Eingabe und Geocoding wird in Teil 2 implementiert...
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button disabled>Einsatz erstellen</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
