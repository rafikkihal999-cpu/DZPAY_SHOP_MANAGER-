import React, { useState } from 'react';
import {
  Settings,
  Store,
  Printer,
  CreditCard,
  Building,
  Save,
  CheckCircle2,
  ChevronLeft,
  Smartphone,
  PhoneCall,
  MapPin,
  FileText,
  Sun,
  Moon,
  Palette,
  Cloud,
  Mail,
  Lock,
  Database,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PageHeader } from '../common/PageHeader';
import { LanguageSelector } from '../common/LanguageSelector';

export const SettingsView: React.FC<{
  onNavigateTo: (id: string) => void;
  onOpenGmailSync?: () => void;
  onOpenInstantBackup?: () => void;
}> = ({ onNavigateTo, onOpenGmailSync, onOpenInstantBackup }) => {
  const {
    currency,
    activeBranch,
    currentUser,
    googleUser,
    isGoogleAuthenticated,
    lastCloudSync,
    loginWithGoogle,
    logout,
  } = useAuth();
  const { theme, isDark, setTheme } = useTheme();
  const { t, language } = useLanguage();

  const [shopName, setShopName] = useState('DZPAY SHOP - هواتف وإكسسوارات');
  const [shopPhone, setShopPhone] = useState('0550 12 34 56');
  const [shopWilaya, setShopWilaya] = useState('25 - قسنطينة');
  const [shopAddress, setShopAddress] = useState('شارع 19 جوان 1965، وسط المدينة، قسنطينة');
  const [rcNumber, setRcNumber] = useState('25/00-1234567A20');
  const [nifNumber, setNifNumber] = useState('002025001234567');

  // BaridiMob RIP
  const [baridiMobRip, setBaridiMobRip] = useState('00799999002233445566');

  // Receipt thermal printer settings
  const [printerPaperSize, setPrinterPaperSize] = useState<'80mm' | '58mm'>('80mm');
  const [receiptHeader, setReceiptHeader] = useState('مرحباً بكم في محل DZPAY SHOP');
  const [receiptFooter, setReceiptFooter] = useState('السلع المباعة لا ترد ولا تستبدل بعد 48 ساعة • شكراً لزيارتكم');

  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div id="settings-view" className="space-y-5">
      {/* Header */}
      <PageHeader
        title={t('settings_title', 'إعدادات وتخصيص المتجر')}
        description={t('settings_subtitle', 'تكوين بيانات الفاتورة والوصل الحراري، حساب بريدي موب BaridiMob، والبيانات القانونية.')}
        breadcrumbCurrent={t('settings', 'إعدادات المحل')}
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={Settings}
      />

      {savedNotification && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{t('save_success', 'تم حفظ التغييرات بنجاح!')}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Language Selection Card */}
        <div className="bg-white dark:bg-[#0f1b38] rounded-2xl p-5 border border-slate-200 dark:border-[#1e2f54] shadow-xs">
          <LanguageSelector variant="cards" />
        </div>
        {/* Section 1: Shop Identity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Store className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">بيانات المحل وهوية النشاط</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">اسم المحل التجاري *</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">رقم هاتف المحل للزبائن *</label>
              <input
                type="text"
                value={shopPhone}
                onChange={(e) => setShopPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">الولاية *</label>
              <input
                type="text"
                value={shopWilaya}
                onChange={(e) => setShopWilaya(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">العنوان بالتفصيل *</label>
              <input
                type="text"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                رقم السجل التجاري (RC)
              </label>
              <input
                type="text"
                value={rcNumber}
                onChange={(e) => setRcNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                رقم التعريف الجبائي (NIF)
              </label>
              <input
                type="text"
                value={nifNumber}
                onChange={(e) => setNifNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: BaridiMob RIP Config */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm text-slate-900">
              إعدادات حساب بريدي موب (BaridiMob RIP)
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                رقم الحساب البريدي الجاري RIP (20 رقم) ليظهر للزبائن عند الدفع
              </label>
              <input
                type="text"
                maxLength={20}
                value={baridiMobRip}
                onChange={(e) => setBaridiMobRip(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm tracking-widest text-blue-800"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                يظهر هذا الرقم تلقائياً في شاشة نقطة البيع (POS) وعلى وصل الشراء لتسهيل التحويل.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Thermal Receipt Printer Config */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Printer className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-sm text-slate-900">
              إعدادات الطابعة الحرارية وتذكرة البيع (Thermal Receipt)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">عرض ورق الطابعة الحرارية</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPrinterPaperSize('80mm')}
                  className={`p-2.5 rounded-xl font-bold border transition-colors ${
                    printerPaperSize === '80mm'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  80 ملم (قياسي كبير)
                </button>
                <button
                  type="button"
                  onClick={() => setPrinterPaperSize('58mm')}
                  className={`p-2.5 rounded-xl font-bold border transition-colors ${
                    printerPaperSize === '58mm'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  58 ملم (طابعة مدمجة)
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                ترويسة الوصل الحراري (Header)
              </label>
              <input
                type="text"
                value={receiptHeader}
                onChange={(e) => setReceiptHeader(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">
                تذييل وملاحظات الضمان أسفل الوصل (Footer & Warranty notes)
              </label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Manager App Theme & Display Mode (الوضع المضيء والنمط الليلي الأزرق Dark Blue) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-sky-600" />
              <div>
                <h2 className="font-bold text-sm text-slate-900">مظهر تطبيق المدير ونمط العرض</h2>
                <p className="text-[11px] text-slate-500">اختر المظهر المفضل للعمل اليومي مع حفظ التفضيل تلقائياً في ذاكرة المتصفح</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              isDark
                ? 'bg-blue-950 text-sky-300 border-sky-800'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {isDark ? '🌙 النمط الليلي الأزرق مفعّل' : '☀️ الوضع المضيء مفعّل'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Light Mode Option */}
            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                theme === 'light'
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">الوضع المضيء الكلاسيكي</h3>
                      <span className="text-[10px] text-slate-500">Light Mode</span>
                    </div>
                  </div>
                  {theme === 'light' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  تصميم ناصع وتباين عالٍ يناسب بيئات العمل المضاءة بالنهار وقراءة الفواتير الورقية بوضوح.
                </p>
              </div>

              {/* Visual preview miniature */}
              <div className="h-12 rounded-xl bg-white border border-slate-200 p-2 flex items-center gap-2 shadow-2xs">
                <div className="w-3 h-full rounded-md bg-emerald-700"></div>
                <div className="flex-1 space-y-1">
                  <div className="w-16 h-2 bg-slate-300 rounded"></div>
                  <div className="w-10 h-1.5 bg-slate-200 rounded"></div>
                </div>
                <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200"></div>
              </div>
            </div>

            {/* Dark Blue Mode Option */}
            <div
              onClick={() => setTheme('dark-blue')}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                theme === 'dark-blue'
                  ? 'border-sky-500 bg-sky-950/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-950 text-sky-400 flex items-center justify-center border border-sky-800">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">النمط الليلي الأزرق الداكن</h3>
                      <span className="text-[10px] text-sky-600 font-semibold">Dark Blue / Midnight Navy</span>
                    </div>
                  </div>
                  {theme === 'dark-blue' && (
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-sky-900/50" />
                  )}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  درجات الأزرق البحري الداكن (Midnight Blue) لراحة فائقة للعين أثناء الورديات المسائية ونقاط البيع.
                </p>
              </div>

              {/* Visual preview miniature */}
              <div className="h-12 rounded-xl bg-[#0b1329] border border-[#1e2f54] p-2 flex items-center gap-2 shadow-2xs">
                <div className="w-3 h-full rounded-md bg-emerald-600"></div>
                <div className="flex-1 space-y-1">
                  <div className="w-16 h-2 bg-sky-400/80 rounded"></div>
                  <div className="w-10 h-1.5 bg-sky-900 rounded"></div>
                </div>
                <div className="w-6 h-6 rounded-md bg-[#162244] border border-[#1e305e]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. المزامنة السحابية وتسجيل الدخول عبر Google / Gmail */}
        <div className="bg-white dark:bg-[#0f1b38] rounded-2xl p-6 border border-slate-200 dark:border-[#1e2f54] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1e2f54]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                  المزامنة السحابية وتسجيل الدخول بواسطة Google / Gmail
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ربط حساب المدير لحفظ نسخ احتياطية للمخزون والبيانات سحابياً على Gmail
                </p>
              </div>
            </div>

            {isGoogleAuthenticated ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>حساب Google متصل</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                غير متصل بـ Google
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#132145] border border-slate-200 dark:border-[#1e2f54] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-500" />
                <span>
                  {isGoogleAuthenticated
                    ? `البريد الإلكتروني المتصل: ${googleUser?.email || currentUser?.email}`
                    : 'تسجيل الدخول بواسطة حساب Google (Gmail) يتيح النسخ الاحتياطي التلقائي'}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {lastCloudSync
                  ? `تاريخ آخر نسخة احتياطية على Gmail: ${lastCloudSync}`
                  : 'لم يتم إجراء أي مزامنة سحابية بعد'}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                id="settings-instant-backup-btn"
                onClick={onOpenInstantBackup}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                title="أخذ نسخة احتياطية كاملة وفورية لقاعدة البيانات وحفظها سحابياً على Gmail"
              >
                <Database className="w-4 h-4" />
                <span>أخذ نسخة احتياطية فورية ⚡</span>
              </button>

              {isGoogleAuthenticated ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenGmailSync}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Cloud className="w-4 h-4" />
                    <span>مزامنة سحابية الآن</span>
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    تبديل الحساب
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenGmailSync) onOpenGmailSync();
                    else loginWithGoogle();
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#16254a] border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#1c2d58] text-slate-800 dark:text-white font-bold text-xs flex items-center gap-2.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>تسجيل الدخول بحساب Google (Gmail)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-all active:scale-98 inline-flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('save', 'حفظ جميع إعدادات المحل')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
