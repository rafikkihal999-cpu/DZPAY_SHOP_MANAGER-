import React from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Smartphone,
  Store,
} from 'lucide-react';
import { NAVIGATION_ITEMS, NAVIGATION_CATEGORIES, ICON_MAP } from '../constants/navigation';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const HOTKEY_HINTS: Record<string, string> = {
  dashboard: 'Ctrl+D',
  pos: 'Ctrl+P',
  'phones-imei': 'Ctrl+I',
  cashbox: 'Ctrl+B',
  sales: 'Ctrl+S',
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const { language, isRtl, t } = useLanguage();

  const getBadgeClass = (color?: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rose':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTranslatedBadge = (badge?: string) => {
    if (!badge) return null;
    if (badge === 'سريع') {
      return language === 'fr' ? 'Rapide' : language === 'en' ? 'Quick' : 'سريع';
    }
    if (badge === 'كريدي') {
      return language === 'fr' ? 'Crédit' : language === 'en' ? 'Credit' : 'كريدي';
    }
    if (badge === 'سجل IMEI') {
      return language === 'fr' ? 'IMEI' : language === 'en' ? 'IMEI' : 'سجل IMEI';
    }
    return badge;
  };

  const renderNavList = () => (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {NAVIGATION_CATEGORIES.map((cat) => {
        const items = NAVIGATION_ITEMS.filter((item) => item.category === cat.id);
        if (items.length === 0) return null;

        const catLabel =
          language === 'fr'
            ? ((cat as any).labelFr || (cat as any).labelEn || cat.label)
            : language === 'en'
            ? ((cat as any).labelEn || cat.label)
            : cat.label;

        return (
          <div key={cat.id} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {catLabel}
              </p>
            )}

            <div className="space-y-1">
              {items.map((item) => {
                const IconComponent = ICON_MAP[item.icon] || Store;
                const isActive = activeSection === item.id;

                const itemTitle =
                  language === 'fr'
                    ? (item.titleFr || item.titleEn || item.title)
                    : language === 'en'
                    ? (item.titleEn || item.title)
                    : item.title;

                const translatedBadge = getTranslatedBadge(item.badge);

                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => {
                      onSelectSection(item.id);
                      if (isOpenMobile) onCloseMobile();
                    }}
                    title={isCollapsed ? itemTitle : undefined}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-start group relative cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm font-semibold'
                        : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-900'
                    }`}
                  >
                    <div
                      className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 ${
                        isActive
                          ? 'bg-white/20 text-white shadow-2xs'
                          : 'bg-slate-100/90 dark:bg-slate-800/80 text-slate-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60'
                      }`}
                    >
                      <IconComponent className="w-4.5 h-4.5 transition-transform duration-300 group-hover:scale-105" />
                    </div>

                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate text-start font-medium">{itemTitle}</span>
                        {HOTKEY_HINTS[item.id] && (
                          <kbd
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border shrink-0 transition-opacity opacity-75 group-hover:opacity-100 ${
                              isActive
                                ? 'bg-white/20 text-white border-white/30'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {HOTKEY_HINTS[item.id]}
                          </kbd>
                        )}
                        {translatedBadge && (
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 transition-transform group-hover:scale-105 ${
                              isActive
                                ? 'bg-white/20 text-white border-white/30'
                                : getBadgeClass(item.badgeColor)
                            }`}
                          >
                            {translatedBadge}
                          </span>
                        )}
                      </>
                    )}

                    {isCollapsed && isActive && (
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-6 bg-emerald-400 rounded-full shadow-xs ${
                          isRtl ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-label={t('btn_close', 'إغلاق')}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        id="mobile-sidebar-drawer"
        className={`fixed top-0 bottom-0 z-50 w-72 bg-white ${
          isRtl ? 'right-0 border-l' : 'left-0 border-r'
        } border-slate-200 shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpenMobile
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                DZPAY SHOP
              </span>
              <span className="text-[10px] text-emerald-400 font-medium block">
                {language === 'fr'
                  ? 'Gestion de Boutique (DZD)'
                  : language === 'en'
                  ? 'Store Management (DZD)'
                  : 'إدارة المحلات بالدينار DZD'}
              </span>
            </div>
          </div>
          <button
            id="close-mobile-sidebar-btn"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label={t('btn_close', 'إغلاق')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation List */}
        {renderNavList()}

        {/* Mobile Footer Status */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
          <span>{language === 'fr' ? 'Devise: Dinar Algérien (DZD) • Algérie' : language === 'en' ? 'Currency: Algerian Dinar (DZD) • Algeria' : 'العملة: د.ج (DZD) • الجزائر'}</span>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden lg:flex flex-col bg-white ${
          isRtl ? 'border-l' : 'border-r'
        } border-slate-200 shrink-0 transition-all duration-300 h-screen sticky top-0 z-20 ${
          isCollapsed ? 'w-20' : 'w-64 xl:w-72'
        }`}
      >
        {/* Desktop Brand Header */}
        <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 shrink-0 transition-transform duration-300 hover:scale-105 hover:-rotate-3 group cursor-pointer">
              <Smartphone className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="font-black text-sm tracking-tight text-slate-900 leading-none">
                  DZPAY <span className="text-emerald-700">SHOP</span>
                </h1>
                <p className="text-[11px] text-slate-500 font-semibold mt-1">
                  {language === 'fr'
                    ? 'Gestion des Magasins (DZD)'
                    : language === 'en'
                    ? 'Store System (DZD)'
                    : 'نظام إدارة المحلات (DZD)'}
                </p>
              </div>
            )}
          </div>

          <button
            id="toggle-sidebar-collapse-btn"
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 shrink-0 cursor-pointer hover:scale-105 active:scale-95"
            title={isCollapsed ? (language === 'fr' ? 'Développer' : language === 'en' ? 'Expand' : 'توسيع القائمة') : (language === 'fr' ? 'Réduire' : language === 'en' ? 'Collapse' : 'طي القائمة')}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            ) : (
              isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        {renderNavList()}

        {/* Desktop Footer Status */}
        {!isCollapsed && (
          <div className="p-3.5 border-t border-slate-200 bg-slate-50/80">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {language === 'fr' ? '21 sections actives' : language === 'en' ? '21 sections available' : '21 قسماً متاحاً'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                DZD {language === 'ar' ? 'د.ج' : ''}
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

