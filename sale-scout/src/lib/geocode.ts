/**
 * Free-text address/zip -> coordinates using OpenStreetMap's Nominatim
 * search API. No API key needed, but Nominatim's usage policy expects
 * light, infrequent client use with an identifying reference; a
 * production deployment should proxy this through a backend that sets a
 * proper User-Agent and respects the ~1 req/sec rate limit.
 */
export async function geocodeAddress(
  query: string,
): Promise<{ lat: number; lng: number; label: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
    query,
  )}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const results = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;

  const first = results[0];
  if (!first) return null;

  return {
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    label: first.display_name,
  };
}

/** Coordinates -> city/town name, via Nominatim reverse geocoding. Same usage-policy notes as geocodeAddress. */
export async function reverseGeocodeCity(point: {
  lat: number;
  lng: number;
}): Promise<string | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${point.lat}&lon=${point.lng}&zoom=10`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = (await res.json()) as {
    address?: { city?: string; town?: string; village?: string; county?: string };
  };

  const address = data.address;
  if (!address) return null;
  return address.city ?? address.town ?? address.village ?? address.county ?? null;
}
