"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { GeraeteTable } from "@/components/geraete/geraete-table";
import { GeraeteDialog } from "@/components/geraete/geraete-dialog";
import { Plus } from "lucide-react";
import { createGeraet, updateGeraet } from "@/lib/actions/geraete";
import { transformGeraetValues, type GeraetFormValues } from "@/lib/validations/geraet";
import type { Geraeteart, Geraetestatus } from "@/types/database";

interface GeraetePageClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialGeraete: any[];
  geraetearten: Geraeteart[];
  statusListe: Geraetestatus[];
}

export function GeraetePageClient({
  initialGeraete,
  geraetearten,
  statusListe,
}: GeraetePageClientProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingGeraet, setEditingGeraet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenNew = () => {
    setEditingGeraet(null);
    setDialogOpen(true);
  };

  const handleSave = async (values: GeraetFormValues) => {
    setIsLoading(true);
    try {
      const transformedValues = transformGeraetValues(values);
      if (editingGeraet) {
        await updateGeraet(editingGeraet.id, transformedValues);
      } else {
        await createGeraet(transformedValues);
      }
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Geräte"
        description="Verwaltung aller Erschütterungsmessgeräte"
      >
        <Button onClick={handleOpenNew}>
          <Plus className="mr-2 h-4 w-4" />
          Neues Gerät
        </Button>
      </PageHeader>

      <GeraeteTable geraete={initialGeraete} />

      <GeraeteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        geraet={editingGeraet}
        geraetearten={geraetearten}
        statusListe={statusListe}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
