"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/layout/admin-guard";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Pencil, Trash2, Wrench, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  createWartungsart,
  updateWartungsart,
  deleteWartungsart,
} from "@/lib/actions/admin";

interface Wartungsart {
  id: string;
  name: string;
  beschreibung: string | null;
  intervall_monate: number | null;
}

interface WartungsartenPageClientProps {
  initialWartungsarten: Wartungsart[];
}

export function WartungsartenPageClient({ initialWartungsarten }: WartungsartenPageClientProps) {
  const router = useRouter();
  const [wartungsarten] = useState(initialWartungsarten);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingWartungsart, setEditingWartungsart] = useState<Wartungsart | null>(null);
  const [deletingWartungsart, setDeletingWartungsart] = useState<Wartungsart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formBeschreibung, setFormBeschreibung] = useState("");
  const [formIntervall, setFormIntervall] = useState("");

  const handleOpenNew = () => {
    setEditingWartungsart(null);
    setFormName("");
    setFormBeschreibung("");
    setFormIntervall("");
    setError(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (wartungsart: Wartungsart) => {
    setEditingWartungsart(wartungsart);
    setFormName(wartungsart.name);
    setFormBeschreibung(wartungsart.beschreibung || "");
    setFormIntervall(wartungsart.intervall_monate?.toString() || "");
    setError(null);
    setDialogOpen(true);
  };

  const handleOpenDelete = (wartungsart: Wartungsart) => {
    setDeletingWartungsart(wartungsart);
    setError(null);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setError("Bitte geben Sie einen Namen ein");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const intervall = formIntervall.trim() ? parseInt(formIntervall, 10) : undefined;

      if (editingWartungsart) {
        await updateWartungsart(editingWartungsart.id, {
          name: formName.trim(),
          beschreibung: formBeschreibung.trim() || undefined,
          intervall_monate: intervall,
        });
      } else {
        await createWartungsart({
          name: formName.trim(),
          beschreibung: formBeschreibung.trim() || undefined,
          intervall_monate: intervall,
        });
      }
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingWartungsart) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteWartungsart(deletingWartungsart.id);
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const formatIntervall = (monate: number | null) => {
    if (!monate) return "-";
    if (monate === 1) return "1 Monat";
    if (monate === 12) return "1 Jahr";
    if (monate % 12 === 0) return `${monate / 12} Jahre`;
    return `${monate} Monate`;
  };

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
            title="Wartungsarten"
            description="Wartungstypen und Intervalle verwalten"
          >
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Wartungsart
            </Button>
          </PageHeader>
        </div>

        {wartungsarten.length === 0 ? (
          <EmptyState
            title="Keine Wartungsarten vorhanden"
            description="Definieren Sie die verschiedenen Arten von Wartungen."
            icon={<Wrench className="h-6 w-6 text-muted-foreground" />}
          >
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" />
              Wartungsart erstellen
            </Button>
          </EmptyState>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead>Intervall</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wartungsarten.map((wartungsart) => (
                  <TableRow key={wartungsart.id}>
                    <TableCell className="font-medium">{wartungsart.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {wartungsart.beschreibung || "-"}
                    </TableCell>
                    <TableCell>{formatIntervall(wartungsart.intervall_monate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(wartungsart)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(wartungsart)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingWartungsart ? "Wartungsart bearbeiten" : "Neue Wartungsart"}
              </DialogTitle>
              <DialogDescription>
                {editingWartungsart
                  ? "Bearbeiten Sie die Wartungsart."
                  : "Erstellen Sie eine neue Wartungsart."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="z.B. Kalibrierung, Batteriepflege"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beschreibung">Beschreibung (optional)</Label>
                <Textarea
                  id="beschreibung"
                  value={formBeschreibung}
                  onChange={(e) => setFormBeschreibung(e.target.value)}
                  placeholder="Optionale Beschreibung der Wartungsart"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intervall">Intervall in Monaten (optional)</Label>
                <Input
                  id="intervall"
                  type="number"
                  min="1"
                  value={formIntervall}
                  onChange={(e) => setFormIntervall(e.target.value)}
                  placeholder="z.B. 12 für jährlich"
                />
                <p className="text-xs text-muted-foreground">
                  Empfohlenes Wartungsintervall in Monaten
                </p>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingWartungsart ? "Speichern" : "Erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Wartungsart löschen</DialogTitle>
              <DialogDescription>
                Möchten Sie die Wartungsart &quot;{deletingWartungsart?.name}&quot; wirklich löschen?
                Diese Aktion kann nicht rückgängig gemacht werden.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Löschen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
