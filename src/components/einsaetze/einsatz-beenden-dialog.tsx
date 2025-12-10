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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  einsatzBeendenSchema,
  type EinsatzBeendenFormValues,
} from "@/lib/validations/einsatz";
import type { Geraetestatus } from "@/types/database";

interface EinsatzBeendenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  statusListe: Geraetestatus[];
  onSave: (values: EinsatzBeendenFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function EinsatzBeendenDialog({
  open,
  onOpenChange,
  statusListe,
  onSave,
  isLoading = false,
}: EinsatzBeendenDialogProps) {
  const form = useForm<EinsatzBeendenFormValues>({
    resolver: zodResolver(einsatzBeendenSchema),
    defaultValues: {
      bis_effektiv: new Date().toISOString().split("T")[0],
      neuer_status_id: "",
    },
  });

  useEffect(() => {
    if (open) {
      const imBueroStatus = statusListe.find((s) => s.name === "im Büro");
      form.reset({
        bis_effektiv: new Date().toISOString().split("T")[0],
        neuer_status_id: imBueroStatus?.id || "",
      });
    }
  }, [open, statusListe, form]);

  const handleSubmit = async (values: EinsatzBeendenFormValues) => {
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
          <DialogTitle>Einsatz beenden</DialogTitle>
          <DialogDescription>
            Geben Sie das effektive Enddatum ein und wählen Sie den neuen
            Gerätestatus.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bis_effektiv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effektives Enddatum *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="neuer_status_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Neuer Gerätestatus *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Status auswählen..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusListe
                        .filter((s) => s.name !== "im Einsatz")
                        .map((status) => (
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
                {isLoading ? "Beenden..." : "Einsatz beenden"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
