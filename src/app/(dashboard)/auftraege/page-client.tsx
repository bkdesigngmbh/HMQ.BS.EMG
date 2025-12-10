"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { AuftraegeTable } from "@/components/auftraege/auftraege-table";
import { AuftraegeDialog } from "@/components/auftraege/auftraege-dialog";
import { Plus } from "lucide-react";
import { createAuftrag, updateAuftrag } from "@/lib/actions/auftraege";
import { transformAuftragValues, type AuftragFormValues } from "@/lib/validations/auftrag";
import type { Auftrag } from "@/types/database";

interface AuftraegePageClientProps {
  initialAuftraege: Auftrag[];
  nextAuftragsnummer: string;
}

export function AuftraegePageClient({
  initialAuftraege,
  nextAuftragsnummer,
}: AuftraegePageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAuftrag, setEditingAuftrag] = useState<Auftrag | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenNew = () => {
    setEditingAuftrag(null);
    setDialogOpen(true);
  };

  const handleSave = async (values: AuftragFormValues) => {
    setIsLoading(true);
    try {
      const transformedValues = transformAuftragValues(values);
      if (editingAuftrag) {
        await updateAuftrag(editingAuftrag.id, transformedValues);
      } else {
        await createAuftrag(transformedValues);
      }
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader title="Aufträge" description="Verwaltung aller Aufträge">
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Auftrag
        </Button>
      </PageHeader>

      <AuftraegeTable auftraege={initialAuftraege} />

      <AuftraegeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        auftrag={editingAuftrag}
        nextAuftragsnummer={nextAuftragsnummer}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
