import React from 'react';

export type BadgeStatus =
  | 'متوفر'
  | 'مباع'
  | 'نشط'
  | 'غير نشط'
  | 'مدفوع'
  | 'غير مدفوع'
  | 'مستحق'
  | 'متأخر'
  | 'منخفض'
  | 'نفد'
  | 'معلق'
  | 'ملغي'
  | string;

interface StatusBadgeProps {
  status: BadgeStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
}) => {
  const getStyle = (st: string) => {
    switch (st) {
      case 'متوفر':
      case 'نشط':
      case 'مدفوع':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'منخفض':
      case 'مستحق':
      case 'معلق':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'مباع':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'غير نشط':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'غير مدفوع':
      case 'متأخر':
      case 'نفد':
      case 'ملغي':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border whitespace-nowrap ${getStyle(
        status
      )} ${sizeClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      <span>{status}</span>
    </span>
  );
};
