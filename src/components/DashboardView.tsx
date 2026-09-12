import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Wallet,
  CalendarClock,
  Smartphone,
  AlertCircle,
  AlertTriangle,
  PlusCircle,
  ShoppingCart,
  QrCode,
  Building2,
  Receipt,
  Truck,
  Coins,
  ArrowDownLeft,
  Package,
  Boxes,
  Users,
  CreditCard,
  History,
  Award,
  BarChart3,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  RotateCcw,
  Cloud,
  Mail,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StatCard } from './common/StatCard';
import { QuickAction } from './common/QuickAction';
import { EmptyState } from './common/EmptyState';
import {
  checkLowStockProducts,
  SAMPLE_MONITORED_PRODUCTS,
  MonitoredProduct,
  StockAlertItem,
} from '../utils/stockMonitor';
import { SalesProfitDataVisualization } from './dashboard/SalesProfitDataVisualization';

export { checkLowStockProducts };

interface DashboardViewProps {
  onNavigateTo: (sectionId: string) => void;
  onOpenGmailSync?: () => void;
  onOpenInstantBackup?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTo,
  onOpenGmailSync,
  onOpenInstantBackup,
}) => {
  const {
    activeBranch,
    currency,
    currentUser,
    googleUser,
    isGoogleAuthenticated,
    lastCloudSync,
    loginWithGoogle,
  } = useAuth();
  const [monitoredProducts, setMonitoredProducts] = useState<MonitoredProduct[]>(SAMPLE_MONITORED_PRODUCTS);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [isAlertExpanded, setIsAlertExpanded] = useState(false);

  // مراقبة كميات المنتجات والكشف عن أي منتج أقل من حده الأدنى
  const stockSummary = useMemo(() => {
    return checkLowStockProducts(monitoredProducts);
  }, [monitoredProducts]);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Top Welcome & Shop Context Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h1 className="text-xl font-black text-slate-900">
              لوحة التحكم • DZPAY SHOP MANAGER
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            نظام إدارة محلات الهواتف المحمولة، الإكسسوارات، والخدمات الرقمية بالدينار الجزائري ({currency})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{activeBranch}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span>العملة: د.ج (DZD)</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GMAIL CLOUD SYNC & AUTH STATUS BANNER (مزامنة البيانات السحابية على الجيمايل)  */}
      {/* ========================================================================= */}
      <div
        id="dashboard-gmail-sync-banner"
        className="rounded-2xl p-4 border border-sky-200 dark:border-[#1e2f54] bg-gradient-to-r from-sky-50/90 via-blue-50/70 to-indigo-50/80 dark:from-[#0f1b38] dark:via-[#122046] dark:to-[#162752] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                المزامنة السحابية عبر Gmail
              </h3>
              {isGoogleAuthenticated ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>متصل: {googleUser?.email || currentUser?.email}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  تسجيل الدخول بـ Google غير نشط
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {isGoogleAuthenticated
                ? `حفظ مشفر ومباشر لنسخ احتياطية للمخزون والتقارير في بريدك الإلكتروني. ${
                    lastCloudSync ? `(آخر حفظ: ${lastCloudSync})` : ''
                  }`
                : 'قم بتسجيل الدخول بحسابك في Google لتمكين حفظ ومزامنة بيانات المحل سحابياً على Gmail بنقرة واحدة.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            id="dash-instant-backup-btn"
            onClick={onOpenInstantBackup}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            title="أخذ نسخة احتياطية كاملة وفورية لقاعدة البيانات وحفظها في التخزين السحابي بحساب Gmail"
          >
            <Database className="w-4 h-4" />
            <span>نسخة احتياطية فورية ⚡</span>
          </button>

          {isGoogleAuthenticated ? (
            <button
              type="button"
              id="dash-sync-gmail-btn"
              onClick={onOpenGmailSync}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Cloud className="w-4 h-4" />
              <span>مزامنة سحابية</span>
            </button>
          ) : (
            <button
              type="button"
              id="dash-google-login-btn"
              onClick={() => {
                if (onOpenGmailSync) onOpenGmailSync();
                else loginWithGoogle();
              }}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#162447] border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#1a2c56] text-slate-800 dark:text-white font-bold text-xs flex items-center gap-2.5 shadow-xs transition-all cursor-pointer"
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
              <span>تسجيل الدخول بـ Google</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISUAL STOCK ALERT BANNER (تنبيه بصري فوري عند انخفاض رصيد أي منتج)         */}
      {/* ========================================================================= */}
      {stockSummary.hasLowStockAlert && !isAlertDismissed && (
        <div
          id="dashboard-low-stock-alert"
          className="relative overflow-hidden rounded-2xl border-2 border-amber-400/90 bg-gradient-to-r from-amber-50 via-orange-50/70 to-rose-50/80 p-4 sm:p-5 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-amber-950">
                    تنبيه مراقبة المخزون: رصد انخفاض رصيد {stockSummary.totalAlerts} أصناف عن الحد الأدنى!
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300">
                    مستوى الأمان تحت الخطر
                  </span>
                </div>

                <p className="text-xs text-amber-900/80 mt-1 max-w-2xl">
                  توجد سلع قاربت أو نفدت بالفعل من المخزن. ينصح بطلب توريد عاجل من تجار الجملة لضمان استمرارية المبيعات ونقطة البيع (POS).
                </p>

                {/* Badges breakdown */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  {stockSummary.outOfStockCount > 0 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                      {stockSummary.outOfStockCount} صنف نفد بالكامل (0 قطع)
                    </span>
                  )}
                  {stockSummary.criticalCount > 0 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                      {stockSummary.criticalCount} صنف في مستوى حرج
                    </span>
                  )}
                  {stockSummary.lowStockCount > 0 && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300">
                      {stockSummary.lowStockCount} صنف تحت الحد الأدنى
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() => setIsAlertExpanded(!isAlertExpanded)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/70 text-amber-900 text-xs font-bold border border-amber-300 transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isAlertExpanded ? 'إخفاء التفاصيل' : 'معاينة النواقص'}</span>
                {isAlertExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => onNavigateTo('purchases')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                <span>طلب توريد فوري (المشتريات)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAlertDismissed(true)}
                className="p-2 rounded-xl bg-white/60 hover:bg-white text-amber-800 hover:text-amber-950 transition-colors border border-amber-200 cursor-pointer"
                title="إخفاء التنبيه مؤقتاً"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expandable Low Stock Items List */}
          {isAlertExpanded && (
            <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-2">
              <div className="text-xs font-bold text-amber-950 mb-2">
                قائمة السلع التي تحتاج لإعادة تموين فورية:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {stockSummary.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/90 p-3 rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-slate-900 truncate">{item.name}</span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                            item.severity === 'out_of_stock'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : item.severity === 'critical'
                              ? 'bg-orange-100 text-orange-800 border border-orange-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {item.severityLabel}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
                        <span>الرصيد بالمخزن: <strong className="text-slate-900 font-mono">{item.currentStock}</strong></span>
                        <span>الحد الأدنى: <strong className="text-amber-800 font-mono">{item.minThreshold}</strong></span>
                      </div>
                      {/* Visual stock ratio bar */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className={`h-full rounded-full ${
                            item.currentStock === 0
                              ? 'w-0'
                              : item.severity === 'critical'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(8, item.stockRatio * 100))}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.barcode ? `باركود: ${item.barcode.slice(-6)}` : item.brand}
                      </span>
                      <button
                        onClick={() => onNavigateTo('purchases')}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                      >
                        <span>طلب توريد</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions (9 Actions, POS prominent) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            الإجراءات السريعة للمحل
          </h2>
          <span className="text-[11px] text-slate-600 font-medium">
            اختصارات المهام اليومية
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2.5">
          {/* 1. بيع جديد (POS - Prominent) */}
          <QuickAction
            id="btn-quick-pos"
            title="بيع جديد (POS)"
            subtitle="شاشة المبيعات السريعة"
            icon={ShoppingCart}
            variant="primary"
            onClick={() => onNavigateTo('pos')}
            className="col-span-2 sm:col-span-1 xl:col-span-1"
          />

          {/* 2. إضافة منتج */}
          <QuickAction
            id="btn-quick-product"
            title="إضافة منتج"
            subtitle="إكسسوارات وشواحن"
            icon={QrCode}
            variant="secondary"
            onClick={() => onNavigateTo('products')}
          />

          {/* 3. تسجيل هاتف / IMEI */}
          <QuickAction
            id="btn-quick-phone"
            title="تسجيل هاتف / IMEI"
            subtitle="تتبع السيريال والضمان"
            icon={Smartphone}
            variant="blue"
            onClick={() => onNavigateTo('phones-imei')}
          />

          {/* 4. إضافة عميل */}
          <QuickAction
            id="btn-quick-customer"
            title="إضافة عميل"
            subtitle="دليل الزبائن والولايات"
            icon={Users}
            variant="secondary"
            onClick={() => onNavigateTo('customers')}
          />

          {/* 5. تسجيل دفعة */}
          <QuickAction
            id="btn-quick-installment"
            title="تسجيل دفعة"
            subtitle="سداد أقساط الكريدي"
            icon={CreditCard}
            variant="amber"
            onClick={() => onNavigateTo('installments-debts')}
          />

          {/* 6. إضافة مصروف */}
          <QuickAction
            id="btn-quick-expense"
            title="إضافة مصروف"
            subtitle="مصاريف تشغيلية ونثرية"
            icon={Coins}
            variant="danger"
            onClick={() => onNavigateTo('expenses')}
          />

          {/* 7. إضافة مورد */}
          <QuickAction
            id="btn-quick-supplier"
            title="إضافة مورد"
            subtitle="تجار الجملة (بلفور/العلمة)"
            icon={Truck}
            variant="secondary"
            onClick={() => onNavigateTo('suppliers')}
          />

          {/* 8. إدخال مشتريات */}
          <QuickAction
            id="btn-quick-purchase"
            title="إدخال مشتريات"
            subtitle="وصل استلام السلع"
            icon={Package}
            variant="secondary"
            onClick={() => onNavigateTo('purchases')}
          />

          {/* 9. حركة صندوق */}
          <QuickAction
            id="btn-quick-cashbox"
            title="حركة صندوق"
            subtitle="جلسة الدرج والخزينة"
            icon={Wallet}
            variant="secondary"
            onClick={() => onNavigateTo('cashbox')}
          />

          {/* 10. مزامنة سحابية Gmail */}
          <QuickAction
            id="btn-quick-gmail-sync"
            title="مزامنة سحابية"
            subtitle="نسخ احتياطي Gmail"
            icon={Cloud}
            variant="blue"
            onClick={() => {
              if (onOpenGmailSync) onOpenGmailSync();
              else loginWithGoogle();
            }}
          />

          {/* 11. نسخة احتياطية فورية لقاعدة البيانات */}
          <QuickAction
            id="btn-quick-instant-db-backup"
            title="نسخة فورية ⚡"
            subtitle="حفظ قاعدة البيانات"
            icon={Database}
            variant="primary"
            onClick={() => {
              if (onOpenInstantBackup) onOpenInstantBackup();
            }}
          />
        </div>
      </div>

      {/* 8 KPI Cards (All empty values: 0.00 دج or لا توجد بيانات بعد) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            المؤشرات المالية والمخزنية
          </h2>
          <span className="text-[11px] text-slate-600 font-medium">
            تُحسب تلقائياً من العمليات المسجلة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* KPI 1: مبيعات اليوم */}
          <StatCard
            label="مبيعات اليوم"
            value="0.00 دج"
            helperText="لا توجد فواتير مبيعات مسجلة اليوم"
            icon={TrendingUp}
            colorScheme="emerald"
          />

          {/* KPI 2: أرباح اليوم */}
          <StatCard
            label="أرباح اليوم"
            value="0.00 دج"
            helperText="تظهر الأرباح بعد تسجيل أول عملية بيع"
            icon={Award}
            colorScheme="emerald"
          />

          {/* KPI 3: مصاريف اليوم */}
          <StatCard
            label="مصاريف اليوم"
            value="0.00 دج"
            helperText="لم يتم تسجيل مصاريف اليوم"
            icon={Coins}
            colorScheme="amber"
          />

          {/* KPI 4: صافي الربح */}
          <StatCard
            label="صافي الربح"
            value="0.00 دج"
            helperText="الإيرادات ناقص التكاليف والمصاريف"
            icon={BarChart3}
            colorScheme="blue"
          />

          {/* KPI 5: رصيد الصندوق */}
          <StatCard
            label="رصيد الصندوق"
            value="0.00 دج"
            helperText="الصندوق مغلق • بانتظار فتح الجلسة"
            icon={Wallet}
            colorScheme="emerald"
          />

          {/* KPI 6: الديون المستحقة */}
          <StatCard
            label="الديون المستحقة (للمحل)"
            value="0.00 دج"
            helperText="لا توجد ديون أو أقساط متأخرة على العملاء"
            icon={CalendarClock}
            colorScheme="amber"
          />

          {/* KPI 7: مستحقات الموردين */}
          <StatCard
            label="مستحقات الموردين (على المحل)"
            value="0.00 دج"
            helperText="لا توجد فواتير شراء مؤجلة للموردين"
            icon={Truck}
            colorScheme="rose"
          />

          {/* KPI 8: قيمة المخزون */}
          <StatCard
            label="قيمة المخزون"
            value="0.00 دج"
            helperText={
              stockSummary.hasLowStockAlert
                ? `⚠️ تنبيه: ${stockSummary.totalAlerts} أصناف انخفضت عن حد الأمان`
                : "قيمة الهواتف والإكسسوارات بسعر التكلفة"
            }
            icon={Boxes}
            colorScheme={stockSummary.hasLowStockAlert ? "amber" : "violet"}
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DATA VISUALIZATION: إحصائيات المبيعات والأرباح اليومية والأسبوعية (RECHARTS)   */}
      {/* ========================================================================= */}
      <SalesProfitDataVisualization />

      {/* 7 Dashboard Sections with Clean Empty States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section 1: آخر المبيعات */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-sm font-bold text-slate-800">آخر المبيعات</h3>
              <p className="text-[11px] text-slate-500">سجل الفواتير الصادرة من نقطة البيع</p>
            </div>
            <button
              onClick={() => onNavigateTo('sales')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              عرض الكل
            </button>
          </div>
          <EmptyState
            icon={Receipt}
            title="لا توجد مبيعات بعد"
            description="ستظهر المبيعات هنا بعد تسجيل أول عملية بيع من نقطة البيع (POS)."
            actionText="فتح نقطة البيع (POS)"
            actionIcon={ShoppingCart}
            onAction={() => onNavigateTo('pos')}
          />
        </div>

        {/* Section 2: تنبيهات المخزون */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>تنبيهات المخزون</span>
                    {stockSummary.hasLowStockAlert && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                        {stockSummary.totalAlerts} تحت الحد
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500">المنتجات التي اقتربت من النفاد وتحت حد الطلب</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTo('inventory')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                إدارة المخزون
              </button>
            </div>

            {stockSummary.hasLowStockAlert ? (
              <div className="p-3 divide-y divide-slate-100">
                {stockSummary.items.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-2.5 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition-colors">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          item.severity === 'out_of_stock'
                            ? 'bg-rose-100 text-rose-700'
                            : item.severity === 'critical'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 truncate">{item.name}</span>
                          <span
                            className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                              item.severity === 'out_of_stock'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : item.severity === 'critical'
                                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {item.severityLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                          <span>الرصيد: <strong className="text-slate-800 font-mono">{item.currentStock}</strong></span>
                          <span>•</span>
                          <span>الحد الأدنى: <strong className="text-amber-800 font-mono">{item.minThreshold}</strong></span>
                          <span>•</span>
                          <span className="text-rose-600 font-medium">عجز: -{item.deficit}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTo('purchases')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold shrink-0 transition-colors flex items-center gap-1"
                    >
                      <span>طلب توريد</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={AlertCircle}
                title="المخزون مكتمل ولا توجد نواقص"
                description="لا توجد منتجات أو قطع غيار تحت الحد الأدنى للطلب حالياً."
                actionText="إضافة منتج للمخزون"
                actionIcon={PlusCircle}
                onAction={() => onNavigateTo('products')}
              />
            )}
          </div>

          {stockSummary.hasLowStockAlert && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 text-[11px]">
                يوجد إجمالي {stockSummary.totalAlerts} منتجات تتطلب تجديد المخزون
              </span>
              <button
                onClick={() => onNavigateTo('inventory')}
                className="font-bold text-emerald-700 hover:text-emerald-800"
              >
                عرض كل النواقص في الجرد ←
              </button>
            </div>
          )}
        </div>

        {/* Section 3: الأقساط المستحقة */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-sm font-bold text-slate-800">الأقساط المستحقة</h3>
              <p className="text-[11px] text-slate-500">دفعات الكريدي الواجبة السداد هذا الشهر</p>
            </div>
            <button
              onClick={() => onNavigateTo('installments-debts')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              سجل الديون
            </button>
          </div>
          <EmptyState
            icon={CalendarClock}
            title="لا توجد أقساط مستحقة حالياً"
            description="ستظهر مواعيد استحقاق أقساط الهواتف والكريدي وتنبيهات السداد هنا."
            actionText="إدارة الأقساط والديون"
            actionIcon={CreditCard}
            onAction={() => onNavigateTo('installments-debts')}
          />
        </div>

        {/* Section 4: آخر حركات الصندوق */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-sm font-bold text-slate-800">آخر حركات الصندوق</h3>
              <p className="text-[11px] text-slate-500">حركات الإيداع، السحب، ومطابقة بريدي موب</p>
            </div>
            <button
              onClick={() => onNavigateTo('cashbox')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              فتح الخزينة
            </button>
          </div>
          <EmptyState
            icon={History}
            title="لا توجد حركات صندوق اليوم"
            description="قم بفتح جلسة الصندوق وتسجيل الرصيد الافتتاحي لمتابعة السيولة النقدية اليومية."
            actionText="بدء جلسة الصندوق اليومية"
            actionIcon={Wallet}
            onAction={() => onNavigateTo('cashbox')}
          />
        </div>

        {/* Section 5: المنتجات الأكثر مبيعاً */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-sm font-bold text-slate-800">المنتجات الأكثر مبيعاً</h3>
              <p className="text-[11px] text-slate-500">الإكسسوارات والهواتف الأعلى طلباً في المحل</p>
            </div>
            <button
              onClick={() => onNavigateTo('reports')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              التقارير
            </button>
          </div>
          <EmptyState
            icon={Award}
            title="لا توجد بيانات مبيعات بعد"
            description="سيتم تصنيف المنتجات الأكثر طلباً تلقائياً فور إجراء المبيعات عبر نقطة البيع."
            actionText="معاينة دليل المنتجات"
            actionIcon={QrCode}
            onAction={() => onNavigateTo('products')}
          />
        </div>

        {/* Section 6: ملخص المبيعات */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-sm font-bold text-slate-800">ملخص المبيعات</h3>
              <p className="text-[11px] text-slate-500">توزيع المبيعات حسب طرق الدفع والأقسام</p>
            </div>
            <button
              onClick={() => onNavigateTo('reports')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              الإحصائيات
            </button>
          </div>
          <EmptyState
            icon={BarChart3}
            title="لا توجد بيانات إحصائية بعد"
            description="الرسم البياني وتوزيع طرق الدفع (كاش، BaridiMob، أقساط) يظهر بعد أول عملية."
            actionText="عرض صفحة التقارير"
            actionIcon={TrendingUp}
            onAction={() => onNavigateTo('reports')}
          />
        </div>

        {/* Section 7: أحدث الهواتف وأرقام IMEI (Full width on lg) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-sm font-bold text-slate-800">أحدث الهواتف وأرقام IMEI</h3>
              <p className="text-[11px] text-slate-500">الأجهزة المضافة حديثاً في مخزون المحل مع السيريال والضمان</p>
            </div>
            <button
              onClick={() => onNavigateTo('phones-imei')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              سجل الهواتف والـ IMEI
            </button>
          </div>
          <EmptyState
            icon={Smartphone}
            title="لا توجد هواتف مسجلة في المخزون"
            description="سجل الهواتف جاهز لتسجيل أرقام IMEI1 و IMEI2، الذاكرة، واللون، وحالة الجهاز (جديد مع ضمان أو مستعمل)."
            actionText="تسجيل أول هاتف / IMEI"
            actionIcon={PlusCircle}
            onAction={() => onNavigateTo('phones-imei')}
          />
        </div>
      </div>
    </div>
  );
};
