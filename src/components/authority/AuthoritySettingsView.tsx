import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Layers,
  Clock,
  Bell,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { MOCK_ROSTER_DEPARTMENTS, MOCK_ROSTER_OFFICERS } from '../../data/authorityMockData';

export const AuthoritySettingsView: React.FC = () => {
  const [slaWarningHours, setSlaWarningHours] = useState('4');
  const [clusterRadiusMeters, setClusterRadiusMeters] = useState('65');
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Operational preferences successfully updated for your workstation session.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Municipal Dispatch & Threshold Configuration</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configure local triage triggers and alert thresholds for incoming tickets.
          </p>
        </div>

        <div className="space-y-4 text-xs font-semibold">
          {/* SLA WARNING THRESHOLD */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-slate-800 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>SLA Approaching-Breach Warning Window</span>
            </label>
            <p className="text-slate-500 font-normal">
              Flag tickets with an alert when the remaining SLA time falls below this window:
            </p>
            <select
              value={slaWarningHours}
              onChange={(e) => setSlaWarningHours(e.target.value)}
              className="p-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="2">2 hours before target SLA</option>
              <option value="4">4 hours before target SLA (Recommended)</option>
              <option value="8">8 hours before target SLA</option>
              <option value="12">12 hours before target SLA</option>
            </select>
          </div>

          {/* CLUSTER RADIUS */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-slate-800 font-bold flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Geospatial Deduplication Radius</span>
            </label>
            <p className="text-slate-500 font-normal">
              Reports of the same category submitted within this spatial radius are merged into clusters:
            </p>
            <select
              value={clusterRadiusMeters}
              onChange={(e) => setClusterRadiusMeters(e.target.value)}
              className="p-2 rounded-lg border border-slate-200 bg-white"
            >
              <option value="35">35 meters (High-density corridors)</option>
              <option value="65">65 meters (Standard urban default)</option>
              <option value="100">100 meters (Wide arterial highways)</option>
            </select>
          </div>

          {/* AUDIO ALERTS */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="block text-slate-800 font-bold">Critical Incident Audio Chimes</span>
              <span className="text-slate-500 font-normal">
                Audible chime when a Critical urgency ticket is auto-routed to your desk.
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableSoundAlerts}
              onChange={(e) => setEnableSoundAlerts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary py-2 px-6 text-xs font-bold">
          Save Operational Preferences
        </button>
      </form>

      {/* DEPARTMENT ROSTER PREVIEW */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Active Municipal Department Roster</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {MOCK_ROSTER_DEPARTMENTS.map((dept) => (
            <div key={dept} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium">
              · {dept}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
