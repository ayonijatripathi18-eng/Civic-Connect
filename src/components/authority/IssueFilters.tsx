import React from 'react';
import { AuthorityIssueStatus, AuthorityIssuePriority } from '../../types/authority';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { MOCK_ROSTER_DEPARTMENTS } from '../../data/authorityMockData';

export interface FilterState {
  search: string;
  category: string;
  priority: AuthorityIssuePriority | 'All';
  status: AuthorityIssueStatus | 'All';
  ward: string;
  department: string;
  assignedOfficer: string;
  onlyOverdue: boolean;
  sortBy: 'date_desc' | 'date_asc' | 'priority_desc' | 'cluster_desc';
}

interface IssueFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  wards: string[];
}

export const IssueFilters: React.FC<IssueFiltersProps> = ({
  filters,
  onChange,
  onReset,
  wards
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-5 space-y-3">
      {/* ROW 1: SEARCH & PRIMARY CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* SEARCH */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID, keyword, road..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none"
          />
        </div>

        {/* STATUS */}
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
          className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Reported">Reported</option>
          <option value="Received">Received</option>
          <option value="Acknowledged">Acknowledged</option>
          <option value="Under Review">Under Review</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* PRIORITY */}
        <select
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value as any })}
          className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-medium"
        >
          <option value="All">All Priorities</option>
          <option value="Critical">Critical Priority</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {/* CATEGORY */}
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none font-medium"
        >
          <option value="All">All Categories</option>
          <option value="Roads & Potholes">Roads & Potholes</option>
          <option value="Streetlights">Streetlights & Electrical</option>
          <option value="Garbage & Waste">Garbage & Sanitation</option>
          <option value="Water Supply">Water Supply & Sewerage</option>
          <option value="Traffic">Traffic & Transport</option>
          <option value="Public Infrastructure">Public Infrastructure</option>
        </select>
      </div>

      {/* ROW 2: ADVANCED CONTROLS (WARD, DEPARTMENT, OVERDUE, SORT) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* WARD FILTER */}
          <select
            value={filters.ward}
            onChange={(e) => onChange({ ...filters, ward: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="All">All Wards / Zones</option>
            {wards.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>

          {/* DEPARTMENT */}
          <select
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="All">All Routed Departments</option>
            {MOCK_ROSTER_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* OVERDUE TOGGLE */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={filters.onlyOverdue}
              onChange={(e) => onChange({ ...filters, onlyOverdue: e.target.checked })}
              className="rounded text-red-600 focus:ring-red-500"
            />
            <span className="text-red-700">Overdue SLA Only</span>
          </label>
        </div>

        {/* SORT & RESET */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
            className="px-2 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-semibold"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="priority_desc">Highest Priority</option>
            <option value="cluster_desc">Most Citizen Complaints (Cluster)</option>
          </select>

          <button
            type="button"
            onClick={onReset}
            className="btn btn-secondary py-1.5 px-2.5 text-xs text-slate-600 hover:text-slate-900"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
