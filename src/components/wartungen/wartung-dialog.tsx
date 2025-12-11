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
import { wartungSchema, type WartungFormValues } from "@/lib/validations/wartung";
import type { Wartungsart } from "@/types/database";

interface WartungDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  geraetId: string;
  wartungsarten: Wartungsart[];
  onSave: (values: WartungFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function WartungDialog({
  open,
  onOpenChange,
  geraetId,
  wartungsarten,
  onSave,
  isLoading = false,
}: WartungDialogProps) {
  const form = useForm<WartungFormValues>({
    resolver: zodResolver(wartungSchema),
    defaultValues: {
      geraet_id: geraetId,
      wartungsart_id: null,
      datum: new Date().toISOString().split("T")[0],
      durchgefuehrt_von: "",
      notizen: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        geraet_id: geraetId,
        wartungsart_id: null,
        datum: new Date().toISOString().split("T")[0],
        durchgefuehrt_von: "",
        notizen: "",
      });
    }
  }, [open, geraetId, form]);

  const handleSubmit = async (values: WartungFormValues) => {
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
          <DialogTitle>Wartung erfassen</DialogTitle>
          <DialogDescription>
            Erfassen Sie eine neue Wartung für dieses Gerät.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="wartungsart_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wartungsart</FormLabel>
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
                      {wartungsarten.map((art) => (
                        <SelectItem key={art.id} value={art.id}>
                          {art.bezeichnung}
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
              name="datum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Datum *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durchgefuehrt_von"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durchgeführt von</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name des Technikers"
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
              name="notizen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notizen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Zusätzliche Informationen zur Wartung..."
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
                {isLoading ? "Speichern..." : "Wartung erfassen"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
