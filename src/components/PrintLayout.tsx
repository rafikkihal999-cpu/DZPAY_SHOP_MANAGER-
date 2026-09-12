import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  Smartphone,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Building2,
  FileText,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Percent,
  Download,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type PrintPaperSize = 'a4' | 'a5' | 'thermal_80mm' | 'thermal_58mm';
export type PrintDocumentType = 'invoice' | 'receipt' | 'warranty' | 'repair' | 'report' | 'purchase';

export interface PrintItem {
  id?: string;
  name: string;
  description?: string;
  imei?: string;
  warrantyPeriod?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
}

export interface PrintTotals {
  subtotal: number;
  tax?: number;
  taxRate?: number;
  discount?: number;
  deliveryFee?: number;
  grandTotal: number;
  paidAmount?: number;
  remainingAmount?: number;
  changeAmount?: number;
  paymentMethod?: string;
}

export interface PrintCustomerInfo {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  wilaya?: string;
  nationalId?: string;
  rcNumber?: string;
  nifNumber?: string;
}

export interface PrintShopInfo {
  name: string;
  slogan?: string;
  managerName?: string;
  branch: string;
  address: string;
  phone: string;
  email?: string;
  rcNumber?: string;
  nifNumber?: string;
  nisNumber?: string;
  aiNumber?: string;
  baridiMobRip?: string;
  ccpNumber?: string;
}

export interface PrintReportMetric {
  label: string;
  value: string | number;
  subValue?: string;
  isPositive?: boolean;
}

export interface PrintReportSection {
  title: string;
  subtitle?: string;
  columns?: string[];
  rows: Array<{
    label: string;
    values: Array<string | number>;
    badge?: string;
  }>;
}

export interface PrintReportData {
  period?: string;
  summaryMetrics?: PrintReportMetric[];
  sections?: PrintReportSection[];
  kpis?: Array<{ label: string; value: string | number; description?: string }>;
}

export interface PrintLayoutProps {
  mode?: 'modal' | 'inline';
  isOpen?: boolean;
  onClose?: () => void;
  documentType?: PrintDocumentType;
  documentTitle?: string;
  documentSubtitle?: string;
  documentNumber?: string;
  documentDate?: string;
  title?: string;
  subtitle?: string;
  branch?: string;
  shopName?: string;
  date?: string;
  operatorName?: string;
  shopInfo?: Partial<PrintShopInfo>;
  customerInfo?: PrintCustomerInfo;
  items?: PrintItem[];
  totals?: PrintTotals;
  reportData?: PrintReportData;
  children?: React.ReactNode;
  notes?: string;
  termsAndConditions?: string[];
  showSignatures?: boolean;
  showStampBox?: boolean;
  showBarcode?: boolean;
  showAmountInWords?: boolean;
  defaultPaperSize?: PrintPaperSize;
  allowPaperSizeChange?: boolean;
  onPrint?: () => void;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({
  mode = 'modal',
  isOpen = true,
  onClose,
  documentType = 'invoice',
  documentTitle,
  documentSubtitle,
  documentNumber,
  documentDate,
  title,
  subtitle,
  branch,
  shopName,
  date,
  operatorName,
  shopInfo: customShopInfo,
  customerInfo,
  items,
  totals,
  reportData,
  children,
  notes,
  termsAndConditions,
  showSignatures = true,
  showStampBox = true,
  showBarcode = true,
  showAmountInWords = true,
  defaultPaperSize = 'a4',
  allowPaperSizeChange = true,
  onPrint,
}) => {
  const { activeBranch } = useAuth();
  const [paperSize, setPaperSize] = useState<PrintPaperSize>(defaultPaperSize);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    setPaperSize(defaultPaperSize);
  }, [defaultPaperSize]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (mode === 'modal' && !isOpen) return null;

  // Algerian today formatted dates
  const todayDateStr =
    date ||
    documentDate ||
    new Date().toLocaleDateString('fr-DZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

  const todayFullArabicDate = new Date().toLocaleDateString('ar-DZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const currentTimeStr = new Date().toLocaleTimeString('fr-DZ', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Shop and Branch details (رفيق كيحل - الفرع الرئيسي - قسنطينة)
  const resolvedBranch =
    branch ||
    customShopInfo?.branch ||
    'رفيق كيحل - الفرع الرئيسي - قسنطينة';

  const resolvedShopInfo: PrintShopInfo = {
    name: shopName || customShopInfo?.name || 'DZPAY SHOP - هواتف وإكسسوارات',
    slogan: customShopInfo?.slogan || 'بيع وصيانة الهواتف الذكية، الإكسسوارات الأصلية والخدمات الرقمية المعتمدة',
    managerName: customShopInfo?.managerName || 'رفيق كيحل',
    branch: resolvedBranch,
    address: customShopInfo?.address || 'شارع 19 جوان 1965، وسط المدينة، قسنطينة',
    phone: customShopInfo?.phone || '0550 12 34 56 / 0770 98 76 54',
    email: customShopInfo?.email || 'rafikkihal999@gmail.com',
    rcNumber: customShopInfo?.rcNumber || '25/00-1234567A20',
    nifNumber: customShopInfo?.nifNumber || '002025001234567',
    nisNumber: customShopInfo?.nisNumber || '002512345678901',
    aiNumber: customShopInfo?.aiNumber || '25012345678',
    baridiMobRip: customShopInfo?.baridiMobRip || '00799999002233445566',
    ccpNumber: customShopInfo?.ccpNumber || '12345678 Clé 45',
  };

  const activeDocumentTitle =
    documentTitle ||
    title ||
    (documentType === 'receipt'
      ? 'وصل استلام ودفع إلكتروني'
      : documentType === 'warranty'
      ? 'شهادة ضمان وفحص معتمدة'
      : documentType === 'repair'
      ? 'وصل إيداع جهاز للصيانة'
      : documentType === 'report'
      ? 'تقرير محاسبي وإحصائي رسمي'
      : documentType === 'purchase'
      ? 'وصل استلام وتوريد بضاعة'
      : 'فاتورة مبيعات تجارية');

  const activeDocNumber =
    documentNumber ||
    `DZ-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleTriggerPrint = () => {
    setIsPrinting(true);
    if (onPrint) onPrint();
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  const isThermal = paperSize === 'thermal_80mm' || paperSize === 'thermal_58mm';

  return (
    <div
      id="print-layout-wrapper"
      className={
        mode === 'modal'
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto'
          : 'w-full py-4'
      }
    >
      <div
        className={
          mode === 'modal'
            ? 'relative w-full max-w-4xl bg-slate-100 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh] border border-slate-300'
            : 'w-full bg-white rounded-xl border border-slate-200'
        }
      >
        {/* ========================================================================= */}
        {/* INTERACTIVE CONTROLS BAR (Hidden during actual print)                     */}
        {/* ========================================================================= */}
        <div className="no-print bg-slate-900 text-white px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide text-slate-100">
                معاينة الطباعة والمستندات الرسمية
              </h2>
              <p className="text-[11px] text-slate-400">
                {resolvedShopInfo.branch}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Paper Size Selector */}
            {allowPaperSizeChange && (
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setPaperSize('a4')}
                  className={`px-2.5 py-1.5 rounded-md font-bold transition-colors ${
                    paperSize === 'a4'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  A4 كامل
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('a5')}
                  className={`px-2.5 py-1.5 rounded-md font-bold transition-colors ${
                    paperSize === 'a5'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  A5 نصف صفحة
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('thermal_80mm')}
                  className={`px-2.5 py-1.5 rounded-md font-bold transition-colors ${
                    paperSize === 'thermal_80mm'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  وصل حراري (80mm)
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('thermal_58mm')}
                  className={`px-2.5 py-1.5 rounded-md font-bold transition-colors hidden sm:block ${
                    paperSize === 'thermal_58mm'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  وصل (58mm)
                </button>
              </div>
            )}

            {/* Print Trigger Button */}
            <button
              type="button"
              id="btn-trigger-browser-print"
              onClick={handleTriggerPrint}
              disabled={isPrinting}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'جارٍ فتح نافذة الطباعة...' : 'طباعة المستند'}</span>
            </button>

            {/* Close Button (if modal) */}
            {mode === 'modal' && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="إغلاق المعاينة"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Container for Preview */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 flex justify-center bg-slate-200/80">
          {/* ========================================================================= */}
          {/* PRINTABLE CONTAINER: id='print-area'                                      */}
          {/* ========================================================================= */}
          <div
            id="print-area"
            className={`bg-white text-slate-900 shadow-md border border-slate-300 transition-all duration-200 ${
              paperSize === 'thermal_80mm'
                ? 'w-[80mm] p-3 text-xs leading-tight mx-auto rounded-none font-sans'
                : paperSize === 'thermal_58mm'
                ? 'w-[58mm] p-2 text-[10px] leading-tight mx-auto rounded-none font-sans'
                : paperSize === 'a5'
                ? 'w-full max-w-[148mm] p-6 text-xs mx-auto rounded-xl'
                : 'w-full max-w-[210mm] p-8 text-sm mx-auto rounded-xl'
            }`}
            style={{
              fontFamily: 'Cairo, Tahoma, Arial, sans-serif',
              direction: 'rtl',
            }}
          >
            {/* ========================================================================= */}
            {/* 1. PROFESSIONAL HEADER (ترويسة احترافية)                                    */}
            {/* يتضمن شعار المحل ومعلومات الفرع (رفيق كيحل - الفرع الرئيسي - قسنطينة)       */}
            {/* مع تاريخ اليوم                                                            */}
            {/* ========================================================================= */}
            {isThermal ? (
              /* THERMAL RECEIPT HEADER */
              <div className="text-center pb-3 mb-3 border-b-2 border-dashed border-slate-400 space-y-1.5">
                {/* Thermal Shop Logo / Icon */}
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-900 text-white flex items-center justify-center font-black">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="font-black text-sm text-slate-950 tracking-tight">
                  {resolvedShopInfo.name}
                </div>
                <div className="text-[10px] text-slate-600 font-bold">
                  {resolvedShopInfo.slogan}
                </div>

                {/* Explicit Branch Badge (رفيق كيحل - الفرع الرئيسي - قسنطينة) */}
                <div className="p-1 rounded bg-slate-100 border border-slate-300 text-[10px] font-black text-slate-900 mt-1">
                  {resolvedShopInfo.branch}
                </div>

                <div className="text-[9px] text-slate-600">
                  {resolvedShopInfo.address}
                </div>
                <div className="text-[9px] font-mono text-slate-700 dir-ltr">
                  هاتف: {resolvedShopInfo.phone}
                </div>

                {/* Date and Time */}
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-600 pt-1 border-t border-slate-200">
                  <span>التاريخ: {todayDateStr}</span>
                  <span>الوقت: {currentTimeStr}</span>
                </div>
              </div>
            ) : (
              /* A4 / A5 COMMERCIAL HEADER */
              <div className="border-b-2 border-slate-900 pb-5 mb-6 space-y-4">
                <div className="flex flex-row items-start justify-between gap-4">
                  {/* Shop Logo & Visual Identity */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col items-center justify-center shadow-xs border border-slate-700 shrink-0">
                      <Smartphone className="w-6 h-6 text-emerald-400 mb-0.5" />
                      <span className="text-[8px] font-mono font-bold tracking-widest text-emerald-300">DZPAY</span>
                    </div>

                    <div>
                      <h1 className="text-xl font-black text-slate-950 tracking-tight">
                        {resolvedShopInfo.name}
                      </h1>
                      <p className="text-xs text-slate-600 font-medium max-w-md mt-0.5">
                        {resolvedShopInfo.slogan}
                      </p>

                      {/* Explicit Required Branch Info: (رفيق كيحل - الفرع الرئيسي - قسنطينة) */}
                      <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 font-black text-xs">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>الفرع: {resolvedShopInfo.branch}</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Meta Box & Today's Date */}
                  <div className="text-left bg-slate-50 p-3 rounded-xl border border-slate-300 min-w-[200px] shrink-0">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {activeDocumentTitle}
                    </div>
                    <div className="text-sm font-mono font-black text-slate-950 mt-0.5 dir-ltr">
                      {activeDocNumber}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200 space-y-1 text-xs">
                      {/* Today's Date */}
                      <div className="flex items-center justify-between gap-2 text-slate-700">
                        <span className="text-slate-500 text-[11px]">تاريخ اليوم:</span>
                        <span className="font-mono font-bold text-slate-900">{todayDateStr}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-slate-600 text-[10px]">
                        <span>توقيت الإصدار:</span>
                        <span className="font-mono font-medium">{currentTimeStr}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Legal, Address & Contact Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200 text-[10px] text-slate-600 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[9px] font-sans">العنوان:</span>
                    <span className="font-sans font-bold text-slate-800">{resolvedShopInfo.address}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-sans">هواتف الاتصال:</span>
                    <span className="text-slate-800 font-bold">{resolvedShopInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-sans">سجل تجاري (RC):</span>
                    <span className="text-slate-800 font-bold">{resolvedShopInfo.rcNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] font-sans">الرقم الجبائي (NIF):</span>
                    <span className="text-slate-800 font-bold">{resolvedShopInfo.nifNumber}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* 2. CUSTOMER & RECIPIENT INFORMATION (IF PROVIDED)                         */}
            {/* ========================================================================= */}
            {customerInfo && (
              <div
                className={`mb-4 p-3 rounded-xl border border-slate-300 bg-slate-50/70 text-xs ${
                  isThermal ? 'text-[10px] p-2 space-y-1' : 'grid grid-cols-2 sm:grid-cols-3 gap-2'
                }`}
              >
                <div>
                  <span className="text-slate-500 block text-[10px]">الزبون / المستلم:</span>
                  <span className="font-bold text-slate-900 text-xs">{customerInfo.name}</span>
                </div>
                {customerInfo.phone && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">رقم الهاتف:</span>
                    <span className="font-mono font-bold text-slate-800">{customerInfo.phone}</span>
                  </div>
                )}
                {customerInfo.address && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">العنوان / الولاية:</span>
                    <span className="text-slate-800">{customerInfo.address} {customerInfo.wilaya ? `(${customerInfo.wilaya})` : ''}</span>
                  </div>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. DYNAMIC CONTENT IN CONTAINER                                          */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              {/* Specialized Report Presentation */}
              {reportData && (
                <div className="space-y-4">
                  {reportData.period && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                      <span className="font-bold text-emerald-950">فترة التقرير المالي والإحصائي:</span>
                      <span className="font-mono font-bold text-emerald-900">{reportData.period}</span>
                    </div>
                  )}

                  {reportData.summaryMetrics && reportData.summaryMetrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {reportData.summaryMetrics.map((m, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-300">
                          <span className="text-[10px] text-slate-500 font-bold block">{m.label}</span>
                          <span className="text-sm font-black text-slate-900 block mt-1 font-mono">
                            {typeof m.value === 'number' ? `${m.value.toLocaleString('fr-DZ')} د.ج` : m.value}
                          </span>
                          {m.subValue && (
                            <span className="text-[9px] text-slate-500 block mt-0.5">{m.subValue}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {reportData.sections && reportData.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="border border-slate-300 rounded-xl overflow-hidden">
                      <div className="bg-slate-100 px-3 py-2 border-b border-slate-300 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{sec.title}</span>
                        {sec.subtitle && <span className="text-[10px] text-slate-500">{sec.subtitle}</span>}
                      </div>
                      <table className="w-full text-right text-xs">
                        {sec.columns && (
                          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-700">
                            <tr>
                              <th className="py-2 px-3">البيان</th>
                              {sec.columns.map((c, cIdx) => (
                                <th key={cIdx} className="py-2 px-3 text-left">{c}</th>
                              ))}
                            </tr>
                          </thead>
                        )}
                        <tbody className="divide-y divide-slate-200">
                          {sec.rows.map((r, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-medium text-slate-900">{r.label}</td>
                              {r.values.map((v, vIdx) => (
                                <td key={vIdx} className="py-2 px-3 text-left font-mono font-bold text-slate-800">
                                  {typeof v === 'number' ? `${v.toLocaleString('fr-DZ')} د.ج` : v}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {children ? (
                /* Custom Dynamic Children */
                <div>{children}</div>
              ) : items && items.length > 0 ? (
                /* Standard Items Table */
                <div className="border border-slate-300 rounded-xl overflow-hidden">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                      <tr>
                        <th className="py-2.5 px-3 w-8 text-center">#</th>
                        <th className="py-2.5 px-3">البيان / المنتوج</th>
                        <th className="py-2.5 px-2 text-center w-14">الكمية</th>
                        <th className="py-2.5 px-3 text-left w-24">سعر الوحدة</th>
                        <th className="py-2.5 px-3 text-left w-28">المجموع (د.ج)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {items.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500 text-[11px]">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            <div>{item.name}</div>
                            {item.imei && (
                              <div className="text-[10px] font-mono text-slate-500">
                                IMEI: {item.imei}
                              </div>
                            )}
                            {item.warrantyPeriod && (
                              <div className="text-[10px] text-emerald-700">
                                ضمان: {item.warrantyPeriod}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono font-bold">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-left font-mono text-slate-700">
                            {item.unitPrice.toLocaleString('fr-DZ')}
                          </td>
                          <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-950">
                            {item.totalPrice.toLocaleString('fr-DZ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {/* ========================================================================= */}
              {/* 4. TOTALS SUMMARY BOX (IF PROVIDED)                                       */}
              {/* ========================================================================= */}
              {totals && (
                <div
                  className={`mt-4 pt-3 border-t border-slate-300 ${
                    isThermal
                      ? 'space-y-1.5 text-xs'
                      : 'flex flex-col sm:flex-row items-start justify-between gap-4'
                  }`}
                >
                  {/* Left Notes / In Words for A4 */}
                  {!isThermal && (
                    <div className="flex-1 space-y-2 text-xs text-slate-600">
                      {showAmountInWords && totals.grandTotal > 0 && (
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">المبلغ الإجمالي بالحروف:</span>
                          <span className="font-bold text-slate-900 text-xs">
                            فقط {totals.grandTotal.toLocaleString('fr-DZ')} دينار جزائري لا غير.
                          </span>
                        </div>
                      )}
                      {notes && (
                        <div className="text-[11px] text-slate-500">
                          <span className="font-bold text-slate-700">ملاحظة:</span> {notes}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Right Totals Breakdown */}
                  <div
                    className={`${
                      isThermal ? 'w-full' : 'w-full sm:w-72'
                    } bg-slate-50 p-3 rounded-xl border border-slate-300 space-y-1.5 text-xs`}
                  >
                    <div className="flex justify-between text-slate-600">
                      <span>المجموع الفرعي:</span>
                      <span className="font-mono font-bold">{totals.subtotal.toLocaleString('fr-DZ')} د.ج</span>
                    </div>
                    {totals.discount && totals.discount > 0 ? (
                      <div className="flex justify-between text-emerald-700">
                        <span>الخصم الممنوح:</span>
                        <span className="font-mono font-bold">-{totals.discount.toLocaleString('fr-DZ')} د.ج</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between items-center pt-2 border-t-2 border-slate-900 font-black text-sm text-slate-950">
                      <span>المبلغ الصافي للدفع:</span>
                      <span className="font-mono text-emerald-800">{totals.grandTotal.toLocaleString('fr-DZ')} د.ج</span>
                    </div>
                    {totals.paidAmount !== undefined && (
                      <div className="flex justify-between text-slate-700 text-xs pt-1 border-t border-slate-200">
                        <span>المدفوع:</span>
                        <span className="font-mono font-bold">{totals.paidAmount.toLocaleString('fr-DZ')} د.ج</span>
                      </div>
                    )}
                    {totals.remainingAmount !== undefined && totals.remainingAmount > 0 ? (
                      <div className="flex justify-between text-rose-700 font-bold text-xs">
                        <span>المتبقي (دين مؤجل):</span>
                        <span className="font-mono">{totals.remainingAmount.toLocaleString('fr-DZ')} د.ج</span>
                      </div>
                    ) : null}
                    {totals.paymentMethod && (
                      <div className="text-[10px] text-slate-500 pt-1 text-center font-medium">
                        طريقة السداد: {totals.paymentMethod}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 5. FOOTER, STAMP BOX & OFFICIAL SIGNATURES                                */}
              {/* ========================================================================= */}
              {!isThermal && (showSignatures || showStampBox) && (
                <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-3 gap-4 text-center text-xs page-break-avoid">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">توقيع واستلام الزبون</span>
                    <span className="text-[10px] text-slate-400 block mb-12">(قرئ وصودق عليه)</span>
                    <div className="border-b border-dashed border-slate-300 w-32 mx-auto"></div>
                  </div>

                  {showStampBox && (
                    <div>
                      <span className="font-bold text-slate-800 block mb-1">خاتم المحل التجاري</span>
                      <div className="w-28 h-20 mx-auto rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                        مربع الخاتم الرسمي
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="font-bold text-slate-800 block mb-1">إدارة المحل والمبيعات</span>
                    <span className="text-[10px] text-slate-600 font-bold block mb-12">
                      {resolvedShopInfo.managerName}
                    </span>
                    <div className="border-b border-dashed border-slate-300 w-32 mx-auto"></div>
                  </div>
                </div>
              )}

              {/* Thermal Receipt Footer Notes */}
              {isThermal && (
                <div className="pt-3 mt-3 border-t border-dashed border-slate-400 text-center space-y-1 text-[10px] text-slate-600">
                  <div className="font-bold text-slate-900">شكراً لزيارتكم وثقتكم بنا!</div>
                  <div className="text-[9px]">السلع الإلكترونية مضمونة حسب الشروط المبينة في الوصل.</div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1">DZPAY SHOP • {resolvedShopInfo.branch}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintLayout;
