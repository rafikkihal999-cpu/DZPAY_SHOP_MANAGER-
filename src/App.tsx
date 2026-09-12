import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PlaceholderModuleView } from './components/PlaceholderModuleView';
import { SearchModal } from './components/SearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { GmailCloudSyncModal } from './components/GmailCloudSyncModal';
import { InstantDatabaseBackupModal } from './components/InstantDatabaseBackupModal';
import { HotkeysHelpModal } from './components/HotkeysHelpModal';
import { NAVIGATION_ITEMS } from './constants/navigation';

// Functional Views
import { PosView } from './components/views/PosView';
import { PhonesImeiView } from './components/views/PhonesImeiView';
import { ProductsView } from './components/views/ProductsView';
import { InventoryView } from './components/views/InventoryView';
import { CashboxView } from './components/views/CashboxView';
import { DigitalServicesView } from './components/views/DigitalServicesView';
import { CustomersView } from './components/views/CustomersView';
import { InstallmentsView } from './components/views/InstallmentsView';
import { SalesView } from './components/views/SalesView';
import { SuppliersView } from './components/views/SuppliersView';
import { PurchasesView } from './components/views/PurchasesView';
import { ExpensesView } from './components/views/ExpensesView';
import { EmployeesView } from './components/views/EmployeesView';
import { ReportsView } from './components/views/ReportsView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';
import { UsersPermissionsView } from './components/views/UsersPermissionsView';
import { AuditLogsView } from './components/views/AuditLogsView';

import {
  LayoutDashboard,
  ShoppingCart,
  Smartphone,
  Wallet,
  Menu,
} from 'lucide-react';

function AppContent() {
  const { isDark } = useTheme();
  const { dir, t } = useLanguage();
  const [activeSectionId, setActiveSectionId] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isGmailSyncOpen, setIsGmailSyncOpen] = useState<boolean>(false);
  const [isInstantBackupOpen, setIsInstantBackupOpen] = useState<boolean>(false);
  const [isHotkeysHelpOpen, setIsHotkeysHelpOpen] = useState<boolean>(false);

  const activeItem =
    NAVIGATION_ITEMS.find((item) => item.id === activeSectionId) ||
    NAVIGATION_ITEMS[0];

  const handleNavigateTo = (id: string) => {
    setActiveSectionId(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Keyboard Shortcuts (Hotkeys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement as HTMLElement)?.isContentEditable;

      // Escape key closes modals
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
        setIsGmailSyncOpen(false);
        setIsInstantBackupOpen(false);
        setIsHotkeysHelpOpen(false);
        return;
      }

      // '?' hotkey opens shortcuts guide when not writing in an input
      if (e.key === '?' && !isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsHotkeysHelpOpen((prev) => !prev);
        return;
      }

      // Modifier key combinations (Ctrl or Cmd)
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'p') {
          // Ctrl+P: Point of Sale (POS)
          e.preventDefault();
          handleNavigateTo('pos');
        } else if (key === 'd') {
          // Ctrl+D: Dashboard (الرئيسية)
          e.preventDefault();
          handleNavigateTo('dashboard');
        } else if (key === 'k') {
          // Ctrl+K: Global Search
          e.preventDefault();
          setIsSearchOpen((prev) => !prev);
        } else if (key === 'i') {
          // Ctrl+I: Phones & IMEI registry
          e.preventDefault();
          handleNavigateTo('phones-imei');
        } else if (key === 'b') {
          // Ctrl+B: Cashbox & Drawer
          e.preventDefault();
          handleNavigateTo('cashbox');
        } else if (key === 's') {
          // Ctrl+S: Sales History
          e.preventDefault();
          handleNavigateTo('sales');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveView = () => {
    switch (activeSectionId) {
      case 'dashboard':
        return (
          <DashboardView
            onNavigateTo={handleNavigateTo}
            onOpenGmailSync={() => setIsGmailSyncOpen(true)}
            onOpenInstantBackup={() => setIsInstantBackupOpen(true)}
          />
        );
      case 'pos':
        return <PosView onNavigateTo={handleNavigateTo} />;
      case 'phones-imei':
        return <PhonesImeiView onNavigateTo={handleNavigateTo} />;
      case 'products':
        return <ProductsView onNavigateTo={handleNavigateTo} />;
      case 'inventory':
        return <InventoryView onNavigateTo={handleNavigateTo} />;
      case 'cashbox':
        return <CashboxView onNavigateTo={handleNavigateTo} />;
      case 'digital-services':
        return <DigitalServicesView onNavigateTo={handleNavigateTo} />;
      case 'customers':
        return <CustomersView onNavigateTo={handleNavigateTo} />;
      case 'installments-debts':
        return <InstallmentsView onNavigateTo={handleNavigateTo} />;
      case 'sales':
        return <SalesView onNavigateTo={handleNavigateTo} />;
      case 'suppliers':
        return <SuppliersView onNavigateTo={handleNavigateTo} />;
      case 'purchases':
        return <PurchasesView onNavigateTo={handleNavigateTo} />;
      case 'expenses':
        return <ExpensesView key="expenses-daily" defaultTab="daily" onNavigateTo={handleNavigateTo} />;
      case 'recurring-expenses':
        return <ExpensesView key="expenses-recurring" defaultTab="recurring" onNavigateTo={handleNavigateTo} />;
      case 'employees':
        return <EmployeesView key="employees-main" defaultTab="employees" onNavigateTo={handleNavigateTo} />;
      case 'payroll':
        return <EmployeesView key="employees-payroll" defaultTab="payroll" onNavigateTo={handleNavigateTo} />;
      case 'reports':
        return <ReportsView onNavigateTo={handleNavigateTo} />;
      case 'notifications':
        return <NotificationsView onNavigateTo={handleNavigateTo} />;
      case 'settings':
        return (
          <SettingsView
            onNavigateTo={handleNavigateTo}
            onOpenGmailSync={() => setIsGmailSyncOpen(true)}
            onOpenInstantBackup={() => setIsInstantBackupOpen(true)}
          />
        );
      case 'users-permissions':
        return <UsersPermissionsView onNavigateTo={handleNavigateTo} />;
      case 'audit-logs':
        return <AuditLogsView onNavigateTo={handleNavigateTo} />;
      default:
        return (
          <PlaceholderModuleView
            item={activeItem}
            onNavigateTo={handleNavigateTo}
          />
        );
    }
  };

  return (
    <div
      className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${
        isDark ? 'theme-dark-blue bg-[#080d1a] text-slate-100' : 'theme-light bg-slate-50 text-slate-900'
      }`}
      dir={dir}
    >
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar
        activeSection={activeSectionId}
        onSelectSection={handleNavigateTo}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          activeSectionId={activeSectionId}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenHotkeysHelp={() => setIsHotkeysHelpOpen(true)}
          onOpenGmailSync={() => setIsGmailSyncOpen(true)}
          onOpenInstantBackup={() => setIsInstantBackupOpen(true)}
          onNavigateTo={handleNavigateTo}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Scrollable Viewport */}
        <main
          id="main-content-viewport"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 lg:pb-8"
        >
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>

        {/* Mobile Quick Bottom Navigation Bar */}
        <nav
          id="mobile-bottom-bar"
          className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-30 shadow-lg"
        >
          <button
            id="mobile-tab-dashboard"
            onClick={() => handleNavigateTo('dashboard')}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${
              activeSectionId === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t('nav_dashboard', 'الرئيسية')}</span>
          </button>

          <button
            id="mobile-tab-pos"
            onClick={() => handleNavigateTo('pos')}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${
              activeSectionId === 'pos' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t('nav_pos', 'نقطة البيع')}</span>
          </button>

          <button
            id="mobile-tab-phones"
            onClick={() => handleNavigateTo('phones-imei')}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${
              activeSectionId === 'phones-imei' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t('nav_phones', 'الهواتف')}</span>
          </button>

          <button
            id="mobile-tab-cashbox"
            onClick={() => handleNavigateTo('cashbox')}
            className={`flex flex-col items-center justify-center flex-1 py-1 ${
              activeSectionId === 'cashbox' ? 'text-emerald-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t('nav_cashbox', 'الصندوق')}</span>
          </button>

          <button
            id="mobile-tab-menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500 hover:text-slate-900"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">{t('all_sections', 'كل الأقسام')}</span>
          </button>
        </nav>
      </div>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSection={handleNavigateTo}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTo={handleNavigateTo}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenGmailSync={() => setIsGmailSyncOpen(true)}
      />

      <GmailCloudSyncModal
        isOpen={isGmailSyncOpen}
        onClose={() => setIsGmailSyncOpen(false)}
        onOpenInstantBackup={() => setIsInstantBackupOpen(true)}
      />

      <InstantDatabaseBackupModal
        isOpen={isInstantBackupOpen}
        onClose={() => setIsInstantBackupOpen(false)}
      />

      <HotkeysHelpModal
        isOpen={isHotkeysHelpOpen}
        onClose={() => setIsHotkeysHelpOpen(false)}
        onNavigateTo={handleNavigateTo}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
