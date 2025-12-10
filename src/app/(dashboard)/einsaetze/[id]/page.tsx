import { notFound } from "next/navigation";
import { getEinsatz } from "@/lib/actions/einsaetze";
import { getGeraetestatus } from "@/lib/actions/geraete";
import { EinsatzDetailClient } from "./page-client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EinsatzDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const [einsatz, statusListe] = await Promise.all([
      getEinsatz(id),
      getGeraetestatus(),
    ]);

    return <EinsatzDetailClient einsatz={einsatz} statusListe={statusListe} />;
  } catch {
    notFound();
  }
}
