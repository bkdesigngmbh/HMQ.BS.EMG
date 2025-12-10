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
import { geraetSchema, type GeraetFormValues } from "@/lib/validations/geraet";
import type { Geraet, Geraeteart, Geraetestatus } from "@/types/database";

interface GeraeteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  geraet?: Geraet | null;
  geraetearten: Geraeteart[];
  statusListe: Geraetestatus[];
  onSave: (values: GeraetFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function GeraeteDialog({
  open,
  onOpenChange,
  geraet,
  geraetearten,
  statusListe,
  onSave,
  isLoading = false,
}: GeraeteDialogProps) {
  const isEditing = !!geraet;

  const form = useForm<GeraetFormValues>({
    resolver: zodResolver(geraetSchema),
    defaultValues: {
      name: "",
      eigentum: "eigen",
      seriennummer: "",
      client: "",
      ip_adresse: "",
      pin: "",
      geraeteart_id: null,
      status_id: null,
      kaufdatum: "",
      naechster_service: "",
      notizen: "",
    },
  });

  useEffect(() => {
    if (geraet) {
      form.reset({
        name: geraet.name,
        eigentum: geraet.eigentum,
        seriennummer: geraet.seriennummer,
        client: geraet.client || "",
        ip_adresse: geraet.ip_adresse || "",
        pin: geraet.pin || "",
        geraeteart_id: geraet.geraeteart_id,
        status_id: geraet.status_id,
        kaufdatum: geraet.kaufdatum || "",
        naechster_service: geraet.naechster_service || "",
        notizen: geraet.notizen || "",
      });
    } else {
      form.reset({
        name: "",
        eigentum: "eigen",
        seriennummer: "",
        client: "",
        ip_adresse: "",
        pin: "",
        geraeteart_id: null,
        status_id: statusListe.find((s) => s.name === "im Büro")?.id || null,
        kaufdatum: "",
        naechster_service: "",
        notizen: "",
      });
    }
  }, [geraet, form, statusListe]);

  const handleSubmit = async (values: GeraetFormValues) => {
    try {
      await onSave(values);
      onOpenChange(false);
    } catch {
      // Error handling is done in parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Gerät bearbeiten" : "Neues Gerät"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Bearbeiten Sie die Geräteinformationen."
              : "Erstellen Sie ein neues Erschütterungsmessgerät."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="HMQ-0001 oder ZC-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seriennummer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seriennummer *</FormLabel>
                    <FormControl>
                      <Input placeholder="12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="eigentum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eigentum *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="eigen">Eigen</SelectItem>
                        <SelectItem value="miete">Miete</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="geraeteart_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Geräteart</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {geraetearten.map((art) => (
                          <SelectItem key={art.id} value={art.id}>
                            {art.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Auswählen..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusListe.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input placeholder="01-01" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ip_adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP-Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.1" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN</FormLabel>
                    <FormControl>
                      <Input placeholder="1234" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="kaufdatum"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kaufdatum</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="naechster_service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nächster Service</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notizen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notizen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Zusätzliche Informationen..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
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
