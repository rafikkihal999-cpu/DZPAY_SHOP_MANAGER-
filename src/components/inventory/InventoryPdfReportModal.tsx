import React from 'react';
import {
  Printer,
  X,
  FileText,
  Building2,
  Calendar,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Download,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { InventoryProduct, InventoryValuationSummary } from '../../types/inventory';
import { formatDA } from '../../services/inventoryService';

interface InventoryPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: InventoryProduct[];
  summary: InventoryValuationSummary;
  shopName?: string;
  branchName?: string;
}

export const InventoryPdfReportModal: React.FC<InventoryPdfReportModalProps> = ({
  isOpen,
  onClose,
  products,
  summary,
  shopName = 'DZPAY SHOP MANAGER',
  branchName = 'الفرع الرئيسي - الجزائر العاصمة',
}) => {
  if (!isOpen) return null;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('ar-DZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = currentDate.toLocaleTimeString('ar-DZ', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Action Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">تقرير تقييم المخزون المالي (معاينة الطباعة / PDF)</h2>
              <p className="text-xs text-slate-500">
                جاهز للتصدير كملف PDF رسمي أو الطباعة الورقية A4 متضمناً كشف COGS ومبالغ إعادة التكوين.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ بتنسيق PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 print:p-0 print:overflow-visible text-slate-900" id="printable-inventory-report">
          {/* Header Section */}
          <div className="border-b-2 border-emerald-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-700 text-white text-[11px] font-black tracking-wide">
                  DZPAY
                </span>
                <h1 className="text-xl font-black text-slate-900">{shopName}</h1>
              </div>
              <p className="text-xs font-medium text-slate-600 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{branchName}</span>
                <span>•</span>
                <span>نظام إدارة وتقييم المخزون والمبيعات</span>
              </p>
            </div>

            <div className="text-right sm:text-left text-xs text-slate-600 space-y-1 bg-slate-50 print:bg-transparent p-3 rounded-xl border border-slate-200 print:border-none">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 justify-end">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>تاريخ التقرير: {formattedDate}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                توقيت التصدير: {formattedTime}
              </div>
              <div className="text-[10px] text-emerald-800 font-bold">
                الرقم المرجعي: INV-REP-{Date.now().toString().slice(-6)}
              </div>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 text-center">
            <h2 className="text-sm font-bold text-emerald-950">
              تقرير الجرد الشامل وتقييم المخزون الرأسمالي وحساب COGS
            </h2>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              يعتمد هذا التقرير قاعدة الفصل المالي التام بين تكلفة البضائع المباعة والأرباح الصافية
            </p>
          </div>

          {/* KPI Summary Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-[11px] text-slate-500 font-medium">إجمالي المنتجات</div>
              <div className="text-base font-black text-slate-900 mt-1">{summary.totalProductsCount} صنف</div>
              <div className="text-[10px] text-slate-500 mt-0.5">إجمالي الكميات: {summary.totalQuantity} وحدة</div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-[11px] text-blue-800 font-medium">قيمة المخزون بسعر الشراء (التكلفة)</div>
              <div className="text-base font-black text-blue-950 mt-1">{formatDA(summary.totalPurchaseValue)}</div>
              <div className="text-[10px] text-blue-700 mt-0.5">رأس المال الفعلي المجمد في الرفوف</div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-[11px] text-emerald-800 font-medium">قيمة المخزون بسعر البيع (المتوقعة)</div>
              <div className="text-base font-black text-emerald-950 mt-1">{formatDA(summary.totalSellingValue)}</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">القيمة السوقية الإجمالية للمخزون</div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
              <div className="text-[11px] text-teal-800 font-medium">الربح المتوقع من المخزون الحالي</div>
              <div className="text-base font-black text-teal-950 mt-1">{formatDA(summary.expectedProfit)}</div>
              <div className="text-[10px] text-teal-700 mt-0.5">هامش ربح إجمالي: ~{summary.expectedProfitMargin}%</div>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <div className="text-[11px] text-indigo-800 font-medium">إجمالي المبيعات المحققة</div>
              <div className="text-base font-black text-indigo-950 mt-1">{formatDA(summary.totalSalesRevenue)}</div>
              <div className="text-[10px] text-indigo-700 mt-0.5">إجمالي السيولة الناتجة عن البيع</div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="text-[11px] text-amber-800 font-medium">تكلفة البضاعة المباعة (COGS)</div>
              <div className="text-base font-black text-amber-950 mt-1">{formatDA(summary.totalCogs)}</div>
              <div className="text-[10px] text-amber-700 mt-0.5">سعر شراء السلع التي تم بيعها</div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="text-[11px] text-rose-800 font-bold">مبلغ إعادة تكوين المخزون ⚠️</div>
              <div className="text-base font-black text-rose-950 mt-1">{formatDA(summary.restockingReserve)}</div>
              <div className="text-[10px] text-rose-700 font-medium mt-0.5">يجب عزله فوراً للموردين ولا يصرف</div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="text-[11px] text-purple-800 font-medium">الربح الإجمالي الفعلي</div>
              <div className="text-base font-black text-purple-950 mt-1">{formatDA(summary.totalGrossProfit)}</div>
              <div className="text-[10px] text-purple-700 mt-0.5">فارق المبيعات - تكلفة السلع المباعة</div>
            </div>
          </div>

          {/* Stock Health Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">مؤشرات سلامة المخزن:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                {products.filter((p) => p.status === 'متوفر').length} أصناف مكتملة
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold">
                {summary.lowStockCount} أصناف منخفضة (تحت حد الطلب)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 font-bold">
                {summary.outOfStockCount} أصناف نفدت بالكامل
              </span>
            </div>
            <div className="text-slate-500 text-[11px]">
              طريقة الحساب: التقييم بسعر التكلفة المرجح (FIFO/Weighted Cost)
            </div>
          </div>

          {/* Detailed Products Valuation Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">
                جدول تفصيلي: تقييم المنتجات، تكاليف الشراء، وهوامش الربح
              </h3>
              <span className="text-[11px] text-slate-500">العملة الرسمية: الدينار الجزائري (DA)</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">المنتج / الصنف</th>
                    <th className="py-2.5 px-3 text-center">الكمية</th>
                    <th className="py-2.5 px-3">سعر الشراء</th>
                    <th className="py-2.5 px-3">سعر البيع</th>
                    <th className="py-2.5 px-3 font-bold text-blue-900">قيمة الشراء</th>
                    <th className="py-2.5 px-3 font-bold text-emerald-900">قيمة البيع</th>
                    <th className="py-2.5 px-3 font-bold text-teal-900">الربح المتوقع</th>
                    <th className="py-2.5 px-3 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {products.map((p, idx) => {
                    const purchaseVal = p.stock * p.purchasePrice;
                    const sellingVal = p.stock * p.sellingPrice;
                    const profitVal = sellingVal - purchaseVal;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="py-2 px-3 font-medium">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            باركود: {p.barcode} • {p.brand}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              p.stock === 0
                                ? 'bg-rose-100 text-rose-800'
                                : p.stock <= p.minStockAlert
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono">{p.purchasePrice.toLocaleString('fr-DZ')} DA</td>
                        <td className="py-2 px-3 font-mono">{p.sellingPrice.toLocaleString('fr-DZ')} DA</td>
                        <td className="py-2 px-3 font-mono font-bold text-blue-900">
                          {purchaseVal.toLocaleString('fr-DZ')} DA
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-emerald-900">
                          {sellingVal.toLocaleString('fr-DZ')} DA
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-teal-900">
                          {profitVal.toLocaleString('fr-DZ')} DA
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              p.status === 'متوفر'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'منخفض'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900">
                  <tr>
                    <td colSpan={2} className="py-3 px-3">المجموع الكلي ({products.length} صنف)</td>
                    <td className="py-3 px-3 text-center font-mono">{summary.totalQuantity}</td>
                    <td colSpan={2} className="py-3 px-3 text-slate-500 text-[11px]">—</td>
                    <td className="py-3 px-3 font-mono text-blue-900">{formatDA(summary.totalPurchaseValue)}</td>
                    <td className="py-3 px-3 font-mono text-emerald-900">{formatDA(summary.totalSellingValue)}</td>
                    <td className="py-3 px-3 font-mono text-teal-900">{formatDA(summary.expectedProfit)}</td>
                    <td className="py-3 px-3 text-center text-emerald-700">~{summary.expectedProfitMargin}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Signatures & Approval Section */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <div className="font-bold text-slate-900">المسؤول عن إعداد الجرد والتقييم:</div>
              <div className="mt-8 border-b border-slate-300 w-48"></div>
              <div className="text-[11px] text-slate-500 mt-1">الاسم والصفة: مسؤول المخزون والمشتريات</div>
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">مصادقة إدارة المحل والختم:</div>
              <div className="mt-8 border-b border-slate-300 w-48 ml-auto"></div>
              <div className="text-[11px] text-slate-500 mt-1">تاريخ الاعتماد: {formattedDate}</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden in print) */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>التقرير متطابق حسابياً وجاهز للطباعة المباشرة بصيغة A4 أو التصدير كملف PDF.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              إغلاق
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
