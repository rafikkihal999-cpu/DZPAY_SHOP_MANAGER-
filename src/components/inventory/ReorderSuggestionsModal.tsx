import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ShoppingCart,
  TrendingDown,
  AlertTriangle,
  Package,
  Plus,
  CheckCircle2,
  Printer,
  ArrowDownRight,
  Truck,
} from 'lucide-react';
import { InventoryProduct, ReorderSuggestionItem } from '../../types/inventory';
import { formatDA, getReorderSuggestions } from '../../services/inventoryService';

interface ReorderSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: InventoryProduct[];
  onOrderProduct?: (item: ReorderSuggestionItem) => void;
}

export const ReorderSuggestionsModal: React.FC<ReorderSuggestionsModalProps> = ({
  isOpen,
  onClose,
  products,
  onOrderProduct,
}) => {
  if (!isOpen) return null;

  const suggestions = getReorderSuggestions(products);

  const totalSuggestedItems = suggestions.reduce((sum, s) => sum + s.suggestedQuantity, 0);
  const totalExpectedCost = suggestions.reduce((sum, s) => sum + s.expectedPurchaseCost, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-amber-50/70 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-900 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">نظام تحليل واقتراح إعادة الشراء</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900">
                  ذكاء المخزون
                </span>
              </div>
              <p className="text-xs text-slate-500">
                تحليل تلقائي لمستويات المخزون الحالية مقارنة بحدود إعادة الطلب وحساب التكلفة الرأسمالية المطلوبة للتوريد.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة طلب التوريد</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-xs text-amber-800 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>أصناف تحتاج إعادة شراء</span>
              </div>
              <div className="text-xl font-black text-amber-950 mt-1.5">
                {suggestions.length} <span className="text-xs font-medium">أصناف تحت حد الطلب</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-xs text-blue-800 font-bold flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4 text-blue-700" />
                <span>إجمالي الكميات المقترحة</span>
              </div>
              <div className="text-xl font-black text-blue-950 mt-1.5">
                {totalSuggestedItems} <span className="text-xs font-medium">وحدة مطلوبة</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>المبلغ الرأسمالي المطلوب للتوريد</span>
              </div>
              <div className="text-xl font-black text-emerald-950 mt-1.5">
                {formatDA(totalExpectedCost)}
              </div>
            </div>
          </div>

          {/* Example Highlight Box as requested in instructions */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-700" />
              <span>قاعدة حساب كميات وتكلفة إعادة الشراء:</span>
            </div>
            <p className="text-slate-600">
              عند وصول مخزون المنتج لحد إعادة الطلب أو أقل منه، يقترح النظام تلقائياً كمية توريد اقتصادية تكفي دورة المبيعات القادمة مع حساب تكلفة الشراء الإجمالية بناءً على سعر الشراء المسجل للمنتج.
            </p>
          </div>

          {/* Suggestions Table */}
          {suggestions.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl p-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">المخزون مكتمل وبحالة ممتازة!</h3>
              <p className="text-xs text-slate-500 mt-1">
                جميع المنتجات المتوفرة تتجاوز حدود إعادة الطلب المحددة، ولا توجد نواقص تتطلب توريداً عاجلاً حالياً.
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-3 px-4">المنتج / الصنف</th>
                      <th className="py-3 px-3 text-center">المخزون الحالي</th>
                      <th className="py-3 px-3 text-center">حد إعادة الطلب</th>
                      <th className="py-3 px-3 text-center font-bold text-emerald-800">الكمية المقترحة</th>
                      <th className="py-3 px-4">سعر الشراء</th>
                      <th className="py-3 px-4 font-bold text-slate-900">تكلفة الشراء المتوقعة</th>
                      <th className="py-3 px-3 text-center print:hidden">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {suggestions.map((item) => {
                      const isZero = item.currentStock === 0;
                      const isA17 = item.productId === 'prod-samsung-a17';

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isA17 ? 'bg-amber-50/50' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{item.productName}</span>
                              {isA17 && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-200 text-amber-900">
                                  مثال النظام
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {item.brand} • {item.category}
                            </div>
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-bold">
                            <span
                              className={`px-2 py-0.5 rounded text-xs ${
                                isZero
                                  ? 'bg-rose-100 text-rose-800 font-black'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {item.currentStock} {isZero ? '(نفد)' : ''}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-600">
                            {item.reorderThreshold}
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-black text-emerald-800 bg-emerald-50/50">
                            +{item.suggestedQuantity}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-700">
                            {item.purchasePrice.toLocaleString('fr-DZ')} DA
                          </td>

                          <td className="py-3 px-4 font-mono font-black text-emerald-900">
                            {formatDA(item.expectedPurchaseCost)}
                          </td>

                          <td className="py-3 px-3 text-center print:hidden">
                            <button
                              onClick={() => {
                                if (onOrderProduct) onOrderProduct(item);
                                else {
                                  alert(
                                    `تم تجهيز طلب شراء ${item.suggestedQuantity} قطعة من ${item.productName} بتكلفة متوقعة: ${formatDA(
                                      item.expectedPurchaseCost
                                    )}.`
                                  );
                                }
                              }}
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                            >
                              طلب توريد
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-100/90 font-bold border-t-2 border-slate-300 text-slate-900">
                    <tr>
                      <td className="py-3 px-4">المجموع الكلي</td>
                      <td colSpan={2} className="py-3 px-3 text-slate-500 text-[11px] text-center">
                        {suggestions.length} صنف يحتاج توريداً
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-emerald-900">
                        +{totalSuggestedItems} وحدة
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">—</td>
                      <td className="py-3 px-4 font-mono text-emerald-900 font-black">
                        {formatDA(totalExpectedCost)}
                      </td>
                      <td className="print:hidden"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between print:hidden shrink-0">
          <div className="text-xs text-slate-500">
            يمكنك طباعة قائمة المقترحات لتسليمها للموردين أو استخدامها عند الذهاب لأسواق الجملة (بلفور، العلمة).
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
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة أمر الشراء المقترح</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
