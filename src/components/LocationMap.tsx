import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { reverseGeocode } from '../services/geocoding';
import { Crosshair, MapPin, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

// Configure proper Leaflet marker assets for Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export interface LocationMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string;
  onLocationChange?: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  height?: string;
  interactive?: boolean;
  zoom?: number;
  showLocateButton?: boolean;
}

// Sensible default map view (before user selects any location)
// NOTE: This initial center is NEVER stored as the report location
const DEFAULT_CENTER: [number, number] = [23.2599, 77.4126]; // Central reference coordinate
const DEFAULT_ZOOM = 13;
const SELECTED_ZOOM = 16;

/**
 * Controller hook to center the map when location coordinates change
 */
function MapViewController({
  coords,
  zoom
}: {
  coords: [number, number] | null;
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size to guarantee tiles render properly even inside tabs/containers
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, zoom, {
        duration: 1.2
      });
    }
  }, [coords, zoom, map]);

  return null;
}

/**
 * Click handler to capture manual map clicks
 */
function MapClickHandler({
  onMapClick,
  enabled
}: {
  onMapClick: (lat: number, lng: number) => void;
  enabled: boolean;
}) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      if (!enabled) return;
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  latitude = null,
  longitude = null,
  address = '',
  onLocationChange,
  height = '380px',
  interactive = true,
  zoom = SELECTED_ZOOM,
  showLocateButton = true
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>(address || '');
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (address) {
      setCurrentAddress(address);
    }
  }, [address]);

  const hasSelectedLocation = latitude !== null && longitude !== null;

  const currentCoords: [number, number] | null = useMemo(() => {
    if (latitude !== null && longitude !== null) {
      return [latitude, longitude];
    }
    return null;
  }, [latitude, longitude]);

  // Handles resolving and updating a newly picked point
  const handlePointSelected = async (lat: number, lng: number) => {
    setLocationError(null);
    setIsGeocoding(true);

    try {
      const res = await reverseGeocode(lat, lng);
      const resolvedAddress = res.address || `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`;
      setCurrentAddress(resolvedAddress);

      if (onLocationChange) {
        onLocationChange({
          latitude: lat,
          longitude: lng,
          address: resolvedAddress
        });
      }
    } catch (err) {
      console.warn('Reverse geocoding could not determine address:', err);
      const fallbackAddress = 'Location selected, but the address could not be determined.';
      setCurrentAddress(fallbackAddress);

      if (onLocationChange) {
        onLocationChange({
          latitude: lat,
          longitude: lng,
          address: fallbackAddress
        });
      }
    } finally {
      setIsGeocoding(false);
    }
  };

  // Browser Geolocation ("Use My Location")
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location services are not supported by this browser. Please select a location manually on the map.');
      return;
    }

    setLocationError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        handlePointSelected(lat, lng);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission was denied. You can select the location manually on the map.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Your location could not be determined. Please select the location manually on the map.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again or select the location manually.');
            break;
          default:
            setLocationError('Unable to retrieve location. Please select the location manually on the map.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Drag handler for the marker
  const markerEventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          handlePointSelected(newPos.lat, newPos.lng);
        }
      }
    }),
    [onLocationChange]
  );

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Action / Toolbar Header */}
      {interactive && showLocateButton && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <button
            type="button"
            className="btn btn-secondary text-xs sm:text-sm font-semibold"
            onClick={handleUseMyLocation}
            disabled={isLocating || isGeocoding}
            aria-label="Use my current location"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Crosshair className="w-4 h-4 text-blue-600" />
            )}
            <span>{isLocating ? 'Getting your location...' : 'Use My Location'}</span>
          </button>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            {isGeocoding ? (
              <span className="text-blue-700 font-semibold flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Finding address...
              </span>
            ) : hasSelectedLocation ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Location selected (click or drag to adjust)
              </span>
            ) : (
              <span>Click map or drag marker to set issue spot</span>
            )}
          </div>
        </div>
      )}

      {/* Geolocation error message if any */}
      {locationError && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Map Container */}
      <div
        className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0"
        style={{ height }}
      >
        <MapContainer
          center={currentCoords || DEFAULT_CENTER}
          zoom={hasSelectedLocation ? zoom : DEFAULT_ZOOM}
          scrollWheelZoom={interactive}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          {/* OpenStreetMap Official Tiles with required Attribution */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Re-centering Controller */}
          <MapViewController coords={currentCoords} zoom={zoom} />

          {/* Click Handler */}
          {interactive && (
            <MapClickHandler
              onMapClick={(lat, lng) => handlePointSelected(lat, lng)}
              enabled={interactive}
            />
          )}

          {/* Report Location Marker */}
          {hasSelectedLocation && (
            <Marker
              ref={markerRef}
              position={currentCoords as LatLngExpression}
              draggable={interactive}
              eventHandlers={interactive ? markerEventHandlers : undefined}
            >
              <Popup>
                <div className="text-xs p-1">
                  <strong className="block text-slate-800 mb-1 font-semibold">Report Location</strong>
                  <div className="text-slate-600 mb-1">{currentAddress || 'Selected coordinate'}</div>
                  <div className="text-slate-400 font-mono text-[10px]">
                    {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Selected Location Details Card */}
      {interactive && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col gap-1">
          <div className="flex justify-between items-center text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Selected Report Address
            </span>
            {hasSelectedLocation && (
              <span className="font-mono text-slate-400">
                {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
              </span>
            )}
          </div>
          <div className="text-slate-800 font-medium text-sm">
            {currentAddress ? (
              currentAddress
            ) : (
              <em className="text-slate-400">No location selected yet. Click map or tap "Use My Location".</em>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
