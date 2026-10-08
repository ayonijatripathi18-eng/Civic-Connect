import React, { useEffect, useState } from 'react';
import { AuthorityAnalyticsSummary } from '../../types/authority';
import { authorityAnalyticsService } from '../../services/authorityAnalyticsService';
import { AuthorityStatCard } from './AuthorityStatCard';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  TrendingUp,
  Building2,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const AuthorityAnalyticsView: React.FC = () => {
  const [data, setData] = useState<AuthorityAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authorityAnalyticsService.getAnalytics().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm font-semibold">Aggregating municipal telemetry & analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AuthorityStatCard
          label="Total Managed Issues"
          value={data.totalIssues}
          subtext="Cumulative civic reports cataloged"
          icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
          badge="+12% this month"
        />
        <AuthorityStatCard
          label="SLA Compliance Rate"
          value={`${data.slaComplianceRate}%`}
          subtext="Target resolved within SLA window"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
          variant="success"
        />
        <AuthorityStatCard
          label="Avg. Acknowledgment"
          value={`${data.averageAckHours} hrs`}
          subtext="Time from citizen submission to triage"
          icon={<Clock className="w-5 h-5 text-indigo-600" />}
          variant="info"
        />
        <AuthorityStatCard
          label="Active Overdue SLA"
          value={data.overdue}
          subtext="Tickets exceeding deadline"
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          variant="danger"
        />
      </div>

      {/* ROW 2: CATEGORY BREAKDOWN & PRIORITY MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ISSUES BY CATEGORY */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center justify-between">
            <span>Civic Issue Distribution by Category</span>
            <span className="text-xs text-slate-400 font-normal">Volume Percentage</span>
          </h3>

          <div className="space-y-4">
            {data.byCategory.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{cat.name}</span>
                  <span className="font-bold text-slate-900">{cat.count} ({cat.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ISSUES BY PRIORITY */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center justify-between">
            <span>Severity & Priority Classification</span>
            <span className="text-xs text-slate-400 font-normal">AI Triage Ratio</span>
          </h3>

          <div className="space-y-4">
            {data.byPriority.map((pri) => {
              const color =
                pri.priority === 'Critical'
                  ? 'bg-rose-600'
                  : pri.priority === 'High'
                  ? 'bg-red-500'
                  : pri.priority === 'Medium'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

              return (
                <div key={pri.priority} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${color}`} />
                      <span>{pri.priority} Priority</span>
                    </span>
                    <span className="font-bold text-slate-900">{pri.count} tickets ({pri.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`${color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pri.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* DEDUPLICATION SAVINGS CALLOUT */}
          <div className="mt-6 p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-amber-700" />
            </div>
            <div className="text-xs">
              <strong className="text-amber-900 block font-bold">
                {data.duplicateMergedCount} Duplicate Reports Cluster-Merged
              </strong>
              <span className="text-amber-700">
                AI cluster grouping eliminated redundant field dispatches across metropolitan zones.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: WARD VOLUME PERFORMANCE */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4 flex items-center justify-between">
          <span>Municipal Ward Resolution Performance</span>
          <span className="text-xs text-slate-400 font-normal">Open vs Resolved</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Ward Jurisdiction</th>
                <th className="py-2.5 px-3">Total Issues</th>
                <th className="py-2.5 px-3">Resolved</th>
                <th className="py-2.5 px-3">Pending</th>
                <th className="py-2.5 px-3">Resolution Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data.byWard.map((w) => {
                const pending = w.count - w.resolvedCount;
                const rate = Math.round((w.resolvedCount / w.count) * 100);

                return (
                  <tr key={w.ward} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{w.ward}</td>
                    <td className="py-3 px-3">{w.count}</td>
                    <td className="py-3 px-3 text-emerald-700 font-bold">{w.resolvedCount}</td>
                    <td className="py-3 px-3 text-amber-700 font-bold">{pending}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="font-bold text-slate-700">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
