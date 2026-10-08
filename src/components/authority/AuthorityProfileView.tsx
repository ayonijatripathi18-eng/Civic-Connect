import React from 'react';
import { AuthorityUser } from '../../types/authority';
import {
  Shield,
  ShieldCheck,
  Lock,
  Building2,
  Mail,
  Phone,
  UserCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface AuthorityProfileViewProps {
  currentUser: AuthorityUser;
}

export const AuthorityProfileView: React.FC<AuthorityProfileViewProps> = ({ currentUser }) => {
  return (
    <div className="max-w-3xl space-y-6">
      {/* SECURITY ACCESS NOTICE */}
      <div className="p-4 bg-[#eaf3fb] text-[#102a43] border border-[#c7dff3] rounded-2xl flex items-start gap-3 shadow-xs text-xs">
        <ShieldCheck className="w-5 h-5 text-[#1769aa] shrink-0 mt-0.5" />
        <div>
          <strong className="block text-sm font-bold text-[#102a43] mb-0.5">
            Verified Municipal Personnel Profile
          </strong>
          <span className="text-[#52667d] leading-relaxed">
            Identity credentials, departmental jurisdiction, and authorization levels are provisioned directly by the
            Central Municipal Administration backend. Personal modifications to identity attributes are restricted.
          </span>
        </div>
      </div>

      {/* OFFICER DOSSIER CARD */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-[#102a43] text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#102a43] tracking-tight">{currentUser.name}</h2>
            <div className="text-xs text-[#1769aa] font-bold">{currentUser.designation}</div>
            <div className="text-xs text-[#64748b] mt-0.5">{currentUser.department}</div>
          </div>
        </div>

        {/* LOCKED CREDENTIAL ATTRIBUTES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" /> Official Authority ID
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm">{currentUser.authorityId}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" /> RBAC Authorization Role
            </span>
            <span className="font-bold text-blue-800">{currentUser.role}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Mail className="w-3 h-3 text-slate-400" /> Official Gov Email
            </span>
            <span className="font-mono text-slate-900 font-semibold">{currentUser.email}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" /> Duty Phone
            </span>
            <span className="font-mono text-slate-900 font-semibold">{currentUser.phone}</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-400" /> Territorial Jurisdiction
            </span>
            <span className="font-bold text-slate-900">{currentUser.jurisdiction}</span>
          </div>
        </div>

        {/* METADATA BAR */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
          <div>
            Account Provisioned:{' '}
            <strong className="text-slate-700">
              {new Date(currentUser.createdAt).toLocaleDateString()}
            </strong>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active & Authorized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
