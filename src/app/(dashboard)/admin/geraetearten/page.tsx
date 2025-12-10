"use client";

import { AdminGuard } from "@/components/layout/admin-guard";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GeraeartePage() {
  return (
    <AdminGuard>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <PageHeader
            title="Gerätearten"
            description="Typen von Messgeräten verwalten"
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Neue Geräteart
            </Button>
          </PageHeader>
        </div>

        <EmptyState
          title="Keine Gerätearten vorhanden"
          description="Definieren Sie die verschiedenen Arten von Messgeräten."
          icon={<Tag className="h-6 w-6 text-muted-foreground" />}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Geräteart erstellen
          </Button>
        </EmptyState>
      </div>
    </AdminGuard>
  );
}
