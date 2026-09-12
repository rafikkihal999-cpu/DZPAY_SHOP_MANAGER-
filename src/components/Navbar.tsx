import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Store,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sun,
  Moon,
  Cloud,
  Database,
  ShoppingCart,
  Keyboard,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NAVIGATION_ITEMS } from '../constants/navigation';
import { LanguageSelector } from './common/LanguageSelector';

interface NavbarProps {
  activeSectionId: string;
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenHotkeysHelp?: () => void;
  onOpenGmailSync?: () => void;
  onOpenInstantBackup?: () => void;
  onNavigateTo: (id: string) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSectionId,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenNotifications,
  onOpenProfile,
  onOpenHotkeysHelp,
  onOpenGmailSync,
  onOpenInstantBackup,
  onNavigateTo,
  isSidebarCollapsed,
  onToggleSidebar,
}) => {
  const {
    currentUser,
    activeBranch,
    currency,
    googleUser,
    isGoogleAuthenticated,
    lastCloudSync,
    logout,
  } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, t, isRtl } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const currentItem = NAVIGATION_ITEMS.find((item) => item.id === activeSectionId) || NAVIGATION_ITEMS[0];

  const sectionTitle =
    language === 'fr'
      ? (currentItem.titleFr || currentItem.titleEn || currentItem.title)
      : language === 'en'
      ? (currentItem.titleEn || currentItem.title)
      : currentItem.title;

  const sectionDesc =
    language === 'fr'
      ? (currentItem.descriptionFr || currentItem.description)
      : language === 'en'
      ? (currentItem.descriptionEn || currentItem.description)
      : currentItem.description;

  return (
    <header
      id="top-navbar"
      className="h-16 bg-white border-b border-slate-200 px-3 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs"
    >
      {/* Right in RTL (Visually Left edge in RTL view): Toggles & Section Title */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile menu trigger */}
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-hidden"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Sidebar collapse button */}
        {onToggleSidebar && (
          <button
            id="navbar-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={isSidebarCollapsed ? (language === 'fr' ? 'Développer' : language === 'en' ? 'Expand' : 'توسيع القائمة الجانبية') : (language === 'fr' ? 'Réduire' : language === 'en' ? 'Collapse' : 'طي القائمة الجانبية')}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-black text-slate-900 leading-none">
              {sectionTitle}
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              DZPAY
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-500 mt-1 truncate max-w-sm">
            {sectionDesc}
          </p>
        </div>
      </div>

      {/* End Edge: Search, Branch, Currency, POS, Language, Theme, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Global Search Button with localized placeholder */}
        <button
          id="navbar-search-btn"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 text-slate-600 text-xs font-medium transition-all duration-200 border border-slate-200 max-w-xs group cursor-pointer active:scale-98 shadow-2xs"
          title={`${t('search_btn', 'بحث')} (Ctrl+K)`}
        >
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0 transition-transform duration-200 group-hover:scale-115 group-hover:text-emerald-700" />
          <span className="hidden xl:inline text-slate-600 truncate">
            {t('search_placeholder', 'ابحث عن عميل، منتج، IMEI، فاتورة...')}
          </span>
          <span className="hidden sm:inline xl:hidden text-slate-600">
            {t('search_btn', 'بحث...')}
          </span>
          <kbd className="hidden lg:inline-block text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-300 font-mono shadow-2xs">
            Ctrl+K
          </kbd>
        </button>

        {/* Current Branch & Currency */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 shadow-2xs">
          <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="font-semibold truncate max-w-[100px]">{activeBranch}</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold shrink-0">
            {language === 'ar' ? 'د.ج' : 'DZD'}
          </span>
        </div>

        {/* POS Quick Launch Button */}
        {activeSectionId !== 'pos' && (
          <button
            id="quick-pos-nav-btn"
            onClick={() => onNavigateTo('pos')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-97 cursor-pointer group"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-emerald-200 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6" />
            <span>{t('quick_pos_btn', 'نقطة البيع (POS)')}</span>
          </button>
        )}

        {/* Gmail Cloud Sync Button */}
        <button
          id="navbar-gmail-sync-btn"
          onClick={onOpenGmailSync}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer group active:scale-97 ${
            isGoogleAuthenticated
              ? 'bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 shadow-2xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}
          title={
            isGoogleAuthenticated
              ? `${t('gmail_sync_active', 'المزامنة السحابية عبر Gmail نشطة')} (${googleUser?.email})`
              : t('gmail_sync_connect', 'تسجيل الدخول والمزامنة السحابية عبر Gmail')
          }
          aria-label="Gmail Cloud Sync"
        >
          <Cloud className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6 ${isGoogleAuthenticated ? 'text-sky-500' : 'text-slate-500'}`} />
          <span className="hidden md:inline text-[11px] font-bold">
            {isGoogleAuthenticated ? t('gmail_sync_btn', 'سحابة Gmail') : t('gmail_sync_connect', 'ربط Gmail')}
          </span>
          {isGoogleAuthenticated && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>

        {/* Instant Database Backup Button */}
        <button
          id="navbar-instant-backup-btn"
          onClick={onOpenInstantBackup}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-2xs group active:scale-97"
          title={t('instant_backup_tooltip', 'أخذ نسخة احتياطية فورية لقاعدة البيانات وحفظها سحابياً على Gmail')}
          aria-label="Instant Backup"
        >
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-6" />
          <span className="hidden sm:inline text-[11px] font-black">
            {t('instant_backup_btn', 'نسخة فورية ⚡')}
          </span>
        </button>

        {/* Language Selector Dropdown (العربية، Français, English) */}
        <LanguageSelector variant="navbar" />

        {/* Theme Toggle Button (التبديل بين الوضع المضيء والنمط الليلي الأزرق Dark Blue) */}
        <button
          id="navbar-theme-toggle-btn"
          onClick={toggleTheme}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer group active:scale-97 ${
            isDark
              ? 'bg-blue-950/70 hover:bg-blue-900/80 text-sky-300 border-sky-800/80 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
          title={isDark ? t('theme_switch_to_light', 'التبديل إلى الوضع المضيء (Light Mode)') : t('theme_switch_to_dark', 'التبديل إلى النمط الليلي الأزرق (Dark Blue)')}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 shrink-0 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-115" />
              <span className="hidden xl:inline text-[11px] font-bold text-amber-300">
                {t('theme_light', 'مضيء')}
              </span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-sky-600 shrink-0 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-115" />
              <span className="hidden xl:inline text-[11px] font-bold text-sky-800">
                {t('theme_dark', 'ليلي أزرق')}
              </span>
            </>
          )}
        </button>

        {/* Global Keyboard Shortcuts Help Button */}
        {onOpenHotkeysHelp && (
          <button
            id="navbar-hotkeys-btn"
            onClick={onOpenHotkeysHelp}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-xs font-bold cursor-pointer group active:scale-95"
            title={language === 'fr' ? 'Raccourcis Clavier (Appuyez sur ?)' : language === 'en' ? 'Keyboard Shortcuts (Press ?)' : 'اختصارات لوحة المفاتيح (اضغط ?)'}
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4 text-slate-500 group-hover:text-emerald-700 transition-transform duration-200 group-hover:scale-115" />
            <span className="hidden xl:inline text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded border border-slate-300 dark:border-slate-700">
              ?
            </span>
          </button>
        )}

        {/* Notifications Button */}
        <button
          id="navbar-notifications-btn"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 group active:scale-95 cursor-pointer"
          aria-label={t('notifications_btn', 'الإشعارات والتنبيهات')}
        >
          <Bell className="w-4.5 h-4.5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-115 group-hover:text-emerald-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
        </button>

        {/* User Profile Area */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
          >
            <div className="w-7.5 h-7.5 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {currentUser?.name?.charAt(0) || 'ر'}
            </div>
            <div className="hidden sm:block text-start">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {currentUser?.name}
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 block">
                {currentUser?.roleArabic}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Menu Dropdown */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div
                id="user-menu-dropdown"
                className="absolute end-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-start font-sans"
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-600">{currentUser?.email}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{language === 'fr' ? 'Compte actif - Accès complet' : language === 'en' ? 'Active account - Full access' : 'حساب نشط - صلاحيات كاملة'}</span>
                  </div>
                </div>

                <div className="py-1 text-xs">
                  <button
                    id="menu-open-profile"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full text-start px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>{t('user_menu_profile', 'الملف الشخصي والصلاحيات')}</span>
                  </button>

                  <button
                    id="menu-open-settings"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigateTo('settings');
                    }}
                    className="w-full text-start px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-slate-500" />
                    <span>{t('user_menu_settings', 'إعدادات المحل والطباعة')}</span>
                  </button>

                  {/* Gmail Cloud Sync Option */}
                  <button
                    id="menu-open-gmail-sync"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onOpenGmailSync) onOpenGmailSync();
                    }}
                    className="w-full text-start px-4 py-2 text-sky-700 hover:bg-sky-50 flex items-center justify-between font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-sky-600" />
                      <span>{t('gmail_sync_btn', 'سحابة Gmail')}</span>
                    </div>
                    {isGoogleAuthenticated ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        {language === 'fr' ? 'Non connecté' : language === 'en' ? 'Not connected' : 'غير متصل'}
                      </span>
                    )}
                  </button>

                  {/* Instant Database Backup Option */}
                  <button
                    id="menu-open-instant-backup"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onOpenInstantBackup) onOpenInstantBackup();
                    }}
                    className="w-full text-start px-4 py-2 text-emerald-800 hover:bg-emerald-50 flex items-center justify-between font-bold cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>{t('instant_backup_btn', 'نسخة فورية ⚡')}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-sans">
                      ⚡ {language === 'fr' ? 'Instantané' : language === 'en' ? 'Instant' : 'فوري'}
                    </span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    id="menu-logout"
                    onClick={async () => {
                      setIsUserMenuOpen(false);
                      await logout();
                    }}
                    className="w-full text-start px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>{t('user_menu_logout', 'تسجيل الخروج')}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
