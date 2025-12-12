"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { beendeEinsatzFromBoard } from "@/lib/actions/einsaetze";
import { useToast } from "@/components/ui/use-toast";

interface Status {
  id: string;
  bezeichnung: string;
  farbe: string | null;
}

interface EinsatzBeendenDialogProps {
  open: boolean;
  onClose: () => void;
  einsatzId: string | null;
  geraetName: string | null;
  statusListe: Status[];
}

export function EinsatzBeendenDialog({
  open,
  onClose,
  einsatzId,
  geraetName,
  statusListe,
}: EinsatzBeendenDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<string>("");

  // Default auf "Im Büro" setzen
  useEffect(() => {
    if (open) {
      const imBuero = statusListe.find(
        (s) => s.bezeichnung.toLowerCase() === "im büro"
      );
      if (imBuero) {
        setSelectedStatusId(imBuero.id);
      }
    }
  }, [open, statusListe]);

  async function handleSubmit() {
    if (!einsatzId || !selectedStatusId) return;

    setIsLoading(true);
    try {
      const result = await beendeEinsatzFromBoard(einsatzId, selectedStatusId);

      if (result.success) {
        toast({
          title: "Erfolg",
          description: `Einsatz beendet - ${geraetName} ist jetzt verfügbar`,
        });
        onClose();
        router.refresh();
      } else {
        toast({
          title: "Fehler",
          description: result.error || "Fehler beim Beenden des Einsatzes",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[400px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Einsatz beenden</DialogTitle>
          <DialogDescription>
            Wo befindet sich{" "}
            <span className="font-semibold">{geraetName}</span> jetzt?
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Neuer Status des Geräts</Label>
            <Select value={selectedStatusId} onValueChange={setSelectedStatusId}>
              <SelectTrigger>
                <SelectValue placeholder="Status wählen..." />
              </SelectTrigger>
              <SelectContent>
                {statusListe.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.farbe || "#gray" }}
                      />
                      {status.bezeichnung}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedStatusId}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Einsatz beenden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
