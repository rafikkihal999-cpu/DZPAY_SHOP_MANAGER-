import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value?: string | number;
  unit?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconColor?: string;
  colorScheme?: 'emerald' | 'blue' | 'amber' | 'rose' | 'violet' | 'cyan' | 'slate';
  className?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value = '0.00 دج',
  unit,
  helperText = 'لا توجد بيانات بعد • تظهر بعد تسجيل العمليات',
  icon: Icon,
  iconColor,
  colorScheme = 'slate',
  className = '',
  trend,
}) => {
  // Compute vibrant, interactive icon container background and color
  const getSchemeStyles = () => {
    switch (colorScheme) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60',
          text: 'text-emerald-700 dark:text-emerald-400',
          border: 'border-emerald-200/70 dark:border-emerald-800/60',
          ring: 'group-hover:ring-2 group-hover:ring-emerald-400/30',
        };
      case 'blue':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/60 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/60',
          text: 'text-sky-700 dark:text-sky-400',
          border: 'border-sky-200/70 dark:border-sky-800/60',
          ring: 'group-hover:ring-2 group-hover:ring-sky-400/30',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/60',
          text: 'text-amber-700 dark:text-amber-400',
          border: 'border-amber-200/70 dark:border-amber-800/60',
          ring: 'group-hover:ring-2 group-hover:ring-amber-400/30',
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/60',
          text: 'text-rose-700 dark:text-rose-400',
          border: 'border-rose-200/70 dark:border-rose-800/60',
          ring: 'group-hover:ring-2 group-hover:ring-rose-400/30',
        };
      case 'violet':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/60 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/60',
          text: 'text-purple-700 dark:text-purple-400',
          border: 'border-purple-200/70 dark:border-purple-800/60',
          ring: 'group-hover:ring-2 group-hover:ring-purple-400/30',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800/80 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-700',
          ring: 'group-hover:ring-2 group-hover:ring-slate-300/40',
        };
    }
  };

  const scheme = getSchemeStyles();
  const resolvedIconColor = iconColor || scheme.text;

  return (
    <div
      className={`group card-interactive bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs hover:border-slate-300/90 transition-all duration-300 relative overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
          {label}
        </span>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-2xs group-hover:scale-110 group-hover:-rotate-6 ${scheme.bg} ${scheme.border} ${scheme.ring}`}
          >
            <Icon className={`w-4.5 h-4.5 ${resolvedIconColor} transition-transform duration-300 group-hover:scale-105`} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1.5">
          <span>{value}</span>
          {unit && <span className="text-xs font-bold text-slate-500">{unit}</span>}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
          {helperText && (
            <div className="flex items-center gap-1.5 text-slate-500 font-medium truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:animate-ping" />
              <span className="truncate">{helperText}</span>
            </div>
          )}

          {trend && (
            <span
              className={`shrink-0 font-bold px-1.5 py-0.5 rounded-md text-[10px] ${
                trend.isPositive
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

