"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auftragSchema, type AuftragFormValues } from "@/lib/validations/auftrag";
import type { Auftrag } from "@/types/database";

interface AuftraegeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auftrag?: Auftrag | null;
  nextAuftragsnummer?: string;
  onSave: (values: AuftragFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function AuftraegeDialog({
  open,
  onOpenChange,
  auftrag,
  nextAuftragsnummer,
  onSave,
  isLoading = false,
}: AuftraegeDialogProps) {
  const isEditing = !!auftrag;

  const form = useForm<AuftragFormValues>({
    resolver: zodResolver(auftragSchema),
    defaultValues: {
      auftragsnummer: "",
      auftragsort: "",
      bezeichnung: "",
      status: "aktiv",
    },
  });

  useEffect(() => {
    if (auftrag) {
      form.reset({
        auftragsnummer: auftrag.auftragsnummer,
        auftragsort: auftrag.auftragsort || "",
        bezeichnung: auftrag.auftragsbezeichnung || "",
        status: auftrag.status,
      });
    } else {
      form.reset({
        auftragsnummer: nextAuftragsnummer || "",
        auftragsort: "",
        bezeichnung: "",
        status: "aktiv",
      });
    }
  }, [auftrag, nextAuftragsnummer, form]);

  const handleSubmit = async (values: AuftragFormValues) => {
    try {
      await onSave(values);
      onOpenChange(false);
    } catch {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Auftrag bearbeiten" : "Neuer Auftrag"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Bearbeiten Sie die Auftragsinformationen."
              : "Erstellen Sie einen neuen Auftrag."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="auftragsnummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auftragsnummer *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="51XXXX.XXXX"
                      {...field}
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="auftragsort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auftragsort</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="z.B. Zürich, Bahnhofstrasse"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bezeichnung"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bezeichnung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beschreibung des Auftrags..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Auswählen..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="aktiv">Aktiv</SelectItem>
                      <SelectItem value="inaktiv">Inaktiv</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Speichern..." : isEditing ? "Speichern" : "Erstellen"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
