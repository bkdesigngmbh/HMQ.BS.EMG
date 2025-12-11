"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Pencil, Trash2, Activity, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  createGeraetestatus,
  updateGeraetestatus,
  deleteGeraetestatus,
} from "@/lib/actions/admin";

interface Status {
  id: string;
  bezeichnung: string;
  farbe: string;
  sortierung: number | null;
}

interface StatusPageClientProps {
  initialStatus: Status[];
}

export function StatusPageClient({ initialStatus }: StatusPageClientProps) {
  const router = useRouter();
  const [statusListe] = useState(initialStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<Status | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formFarbe, setFormFarbe] = useState("#3b82f6");

  const handleOpenNew = () => {
    setEditingStatus(null);
    setFormName("");
    setFormFarbe("#3b82f6");
    setError(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (status: Status) => {
    setEditingStatus(status);
    setFormName(status.bezeichnung);
    setFormFarbe(status.farbe);
    setError(null);
    setDialogOpen(true);
  };

  const handleOpenDelete = (status: Status) => {
    setDeletingStatus(status);
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
      if (editingStatus) {
        await updateGeraetestatus(editingStatus.id, {
          bezeichnung: formName.trim(),
          farbe: formFarbe,
        });
      } else {
        await createGeraetestatus({
          bezeichnung: formName.trim(),
          farbe: formFarbe,
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
    if (!deletingStatus) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteGeraetestatus(deletingStatus.id);
      setDeleteDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <PageHeader
            title="Gerätestatus"
            description="Status-Bezeichnungen und Farben verwalten"
          >
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Status
            </Button>
          </PageHeader>
        </div>

        {statusListe.length === 0 ? (
          <EmptyState
            title="Keine Status vorhanden"
            description="Erstellen Sie Status-Bezeichnungen für Ihre Geräte."
            icon={<Activity className="h-6 w-6 text-muted-foreground" />}
          >
            <Button onClick={handleOpenNew}>
              <Plus className="mr-2 h-4 w-4" />
              Status erstellen
            </Button>
          </EmptyState>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Farbe</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusListe.map((status) => (
                  <TableRow key={status.id}>
                    <TableCell className="font-medium">{status.bezeichnung}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded border"
                          style={{ backgroundColor: status.farbe }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {status.farbe}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(status)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(status)}
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
                {editingStatus ? "Status bearbeiten" : "Neuer Status"}
              </DialogTitle>
              <DialogDescription>
                {editingStatus
                  ? "Bearbeiten Sie die Status-Bezeichnung und Farbe."
                  : "Erstellen Sie eine neue Status-Bezeichnung für Geräte."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="z.B. im Büro, im Einsatz, defekt"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farbe">Farbe</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="farbe"
                    type="color"
                    value={formFarbe}
                    onChange={(e) => setFormFarbe(e.target.value)}
                    className="h-10 w-14 p-1 cursor-pointer"
                  />
                  <Input
                    value={formFarbe}
                    onChange={(e) => setFormFarbe(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
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
                {editingStatus ? "Speichern" : "Erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Status löschen</DialogTitle>
              <DialogDescription>
                Möchten Sie den Status &quot;{deletingStatus?.bezeichnung}&quot; wirklich löschen?
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
  );
}
