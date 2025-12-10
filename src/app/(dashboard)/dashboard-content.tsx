"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Box,
  FileText,
  Calendar,
  AlertTriangle,
  MapPin,
  Wrench,
} from "lucide-react";
import type { Auftrag } from "@/types/database";

interface DashboardContentProps {
  statistiken: {
    gesamt: number;
    imBuero: number;
    imEinsatz: number;
    inWartung: number;
    defekt: number;
  };
  aktiveAuftraege: Auftrag[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aktiveEinsaetze: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anstehendeWartungen: any[];
}

export function DashboardContent({
  statistiken,
  aktiveAuftraege,
  aktiveEinsaetze,
  anstehendeWartungen,
}: DashboardContentProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("de-CH");
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Übersicht über Geräte, Aufträge und Einsätze"
      />

      {/* Statistik-Karten */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Geräte gesamt</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiken.gesamt}</div>
            <p className="text-xs text-muted-foreground">
              {statistiken.imBuero} im Büro, {statistiken.imEinsatz} im Einsatz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Im Büro</CardTitle>
            <Box className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistiken.imBuero}
            </div>
            <p className="text-xs text-muted-foreground">Verfügbare Geräte</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Im Einsatz</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statistiken.imEinsatz}
            </div>
            <p className="text-xs text-muted-foreground">
              {aktiveEinsaetze.length} aktive Einsätze
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wartungen fällig</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {anstehendeWartungen.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistiken.inWartung} in Wartung, {statistiken.defekt} defekt
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Aktive Einsätze */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Aktive Einsätze
            </CardTitle>
            <Link
              href="/einsaetze"
              className="text-sm text-muted-foreground hover:underline"
            >
              Alle anzeigen
            </Link>
          </CardHeader>
          <CardContent>
            {aktiveEinsaetze.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Keine aktiven Einsätze.
              </p>
            ) : (
              <div className="space-y-3">
                {aktiveEinsaetze.slice(0, 5).map((einsatz) => (
                  <Link
                    key={einsatz.id}
                    href={`/einsaetze/${einsatz.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{einsatz.geraet.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {einsatz.ort || einsatz.auftrag.auftragsort || "Kein Ort"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">
                          {einsatz.auftrag.auftragsnummer}
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
                {aktiveEinsaetze.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    + {aktiveEinsaetze.length - 5} weitere
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Anstehende Wartungen */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Anstehende Wartungen
            </CardTitle>
            <Link
              href="/geraete"
              className="text-sm text-muted-foreground hover:underline"
            >
              Alle Geräte
            </Link>
          </CardHeader>
          <CardContent>
            {anstehendeWartungen.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Keine Wartungen fällig.
              </p>
            ) : (
              <div className="space-y-3">
                {anstehendeWartungen.slice(0, 5).map((geraet) => (
                  <Link
                    key={geraet.id}
                    href={`/geraete/${geraet.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{geraet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Fällig: {formatDate(geraet.naechster_service)}
                        </p>
                      </div>
                      <Badge variant="destructive">Überfällig</Badge>
                    </div>
                  </Link>
                ))}
                {anstehendeWartungen.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    + {anstehendeWartungen.length - 5} weitere
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Aktive Aufträge */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Aktive Aufträge ({aktiveAuftraege.length})
          </CardTitle>
          <Link
            href="/auftraege"
            className="text-sm text-muted-foreground hover:underline"
          >
            Alle anzeigen
          </Link>
        </CardHeader>
        <CardContent>
          {aktiveAuftraege.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Keine aktiven Aufträge.
            </p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {aktiveAuftraege.slice(0, 6).map((auftrag) => (
                <Link
                  key={auftrag.id}
                  href={`/auftraege/${auftrag.id}`}
                  className="block"
                >
                  <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <p className="font-mono font-medium">
                      {auftrag.auftragsnummer}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {auftrag.auftragsort || "Kein Ort"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
