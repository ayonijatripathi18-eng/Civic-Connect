import React, { useState, useEffect } from 'react';
import { authorityAnalyticsService } from '../../services/authorityAnalyticsService';
import {
  Users,
  Search,
  Mail,
  Phone,
  FileText,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface CitizenRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  ward: string;
  totalReportsSubmitted: number;
  registeredDate: string;
  verifiedCitizen: boolean;
  lastReportDate: string;
  relatedIssueIds: string[];
}

interface AuthorityCitizensViewProps {
  onSelectIssueId?: (issueId: string) => void;
}

export const AuthorityCitizensView: React.FC<AuthorityCitizensViewProps> = ({
  onSelectIssueId
}) => {
  const [citizens, setCitizens] = useState<CitizenRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authorityAnalyticsService.getCitizensDirectory().then((res) => {
      setCitizens(res);
      setLoading(false);
    });
  }, []);

  const filtered = citizens.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.ward.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* PRIVACY & JURISDICTION NOTICE */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
        <ShieldAlert className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Authorized Department Jurisdiction Directory:</strong>
          <span>
            Citizen contact records are restricted strictly to reporters with active civic complaints inside your
            authorized municipal division. Data access is monitored and logged in compliance with public privacy standards.
          </span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by citizen name, phone, email, or ward..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs bg-transparent outline-none"
        />
      </div>

      {/* DIRECTORY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Citizen Name</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Ward Location</th>
                <th className="py-3 px-4">Total Submissions</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Linked Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading citizen records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No citizen profiles found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Verified Citizen
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div>{c.email}</div>
                      <div className="text-slate-400">{c.phone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">{c.ward}</td>

                    <td className="py-3.5 px-4 font-bold text-blue-800">
                      {c.totalReportsSubmitted} reports
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(c.lastReportDate).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {c.relatedIssueIds.length > 0 && onSelectIssueId ? (
                        <button
                          type="button"
                          onClick={() => onSelectIssueId(c.relatedIssueIds[0])}
                          className="text-xs font-mono font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{c.relatedIssueIds[0]}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-slate-400">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
