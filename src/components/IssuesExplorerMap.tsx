import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CivicIssue } from '../App';
import { Tag, MapPin, ArrowRight } from 'lucide-react';

const DEFAULT_CENTER: [number, number] = [23.2599, 77.4126];
const DEFAULT_ZOOM = 13;

function ExplorerMapController({
  selectedIssue
}: {
  selectedIssue: CivicIssue | null;
}) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  useEffect(() => {
    if (
      selectedIssue &&
      typeof selectedIssue.latitude === 'number' &&
      typeof selectedIssue.longitude === 'number'
    ) {
      map.flyTo([selectedIssue.latitude, selectedIssue.longitude], 15, {
        duration: 1.2
      });
    }
  }, [selectedIssue, map]);

  return null;
}

export interface IssuesExplorerMapProps {
  issues: CivicIssue[];
  selectedIssue?: CivicIssue | null;
  onSelectIssue?: (issue: CivicIssue) => void;
  onViewDetails?: (issue: CivicIssue) => void;
  height?: string;
}

export const IssuesExplorerMap: React.FC<IssuesExplorerMapProps> = ({
  issues,
  selectedIssue = null,
  onSelectIssue,
  onViewDetails,
  height = '100%'
}) => {
  // Only issues with actual valid latitude & longitude get pins
  const issuesWithCoords = useMemo(() => {
    return issues.filter(
      (i) => typeof i.latitude === 'number' && typeof i.longitude === 'number'
    );
  }, [issues]);

  const initialCenter = useMemo<[number, number]>(() => {
    if (
      selectedIssue &&
      typeof selectedIssue.latitude === 'number' &&
      typeof selectedIssue.longitude === 'number'
    ) {
      return [selectedIssue.latitude, selectedIssue.longitude];
    }
    if (issuesWithCoords.length > 0) {
      return [issuesWithCoords[0].latitude!, issuesWithCoords[0].longitude!];
    }
    return DEFAULT_CENTER;
  }, [selectedIssue, issuesWithCoords]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 relative shadow-sm">
      <MapContainer
        center={initialCenter}
        zoom={DEFAULT_ZOOM}
        style={{ height, width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <ExplorerMapController selectedIssue={selectedIssue} />

        {issuesWithCoords.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude!, issue.longitude!] as LatLngExpression}
            eventHandlers={{
              click: () => {
                if (onSelectIssue) onSelectIssue(issue);
              }
            }}
          >
            <Popup>
              <div className="text-xs p-1 min-w-[190px]">
                <div className="font-bold text-slate-900 mb-1 leading-snug">{issue.title}</div>
                <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-600" />
                  <span>{issue.category}</span>
                </div>
                <div className="text-[11px] text-slate-500 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{issue.location}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span
                    className={`badge ${
                      issue.status === 'Resolved'
                        ? 'resolved'
                        : issue.status === 'In Progress'
                        ? 'progress'
                        : 'reported'
                    }`}
                  >
                    {issue.status}
                  </span>
                  {onViewDetails && (
                    <button
                      type="button"
                      className="text-blue-700 font-bold hover:underline flex items-center gap-0.5 text-[11px]"
                      onClick={() => onViewDetails(issue)}
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {issuesWithCoords.length === 0 && (
        <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 z-[400] text-center shadow-sm">
          No reports on this filter have GPS coordinates yet. New reports submitted with the map will appear here.
        </div>
      )}
    </div>
  );
};

export default IssuesExplorerMap;
