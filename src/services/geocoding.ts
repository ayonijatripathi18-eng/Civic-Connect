/**
 * OpenStreetMap Nominatim Reverse Geocoding Service
 * Compliant with Nominatim Usage Policy:
 * - Rate limited to <= 1 request per second
 * - In-memory cache to prevent redundant queries
 * - Clean address formatting
 */

export interface ReverseGeocodeResult {
  address: string;
  rawAddress?: Record<string, string>;
  displayName: string;
}

// In-memory cache: "lat.5,lon.5" -> formatted address
const geocodeCache = new Map<string, string>();

// Request queue & rate limiter tracking
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 1100; // > 1 sec interval
let pendingRequest: Promise<ReverseGeocodeResult> | null = null;

function formatAddress(data: any): string {
  if (!data) return '';

  const address = data.address || {};
  const road = address.road || address.pedestrian || address.street || address.path || address.footway || '';
  const locality = address.suburb || address.neighbourhood || address.residential || address.hamlet || '';
  const city = address.city || address.town || address.village || address.municipality || address.county || '';
  const state = address.state || '';
  const postcode = address.postcode || '';

  const parts: string[] = [];
  if (road) parts.push(road);
  if (locality && locality !== road) parts.push(locality);
  if (city) parts.push(city);
  if (state) parts.push(state);
  if (postcode) parts.push(postcode);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  // Fallback to display_name or first few comma-separated pieces
  if (data.display_name) {
    const rawParts = data.display_name.split(',').map((s: string) => s.trim());
    return rawParts.slice(0, 4).join(', ');
  }

  return '';
}

/**
 * Reverse geocode latitude and longitude using OpenStreetMap Nominatim
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> {
  const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
  const cached = geocodeCache.get(cacheKey);
  if (cached) {
    return {
      address: cached,
      displayName: cached
    };
  }

  // Ensure requests are serialized and spaced by at least 1.1s
  const execute = async (): Promise<ReverseGeocodeResult> => {
    const now = Date.now();
    const timeSinceLast = now - lastRequestTime;
    if (timeSinceLast < MIN_REQUEST_INTERVAL_MS) {
      await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL_MS - timeSinceLast));
    }
    lastRequestTime = Date.now();

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
      latitude
    )}&lon=${encodeURIComponent(longitude)}&format=jsonv2&addressdetails=1`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Nominatim HTTP ${response.status}`);
      }

      const data = await response.json();
      const formatted = formatAddress(data);
      const finalAddress = formatted || data.display_name || `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;

      geocodeCache.set(cacheKey, finalAddress);

      return {
        address: finalAddress,
        rawAddress: data.address,
        displayName: data.display_name || finalAddress
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  // Chain behind any in-flight request
  if (pendingRequest) {
    pendingRequest = pendingRequest
      .catch(() => ({} as ReverseGeocodeResult))
      .then(() => execute());
  } else {
    pendingRequest = execute();
  }

  const result = await pendingRequest;
  pendingRequest = null;
  return result;
}
