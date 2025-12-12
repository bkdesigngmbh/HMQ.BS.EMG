"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EinsaetzeTable } from "@/components/einsaetze/einsaetze-table";
import { EinsatzWizard } from "@/components/einsaetze/einsatz-wizard";
import { Plus } from "lucide-react";
import { createEinsatz } from "@/lib/actions/einsaetze";
import { type EinsatzFormValues } from "@/lib/validations/einsatz";
import type { Auftrag } from "@/types/database";

interface EinsaetzePageClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialEinsaetze: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  verfuegbareGeraete: any[];
  auftraege: Auftrag[];
}

export function EinsaetzePageClient({
  initialEinsaetze,
  verfuegbareGeraete,
  auftraege,
}: EinsaetzePageClientProps) {
  const router = useRouter();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (values: EinsatzFormValues) => {
    setIsLoading(true);
    try {
      // Direkt values übergeben - Transform passiert in der Server Action
      await createEinsatz(values);
      router.refresh();
    } catch (error) {
      console.error("Fehler beim Erstellen des Einsatzes:", error);
      throw error; // Re-throw damit Wizard den Fehler anzeigen kann
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Einsätze"
        description="Übersicht aller Geräteeinsätze"
      >
        <Button onClick={() => setWizardOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Einsatz
        </Button>
      </PageHeader>

      <EinsaetzeTable einsaetze={initialEinsaetze} />

      <EinsatzWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        verfuegbareGeraete={verfuegbareGeraete}
        auftraege={auftraege}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
