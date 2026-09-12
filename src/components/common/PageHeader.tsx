import React from 'react';
import { ChevronLeft, LucideIcon, Printer } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumbCurrent?: string;
  onNavigateHome?: () => void;
  icon?: LucideIcon;
  badgeText?: string;
  badgeVariant?: 'emerald' | 'slate' | 'amber' | 'blue';
  primaryActionText?: string;
  primaryActionIcon?: LucideIcon;
  onPrimaryAction?: () => void;
  secondaryActionText?: string;
  secondaryActionIcon?: LucideIcon;
  onSecondaryAction?: () => void;
  showPrintButton?: boolean;
  onPrint?: () => void;
  printText?: string;
  extraActions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbCurrent,
  onNavigateHome,
  icon: Icon,
  badgeText,
  badgeVariant = 'slate',
  primaryActionText,
  primaryActionIcon: PrimaryIcon,
  onPrimaryAction,
  secondaryActionText,
  secondaryActionIcon: SecondaryIcon,
  onSecondaryAction,
  showPrintButton = true,
  onPrint,
  printText = 'طباعة الصفحة',
  extraActions,
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const getBadgeStyle = () => {
    switch (badgeVariant) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'amber':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'blue':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
          <button
            onClick={onNavigateHome}
            className="hover:text-emerald-700 transition-colors"
          >
            الرئيسية
          </button>
          <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">
            {breadcrumbCurrent || title}
          </span>
        </div>

        {/* Title & Icon */}
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 shrink-0 transition-transform duration-300 hover:scale-110 hover:-rotate-3 group cursor-pointer">
              <Icon className="w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                {title}
              </h1>
              {badgeText && (
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle()}`}
                >
                  {badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {(primaryActionText || secondaryActionText || showPrintButton || onPrint || extraActions) && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {extraActions}

          {/* Print Button with Printer icon and .no-print class */}
          {showPrintButton && (
            <button
              type="button"
              onClick={handlePrint}
              id="header-btn-print"
              className="no-print px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50/90 text-slate-700 text-xs font-bold border border-slate-200 transition-all duration-200 inline-flex items-center gap-1.5 shadow-2xs active:scale-97 cursor-pointer group hover:border-slate-300"
              title={printText}
            >
              <Printer className="w-4 h-4 text-emerald-700 shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6" />
              <span>{printText}</span>
            </button>
          )}

          {secondaryActionText && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50/90 text-slate-700 text-xs font-bold border border-slate-200 transition-all duration-200 inline-flex items-center gap-1.5 shadow-2xs active:scale-97 cursor-pointer group hover:border-slate-300"
            >
              {SecondaryIcon && (
                <SecondaryIcon className="w-4 h-4 text-slate-500 transition-transform duration-300 group-hover:scale-115 group-hover:text-slate-800" />
              )}
              <span>{secondaryActionText}</span>
            </button>
          )}

          {primaryActionText && onPrimaryAction && (
            <button
              onClick={onPrimaryAction}
              className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs md:text-sm font-bold shadow-xs hover:shadow-md transition-all duration-200 inline-flex items-center gap-2 cursor-pointer active:scale-97 group"
            >
              {PrimaryIcon && (
                <PrimaryIcon className="w-4 h-4 text-emerald-200 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6" />
              )}
              <span>{primaryActionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
