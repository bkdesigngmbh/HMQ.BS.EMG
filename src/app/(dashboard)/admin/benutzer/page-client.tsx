"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Users, ArrowLeft, Loader2, Mail, Shield, User } from "lucide-react";
import Link from "next/link";
import {
  updateBenutzerRolle,
  inviteBenutzer,
} from "@/lib/actions/admin";

interface Benutzer {
  id: string;
  email: string;
  rolle: "admin" | "user";
  created_at: string;
}

interface BenutzerPageClientProps {
  initialBenutzer: Benutzer[];
}

export function BenutzerPageClient({ initialBenutzer }: BenutzerPageClientProps) {
  const router = useRouter();
  const [benutzer] = useState(initialBenutzer);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingBenutzer, setEditingBenutzer] = useState<Benutzer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRolle, setInviteRolle] = useState<"admin" | "user">("user");
  const [newRolle, setNewRolle] = useState<"admin" | "user">("user");

  const handleOpenInvite = () => {
    setInviteEmail("");
    setInviteRolle("user");
    setError(null);
    setSuccess(null);
    setInviteDialogOpen(true);
  };

  const handleOpenRoleChange = (user: Benutzer) => {
    setEditingBenutzer(user);
    setNewRolle(user.rolle);
    setError(null);
    setRoleDialogOpen(true);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      setError("Bitte geben Sie eine E-Mail-Adresse ein");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await inviteBenutzer(inviteEmail.trim(), inviteRolle);
      setSuccess(`Einladung wurde an ${inviteEmail} gesendet`);
      setInviteEmail("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!editingBenutzer) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateBenutzerRolle(editingBenutzer.id, newRolle);
      setRoleDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
            title="Benutzer"
            description="Benutzerkonten und Rollen verwalten"
          >
            <Button onClick={handleOpenInvite}>
              <Plus className="mr-2 h-4 w-4" />
              Benutzer einladen
            </Button>
          </PageHeader>
        </div>

        {benutzer.length === 0 ? (
          <EmptyState
            title="Keine Benutzer vorhanden"
            description="Laden Sie Benutzer ein, um ihnen Zugang zur Anwendung zu geben."
            icon={<Users className="h-6 w-6 text-muted-foreground" />}
          >
            <Button onClick={handleOpenInvite}>
              <Plus className="mr-2 h-4 w-4" />
              Benutzer einladen
            </Button>
          </EmptyState>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Registriert am</TableHead>
                  <TableHead className="w-[100px]">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benutzer.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.rolle === "admin" ? "default" : "secondary"}
                        className="flex items-center gap-1 w-fit"
                      >
                        {user.rolle === "admin" ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        {user.rolle === "admin" ? "Administrator" : "Benutzer"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenRoleChange(user)}
                      >
                        Rolle ändern
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Invite User Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Benutzer einladen</DialogTitle>
              <DialogDescription>
                Senden Sie eine Einladung per E-Mail an einen neuen Benutzer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="benutzer@beispiel.ch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rolle">Rolle</Label>
                <Select value={inviteRolle} onValueChange={(v) => setInviteRolle(v as "admin" | "user")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Benutzer
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Administratoren haben Zugriff auf alle Einstellungen und können Benutzer verwalten.
                </p>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-600">{success}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setInviteDialogOpen(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button onClick={handleInvite} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Einladung senden
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Role Dialog */}
        <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rolle ändern</DialogTitle>
              <DialogDescription>
                Ändern Sie die Rolle für {editingBenutzer?.email}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Neue Rolle</Label>
                <Select value={newRolle} onValueChange={(v) => setNewRolle(v as "admin" | "user")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Benutzer
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRoleDialogOpen(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button onClick={handleRoleChange} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Speichern
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
