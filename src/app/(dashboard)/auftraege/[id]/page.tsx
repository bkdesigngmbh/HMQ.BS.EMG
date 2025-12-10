import { notFound } from "next/navigation";
import { getAuftragMitEinsaetze } from "@/lib/actions/auftraege";
import { AuftraegeDetailClient } from "./page-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AuftraegeDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const auftrag = await getAuftragMitEinsaetze(id);

    return <AuftraegeDetailClient auftrag={auftrag} />;
  } catch {
    notFound();
  }
}
