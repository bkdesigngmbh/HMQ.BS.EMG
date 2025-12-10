import { notFound } from "next/navigation";
import {
  getGeraetMitAktiverEinsatz,
  getGeraetearten,
  getGeraetestatus,
} from "@/lib/actions/geraete";
import { getEinsaetzeByGeraet } from "@/lib/actions/einsaetze";
import { getWartungenByGeraet, getWartungsarten } from "@/lib/actions/wartungen";
import { GeraeteDetailClient } from "./page-client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function GeraeteDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const [geraet, einsaetze, wartungen, geraetearten, statusListe, wartungsarten] =
      await Promise.all([
        getGeraetMitAktiverEinsatz(id),
        getEinsaetzeByGeraet(id),
        getWartungenByGeraet(id),
        getGeraetearten(),
        getGeraetestatus(),
        getWartungsarten(),
      ]);

    return (
      <GeraeteDetailClient
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geraet={geraet as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        einsaetze={einsaetze as any}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wartungen={wartungen as any}
        geraetearten={geraetearten}
        statusListe={statusListe}
        wartungsarten={wartungsarten}
      />
    );
  } catch {
    notFound();
  }
}
