"use client";

import { useState, useEffect, useCallback } from "react";
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
import { einsatzSchema, type EinsatzFormValues } from "@/lib/validations/einsatz";
import {
  searchAddress,
  parseGeocodingResult,
  debounce,
  type GeocodingResult,
} from "@/lib/services/geocoding";
import type { Geraet, Auftrag, Geraeteart, Geraetestatus } from "@/types/database";
import { ChevronLeft, ChevronRight, MapPin, Search } from "lucide-react";

type GeraetMitRelationen = Geraet & {
  geraeteart: Geraeteart | null;
  status: Geraetestatus | null;
};

interface EinsatzWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verfuegbareGeraete: GeraetMitRelationen[];
  auftraege: Auftrag[];
  onSave: (values: EinsatzFormValues) => Promise<void>;
  isLoading?: boolean;
}

export function EinsatzWizard({
  open,
  onOpenChange,
  verfuegbareGeraete,
  auftraege,
  onSave,
  isLoading = false,
}: EinsatzWizardProps) {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EinsatzFormValues>({
    resolver: zodResolver(einsatzSchema),
    defaultValues: {
      geraet_id: "",
      auftrag_id: "",
      von: new Date().toISOString().split("T")[0],
      bis_provisorisch: "",
      strasse: "",
      plz: "",
      ort: "",
      lat: null,
      lng: null,
      notizen: "",
    },
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      setError(null);
      form.reset({
        geraet_id: "",
        auftrag_id: "",
        von: new Date().toISOString().split("T")[0],
        bis_provisorisch: "",
        strasse: "",
        plz: "",
        ort: "",
        lat: null,
        lng: null,
        notizen: "",
      });
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [open, form]);

  const doSearch = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchAddress(query);
      setSearchResults(results);
    } finally {
      setIsSearching(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => doSearch(query), 1000),
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSelectAddress = (result: GeocodingResult) => {
    const parsed = parseGeocodingResult(result);
    form.setValue("strasse", parsed.strasse || "");
    form.setValue("plz", parsed.plz || "");
    form.setValue("ort", parsed.ort || "");
    form.setValue("lat", parsed.lat);
    form.setValue("lng", parsed.lng);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSubmit = async (values: EinsatzFormValues) => {
    setError(null);
    try {
      await onSave(values);
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ein Fehler ist aufgetreten";
      setError(message);
      console.error("Einsatz erstellen fehlgeschlagen:", err);
    }
  };

  const canProceedStep1 = form.watch("geraet_id") && form.watch("auftrag_id");
  const canProceedStep2 = form.watch("von");

  const stepTitles = ["Gerät & Auftrag", "Zeitraum", "Standort"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Neuer Einsatz</DialogTitle>
          <DialogDescription>
            Schritt {step} von 3: {stepTitles[step - 1]}
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Step 1: Gerät & Auftrag */}
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="geraet_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gerät *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Gerät auswählen..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {verfuegbareGeraete.length === 0 ? (
                            <div className="py-2 px-2 text-sm text-muted-foreground">
                              Keine verfügbaren Geräte
                            </div>
                          ) : (
                            verfuegbareGeraete.map((geraet) => (
                              <SelectItem key={geraet.id} value={geraet.id}>
                                {geraet.name} - {geraet.seriennummer}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="auftrag_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auftrag *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Auftrag auswählen..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {auftraege.map((auftrag) => (
                            <SelectItem key={auftrag.id} value={auftrag.id}>
                              {auftrag.auftragsnummer}
                              {auftrag.auftragsort && ` - ${auftrag.auftragsort}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 2: Zeitraum */}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="von"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Startdatum *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bis_provisorisch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Geplantes Enddatum (provisorisch)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ""} />
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
                          placeholder="Zusätzliche Informationen..."
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 3: Standort */}
            {step === 3 && (
              <>
                <div className="space-y-2">
                  <FormLabel>Adresse suchen</FormLabel>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Adresse eingeben..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {isSearching && (
                    <p className="text-sm text-muted-foreground">Suche...</p>
                  )}
                  {searchResults.length > 0 && (
                    <div className="border rounded-md max-h-40 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2"
                          onClick={() => handleSelectAddress(result)}
                        >
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{result.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="strasse"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Strasse</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="plz"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PLZ</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ort</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("lat") && form.watch("lng") && (
                  <p className="text-sm text-muted-foreground">
                    Koordinaten: {form.watch("lat")?.toFixed(6)},{" "}
                    {form.watch("lng")?.toFixed(6)}
                  </p>
                )}
              </>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <DialogFooter>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={isLoading}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && !canProceedStep2)
                  }
                >
                  Weiter
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Erstellen..." : "Einsatz erstellen"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
