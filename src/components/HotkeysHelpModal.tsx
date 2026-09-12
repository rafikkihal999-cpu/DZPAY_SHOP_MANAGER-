import React from 'react';
import { X, Command, Keyboard, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HotkeysHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (id: string) => void;
}

export const HotkeysHelpModal: React.FC<HotkeysHelpModalProps> = ({
  isOpen,
  onClose,
  onNavigateTo,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const hotkeysList = [
    {
      keys: ['Ctrl', 'D'],
      title: language === 'fr' ? 'Tableau de bord' : language === 'en' ? 'Dashboard' : 'الرئيسية (لوحة التحكم)',
      sectionId: 'dashboard',
      description: language === 'fr' ? 'Vue d’ensemble et statistiques' : language === 'en' ? 'Overview and metrics' : 'نظرة عامة على المحل والإحصائيات',
      badge: 'رئيسي',
    },
    {
      keys: ['Ctrl', 'P'],
      title: language === 'fr' ? 'Point de Vente (POS)' : language === 'en' ? 'Point of Sale (POS)' : 'نقطة البيع (POS)',
      sectionId: 'pos',
      description: language === 'fr' ? 'Caisse rapide et facturation' : language === 'en' ? 'Fast checkout and billing' : 'شاشة الفوترة السريعة وبيع السلع',
      badge: 'سريع',
    },
    {
      keys: ['Ctrl', 'K'],
      title: language === 'fr' ? 'Recherche Globale' : language === 'en' ? 'Global Search' : 'البحث الشامل',
      action: 'search',
      description: language === 'fr' ? 'Rechercher un produit, client, IMEI' : language === 'en' ? 'Search product, customer, IMEI' : 'بحث فوري عن الهواتف والعملاء والفواتير',
      badge: 'بحث',
    },
    {
      keys: ['Ctrl', 'I'],
      title: language === 'fr' ? 'Téléphones & IMEI' : language === 'en' ? 'Phones & IMEI' : 'سجل الهواتف و IMEI',
      sectionId: 'phones-imei',
      description: language === 'fr' ? 'Registre des appareils et garanties' : language === 'en' ? 'Device registry and warranty' : 'تسجيل وتتبع الأجهزة وسيريال الضمان',
    },
    {
      keys: ['Ctrl', 'B'],
      title: language === 'fr' ? 'Caisse & Tiroir' : language === 'en' ? 'Cashbox & Drawer' : 'حركة الصندوق والدرج',
      sectionId: 'cashbox',
      description: language === 'fr' ? 'Ouverture, clôture et solde' : language === 'en' ? 'Open, close, and drawer balance' : 'إيداع، سحب، وجلسات الخزينة',
    },
    {
      keys: ['Ctrl', 'S'],
      title: language === 'fr' ? 'Ventes' : language === 'en' ? 'Sales History' : 'سجل المبيعات والفواتير',
      sectionId: 'sales',
      description: language === 'fr' ? 'Historique et factures' : language === 'en' ? 'Sales invoices history' : 'أرشيف وصولات وفواتير الزبائن',
    },
    {
      keys: ['?'],
      title: language === 'fr' ? 'Aide Raccourcis' : language === 'en' ? 'Shortcuts Help' : 'دليل الاختصارات',
      action: 'help',
      description: language === 'fr' ? 'Ouvrir ce guide des touches' : language === 'en' ? 'Open this shortcuts modal' : 'فتح هذه النافذة الإرشادية في أي وقت',
    },
    {
      keys: ['Esc'],
      title: language === 'fr' ? 'Fermer la fenêtre' : language === 'en' ? 'Close Modal' : 'إغلاق النوافذ المنبثقة',
      description: language === 'fr' ? 'Quitter la fenêtre active' : language === 'en' ? 'Dismiss current overlay' : 'إغلاق أي نافذة منبثقة مفتوحة حالياً',
    },
  ];

  return (
    <div
      id="hotkeys-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="hotkeys-modal-content"
        className="bg-white dark:bg-[#0f1a36] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-slate-50 to-emerald-50/40 dark:from-[#0a1124] dark:to-[#0f1a36]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'fr' ? 'Raccourcis Clavier Globaux' : language === 'en' ? 'Global Keyboard Shortcuts' : 'اختصارات لوحة المفاتيح (Hotkeys)'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {language === 'fr' ? 'Actifs' : language === 'en' ? 'Active' : 'مفعلة تلقائياً'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'fr'
                  ? 'Naviguez instantanément dans votre boutique sans utiliser la souris'
                  : language === 'en'
                  ? 'Navigate instantly across your shop without touching the mouse'
                  : 'تنقل فورياً بين أقسام المحل ونقطة البيع بضغطة زر واحدة'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={t('btn_close', 'إغلاق')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="p-4 max-h-[60vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {hotkeysList.map((item, idx) => (
            <div
              key={idx}
              className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 rounded-xl transition-colors group cursor-pointer"
              onClick={() => {
                if (item.sectionId) {
                  onNavigateTo(item.sectionId);
                  onClose();
                }
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {item.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="px-2.5 py-1 text-xs font-mono font-black text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs group-hover:border-emerald-400 dark:group-hover:border-emerald-600 transition-colors"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50 dark:bg-[#0a1124] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'fr' ? 'Astuce: Appuyez sur "?" à tout moment' : language === 'en' ? 'Tip: Press "?" anytime for this guide' : 'نصيحة: اضغط على "?" أو Ctrl+P في أي وقت للتنقل السريع'}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold transition-colors cursor-pointer text-xs"
          >
            {t('btn_close', 'إغلاق')}
          </button>
        </div>
      </div>
    </div>
  );
};
