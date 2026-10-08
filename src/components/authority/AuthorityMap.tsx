import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AuthorityIssue, AuthorityIssuePriority, AuthorityIssueStatus } from '../../types/authority';
import { PriorityBadge, StatusBadge } from './AuthorityStatusBadge';
import { MapPin, ArrowRight, Filter, Layers } from 'lucide-react';

interface AuthorityMapProps {
  issues: AuthorityIssue[];
  onSelectIssue: (issue: AuthorityIssue) => void;
}

export const AuthorityMap: React.FC<AuthorityMapProps> = ({ issues, onSelectIssue }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<AuthorityIssuePriority | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<AuthorityIssueStatus | 'All'>('All');

  const filtered = useMemo(() => {
    return issues.filter((i) => {
      const matchCat = filterCategory === 'All' || i.category === filterCategory;
      const matchPri = filterPriority === 'All' || i.priority === filterPriority;
      const matchStat = filterStatus === 'All' || i.status === filterStatus;
      return matchCat && matchPri && matchStat;
    });
  }, [issues, filterCategory, filterPriority, filterStatus]);

  const defaultCenter: [number, number] = [23.2599, 77.4126];

  return (
    <div className="space-y-4">
      {/* FILTER CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>GIS Map Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
          >
            <option value="All">All Categories</option>
            <option value="Roads & Potholes">Roads & Potholes</option>
            <option value="Streetlights">Streetlights</option>
            <option value="Garbage & Waste">Garbage & Waste</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Traffic">Traffic</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Under Review">Under Review</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <span className="text-slate-500 font-bold">
          Displaying {filtered.length} geocoded tickets
        </span>
      </div>

      {/* MAP CONTAINER */}
      <div className="h-[620px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {filtered.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude] as LatLngExpression}
            >
              <Popup>
                <div className="text-xs p-1 min-w-[220px]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono font-bold text-blue-700">{issue.id}</span>
                    <PriorityBadge priority={issue.priority} size="sm" />
                  </div>
                  <h4 className="font-bold text-slate-900 leading-snug mb-1">{issue.title}</h4>
                  <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{issue.location}</span>
                  </div>

                  {issue.cluster && issue.cluster.clusterCount > 1 && (
                    <div className="mb-2 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>{issue.cluster.clusterCount} citizen reports merged</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <StatusBadge status={issue.status} size="sm" />
                    <button
                      type="button"
                      onClick={() => onSelectIssue(issue)}
                      className="text-blue-700 font-bold hover:underline flex items-center gap-0.5 text-xs"
                    >
                      <span>Manage Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
