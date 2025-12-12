"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { EinsatzBeendenDialog } from "@/components/einsaetze/einsatz-beenden-dialog";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Box,
  FileText,
  StopCircle,
} from "lucide-react";
import { beendenEinsatz } from "@/lib/actions/einsaetze";
import type { EinsatzBeendenFormValues } from "@/lib/validations/einsatz";
import type { Geraetestatus } from "@/types/database";

interface EinsatzDetailClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  einsatz: any;
  statusListe: Geraetestatus[];
}

export function EinsatzDetailClient({
  einsatz,
  statusListe,
}: EinsatzDetailClientProps) {
  const router = useRouter();
  const [beendenDialogOpen, setBeendenDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAktiv = !einsatz.bis_effektiv;

  const handleBeenden = async (values: EinsatzBeendenFormValues) => {
    setIsLoading(true);
    try {
      await beendenEinsatz(einsatz.id, values, einsatz.geraet_id);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("de-CH");
  };

  const getAdresse = () => {
    const parts = [];
    if (einsatz.strasse) parts.push(einsatz.strasse);
    if (einsatz.plz || einsatz.ort) {
      parts.push([einsatz.plz, einsatz.ort].filter(Boolean).join(" "));
    }
    return parts.length > 0 ? parts.join(", ") : null;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/einsaetze">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <PageHeader
            title={`Einsatz ${einsatz.geraet.name}`}
            description={`Auftrag: ${einsatz.auftrag.auftragsnummer}`}
          >
            <div className="flex items-center gap-2">
              {isAktiv ? (
                <>
                  <Badge variant="default">Aktiv</Badge>
                  <Button
                    variant="destructive"
                    onClick={() => setBeendenDialogOpen(true)}
                  >
                    <StopCircle className="mr-2 h-4 w-4" />
                    Beenden
                  </Button>
                </>
              ) : (
                <Badge variant="secondary">Beendet</Badge>
              )}
            </div>
          </PageHeader>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Zeitraum */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Zeitraum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Startdatum</span>
              <span className="font-medium">{formatDate(einsatz.von)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Geplantes Ende</span>
              <span>{formatDate(einsatz.bis_provisorisch)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Effektives Ende</span>
              <span
                className={isAktiv ? "text-green-600 font-medium" : "font-medium"}
              >
                {isAktiv ? "Laufend" : formatDate(einsatz.bis_effektiv)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Standort */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Standort
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {getAdresse() ? (
              <>
                <p className="font-medium">{getAdresse()}</p>
                {einsatz.koordinaten_lat && einsatz.koordinaten_lng && (
                  <p className="text-sm text-muted-foreground">
                    Koordinaten: {einsatz.koordinaten_lat.toFixed(6)}, {einsatz.koordinaten_lng.toFixed(6)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Kein Standort angegeben</p>
            )}
          </CardContent>
        </Card>

        {/* Gerät */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              Gerät
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <Link
                href={`/geraete/${einsatz.geraet.id}`}
                className="font-medium hover:underline"
              >
                {einsatz.geraet.name}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seriennummer</span>
              <span>{einsatz.geraet.seriennummer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Typ</span>
              <span>{einsatz.geraet.geraeteart?.bezeichnung || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              {einsatz.geraet.status ? (
                <StatusBadge
                  status={einsatz.geraet.status.bezeichnung}
                  color={einsatz.geraet.status.farbe}
                />
              ) : (
                "-"
              )}
            </div>
          </CardContent>
        </Card>

        {/* Auftrag */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Auftrag
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nummer</span>
              <Link
                href={`/auftraege/${einsatz.auftrag.id}`}
                className="font-medium hover:underline"
              >
                {einsatz.auftrag.auftragsnummer}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ort</span>
              <span>{einsatz.auftrag.auftragsort || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge
                variant={
                  einsatz.auftrag.status === "aktiv" ? "default" : "secondary"
                }
              >
                {einsatz.auftrag.status === "aktiv" ? "Aktiv" : "Inaktiv"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notizen */}
      {einsatz.notizen && (
        <Card>
          <CardHeader>
            <CardTitle>Notizen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{einsatz.notizen}</p>
          </CardContent>
        </Card>
      )}

      <EinsatzBeendenDialog
        open={beendenDialogOpen}
        onOpenChange={setBeendenDialogOpen}
        statusListe={statusListe}
        onSave={handleBeenden}
        isLoading={isLoading}
      />
    </div>
  );
}
