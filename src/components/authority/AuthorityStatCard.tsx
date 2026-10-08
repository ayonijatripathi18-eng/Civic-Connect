import React from 'react';

interface AuthorityStatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info';
  badge?: string;
  onClick?: () => void;
}

export const AuthorityStatCard: React.FC<AuthorityStatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  variant = 'default',
  badge,
  onClick
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: 'bg-[#fff0f1] text-[#dc3545]',
          valueColor: 'text-[#dc3545]'
        };
      case 'warning':
        return {
          iconBg: 'bg-[#fff7e6] text-[#d97706]',
          valueColor: 'text-[#d97706]'
        };
      case 'success':
        return {
          iconBg: 'bg-[#ebf8f0] text-[#198754]',
          valueColor: 'text-[#198754]'
        };
      case 'info':
        return {
          iconBg: 'bg-[#eaf3fb] text-[#1769aa]',
          valueColor: 'text-[#1769aa]'
        };
      default:
        return {
          iconBg: 'bg-[#f1f5f9] text-[#102a43]',
          valueColor: 'text-[#102a43]'
        };
    }
  };

  const style = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-white border border-[#e2e8f0] transition-all duration-150 shadow-xs flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-[#1769aa]/40 hover:shadow-md' : 'hover:border-slate-300'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
          {label}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${style.iconBg} shadow-2xs`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold tracking-tight ${style.valueColor}`}>
            {value}
          </span>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eaf3fb] text-[#1769aa] border border-[#c8e1f5]">
              {badge}
            </span>
          )}
        </div>
        {subtext && <p className="text-xs text-[#64748b] mt-1 font-medium">{subtext}</p>}
      </div>
    </div>
  );
};
