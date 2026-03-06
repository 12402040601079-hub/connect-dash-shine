export type LatLng = { lat: number; lng: number };

const MAPS_API_KEY = (import.meta.env.VITE_MAPS_API_KEY || "").trim();
const MAPS_EMBED_TEMPLATE = (import.meta.env.VITE_MAPS_EMBED_URL_TEMPLATE || "").trim();

export const hasMapsApiKey = MAPS_API_KEY.length > 0;

export function getMapsApiKey(): string {
  return MAPS_API_KEY;
}

function around(lat: number, lng: number, delta = 0.03) {
  const west = Math.max(-180, lng - delta);
  const east = Math.min(180, lng + delta);
  const south = Math.max(-90, lat - delta);
  const north = Math.min(90, lat + delta);
  return { west, east, south, north };
}

export function buildMapEmbedUrl(center: LatLng, zoom = 14): string {
  const { lat, lng } = center;

  if (MAPS_EMBED_TEMPLATE) {
    return MAPS_EMBED_TEMPLATE
      .replaceAll("{lat}", String(lat))
      .replaceAll("{lng}", String(lng))
      .replaceAll("{zoom}", String(zoom))
      .replaceAll("{key}", encodeURIComponent(MAPS_API_KEY));
  }

  // Fallback: open street map embed works without API key.
  const b = around(lat, lng, 0.02);
  const bbox = `${b.west}%2C${b.south}%2C${b.east}%2C${b.north}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}
