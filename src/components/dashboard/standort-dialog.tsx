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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MapPin, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  createEinsatzFromBoard,
  geocodeAddress,
} from "@/lib/actions/einsaetze";
import { useToast } from "@/components/ui/use-toast";

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
  imEinsatzStatusId,
}: StandortDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Form State
  const [vonDatum, setVonDatum] = useState<Date>(new Date());
  const [bisProvisорisch, setBisProvisорisch] = useState<Date | undefined>();
  const [strasse, setStrasse] = useState("");
  const [plz, setPlz] = useState("");
  const [ort, setOrt] = useState("");
  const [koordinaten, setKoordinaten] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [notizen, setNotizen] = useState("");

  // Ort vom Auftrag übernehmen wenn Dialog öffnet
  useEffect(() => {
    if (open && auftrag?.auftragsort) {
      setOrt(auftrag.auftragsort);
    }
  }, [open, auftrag]);

  // Reset Form wenn Dialog schliesst
  useEffect(() => {
    if (!open) {
      setVonDatum(new Date());
      setBisProvisорisch(undefined);
      setStrasse("");
      setPlz("");
      setOrt(auftrag?.auftragsort || "");
      setKoordinaten(null);
      setNotizen("");
    }
  }, [open, auftrag]);

  // Geocoding durchführen
  async function handleGeocode() {
    if (!strasse || !ort) {
      toast({
        title: "Fehler",
        description: "Bitte Strasse und Ort eingeben",
        variant: "destructive",
      });
      return;
    }

    setIsGeocoding(true);
    try {
      const result = await geocodeAddress(strasse, plz, ort);
      if (result) {
        setKoordinaten(result);
        toast({
          title: "Erfolg",
          description: "Koordinaten gefunden",
        });
      } else {
        toast({
          title: "Nicht gefunden",
          description: "Adresse konnte nicht gefunden werden",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Fehler",
        description: "Fehler beim Geocoding",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  }

  // Einsatz erstellen
  async function handleSubmit() {
    if (!geraet || !auftrag) return;

    setIsLoading(true);
    try {
      const result = await createEinsatzFromBoard(
        {
          geraet_id: geraet.id,
          auftrag_id: auftrag.id,
          von: format(vonDatum, "yyyy-MM-dd"),
          bis_provisorisch: bisProvisорisch
            ? format(bisProvisорisch, "yyyy-MM-dd")
            : null,
          strasse: strasse || null,
          plz: plz || null,
          ort: ort || null,
          koordinaten_lat: koordinaten?.lat || null,
          koordinaten_lng: koordinaten?.lng || null,
          notizen: notizen || null,
        },
        imEinsatzStatusId
      );

      if (result.success) {
        toast({
          title: "Erfolg",
          description: `${geraet.name} wurde ${auftrag.auftragsnummer} zugewiesen`,
        });
        onClose();
        router.refresh();
      } else {
        toast({
          title: "Fehler",
          description: result.error || "Fehler beim Erstellen des Einsatzes",
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

  if (!geraet || !auftrag) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Gerät zuweisen</DialogTitle>
          <DialogDescription>
            <span className="font-semibold">{geraet.name}</span> wird dem
            Auftrag <span className="font-semibold">{auftrag.auftragsnummer}</span>{" "}
            zugewiesen.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Von-Datum */}
          <div className="grid gap-2">
            <Label>Einsatz ab *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !vonDatum && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {vonDatum
                    ? format(vonDatum, "dd.MM.yyyy", { locale: de })
                    : "Datum wählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={vonDatum}
                  onSelect={(date) => date && setVonDatum(date)}
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Bis-Datum (provisorisch) */}
          <div className="grid gap-2">
            <Label>Voraussichtlich bis (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !bisProvisорisch && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {bisProvisорisch
                    ? format(bisProvisорisch, "dd.MM.yyyy", { locale: de })
                    : "Datum wählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={bisProvisорisch}
                  onSelect={setBisProvisорisch}
                  locale={de}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Adresse */}
          <div className="grid gap-2">
            <Label>Standort des Geräts</Label>
            <Input
              placeholder="Strasse und Hausnummer"
              value={strasse}
              onChange={(e) => setStrasse(e.target.value)}
            />
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="PLZ"
                value={plz}
                onChange={(e) => setPlz(e.target.value)}
              />
              <Input
                placeholder="Ort"
                value={ort}
                onChange={(e) => setOrt(e.target.value)}
                className="col-span-2"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGeocode}
              disabled={isGeocoding}
            >
              {isGeocoding ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="mr-2 h-4 w-4" />
              )}
              Koordinaten ermitteln
            </Button>
            {koordinaten && (
              <p className="text-xs text-muted-foreground">
                Koordinaten: {koordinaten.lat.toFixed(6)},{" "}
                {koordinaten.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Notizen */}
          <div className="grid gap-2">
            <Label>Notizen (optional)</Label>
            <Textarea
              placeholder="Zusätzliche Informationen..."
              value={notizen}
              onChange={(e) => setNotizen(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Zuweisen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
