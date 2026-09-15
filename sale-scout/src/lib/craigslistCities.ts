import { distanceMiles } from "./geo";

export interface CraigslistCity {
  /** Subdomain used in the city's craigslist URL, e.g. "austin" -> austin.craigslist.org */
  subdomain: string;
  label: string;
  lat: number;
  lng: number;
}

/**
 * A curated (not exhaustive) list of major US craigslist city sites and
 * their approximate centers. Craigslist has ~400+ city sites with
 * irregular, undocumented boundaries — there's no public API for "which
 * site covers this lat/lng," so this picks the nearest known center as a
 * best-effort guess. Good enough near major metros; less accurate in
 * rural areas far from any listed city.
 */
export const CRAIGSLIST_CITIES: CraigslistCity[] = [
  { subdomain: "newyork", label: "New York, NY", lat: 40.7128, lng: -74.006 },
  { subdomain: "losangeles", label: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { subdomain: "chicago", label: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  { subdomain: "houston", label: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  { subdomain: "phoenix", label: "Phoenix, AZ", lat: 33.4484, lng: -112.074 },
  { subdomain: "philadelphia", label: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 },
  { subdomain: "sanantonio", label: "San Antonio, TX", lat: 29.4241, lng: -98.4936 },
  { subdomain: "sandiego", label: "San Diego, CA", lat: 32.7157, lng: -117.1611 },
  { subdomain: "dallas", label: "Dallas, TX", lat: 32.7767, lng: -96.797 },
  { subdomain: "austin", label: "Austin, TX", lat: 30.2672, lng: -97.7431 },
  { subdomain: "sfbay", label: "San Francisco Bay Area, CA", lat: 37.7749, lng: -122.4194 },
  { subdomain: "seattle", label: "Seattle, WA", lat: 47.6062, lng: -122.3321 },
  { subdomain: "denver", label: "Denver, CO", lat: 39.7392, lng: -104.9903 },
  { subdomain: "boston", label: "Boston, MA", lat: 42.3601, lng: -71.0589 },
  { subdomain: "nashville", label: "Nashville, TN", lat: 36.1627, lng: -86.7816 },
  { subdomain: "portland", label: "Portland, OR", lat: 45.5152, lng: -122.6784 },
  { subdomain: "lasvegas", label: "Las Vegas, NV", lat: 36.1699, lng: -115.1398 },
  { subdomain: "detroit", label: "Detroit, MI", lat: 42.3314, lng: -83.0458 },
  { subdomain: "memphis", label: "Memphis, TN", lat: 35.1495, lng: -90.049 },
  { subdomain: "charlotte", label: "Charlotte, NC", lat: 35.2271, lng: -80.8431 },
  { subdomain: "elpaso", label: "El Paso, TX", lat: 31.7619, lng: -106.485 },
  { subdomain: "okc", label: "Oklahoma City, OK", lat: 35.4676, lng: -97.5164 },
  { subdomain: "columbus", label: "Columbus, OH", lat: 39.9612, lng: -82.9988 },
  { subdomain: "indianapolis", label: "Indianapolis, IN", lat: 39.7684, lng: -86.1581 },
  { subdomain: "sacramento", label: "Sacramento, CA", lat: 38.5816, lng: -121.4944 },
  { subdomain: "baltimore", label: "Baltimore, MD", lat: 39.2904, lng: -76.6122 },
  { subdomain: "milwaukee", label: "Milwaukee, WI", lat: 43.0389, lng: -87.9065 },
  { subdomain: "albuquerque", label: "Albuquerque, NM", lat: 35.0844, lng: -106.6504 },
  { subdomain: "tucson", label: "Tucson, AZ", lat: 32.2226, lng: -110.9747 },
  { subdomain: "fresno", label: "Fresno, CA", lat: 36.7378, lng: -119.7871 },
  { subdomain: "atlanta", label: "Atlanta, GA", lat: 33.749, lng: -84.388 },
  { subdomain: "kansascity", label: "Kansas City, MO", lat: 39.0997, lng: -94.5786 },
  { subdomain: "miami", label: "Miami, FL", lat: 25.7617, lng: -80.1918 },
  { subdomain: "raleigh", label: "Raleigh, NC", lat: 35.7796, lng: -78.6382 },
  { subdomain: "omaha", label: "Omaha, NE", lat: 41.2565, lng: -95.9345 },
  { subdomain: "minneapolis", label: "Minneapolis, MN", lat: 44.9778, lng: -93.265 },
  { subdomain: "tulsa", label: "Tulsa, OK", lat: 36.154, lng: -95.9928 },
  { subdomain: "neworleans", label: "New Orleans, LA", lat: 29.9511, lng: -90.0715 },
  { subdomain: "cleveland", label: "Cleveland, OH", lat: 41.4993, lng: -81.6944 },
  { subdomain: "tampa", label: "Tampa, FL", lat: 27.9506, lng: -82.4572 },
  { subdomain: "stlouis", label: "St. Louis, MO", lat: 38.627, lng: -90.1994 },
  { subdomain: "pittsburgh", label: "Pittsburgh, PA", lat: 40.4406, lng: -79.9959 },
  { subdomain: "cincinnati", label: "Cincinnati, OH", lat: 39.1031, lng: -84.512 },
  { subdomain: "orlando", label: "Orlando, FL", lat: 28.5384, lng: -81.3789 },
  { subdomain: "saltlakecity", label: "Salt Lake City, UT", lat: 40.7608, lng: -111.891 },
  { subdomain: "richmond", label: "Richmond, VA", lat: 37.5407, lng: -77.436 },
  { subdomain: "washingtondc", label: "Washington, DC", lat: 38.9072, lng: -77.0369 },
  { subdomain: "hartford", label: "Hartford, CT", lat: 41.7658, lng: -72.6734 },
  { subdomain: "providence", label: "Providence, RI", lat: 41.824, lng: -71.4128 },
  { subdomain: "salem", label: "Salem, OR", lat: 44.9429, lng: -123.0351 },
];

/** Nearest known craigslist city site to a given point. */
export function nearestCraigslistCity(point: { lat: number; lng: number }): CraigslistCity {
  let best = CRAIGSLIST_CITIES[0];
  let bestDist = Infinity;
  for (const city of CRAIGSLIST_CITIES) {
    const d = distanceMiles(point, city);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }
  return best;
}
