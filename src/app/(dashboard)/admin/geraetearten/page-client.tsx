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
import { Plus, Pencil, Trash2, Tag, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  createGeraeteart,
  updateGeraeteart,
  deleteGeraeteart,
} from "@/lib/actions/admin";

interface Geraeteart {
  id: string;
  bezeichnung: string;
  sortierung: number | null;
}

interface GeraeteartenPageClientProps {
  initialGeraetearten: Geraeteart[];
}

export function GeraeteartenPageClient({ initialGeraetearten }: GeraeteartenPageClientProps) {
  const router = useRouter();
  const [geraetearten] = useState(initialGeraetearten);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingGeraeteart, setEditingGeraeteart] = useState<Geraeteart | null>(null);
  const [deletingGeraeteart, setDeletingGeraeteart] = useState<Geraeteart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formBeschreibung, setFormBeschreibung] = useState("");

  const handleOpenNew = () => {
    setEditingGeraeteart(null);
    setFormName("");
    setFormBeschreibung("");
    setError(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (geraeteart: Geraeteart) => {
    setEditingGeraeteart(geraeteart);
    setFormName(geraeteart.bezeichnung);
    setFormBeschreibung("");
    setError(null);
    setDialogOpen(true);
  };

  const handleOpenDelete = (geraeteart: Geraeteart) => {
    setDeletingGeraeteart(geraeteart);
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
      if (editingGeraeteart) {
        await updateGeraeteart(editingGeraeteart.id, {
          bezeichnung: formName.trim(),
        });
      } else {
        await createGeraeteart({
          bezeichnung: formName.trim(),
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
    if (!deletingGeraeteart) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteGeraeteart(deletingGeraeteart.id);
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
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
            title="Gerätearten"
            description="Typen von Messgeräten verwalten"
          >
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" />
              Neue Geräteart
            </Button>
          </PageHeader>
        </div>

        {geraetearten.length === 0 ? (
          <EmptyState
            title="Keine Gerätearten vorhanden"
            description="Definieren Sie die verschiedenen Arten von Messgeräten."
            icon={<Tag className="h-6 w-6 text-muted-foreground" />}
          >
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" />
              Geräteart erstellen
            </Button>
          </EmptyState>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Beschreibung</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {geraetearten.map((geraeteart) => (
                  <TableRow key={geraeteart.id}>
                    <TableCell className="font-medium">{geraeteart.bezeichnung}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {geraeteart.sortierung || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(geraeteart)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(geraeteart)}
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
                {editingGeraeteart ? "Geräteart bearbeiten" : "Neue Geräteart"}
              </DialogTitle>
              <DialogDescription>
                {editingGeraeteart
                  ? "Bearbeiten Sie die Geräteart."
                  : "Erstellen Sie eine neue Geräteart für Messgeräte."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="z.B. Erschütterungsmessgerät, Seismograph"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beschreibung">Beschreibung (optional)</Label>
                <Textarea
                  id="beschreibung"
                  value={formBeschreibung}
                  onChange={(e) => setFormBeschreibung(e.target.value)}
                  placeholder="Optionale Beschreibung der Geräteart"
                  rows={3}
                />
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
                {editingGeraeteart ? "Speichern" : "Erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Geräteart löschen</DialogTitle>
              <DialogDescription>
                Möchten Sie die Geräteart &quot;{deletingGeraeteart?.bezeichnung}&quot; wirklich löschen?
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
