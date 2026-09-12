import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  History,
  ClipboardList,
  Search,
  Filter,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
  Printer,
  FileText,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { StatCard } from '../common/StatCard';
import {
  getStoredInventoryProducts,
  saveStoredInventoryProducts,
  getStoredInventoryMovements,
  saveStoredInventoryMovements,
  calculateInventoryValuation,
  executeStockMovement,
  formatDA,
  resetInventoryToDefaults,
} from '../../services/inventoryService';
import { InventoryProduct, InventoryMovement, StockMovementType } from '../../types/inventory';
import { InventoryValuationDashboard } from '../inventory/InventoryValuationDashboard';
import { StockMovementsLog } from '../inventory/StockMovementsLog';
import { ReorderSuggestionsModal } from '../inventory/ReorderSuggestionsModal';
import { StockMovementModal } from '../inventory/StockMovementModal';
import { InventoryPdfReportModal } from '../inventory/InventoryPdfReportModal';

interface InventoryViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onNavigateTo }) => {
  const { currency, activeBranch } = useAuth();

  // Inventory state with local persistence
  const [products, setProducts] = useState<InventoryProduct[]>(() => getStoredInventoryProducts());
  const [movements, setMovements] = useState<InventoryMovement[]>(() => getStoredInventoryMovements());

  // Sub-tabs navigation
  const [activeSubTab, setActiveSubTab] = useState<
    'valuation' | 'cogs_reserve' | 'reorder' | 'movements' | 'reconciliation'
  >('valuation');

  // Modals state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementTargetProductId, setMovementTargetProductId] = useState<string | undefined>(undefined);

  // Computed summary
  const summary = calculateInventoryValuation(products, movements);

  // Handle new movement
  const handleExecuteMovement = (data: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    employeeName: string;
    note?: string;
    unitCostPrice?: number;
    unitSellingPrice?: number;
  }) => {
    try {
      const result = executeStockMovement(data, products, movements);
      setProducts(result.updatedProducts);
      setMovements(result.updatedMovements);
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء تسجيل حركة المخزون');
    }
  };

  const handleOpenMovementForProduct = (productId?: string) => {
    setMovementTargetProductId(productId);
    setIsMovementModalOpen(true);
  };

  const handleResetDefaults = () => {
    if (window.confirm('هل تريد استعادة بيانات المخزون النموذجية الأصلية؟')) {
      const { products: p, movements: m } = resetInventoryToDefaults();
      setProducts(p);
      setMovements(m);
    }
  };

  return (
    <div id="inventory-view" className="space-y-5" dir="rtl">
      {/* Page Header */}
      <PageHeader
        title="إدارة وتقييم المخزون المالي"
        description="تقييم المخزون بسعري الشراء والبيع، تتبع تكلفة البضاعة المباعة (COGS)، حساب مبالغ إعادة التكوين وسجل الحركات."
        breadcrumbCurrent="المخزون والجرد"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={Boxes}
        primaryActionText="+ تسجيل حركة مخزون"
        primaryActionIcon={Plus}
        onPrimaryAction={() => handleOpenMovementForProduct()}
      />

      {/* Top Quick Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Export PDF Report Button */}
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>تصدير تقرير المخزون PDF</span>
          </button>

          {/* Reorder Suggestions Button */}
          <button
            onClick={() => setIsReorderModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>اقتراح إعادة الشراء</span>
            {summary.lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-200 text-amber-950">
                {summary.lowStockCount}
              </span>
            )}
          </button>

          {/* Log Movement Button */}
          <button
            onClick={() => handleOpenMovementForProduct()}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <History className="w-4 h-4 text-slate-600" />
            <span>تسجيل حركة يدوية</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            title="استعادة البيانات النموذجية"
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إعادة تعيين</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('valuation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'valuation'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>تقييم المخزون ولوحة المعلومات</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cogs_reserve')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'cogs_reserve'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>مبلغ إعادة تكوين المخزون & COGS</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reorder')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'reorder'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>اقتراح إعادة الشراء والنواقص</span>
          {summary.lowStockCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeSubTab === 'reorder'
                  ? 'bg-white/20 text-white'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {summary.lowStockCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('movements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'movements'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجل حركات المخزون</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeSubTab === 'movements'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {movements.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('reconciliation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
            activeSubTab === 'reconciliation'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>محاضر الجرد الدوري</span>
        </button>
      </div>

      {/* Tab 1: Valuation & Mini-Dashboard */}
      {activeSubTab === 'valuation' && (
        <InventoryValuationDashboard
          products={products}
          summary={summary}
          movements={movements}
          onOpenMovementModal={handleOpenMovementForProduct}
          onOpenReorderModal={() => setIsReorderModalOpen(true)}
          onOpenPdfReport={() => setIsPdfModalOpen(true)}
        />
      )}

      {/* Tab 2: COGS & Restocking Reserve Deep Dive */}
      {activeSubTab === 'cogs_reserve' && (
        <div className="space-y-6">
          {/* Detailed Financial Reserve Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-700" />
                  <span>نظام عزل تكلفة البضاعة المباعة ومبلغ إعادة تكوين المخزون</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حساب دقيق لمستحقات إعادة شراء البضائع التي تم بيعها للزبائن لعزلها في صندوق خاص برأس المال.
                </p>
              </div>

              <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold">
                قاعدة الفصل المحاسبي التام
              </div>
            </div>

            {/* User Prompt Example Illustrated Live */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-medium">إجمالي المبيعات المحققة</div>
                <div className="text-xl font-black text-slate-900 mt-1 font-mono">
                  {formatDA(summary.totalSalesRevenue)}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">كامل المداخيل المستلمة</div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-xs text-amber-800 font-medium">تكلفة البضاعة المباعة (COGS)</div>
                <div className="text-xl font-black text-amber-950 mt-1 font-mono">
                  {formatDA(summary.totalCogs)}
                </div>
                <div className="text-[10px] text-amber-700 mt-1">سعر الشراء الفعلي للسلع المباعة</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs text-emerald-800 font-medium">الربح الإجمالي الفعلي</div>
                <div className="text-xl font-black text-emerald-950 mt-1 font-mono">
                  {formatDA(summary.totalGrossProfit)}
                </div>
                <div className="text-[10px] text-emerald-700 mt-1">المبيعات - تكلفة البضاعة فقط</div>
              </div>

              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div className="text-xs text-rose-800 font-bold">مبلغ إعادة تكوين المخزون ⚠️</div>
                <div className="text-xl font-black text-rose-950 mt-1 font-mono">
                  {formatDA(summary.restockingReserve)}
                </div>
                <div className="text-[10px] text-rose-700 font-medium mt-1">
                  المبلغ المطلوب لشراء نفس الكميات من المورد
                </div>
              </div>
            </div>

            {/* Illustrative Simulation Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900">نموذج حي لحساب حركة بيع هاتف:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">سعر الشراء من المورد:</span>
                  <span className="font-bold text-slate-900">30,000 DA</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">سعر البيع للزبون:</span>
                  <span className="font-bold text-slate-900">35,000 DA</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                  <span className="block">تكلفة البضاعة (COGS):</span>
                  <span className="font-bold">30,000 DA</span>
                </div>
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900">
                  <span className="block">الربح الإجمالي الصافي:</span>
                  <span className="font-bold">5,000 DA</span>
                </div>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                عند بيع 6 وحدات: تكلفة إعادة الشراء = 6 × 30,000 = <strong className="font-bold">180,000 DA</strong>، المبيعات = <strong className="font-bold">210,000 DA</strong>، والربح الإجمالي = <strong className="font-bold">30,000 DA</strong>. يعزل النظام تلقائياً الـ 180,000 DA تحت بند «مبلغ إعادة تكوين المخزون».
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Reorder Suggestions & Analysis */}
      {activeSubTab === 'reorder' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>تحليل واقتراح إعادة الشراء من الموردين</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                حساب النواقص مقارنة بحدود الطلب، وتحديد الكميات والتكلفة المتوقعة للتوريد.
              </p>
            </div>
            <button
              onClick={() => setIsReorderModalOpen(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              عرض وتصدير أمر الشراء
            </button>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">مثال توضيحي لمنتج Samsung A17:</div>
              <p className="text-[11px] text-amber-800 mt-0.5">
                المخزون الحالي: <strong className="font-mono">2</strong> • حد إعادة الطلب: <strong className="font-mono">3</strong> • الكمية المقترحة: <strong className="font-mono">5</strong> • تكلفة الشراء المتوقعة: <strong className="font-mono">125,000 DA</strong>.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4">المنتج / الصنف</th>
                  <th className="py-3 px-3 text-center">المخزون الحالي</th>
                  <th className="py-3 px-3 text-center">حد إعادة الطلب</th>
                  <th className="py-3 px-3 text-center font-bold text-emerald-800">الكمية المقترحة</th>
                  <th className="py-3 px-4">سعر الشراء</th>
                  <th className="py-3 px-4 font-bold text-slate-900">تكلفة الشراء المتوقعة</th>
                  <th className="py-3 px-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {products
                  .filter((p) => p.stock <= p.minStockAlert)
                  .map((p) => {
                    const suggested = p.suggestedReorderQty || Math.max(1, p.minStockAlert * 2 - p.stock);
                    const expectedCost = suggested * p.purchasePrice;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {p.barcode} • {p.brand}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              p.stock === 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-600">
                          {p.minStockAlert}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-black text-emerald-800 bg-emerald-50/50">
                          +{suggested}
                        </td>
                        <td className="py-3 px-4 font-mono">{formatDA(p.purchasePrice)}</td>
                        <td className="py-3 px-4 font-mono font-black text-emerald-900">
                          {formatDA(expectedCost)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleOpenMovementForProduct(p.id)}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
                          >
                            تسجيل شراء
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Stock Movements Log */}
      {activeSubTab === 'movements' && (
        <StockMovementsLog
          movements={movements}
          onOpenNewMovementModal={() => handleOpenMovementForProduct()}
        />
      )}

      {/* Tab 5: Physical Inventory Reconciliation */}
      {activeSubTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <EmptyState
            icon={ClipboardList}
            title="محاضر الجرد الدوري للمخزن"
            description="قم بإجراء جرد فعلي (شهري أو سنوي) ومقارنة الكميات المحسوبة على الرفوف بالرصيد في النظام لتسجيل فروقات الجرد والتعديلات اليدوية."
            actionText="+ تسجيل حركة تسوية جرد يدوي"
            actionIcon={Plus}
            onAction={() => handleOpenMovementForProduct()}
          />
        </div>
      )}

      {/* MODALS */}
      {/* 1. PDF Report Modal */}
      <InventoryPdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        products={products}
        summary={summary}
        shopName="DZPAY SHOP MANAGER"
        branchName={activeBranch ? `فرع ${activeBranch.name}` : 'الفرع الرئيسي - الجزائر العاصمة'}
      />

      {/* 2. Reorder Suggestions Modal */}
      <ReorderSuggestionsModal
        isOpen={isReorderModalOpen}
        onClose={() => setIsReorderModalOpen(false)}
        products={products}
        onOrderProduct={(item) => {
          setIsReorderModalOpen(false);
          handleOpenMovementForProduct(item.productId);
        }}
      />

      {/* 3. New Stock Movement Modal */}
      <StockMovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        products={products}
        onSubmitMovement={handleExecuteMovement}
        preselectedProductId={movementTargetProductId}
      />
    </div>
  );
};
