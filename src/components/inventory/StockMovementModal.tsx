import React, { useState } from 'react';
import {
  X,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  SlidersHorizontal,
  AlertTriangle,
  History,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { InventoryProduct, StockMovementType } from '../../types/inventory';
import { formatDA } from '../../services/inventoryService';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: InventoryProduct[];
  onSubmitMovement: (movement: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    employeeName: string;
    note?: string;
    unitCostPrice?: number;
    unitSellingPrice?: number;
  }) => void;
  preselectedProductId?: string;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
  isOpen,
  onClose,
  products,
  onSubmitMovement,
  preselectedProductId,
}) => {
  if (!isOpen) return null;

  const [selectedProductId, setSelectedProductId] = useState<string>(
    preselectedProductId || (products.length > 0 ? products[0].id : '')
  );
  const [movementType, setMovementType] = useState<StockMovementType>('sale');
  const [quantity, setQuantity] = useState<string>('1');
  const [employeeName, setEmployeeName] = useState<string>('يوسف بن عيسى (كاشير)');
  const [note, setNote] = useState<string>('');
  const [customCostPrice, setCustomCostPrice] = useState<string>('');
  const [customSellingPrice, setCustomSellingPrice] = useState<string>('');

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const currentStock = selectedProduct ? selectedProduct.stock : 0;
  const numQty = Math.max(1, parseInt(quantity, 10) || 1);

  // حساب الكمية بعد العملية
  let calculatedNewStock = currentStock;
  if (movementType === 'purchase' || movementType === 'return') {
    calculatedNewStock = currentStock + numQty;
  } else if (movementType === 'sale' || movementType === 'damage_loss') {
    calculatedNewStock = Math.max(0, currentStock - numQty);
  } else if (movementType === 'manual_adjust') {
    calculatedNewStock = Math.max(0, numQty);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    onSubmitMovement({
      productId: selectedProductId,
      type: movementType,
      quantity: numQty,
      employeeName: employeeName.trim() || 'مدير النظام',
      note: note.trim(),
      unitCostPrice: customCostPrice ? Number(customCostPrice) : selectedProduct?.purchasePrice,
      unitSellingPrice: customSellingPrice ? Number(customSellingPrice) : selectedProduct?.sellingPrice,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">تسجيل حركة مخزون جديدة</h2>
              <p className="text-xs text-slate-500">
                تسجيل حركة بيع، شراء، إرجاع، تسوية جرد أو تلف مع التحديث الفوري للأرصدة.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Movement Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              نوع حركة المخزون <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMovementType('sale')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  movementType === 'sale'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" />
                <span>بيع منتج (-)</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('purchase')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  movementType === 'purchase'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
                <span>شراء وتوريد (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('return')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  movementType === 'return'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                <span>إرجاع بضاعة (+)</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('manual_adjust')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  movementType === 'manual_adjust'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                <span>تعديل يدوي (جرد)</span>
              </button>

              <button
                type="button"
                onClick={() => setMovementType('damage_loss')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                  movementType === 'damage_loss'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>تلف أو ضياع (-)</span>
              </button>
            </div>
          </div>

          {/* Product Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اختر المنتج <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-hidden focus:border-emerald-600"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (المتوفر: {p.stock} | سعر الشراء: {formatDA(p.purchasePrice)} | البيع: {formatDA(p.sellingPrice)})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Stock Impact Visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {movementType === 'manual_adjust' ? 'الكمية الفعلية بعد الجرد' : 'الكمية المستهدفة'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold focus:outline-hidden focus:border-emerald-600"
                placeholder="1"
                required
              />
            </div>

            {/* Impact Calculation Preview */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <div className="text-[11px] text-slate-500">حساب تأثير الحركة على الرصيد:</div>
              <div className="flex items-center justify-between font-mono font-bold">
                <span className="text-slate-600">قبل: {currentStock}</span>
                <span className="text-emerald-700">→</span>
                <span className="text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  بعد: {calculatedNewStock}
                </span>
              </div>
            </div>
          </div>

          {/* Employee Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الموظف المسؤول عن العملية
            </label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
              placeholder="اسم الموظف أو الكاشير"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظة اختيارية (رقم فاتورة، سبب التعديل، إلخ)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
              placeholder="مثال: بيع نقدي، تلف زجاج أثناء العرض، فاتورة توريد #409..."
            />
          </div>

          {/* Educational Note on COGS and Restocking */}
          {movementType === 'sale' && selectedProduct && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>الأثر المالي لحركة البيع:</span>
              </div>
              <p className="text-emerald-800 text-[11px]">
                سيتم قيد <strong className="font-mono">{formatDA(selectedProduct.purchasePrice * numQty)}</strong> كتكلفة بضاعة مباعة (COGS) وتخصيصها في <strong className="underline">مبلغ إعادة تكوين المخزون</strong>، بينما يسجل الربح الإجمالي بقيمة <strong className="font-mono">{formatDA((selectedProduct.sellingPrice - selectedProduct.purchasePrice) * numQty)}</strong> فقط.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تسجيل الحركة وتحديث المخزون</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
