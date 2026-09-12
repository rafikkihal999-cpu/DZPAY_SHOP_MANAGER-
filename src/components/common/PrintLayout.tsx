import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export type PrintPaperSize = 'a4' | 'a5' | '80mm' | '58mm';
export type PrintDocumentType =
  | 'invoice'
  | 'receipt'
  | 'report'
  | 'warranty'
  | 'order'
  | 'quote'
  | 'custom';

export interface PrintShopInfo {
  name?: string;
  slogan?: string;
  branch?: string;
  address?: string;
  phone?: string;
  email?: string;
  rcNumber?: string;
  nifNumber?: string;
  nisNumber?: string;
  aiNumber?: string;
  baridiMobRip?: string;
  ccpNumber?: string;
}

export interface PrintCustomerInfo {
  name?: string;
  phone?: string;
  address?: string;
  nif?: string;
  customerType?: 'walkin' | 'registered' | 'wholesale';
}

export interface PrintInvoiceItem {
  id?: string;
  name: string;
  category?: string;
  imei?: string;
  serialNumber?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  warrantyPeriod?: string;
}

export interface PrintInvoiceTotals {
  subtotal: number;
  discount?: number;
  taxRate?: number;
  taxAmount?: number;
  grandTotal: number;
  paidAmount?: number;
  remainingAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface PrintLayoutProps {
  /** Mode: 'modal' displays an overlay preview with controls; 'embedded' renders directly in the page */
  mode?: 'modal' | 'embedded';
  isOpen?: boolean;
  onClose?: () => void;

  /** Basic convenient props */
  title?: string;
  subtitle?: string;
  branch?: string;
  shopName?: string;
  date?: string;

  /** Document Classification */
  documentType?: PrintDocumentType;
  documentTitle?: string;
  documentSubtitle?: string;
  documentNumber?: string;
  documentDate?: string;
  operatorName?: string;

  /** Shop & Customer Identity */
  shopInfo?: PrintShopInfo;
  customerInfo?: PrintCustomerInfo;

  /** Paper formatting */
  defaultPaperSize?: PrintPaperSize;
  allowPaperSizeChange?: boolean;

  /** Optional Invoice structured data */
  items?: PrintInvoiceItem[];
  totals?: PrintInvoiceTotals;

  /** Dynamic Content (محتوى ديناميكي مخصص للفواتير والتقارير) */
  children?: React.ReactNode;

  /** Notes and commercial terms */
  notes?: string;
  termsAndConditions?: string[];
  showSignatures?: boolean;
  showStampBox?: boolean;
  showBarcode?: boolean;
  showAmountInWords?: boolean;

  /** Callbacks */
  onPrint?: () => void;
}

/**
 * Converts numbers to Arabic words for commercial documents (DZD / د.ج)
 */
function numberToArabicWordsDZD(num: number): string {
  if (!num || isNaN(num) || num <= 0) return 'صفر دينار جزائري';
  const integerPart = Math.floor(num);

  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];

  function convertGroup(n: number): string {
    let result = '';
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;

    if (h > 0) result += hundreds[h];

    if (t === 1 && o > 0) {
      if (result) result += ' و';
      result += teens[o];
      return result;
    }

    if (o > 0) {
      if (result) result += ' و';
      result += ones[o];
    }

    if (t > 0) {
      if (result) result += ' و';
      result += tens[t];
    }

    return result;
  }

  const billions = Math.floor(integerPart / 1_000_000_000);
  const millions = Math.floor((integerPart % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((integerPart % 1_000_000) / 1_000);
  const remainder = integerPart % 1_000;

  const parts: string[] = [];

  if (billions > 0) {
    if (billions === 1) parts.push('مليار');
    else if (billions === 2) parts.push('ملياران');
    else parts.push(`${convertGroup(billions)} مليار`);
  }

  if (millions > 0) {
    if (millions === 1) parts.push('مليون');
    else if (millions === 2) parts.push('مليونان');
    else parts.push(`${convertGroup(millions)} مليون`);
  }

  if (thousands > 0) {
    if (thousands === 1) parts.push('ألف');
    else if (thousands === 2) parts.push('ألفان');
    else parts.push(`${convertGroup(thousands)} ألف`);
  }

  if (remainder > 0) {
    parts.push(convertGroup(remainder));
  }

  return parts.join(' و ') + ' دينار جزائري لا غير';
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({
  mode = 'modal',
  isOpen = true,
  onClose,
  title,
  subtitle,
  branch,
  shopName,
  date,
  documentType = 'invoice',
  documentTitle,
  documentSubtitle,
  documentNumber,
  documentDate,
  operatorName,
  shopInfo: customShopInfo,
  customerInfo,
  defaultPaperSize = 'a4',
  allowPaperSizeChange = true,
  items,
  totals,
  children,
  notes,
  termsAndConditions,
  showSignatures = true,
  showStampBox = true,
  showBarcode = true,
  showAmountInWords = true,
  onPrint,
}) => {
  const { activeBranch } = useAuth();
  const [paperSize, setPaperSize] = useState<PrintPaperSize>(defaultPaperSize);
  const [isPrinting, setIsPrinting] = useState(false);

  // Sync paper size when default changes
  useEffect(() => {
    setPaperSize(defaultPaperSize);
  }, [defaultPaperSize]);

  // Today's date default
  const todayFormattedDate =
    date ||
    documentDate ||
    new Date().toLocaleDateString('fr-DZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

  const todayArabicFullDate = new Date().toLocaleDateString('ar-DZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const displayTime = new Date().toLocaleTimeString('fr-DZ', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Target branch info specifically setting Constantine as main branch
  const targetBranch =
    branch ||
    customShopInfo?.branch ||
    activeBranch ||
    'رفيق كيحل - الفرع الرئيسي - قسنطينة';

  // Default Shop Identity
  const resolvedShopInfo: PrintShopInfo = {
    name: shopName || customShopInfo?.name || 'DZPAY SHOP',
    slogan:
      customShopInfo?.slogan ||
      'بيع وشراء وتصليح الهواتف النقالة، الإكسسوارات والخدمات الرقمية',
    branch: targetBranch,
    address:
      customShopInfo?.address ||
      'شارع 19 جوان 1965، وسط المدينة، قسنطينة',
    phone: customShopInfo?.phone || '0550 12 34 56 / 0770 98 76 54',
    email: customShopInfo?.email || 'contact@dzpay-shop.dz',
    rcNumber: customShopInfo?.rcNumber || '25/00-1234567A20',
    nifNumber: customShopInfo?.nifNumber || '002025001234567',
    nisNumber: customShopInfo?.nisNumber || '002512345678901',
    aiNumber: customShopInfo?.aiNumber || '25012345678',
    baridiMobRip: customShopInfo?.baridiMobRip || '00799999002233445566',
    ccpNumber: customShopInfo?.ccpNumber || '12345678 Clé 45',
  };

  // Document Title determination
  const getDocumentDefaultTitle = () => {
    switch (documentType) {
      case 'invoice':
        return 'فاتورة مبيعات تجارية (FACTURE DE VENTE)';
      case 'receipt':
        return 'وصل مبيعات واستلام (TICKET DE CAISSE)';
      case 'report':
        return 'تقرير محاسبي وإحصائي (RAPPORT FINANCIER)';
      case 'warranty':
        return 'شهادة ضمان جهاز (BON DE GARANTIE)';
      case 'order':
        return 'وصل طلبية ومشتريات (BON DE COMMANDE)';
      case 'quote':
        return 'عرض أسعار تقديري (DEVIS PROFORMA)';
      default:
        return 'وثيقة تجارية رسمية';
    }
  };

  const finalTitle = title || documentTitle || getDocumentDefaultTitle();
  const finalSubtitle = subtitle || documentSubtitle;
  const finalDocNumber =
    documentNumber ||
    `DZ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Default Algerian Commercial Terms
  const defaultTerms = [
    'الضمان لمدة 12 شهراً للأجهزة الجديدة مشروط باستظهار هذا الوصل مع سلامة الرقم التسلسلي IMEI.',
    'الإكسسوارات وقطع الغيار تستبدل خلال 48 ساعة بشرط سلامتها وفي غلافها الأصلي.',
    'المحل غير مسؤول عن الأجهزة المتروكة لأكثر من 30 يوماً من تاريخ الإيداع.',
    'أي تدخل أو صيانة للجهاز خارج ورشتنا يلغي الضمان نهائياً.',
  ];

  const finalTerms =
    termsAndConditions && termsAndConditions.length > 0
      ? termsAndConditions
      : defaultTerms;

  // Browser Print trigger handler
  const handleTriggerPrint = () => {
    setIsPrinting(true);
    if (onPrint) onPrint();
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 150);
  };

  if (mode === 'modal' && !isOpen) {
    return null;
  }

  const isThermal = paperSize === '80mm' || paperSize === '58mm';

  // Sizing styles for preview
  const getPaperContainerStyle = () => {
    switch (paperSize) {
      case '58mm':
        return 'w-[58mm] max-w-[58mm] p-2 text-[10px] leading-tight';
      case '80mm':
        return 'w-[80mm] max-w-[80mm] p-3 text-[11px] leading-tight';
      case 'a5':
        return 'w-[148mm] min-h-[210mm] p-6 text-xs';
      case 'a4':
      default:
        return 'w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-10 text-xs';
    }
  };

  return (
    <>
      {/* Embedded Print Media Stylesheet: guarantees hiding unnecessary UI elements on print */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              html, body {
                background: #ffffff !important;
                color: #000000 !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              /* Hide all normal UI elements in body */
              body * {
                visibility: hidden !important;
              }
              /* Expose print container and its descendants */
              #print-area,
              #print-area * {
                visibility: visible !important;
              }
              #print-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 8mm !important;
                background: #ffffff !important;
                color: #0f172a !important;
                box-shadow: none !important;
                border: none !important;
              }
              /* Strictly hide any interactive or navigation UI elements */
              .no-print,
              .no-print * {
                display: none !important;
                visibility: hidden !important;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page {
                margin: 8mm;
                size: auto;
              }
              .page-break-avoid {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
            }
          `,
        }}
      />

      {/* Main Wrapper: Modal overlay or Embedded layout */}
      <div
        className={
          mode === 'modal'
            ? 'fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-6'
            : 'w-full'
        }
        dir="rtl"
      >
        {/* On-Screen Control & Action Bar (Hidden during actual print) */}
        <div className="no-print w-full max-w-4xl bg-white border border-slate-200 shadow-lg rounded-2xl p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-3 sticky top-2 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                معاينة الطباعة وتنسيق المستند
              </h4>
              <p className="text-[11px] text-slate-500">
                الفرع: {resolvedShopInfo.branch} • التاريخ: {todayFormattedDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Paper Format Switcher */}
            {allowPaperSizeChange && (
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaperSize('a4')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    paperSize === 'a4'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  A4 رسمي
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('a5')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    paperSize === 'a5'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  A5 مدمج
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('80mm')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    paperSize === '80mm'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  وصل 80mm
                </button>
                <button
                  type="button"
                  onClick={() => setPaperSize('58mm')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    paperSize === '58mm'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  وصل 58mm
                </button>
              </div>
            )}

            {/* Print Trigger Button */}
            <button
              type="button"
              id="btn-confirm-print"
              onClick={handleTriggerPrint}
              disabled={isPrinting}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? 'جاري التحضير...' : 'طباعة الآن (Ctrl + P)'}</span>
            </button>

            {/* Modal Close Button */}
            {mode === 'modal' && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="إغلاق المعاينة"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINTABLE CONTAINER: MUST HAVE id='print-area'                            */}
        {/* Contains Shop Logo, Branch Info (قسنطينة), Today's Date, and Dynamic Body */}
        {/* ========================================================================= */}
        <div
          id="print-area"
          className={`bg-white text-slate-900 border border-slate-300 shadow-2xl mx-auto rounded-xs transition-all relative ${getPaperContainerStyle()} ${
            isThermal ? 'font-mono' : 'font-sans'
          }`}
          dir="rtl"
        >
          {/* ========================================================= */}
          {/* FORMAT 1: THERMAL RECEIPT (80mm / 58mm POS TICKET)        */}
          {/* ========================================================= */}
          {isThermal ? (
            <div className="space-y-3">
              {/* Thermal Shop Header */}
              <div className="text-center space-y-1 pb-2 border-b border-dashed border-slate-400">
                {/* Shop Vector Logo */}
                <div className="flex items-center justify-center gap-1 font-black text-sm text-slate-950">
                  <span className="text-base font-black text-emerald-800">★</span>
                  <span>{resolvedShopInfo.name}</span>
                  <span className="text-base font-black text-emerald-800">★</span>
                </div>
                <div className="text-[10px] text-slate-700 font-bold">
                  {resolvedShopInfo.slogan}
                </div>
                {/* Branch Info - Specifically mentions 'قسنطينة' */}
                <div className="text-[9px] text-slate-800 font-bold bg-slate-50 py-0.5 px-1 rounded-sm border border-slate-200 inline-block">
                  الفرع: {resolvedShopInfo.branch}
                </div>
                <div className="text-[9px] text-slate-600">
                  العنوان: {resolvedShopInfo.address}
                </div>
                <div className="text-[9px] text-slate-600">
                  الهاتف: {resolvedShopInfo.phone}
                </div>
                <div className="text-[8px] text-slate-500 font-mono">
                  RC: {resolvedShopInfo.rcNumber} • NIF: {resolvedShopInfo.nifNumber}
                </div>
              </div>

              {/* Thermal Metadata: Date, Time & Document Number */}
              <div className="text-[9px] space-y-0.5 border-b border-dashed border-slate-400 pb-2">
                <div className="flex justify-between">
                  <span className="font-bold">تاريخ اليوم:</span>
                  <span className="font-mono font-bold">{todayFormattedDate} {displayTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">رقم الوصل:</span>
                  <span className="font-mono font-bold">{finalDocNumber}</span>
                </div>
                {operatorName && (
                  <div className="flex justify-between">
                    <span>البائع / الكاشير:</span>
                    <span>{operatorName}</span>
                  </div>
                )}
                {customerInfo?.name && (
                  <div className="flex justify-between">
                    <span>الزبون:</span>
                    <span className="font-bold">{customerInfo.name}</span>
                  </div>
                )}
              </div>

              {/* Thermal Structured Items List (if provided) */}
              {items && items.length > 0 && (
                <div className="border-b border-dashed border-slate-400 pb-2 space-y-1.5 text-[10px]">
                  <div className="flex justify-between font-black border-b border-slate-300 pb-0.5 text-[9px]">
                    <span>البيان / السلعة</span>
                    <span>المبلغ</span>
                  </div>
                  {items.map((item, idx) => (
                    <div key={item.id || idx} className="space-y-0.5">
                      <div className="flex justify-between items-start">
                        <span className="font-bold max-w-[70%]">{item.name}</span>
                        <span className="font-mono font-bold">
                          {(item.totalPrice || item.quantity * item.unitPrice).toLocaleString(
                            'fr-DZ'
                          )}{' '}
                          د.ج
                        </span>
                      </div>
                      {item.imei && (
                        <div className="text-[8px] text-slate-600 font-mono">
                          IMEI: {item.imei}
                        </div>
                      )}
                      <div className="text-[8px] text-slate-500 font-mono">
                        {item.quantity} × {item.unitPrice.toLocaleString('fr-DZ')} د.ج
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* DYNAMIC CONTENT CONTAINER (المحتوى الديناميكي المرسل للمكون) */}
              {children && (
                <div className="border-b border-dashed border-slate-400 pb-2 text-[10px]">
                  {children}
                </div>
              )}

              {/* Thermal Totals */}
              {totals && (
                <div className="space-y-1 text-[10px] border-b border-dashed border-slate-400 pb-2">
                  <div className="flex justify-between text-slate-700">
                    <span>المجموع الفرعي:</span>
                    <span className="font-mono">{totals.subtotal.toLocaleString('fr-DZ')} د.ج</span>
                  </div>
                  {totals.discount && totals.discount > 0 ? (
                    <div className="flex justify-between text-slate-900 font-bold">
                      <span>الخصم:</span>
                      <span className="font-mono">
                        -{totals.discount.toLocaleString('fr-DZ')} د.ج
                      </span>
                    </div>
                  ) : null}
                  <div className="flex justify-between font-black text-xs pt-1 border-t border-slate-300">
                    <span>المبلغ الصافي:</span>
                    <span className="font-mono text-sm">
                      {totals.grandTotal.toLocaleString('fr-DZ')} د.ج
                    </span>
                  </div>
                  {totals.paymentMethod && (
                    <div className="flex justify-between text-[9px] text-slate-600 pt-0.5">
                      <span>طريقة الدفع:</span>
                      <span className="font-bold">{totals.paymentMethod}</span>
                    </div>
                  )}
                  {totals.paidAmount !== undefined && (
                    <div className="flex justify-between text-[9px] text-slate-600">
                      <span>المدفوع:</span>
                      <span className="font-mono">
                        {totals.paidAmount.toLocaleString('fr-DZ')} د.ج
                      </span>
                    </div>
                  )}
                  {totals.remainingAmount !== undefined && totals.remainingAmount > 0 && (
                    <div className="flex justify-between text-[9px] font-bold text-slate-900">
                      <span>المتبقي:</span>
                      <span className="font-mono">
                        {totals.remainingAmount.toLocaleString('fr-DZ')} د.ج
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Thermal Footer */}
              <div className="text-center text-[8px] text-slate-600 space-y-1 pt-1 leading-relaxed">
                <p className="font-bold text-slate-900">
                  ★ يرجى الاحتفاظ بهذا الوصل للاستفادة من الضمان ★
                </p>
                <div className="font-mono text-[9px] font-bold text-slate-800 pt-1">
                  *** {resolvedShopInfo.name} • {resolvedShopInfo.branch} ***
                </div>
                {showBarcode && (
                  <div className="pt-2 flex flex-col items-center justify-center">
                    <div className="font-mono tracking-widest text-[8px] border-t border-b border-slate-400 py-0.5 px-3">
                      *{finalDocNumber}*
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* FORMAT 2: COMMERCIAL A4 / A5 STANDARD LAYOUT              */
            /* ========================================================= */
            <div className="space-y-6">
              {/* Commercial Header: Logo, Branch Info (قسنطينة), Today's Date, Legal Records */}
              <div className="flex flex-row items-start justify-between border-b-2 border-slate-900 pb-5 gap-4">
                {/* Shop Identity & Logo */}
                <div className="flex items-start gap-4">
                  {/* Shop Logo Vector Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 text-white flex flex-col items-center justify-center shrink-0 border border-slate-800 p-1 shadow-xs">
                    <span className="text-[11px] font-black tracking-wider text-emerald-400">
                      DZPAY
                    </span>
                    <span className="text-[8px] font-mono text-slate-300">SHOP</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                        {resolvedShopInfo.name}
                      </h1>
                      {/* Branch Info Badge (قسنطينة) */}
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900">
                        الفرع: {resolvedShopInfo.branch}
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-slate-700">
                      {resolvedShopInfo.slogan}
                    </p>

                    <div className="text-[10px] text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span>العنوان: {resolvedShopInfo.address}</span>
                      <span>•</span>
                      <span>الهاتف: {resolvedShopInfo.phone}</span>
                      {resolvedShopInfo.email && (
                        <>
                          <span>•</span>
                          <span>البريد: {resolvedShopInfo.email}</span>
                        </>
                      )}
                    </div>

                    {/* Prominent Today's Date Badge */}
                    <div className="text-[10px] text-slate-800 font-bold flex items-center gap-1.5 pt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>تاريخ اليوم:</span>
                      <span className="font-mono text-slate-950 font-black">{todayFormattedDate}</span>
                      <span className="text-slate-500 font-normal">({todayArabicFullDate})</span>
                    </div>
                  </div>
                </div>

                {/* Official Algerian Tax & Commercial Records Badge */}
                <div className="text-left font-mono text-[9px] text-slate-600 border border-slate-300 bg-slate-50/80 p-2.5 rounded-xl space-y-0.5 shrink-0 min-w-[170px]">
                  <div className="font-bold text-slate-900 text-[10px] border-b border-slate-200 pb-1 mb-1 text-center font-sans">
                    البيانات الجبائية والقانونية
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">RC : </span>
                    {resolvedShopInfo.rcNumber}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">NIF : </span>
                    {resolvedShopInfo.nifNumber}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">NIS : </span>
                    {resolvedShopInfo.nisNumber}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">AI : </span>
                    {resolvedShopInfo.aiNumber}
                  </div>
                  {resolvedShopInfo.baridiMobRip && (
                    <div className="text-[8px] text-emerald-800 font-bold border-t border-slate-200 pt-0.5 mt-0.5">
                      BaridiMob: {resolvedShopInfo.baridiMobRip}
                    </div>
                  )}
                </div>
              </div>

              {/* Document Banner & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
                {/* Document Type & Meta */}
                <div className="space-y-1.5">
                  <div className="inline-block px-3 py-1 rounded-md bg-slate-900 text-white font-black text-xs">
                    {finalTitle}
                  </div>
                  {finalSubtitle && (
                    <p className="text-[11px] text-slate-600 font-medium">{finalSubtitle}</p>
                  )}
                  <div className="text-[11px] text-slate-700 space-y-0.5 pt-1">
                    <div>
                      <span className="font-bold text-slate-900">رقم الوثيقة: </span>
                      <span className="font-mono font-bold text-slate-950">{finalDocNumber}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">تاريخ الإصدار: </span>
                      <span className="font-mono">{todayFormattedDate} {displayTime}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">الفرع المصدر: </span>
                      <span className="font-bold text-emerald-900">{resolvedShopInfo.branch}</span>
                    </div>
                    {operatorName && (
                      <div>
                        <span className="font-bold text-slate-900">المحرر / الكاشير: </span>
                        <span>{operatorName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Information (if available) */}
                <div className="border-t sm:border-t-0 sm:border-r border-slate-200 sm:pr-4 pt-2 sm:pt-0 space-y-1 text-[11px]">
                  <div className="font-black text-slate-900 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    <span>بيانات العميل / المشتري:</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">الاسم / الهيئة: </span>
                    <span className="font-bold text-slate-950">
                      {customerInfo?.name || 'زبون عام (Client au comptoir)'}
                    </span>
                  </div>
                  {customerInfo?.phone && (
                    <div>
                      <span className="font-bold text-slate-700">الهاتف: </span>
                      <span className="font-mono">{customerInfo.phone}</span>
                    </div>
                  )}
                  {customerInfo?.address && (
                    <div>
                      <span className="font-bold text-slate-700">العنوان: </span>
                      <span>{customerInfo.address}</span>
                    </div>
                  )}
                  {customerInfo?.nif && (
                    <div>
                      <span className="font-bold text-slate-700">الرقم الجبائي NIF: </span>
                      <span className="font-mono">{customerInfo.nif}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Structured Items Table (if invoice / order) */}
              {items && items.length > 0 && (
                <div className="border border-slate-300 rounded-xl overflow-hidden page-break-avoid">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                      <tr>
                        <th className="py-2.5 px-3 w-10 text-center">#</th>
                        <th className="py-2.5 px-3">البيان وتعيين المادة / السلعة</th>
                        <th className="py-2.5 px-3 w-28">الرقم التسلسلي / IMEI</th>
                        <th className="py-2.5 px-3 w-16 text-center">الكمية</th>
                        <th className="py-2.5 px-3 w-28 text-left">سعر الوحدة (د.ج)</th>
                        <th className="py-2.5 px-3 w-32 text-left">الإجمالي (د.ج)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      {items.map((item, index) => {
                        const lineTotal =
                          item.totalPrice || item.quantity * item.unitPrice;
                        return (
                          <tr key={item.id || index} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                              {index + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-950">{item.name}</div>
                              {item.category && (
                                <span className="text-[10px] text-slate-500">
                                  {item.category}
                                </span>
                              )}
                              {item.warrantyPeriod && (
                                <span className="mr-2 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                                  ضمان {item.warrantyPeriod}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                              {item.imei || item.serialNumber || '—'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-left font-mono">
                              {item.unitPrice.toLocaleString('fr-DZ')}
                            </td>
                            <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-950">
                              {lineTotal.toLocaleString('fr-DZ')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DYNAMIC CONTENT CONTAINER (المحتوى الديناميكي المرسل للمكون) */}
              {children && (
                <div className="space-y-4 page-break-avoid w-full">
                  {children}
                </div>
              )}

              {/* Financial Totals & Words Summary */}
              {totals && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start page-break-avoid">
                  {/* Amount in words & payment details (7 cols) */}
                  <div className="sm:col-span-7 space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    {showAmountInWords && (
                      <div>
                        <span className="font-bold text-slate-800">
                          أوقفت هذه الفاتورة عند المبلغ الإجمالي قدره:
                        </span>
                        <div className="font-bold text-slate-950 mt-1 pr-2 border-r-2 border-emerald-600 bg-white p-2 rounded-lg text-[11px]">
                          {numberToArabicWordsDZD(totals.grandTotal)}
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-700 space-y-1 pt-1 border-t border-slate-200">
                      <div>
                        <span className="font-bold text-slate-900">طريقة الدفع: </span>
                        <span className="font-bold">
                          {totals.paymentMethod || 'نقداً (Espèces / Cash)'}
                        </span>
                      </div>
                      {totals.paymentReference && (
                        <div>
                          <span className="font-bold text-slate-900">رقم المرجع / الحوالة: </span>
                          <span className="font-mono">{totals.paymentReference}</span>
                        </div>
                      )}
                      {totals.paidAmount !== undefined && (
                        <div className="flex items-center gap-4 pt-1">
                          <span>
                            <strong className="text-slate-900">المبلغ المدفوع: </strong>
                            <span className="font-mono">
                              {totals.paidAmount.toLocaleString('fr-DZ')} د.ج
                            </span>
                          </span>
                          {totals.remainingAmount !== undefined &&
                            totals.remainingAmount > 0 && (
                              <span className="text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                                المتبقي: {totals.remainingAmount.toLocaleString('fr-DZ')} د.ج
                              </span>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Numeric Totals Summary Table (5 cols) */}
                  <div className="sm:col-span-5 border border-slate-300 rounded-xl overflow-hidden text-xs">
                    <div className="p-2.5 bg-slate-100 flex justify-between items-center border-b border-slate-200 text-slate-700">
                      <span>المجموع الفرعي:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {totals.subtotal.toLocaleString('fr-DZ')} د.ج
                      </span>
                    </div>

                    {totals.discount && totals.discount > 0 ? (
                      <div className="p-2.5 flex justify-between items-center border-b border-slate-200 text-rose-700 bg-rose-50/50">
                        <span>الخصم والتخفيض:</span>
                        <span className="font-mono font-bold">
                          -{totals.discount.toLocaleString('fr-DZ')} د.ج
                        </span>
                      </div>
                    ) : null}

                    {totals.taxAmount && totals.taxAmount > 0 ? (
                      <div className="p-2.5 flex justify-between items-center border-b border-slate-200 text-slate-700">
                        <span>الرسم على القيمة المضافة (TVA):</span>
                        <span className="font-mono font-bold">
                          {totals.taxAmount.toLocaleString('fr-DZ')} د.ج
                        </span>
                      </div>
                    ) : null}

                    <div className="p-3 bg-slate-950 text-white flex justify-between items-center font-black">
                      <span className="text-xs">المبلغ الصافي للدفع:</span>
                      <span className="font-mono text-base">
                        {totals.grandTotal.toLocaleString('fr-DZ')} د.ج
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Commercial Terms & Notes */}
              {finalTerms.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-600 space-y-1 page-break-avoid">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>شروط الضمان والبيع التجاري (Conditions Générales & Garantie):</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pr-1">
                    {finalTerms.map((term, i) => (
                      <li key={i}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}

              {notes && (
                <div className="p-2.5 bg-amber-50/70 border border-amber-200 text-amber-900 rounded-xl text-[10px] font-medium page-break-avoid">
                  <span className="font-bold">ملاحظة: </span>
                  <span>{notes}</span>
                </div>
              )}

              {/* Signatures & Stamp Box */}
              {(showSignatures || showStampBox) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 page-break-avoid text-center text-xs">
                  {showStampBox && (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 h-32 flex flex-col justify-between bg-slate-50/40">
                      <span className="font-bold text-slate-800 text-[11px]">
                        ختم وتوقيع المحل (Cachet & Signature)
                      </span>
                      <div className="text-[9px] text-slate-400 font-mono">
                        {resolvedShopInfo.name} • {resolvedShopInfo.branch}
                      </div>
                    </div>
                  )}

                  {showSignatures && (
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 h-32 flex flex-col justify-between bg-slate-50/40">
                      <span className="font-bold text-slate-800 text-[11px]">
                        توقيع واستلام العميل (Signature Client)
                      </span>
                      <div className="text-[9px] text-slate-400">
                        قرأت وقبلت شروط الضمان أعلاه
                      </div>
                    </div>
                  )}

                  {showBarcode && (
                    <div className="hidden sm:flex border border-slate-200 rounded-xl p-3 flex-col items-center justify-center space-y-1 bg-white">
                      <div className="text-[9px] font-bold text-slate-500">
                        رمز التحقق الإلكتروني
                      </div>
                      <div className="font-mono text-lg font-black tracking-widest text-slate-900">
                        ||| | |||| || | |||| |||
                      </div>
                      <div className="font-mono text-[9px] text-slate-600">
                        {finalDocNumber}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Official Footnote */}
              <div className="text-center text-[9px] text-slate-400 border-t border-slate-200 pt-3 font-mono">
                DZPAY SHOP MANAGER • {resolvedShopInfo.branch} • تم استخراج هذه الوثيقة إلكترونياً
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
