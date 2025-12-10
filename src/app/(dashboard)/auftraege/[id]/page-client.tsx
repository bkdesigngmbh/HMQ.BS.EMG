"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { AuftraegeDialog } from "@/components/auftraege/auftraege-dialog";
import {
  ArrowLeft,
  Edit,
  Calendar,
  MapPin,
  Box,
} from "lucide-react";
import { updateAuftrag } from "@/lib/actions/auftraege";
import { transformAuftragValues, type AuftragFormValues } from "@/lib/validations/auftrag";

interface AuftraegeDetailClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auftrag: any;
}

export function AuftraegeDetailClient({ auftrag }: AuftraegeDetailClientProps) {
  const router = useRouter();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAuftrag = async (values: AuftragFormValues) => {
    setIsLoading(true);
    try {
      const transformedValues = transformAuftragValues(values);
      await updateAuftrag(auftrag.id, transformedValues);
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("de-CH");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aktiveEinsaetze = auftrag.einsaetze.filter((e: any) => !e.bis_effektiv);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const abgeschlosseneEinsaetze = auftrag.einsaetze.filter((e: any) => e.bis_effektiv);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/auftraege">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <PageHeader
            title={auftrag.auftragsnummer}
            description={auftrag.auftragsort || "Kein Ort angegeben"}
          >
            <div className="flex items-center gap-2">
              <Badge
                variant={auftrag.status === "aktiv" ? "default" : "secondary"}
              >
                {auftrag.status === "aktiv" ? "Aktiv" : "Inaktiv"}
              </Badge>
              <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Bearbeiten
              </Button>
            </div>
          </PageHeader>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Geräte aktiv
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auftrag.geraete_anzahl}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Einsätze gesamt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auftrag.einsaetze.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Erstellt am
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDate(auftrag.created_at)}
            </div>
          </CardContent>
        </Card>
      </div>

      {auftrag.bezeichnung && (
        <Card>
          <CardHeader>
            <CardTitle>Beschreibung</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{auftrag.bezeichnung}</p>
          </CardContent>
        </Card>
      )}

      {/* Aktive Einsätze */}
      {aktiveEinsaetze.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5" />
              Aktive Einsätze ({aktiveEinsaetze.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {aktiveEinsaetze.map((einsatz: any) => (
                <Link
                  key={einsatz.id}
                  href={`/einsaetze/${einsatz.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{einsatz.geraet.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {einsatz.ort || "Kein Ort"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        seit {formatDate(einsatz.von_datum)}
                      </p>
                      {einsatz.geraet.status && (
                        <StatusBadge
                          status={einsatz.geraet.status.name}
                          color={einsatz.geraet.status.farbe}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Abgeschlossene Einsätze */}
      <Card>
        <CardHeader>
          <CardTitle>Einsatzhistorie ({abgeschlosseneEinsaetze.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {abgeschlosseneEinsaetze.length === 0 ? (
            <p className="text-muted-foreground">
              Keine abgeschlossenen Einsätze.
            </p>
          ) : (
            <div className="space-y-3">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {abgeschlosseneEinsaetze.map((einsatz: any) => (
                <Link
                  key={einsatz.id}
                  href={`/einsaetze/${einsatz.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{einsatz.geraet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {einsatz.ort || "Kein Ort"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {formatDate(einsatz.von_datum)} -{" "}
                        {formatDate(einsatz.bis_effektiv)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AuftraegeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        auftrag={auftrag}
        onSave={handleUpdateAuftrag}
        isLoading={isLoading}
      />
    </div>
  );
}
