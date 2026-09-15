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
