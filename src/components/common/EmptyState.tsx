import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  actionText?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title = 'لا توجد بيانات بعد',
  description = 'لم يتم تسجيل أي عمليات أو بيانات في هذا القسم بعد.',
  actionText,
  actionIcon: ActionIcon,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-64 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3.5 border border-slate-200 shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-xs active:scale-98"
        >
          {ActionIcon && <ActionIcon className="w-3.5 h-3.5" />}
          <span>{actionText}</span>
        </button>
      )}
    </div>
  );
};
