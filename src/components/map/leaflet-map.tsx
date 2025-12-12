"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface LeafletMapProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  einsaetze: any[];
}

export function LeafletMap({ einsaetze }: LeafletMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [leafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    // Dynamischer Import von Leaflet nur auf dem Client
    const loadLeaflet = async () => {
      // CSS über Link-Tag laden
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = (await import("leaflet")).default;
      const { MapContainer, TileLayer, Marker, Popup } = await import("react-leaflet");

      // Fix für Leaflet Marker Icons in Next.js
      const defaultIcon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      L.Marker.prototype.options.icon = defaultIcon;

      setLeafletComponents({ MapContainer, TileLayer, Marker, Popup });
      setIsMounted(true);
    };

    loadLeaflet();
  }, []);

  if (!isMounted || !leafletComponents) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">Karte wird geladen...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = leafletComponents;

  // Einsätze mit Koordinaten filtern
  const einsaetzeMitKoordinaten = einsaetze.filter(
    (e) => e.koordinaten_lat !== null && e.koordinaten_lng !== null
  );

  // Schweiz-Zentrum als Standard
  const defaultCenter: [number, number] = [46.8182, 8.2275];
  const defaultZoom = 8;

  // Wenn Einsätze vorhanden sind, zentrieren wir auf den ersten
  const center: [number, number] =
    einsaetzeMitKoordinaten.length > 0
      ? [einsaetzeMitKoordinaten[0].koordinaten_lat!, einsaetzeMitKoordinaten[0].koordinaten_lng!]
      : defaultCenter;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("de-CH");
  };

  return (
    <MapContainer
      center={center}
      zoom={defaultZoom}
      scrollWheelZoom={true}
      className="h-[600px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {einsaetzeMitKoordinaten.map((einsatz) => (
        <Marker key={einsatz.id} position={[einsatz.koordinaten_lat!, einsatz.koordinaten_lng!]}>
          <Popup>
            <div className="min-w-[200px]">
              <div className="font-medium text-lg">{einsatz.geraet.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                {einsatz.strasse && <div>{einsatz.strasse}</div>}
                {(einsatz.plz || einsatz.ort) && (
                  <div>
                    {einsatz.plz} {einsatz.ort}
                  </div>
                )}
              </div>

              <div className="border-t my-2 pt-2">
                <div className="text-sm">
                  <span className="text-gray-500">Auftrag:</span>{" "}
                  <span className="font-medium">{einsatz.auftrag.auftragsnummer}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Seit:</span>{" "}
                  {formatDate(einsatz.von)}
                </div>
                {einsatz.bis_provisorisch && (
                  <div className="text-sm">
                    <span className="text-gray-500">Geplant bis:</span>{" "}
                    {formatDate(einsatz.bis_provisorisch)}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <Link href={`/einsaetze/${einsatz.id}`}>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
