// Geocoding Service mit Nominatim API
// Fokus auf Schweiz (countrycodes=ch)

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
  };
}

export interface ParsedAddress {
  strasse: string | null;
  plz: string | null;
  ort: string | null;
  lat: number | null;
  lng: number | null;
}

// Cache für Geocoding-Ergebnisse
const geocodingCache = new Map<string, GeocodingResult[]>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 Stunde
const cacheTimestamps = new Map<string, number>();

function getCacheKey(query: string): string {
  return query.toLowerCase().trim();
}

function isCacheValid(key: string): boolean {
  const timestamp = cacheTimestamps.get(key);
  if (!timestamp) return false;
  return Date.now() - timestamp < CACHE_DURATION;
}

export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 3) {
    return [];
  }

  const cacheKey = getCacheKey(query);

  // Cache prüfen
  if (geocodingCache.has(cacheKey) && isCacheValid(cacheKey)) {
    return geocodingCache.get(cacheKey) || [];
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: "json",
      addressdetails: "1",
      limit: "5",
      countrycodes: "ch", // Fokus auf Schweiz
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "HMQ-EMG-App/1.0", // Nominatim erfordert User-Agent
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.statusText}`);
    }

    const results: GeocodingResult[] = await response.json();

    // Cache aktualisieren
    geocodingCache.set(cacheKey, results);
    cacheTimestamps.set(cacheKey, Date.now());

    return results;
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
}

export function parseGeocodingResult(result: GeocodingResult): ParsedAddress {
  const address = result.address;

  // Strasse zusammensetzen
  let strasse: string | null = null;
  if (address.road) {
    strasse = address.road;
    if (address.house_number) {
      strasse += ` ${address.house_number}`;
    }
  }

  // Ort bestimmen (verschiedene Nominatim-Felder prüfen)
  const ort = address.city || address.town || address.village || address.municipality || null;

  return {
    strasse,
    plz: address.postcode || null,
    ort,
    lat: parseFloat(result.lat) || null,
    lng: parseFloat(result.lon) || null,
  };
}

// Debounce-Utility für Client-Verwendung
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Reverse Geocoding (Koordinaten zu Adresse)
export async function reverseGeocode(lat: number, lng: number): Promise<ParsedAddress | null> {
  const cacheKey = `reverse:${lat},${lng}`;

  // Cache prüfen
  if (geocodingCache.has(cacheKey) && isCacheValid(cacheKey)) {
    const cached = geocodingCache.get(cacheKey);
    if (cached && cached[0]) {
      return parseGeocodingResult(cached[0]);
    }
  }

  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: "json",
      addressdetails: "1",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          "User-Agent": "HMQ-EMG-App/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.statusText}`);
    }

    const result: GeocodingResult = await response.json();

    // Cache aktualisieren
    geocodingCache.set(cacheKey, [result]);
    cacheTimestamps.set(cacheKey, Date.now());

    return parseGeocodingResult(result);
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}
