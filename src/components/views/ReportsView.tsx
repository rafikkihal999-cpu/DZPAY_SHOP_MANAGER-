import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Printer,
  FileSpreadsheet,
  FileText,
  TrendingDown,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { StatCard } from '../common/StatCard';
import { PrintLayout } from '../common/PrintLayout';

type ReportType =
  | 'sales'
  | 'profit'
  | 'inventory'
  | 'debts'
  | 'expenses'
  | 'employees';

type PeriodType = 'today' | 'week' | 'month' | 'custom';

export const ReportsView: React.FC<{ onNavigateTo: (id: string) => void }> = ({ onNavigateTo }) => {
  const { currency, activeBranch } = useAuth();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Strict constraint: No fake data. Initially empty as requested.
  const hasData = false;

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const handleExportExcel = () => {
    alert('تصدير التقرير كملف Excel (ميزة جاهزة للربط مع قاعدة البيانات)');
  };

  const handleExportPdf = () => {
    setIsPrintModalOpen(true);
  };

  const getReportTitle = (type: ReportType) => {
    switch (type) {
      case 'sales':
        return 'تقرير المبيعات وحركة الفواتير';
      case 'profit':
        return 'تقرير الأرباح وهامش الربح التجاري';
      case 'inventory':
        return 'تقرير المخزون وحركة المواد والسلع';
      case 'debts':
        return 'تقرير الديون والتحصيلات';
      case 'expenses':
        return 'تقرير المصاريف والنفقات التشغيلية';
      case 'employees':
        return 'تقرير أداء الموظفين والمبيعات';
    }
  };

  return (
    <div id="reports-view" className="space-y-5">
      <PageHeader
        title="التقارير المالية والإحصائيات"
        description="تقارير المبيعات، حساب هامش الأرباح الصافية، متابعة حركة المخزون، وتحصيل الديون."
        breadcrumbCurrent="التقارير والإحصائيات"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={BarChart3}
        onPrint={handlePrint}
        printText="طباعة"
      />

      {/* Control Bar: Period Selector, Report Type, and Exports */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Period Selector (اليوم، هذا الأسبوع، هذا الشهر، مخصص) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                period === 'today'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اليوم
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                period === 'week'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              هذا الأسبوع
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                period === 'month'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              هذا الشهر
            </button>
            <button
              onClick={() => setPeriod('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                period === 'custom'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              مخصص
            </button>
          </div>

          {/* Export / Print buttons (طباعة، تصدير Excel، تصدير PDF) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="طباعة التقرير"
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={handleExportExcel}
              title="تصدير ملف إكسل"
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>تصدير Excel</span>
            </button>
            <button
              onClick={handleExportPdf}
              title="تصدير كملف PDF"
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>تصدير PDF</span>
            </button>
          </div>
        </div>

        {/* Custom Date Pickers when 'custom' is selected */}
        {period === 'custom' && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">من تاريخ:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">إلى تاريخ:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-mono"
              />
            </div>
          </div>
        )}

        {/* Report Types Tabs (6 types requested) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {[
            { id: 'sales', label: 'تقرير المبيعات' },
            { id: 'profit', label: 'تقرير الأرباح (هامش الربح)' },
            { id: 'inventory', label: 'تقرير المخزون وحركة المواد' },
            { id: 'debts', label: 'تقرير الديون والتحصيل' },
            { id: 'expenses', label: 'تقرير المصاريف' },
            { id: 'employees', label: 'تقرير أداء الموظفين' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setReportType(t.id as ReportType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                reportType === t.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary for Selected Period */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="إجمالي المبيعات"
          value={`0 ${currency}`}
          helperText="للفترة المحددة"
          icon={ShoppingBag}
          iconColor="text-emerald-700"
        />
        <StatCard
          label="صافي الأرباح المقدرة"
          value={`0 ${currency}`}
          helperText="بعد خصم سعر التكلفة"
          icon={TrendingUp}
          iconColor="text-blue-700"
        />
        <StatCard
          label="إجمالي المصاريف والنفقات"
          value={`0 ${currency}`}
          helperText="مصاريف تشغيلية ونثريات"
          icon={CreditCard}
          iconColor="text-rose-700"
        />
        <StatCard
          label="التحصيلات النقدية"
          value={`0 ${currency}`}
          helperText="المقبوضات في الدرج وبريدي موب"
          icon={DollarSign}
          iconColor="text-amber-700"
        />
      </div>

      {/* Clean data tables for each report type / Empty state */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900">{getReportTitle(reportType)}</h3>
          <span className="text-[11px] text-slate-500 font-medium">الفترة: {period === 'today' ? 'اليوم' : period === 'week' ? 'هذا الأسبوع' : period === 'month' ? 'هذا الشهر' : 'فترة مخصصة'}</span>
        </div>

        {hasData ? (
          <div className="p-4 text-xs text-slate-600">بيانات التقرير</div>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="لا توجد بيانات كافية لإنشاء التقرير"
            description="ستتوفر التقارير والرسوم البيانية بمجرد تسجيل مبيعات وحركات في النظام."
            actionText="الذهاب لنقطة البيع (POS)"
            onAction={() => onNavigateTo('pos')}
          />
        )}
      </div>

      {/* Print Preview Modal using Generic PrintLayout */}
      {isPrintModalOpen && (
        <PrintLayout
          mode="modal"
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          documentType="report"
          documentTitle={getReportTitle(reportType)}
          documentSubtitle={`الفترة الزمنية: ${
            period === 'today'
              ? 'اليوم'
              : period === 'week'
              ? 'هذا الأسبوع'
              : period === 'month'
              ? 'هذا الشهر'
              : `من ${customStart || 'البداية'} إلى ${customEnd || 'اليوم'}`
          }`}
          defaultPaperSize="a4"
          allowPaperSizeChange={true}
          showSignatures={true}
          showStampBox={true}
          showBarcode={true}
          notes="تم استخراج هذا التقرير آلياً من سجلات برنامج DZPAY SHOP MANAGER وهو معتمد للمراجعة والمحاسبة الداخلية."
        >
          {/* Professional Report Body Content */}
          <div className="space-y-4 text-xs">
            {/* Report Summary Cards */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">إجمالي المبيعات</div>
                <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">0 د.ج</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">صافي الأرباح</div>
                <div className="font-mono font-bold text-sm text-emerald-800 mt-0.5">0 د.ج</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">إجمالي المصاريف</div>
                <div className="font-mono font-bold text-sm text-rose-800 mt-0.5">0 د.ج</div>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold">التحصيلات النقدية</div>
                <div className="font-mono font-bold text-sm text-blue-800 mt-0.5">0 د.ج</div>
              </div>
            </div>

            {/* Empty report state notice */}
            <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-1">
              <p className="font-bold text-slate-800 text-xs">لا توجد حركات تجارية مسجلة خلال الفترة المحددة</p>
              <p className="text-[11px] text-slate-500">
                ستدرج الجداول المحاسبية وحركات الصندوق تلقائياً بمجرد إتمام عمليات البيع والشراء في النظام.
              </p>
            </div>
          </div>
        </PrintLayout>
      )}
    </div>
  );
};
