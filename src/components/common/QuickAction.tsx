import React from 'react';
import { LucideIcon, ArrowUpRight, Plus } from 'lucide-react';

interface QuickActionProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'amber' | 'blue';
  className?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  onClick,
  variant = 'secondary',
  className = '',
}) => {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isAmber = variant === 'amber';
  const isBlue = variant === 'blue';

  const baseClasses = isPrimary
    ? 'bg-gradient-to-br from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xs border border-emerald-600/80'
    : isDanger
    ? 'bg-white hover:bg-rose-50/80 text-rose-700 border border-rose-200/90 shadow-xs'
    : isAmber
    ? 'bg-white hover:bg-amber-50/80 text-amber-800 border border-amber-200/90 shadow-xs'
    : isBlue
    ? 'bg-white hover:bg-sky-50/80 text-sky-800 border border-sky-200/90 shadow-xs'
    : 'bg-white hover:bg-slate-50/90 text-slate-800 border border-slate-200/90 shadow-xs';

  const iconBoxClasses = isPrimary
    ? 'bg-white/20 text-white border-white/20 group-hover:bg-white/30'
    : isDanger
    ? 'bg-rose-100/70 text-rose-600 border-rose-200 group-hover:bg-rose-100'
    : isAmber
    ? 'bg-amber-100/70 text-amber-700 border-amber-200 group-hover:bg-amber-100'
    : isBlue
    ? 'bg-sky-100/70 text-sky-700 border-sky-200 group-hover:bg-sky-100'
    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:border-emerald-200';

  return (
    <button
      id={id}
      onClick={onClick}
      className={`p-3.5 rounded-2xl text-start transition-all duration-250 active:scale-97 flex flex-col justify-between h-25 group card-interactive cursor-pointer ${baseClasses} ${className}`}
    >
      <div className="flex items-center justify-between w-full">
        <div
          className={`w-8.5 h-8.5 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:scale-110 group-hover:rotate-6 ${iconBoxClasses}`}
        >
          <Icon className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-105" />
        </div>

        {isPrimary ? (
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80 group-hover:scale-110">
            <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
          </div>
        )}
      </div>

      <div className="mt-1">
        <span className="text-xs font-bold block leading-snug group-hover:text-inherit">
          {title}
        </span>
        {subtitle && (
          <span
            className={`text-[10px] block mt-0.5 truncate font-medium ${
              isPrimary ? 'text-emerald-100/90' : 'text-slate-500 group-hover:text-slate-600'
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </button>
  );
};

