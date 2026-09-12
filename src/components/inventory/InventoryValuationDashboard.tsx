import React, { useState } from 'react';
import {
  Boxes,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  PieChart,
  HelpCircle,
  Percent,
  Plus,
  Coins,
  ShieldAlert,
} from 'lucide-react';
import {
  InventoryProduct,
  InventoryValuationSummary,
  InventoryMovement,
} from '../../types/inventory';
import {
  formatDA,
  getTopSellingProducts,
  getStagnantProducts,
} from '../../services/inventoryService';

interface InventoryValuationDashboardProps {
  products: InventoryProduct[];
  summary: InventoryValuationSummary;
  movements: InventoryMovement[];
  onOpenMovementModal: (productId?: string) => void;
  onOpenReorderModal: () => void;
  onOpenPdfReport: () => void;
}

export const InventoryValuationDashboard: React.FC<InventoryValuationDashboardProps> = ({
  products,
  summary,
  movements,
  onOpenMovementModal,
  onOpenReorderModal,
  onOpenPdfReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'متوفر' | 'منخفض' | 'نفد'>('all');

  const topSelling = getTopSellingProducts(products);
  const stagnantProducts = getStagnantProducts(products);

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.barcode.includes(q) ||
      p.brand.toLowerCase().includes(q);
    return matchCat && matchStatus && matchQuery;
  });

  const categories = [
    { id: 'all', label: 'جميع الأقسام' },
    { id: 'phones', label: 'الهواتف الذكية' },
    { id: 'chargers', label: 'شواحن وبنوك طاقة' },
    { id: 'cables', label: 'كابلات وتحويلات' },
    { id: 'audio', label: 'سماعات وصوتيات' },
    { id: 'protection', label: 'زجاج حماية وكفرات' },
    { id: 'parts', label: 'قطع غيار وشاشات' },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. SECTION: تقييم المخزون (Core Valuation Metric Cards & Mathematical Formulas) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-700" />
              <span>تقييم المخزون المالي والرأسمالي</span>
            </h2>
            <p className="text-xs text-slate-500">
              قيمة البضائع المتوفرة حالياً في رفوف ومخازن المحل بسعري التكلفة والبيع مع قياس الأرباح المتوقعة.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              العملة: الدينار الجزائري (DA)
            </span>
          </div>
        </div>

        {/* The 6 Required Cards for Section 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Card 1: إجمالي عدد المنتجات الموجودة */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold">إجمالي المنتجات</span>
              <Package className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-black text-slate-900">{summary.totalProductsCount}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              مجموع القطع: <strong className="text-slate-800 font-mono">{summary.totalQuantity}</strong> وحدة
            </div>
          </div>

          {/* Card 2: إجمالي قيمة المخزون بسعر الشراء */}
          <div className="bg-white rounded-2xl p-4 border border-blue-200/80 shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-blue-600"></div>
            <div className="flex items-center justify-between text-blue-900 mb-2">
              <span className="text-xs font-bold">قيمة بسعر الشراء</span>
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-black text-blue-950 font-mono">{formatDA(summary.totalPurchaseValue)}</div>
            <div className="text-[10px] text-blue-700 mt-1 font-medium">
              مجموع (الكمية × سعر الشراء)
            </div>
          </div>

          {/* Card 3: إجمالي قيمة المخزون بسعر البيع */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200/80 shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-emerald-600"></div>
            <div className="flex items-center justify-between text-emerald-900 mb-2">
              <span className="text-xs font-bold">قيمة بسعر البيع</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-lg font-black text-emerald-950 font-mono">{formatDA(summary.totalSellingValue)}</div>
            <div className="text-[10px] text-emerald-700 mt-1 font-medium">
              مجموع (الكمية × سعر البيع)
            </div>
          </div>

          {/* Card 4: إجمالي الربح المتوقع من المخزون الحالي */}
          <div className="bg-white rounded-2xl p-4 border border-teal-200/80 shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1 bg-teal-600"></div>
            <div className="flex items-center justify-between text-teal-900 mb-2">
              <span className="text-xs font-bold">الربح المتوقع</span>
              <Percent className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-lg font-black text-teal-950 font-mono">{formatDA(summary.expectedProfit)}</div>
            <div className="text-[10px] text-teal-700 mt-1 font-medium">
              سعر البيع - سعر الشراء (~{summary.expectedProfitMargin}%)
            </div>
          </div>

          {/* Card 5: عدد المنتجات منخفضة المخزون */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between text-amber-900 mb-2">
              <span className="text-xs font-bold">منخفضة المخزون</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-950 font-mono">{summary.lowStockCount}</div>
            <div className="text-[11px] text-amber-700 mt-1">
              تحت حد إعادة الطلب
            </div>
          </div>

          {/* Card 6: عدد المنتجات التي نفدت */}
          <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-2xs">
            <div className="flex items-center justify-between text-rose-900 mb-2">
              <span className="text-xs font-bold">منتجات نفدت</span>
              <TrendingDown className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-950 font-mono">{summary.outOfStockCount}</div>
            <div className="text-[11px] text-rose-700 mt-1">
              الكمية الحالية = 0
            </div>
          </div>
        </div>

        {/* Formula Explanatory Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-bold text-slate-800">قواعد التقييم الحسابية:</span>
            <span>قيمة المخزون بالشراء = ∑(الكمية × سعر الشراء)</span>
            <span>•</span>
            <span>قيمة المخزون بالبيع = ∑(الكمية × سعر البيع)</span>
            <span>•</span>
            <span>الربح المتوقع = قيمة البيع - قيمة الشراء</span>
          </div>
          <button
            onClick={onOpenPdfReport}
            className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer text-xs"
          >
            معاينة تقرير الجرد والطباعة PDF &larr;
          </button>
        </div>
      </div>

      {/* 2 & 3. SECTION: تتبع تكلفة البضاعة المباعة (COGS) + مبلغ إعادة تكوين المخزون */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 md:p-6 text-white shadow-md border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-slate-950">
                ميزة مالية حاسمة
              </span>
              <h3 className="text-base font-black text-white">
                تتبع تكلفة البضاعة المباعة (COGS) & مبلغ إعادة تكوين المخزون
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              فصل تكلفة السلع المباعة عن الأرباح لضمان استمرارية رأس مال المحل وعدم استنزاف السيولة في مصاريف عشوائية.
            </p>
          </div>

          <button
            onClick={() => onOpenMovementModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل حركة بيع أو شراء تجريبية</span>
          </button>
        </div>

        {/* Comparative 4-Pillar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {/* Pillar 1: المبيعات المحققة */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/15">
            <div className="text-xs text-slate-300 font-bold mb-1">إجمالي المبيعات (السيولة المقبوضة)</div>
            <div className="text-xl font-black text-white font-mono">{formatDA(summary.totalSalesRevenue)}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              كامل المداخيل الناتجة عن بيع السلع
            </div>
          </div>

          {/* Pillar 2: تكلفة البضاعة المباعة (COGS) */}
          <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-500/30">
            <div className="text-xs text-amber-300 font-bold mb-1">تكلفة البضاعة المباعة (COGS)</div>
            <div className="text-xl font-black text-amber-400 font-mono">{formatDA(summary.totalCogs)}</div>
            <div className="text-[11px] text-amber-200/80 mt-1">
              سعر شراء المنتجات التي تم بيعها للزبائن
            </div>
          </div>

          {/* Pillar 3: الربح الإجمالي */}
          <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-500/30">
            <div className="text-xs text-emerald-300 font-bold mb-1">الربح الإجمالي الفعلي (Gross Profit)</div>
            <div className="text-xl font-black text-emerald-400 font-mono">{formatDA(summary.totalGrossProfit)}</div>
            <div className="text-[11px] text-emerald-200/80 mt-1">
              المبيعات - تكلفة البضاعة المباعة
            </div>
          </div>

          {/* Pillar 4: مبلغ إعادة تكوين المخزون */}
          <div className="bg-rose-950/50 rounded-xl p-4 border border-rose-500/40 relative">
            <div className="text-xs text-rose-300 font-black mb-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>مبلغ إعادة تكوين المخزون</span>
            </div>
            <div className="text-xl font-black text-rose-300 font-mono">{formatDA(summary.restockingReserve)}</div>
            <div className="text-[11px] text-rose-200/90 mt-1 font-bold">
              مخصص حتمي لشراء نفس كميات البضاعة المباعة
            </div>
          </div>
        </div>

        {/* Educational Principle Callout */}
        <div className="mt-5 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5">
            <Coins className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-emerald-300">
              القاعدة الذهبية لإدارة أموال المحل: «لا تعتبر كامل مبلغ البيع ربحاً أو أموالاً متاحة للصرف»
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              عند بيع هاتف بـ <strong className="text-white font-mono">35,000 DA</strong> وكان سعر شرائه من المورد <strong className="text-white font-mono">30,000 DA</strong>، فإن الـ <strong className="text-rose-300 font-mono">30,000 DA</strong> هي <strong className="underline">أمانة المخزن</strong> لإعادة شراء الهاتف مجدداً من سوق الجملة (بلفور أو العلمة)، وفقط <strong className="text-emerald-300 font-mono">5,000 DA</strong> هي الربح الإجمالي الفعلي.
            </p>
          </div>
        </div>
      </div>

      {/* 4. SECTION: لوحة معلومات المخزون (Mini-Dashboard: Top Selling, Stagnant, Low Stock) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Box 1: المنتجات الأكثر مبيعاً */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">المنتجات الأكثر مبيعاً (Top Sellers)</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">حسب حجم المبيعات</span>
          </div>

          <div className="space-y-2">
            {topSelling.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد مبيعات مسجلة بعد</p>
            ) : (
              topSelling.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-500">
                        سعر البيع: {p.sellingPrice.toLocaleString('fr-DZ')} DA
                      </div>
                    </div>
                  </div>
                  <div className="text-left shrink-0 font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-lg text-[11px]">
                    {p.unitsSold} مبيعة
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Box 2: المنتجات الراكدة (Stagnant Stock) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">المنتجات الراكدة (بطيئة الدوران)</h4>
            </div>
            <span className="text-[10px] text-amber-800 font-bold">رأس مال معطل</span>
          </div>

          <div className="space-y-2">
            {stagnantProducts.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">لا توجد منتجات راكدة حالياً</p>
            ) : (
              stagnantProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-slate-900 truncate">{p.name}</div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                      {p.stock} وحدة معطلة
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>قيمة التكلفة المجمدة: {(p.stock * p.purchasePrice).toLocaleString('fr-DZ')} DA</span>
                    <span className="text-rose-600 font-bold">0 مبيعات قريبة</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Box 3: المنتجات منخفضة المخزون والنواقص */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">تنبيه النواقص وإعادة الطلب</h4>
            </div>
            <button
              onClick={onOpenReorderModal}
              className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
            >
              اقتراح الشراء &larr;
            </button>
          </div>

          <div className="space-y-2">
            {products
              .filter((p) => p.stock <= p.minStockAlert)
              .slice(0, 4)
              .map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 border border-rose-200/70 text-xs"
                >
                  <div className="truncate">
                    <div className="font-bold text-slate-900 truncate">{p.name}</div>
                    <div className="text-[10px] text-slate-500">
                      حد الطلب: {p.minStockAlert} • تكلفة الشراء: {formatDA(p.purchasePrice)}
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        p.stock === 0 ? 'bg-rose-600 text-white' : 'bg-amber-200 text-amber-950'
                      }`}
                    >
                      {p.stock === 0 ? 'نفد (0)' : `${p.stock} فقط`}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 5. Comprehensive Detailed Product Valuation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              جدول تقييم تفصيلي لجميع أصناف المخزون
            </h3>
            <p className="text-[11px] text-slate-500">
              قيمة الشراء، قيمة البيع، والربح المتوقع لكل منتج على حدة مع تحديث فوري للأرصدة.
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الباركود..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8 pl-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-600"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">كل الحالات</option>
              <option value="متوفر">متوفر</option>
              <option value="منخفض">منخفض</option>
              <option value="نفد">نفد</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3 px-3">المنتج / الصنف</th>
                <th className="py-3 px-3 text-center">الكمية الحالية</th>
                <th className="py-3 px-3">سعر الشراء</th>
                <th className="py-3 px-3">سعر البيع</th>
                <th className="py-3 px-3 font-bold text-blue-900">قيمة الشراء</th>
                <th className="py-3 px-3 font-bold text-emerald-900">قيمة البيع</th>
                <th className="py-3 px-3 font-bold text-teal-900">الربح المتوقع</th>
                <th className="py-3 px-3 text-center">الحالة</th>
                <th className="py-3 px-3 text-center">حركة سريعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredProducts.map((p) => {
                const purchaseVal = p.stock * p.purchasePrice;
                const sellingVal = p.stock * p.sellingPrice;
                const profitVal = sellingVal - purchaseVal;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {p.barcode} • {p.brand}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-xs ${
                          p.stock === 0
                            ? 'bg-rose-100 text-rose-800'
                            : p.stock <= p.minStockAlert
                            ? 'bg-amber-100 text-amber-900 font-bold'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">{formatDA(p.purchasePrice)}</td>
                    <td className="py-3 px-3 font-mono">{formatDA(p.sellingPrice)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-900">{formatDA(purchaseVal)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-900">{formatDA(sellingVal)}</td>
                    <td className="py-3 px-3 font-mono font-bold text-teal-900">{formatDA(profitVal)}</td>
                    <td className="py-3 px-3 text-center">
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
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onOpenMovementModal(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                        title="تسجيل حركة مخزنية على هذا الصنف"
                      >
                        حركة مخزنية
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
              <tr>
                <td className="py-3 px-3">المجموع ({filteredProducts.length} صنف)</td>
                <td className="py-3 px-3 text-center font-mono">
                  {filteredProducts.reduce((sum, p) => sum + p.stock, 0)}
                </td>
                <td colSpan={2} className="py-3 px-3 text-slate-400 text-center">—</td>
                <td className="py-3 px-3 font-mono text-blue-900">
                  {formatDA(filteredProducts.reduce((sum, p) => sum + p.stock * p.purchasePrice, 0))}
                </td>
                <td className="py-3 px-3 font-mono text-emerald-900">
                  {formatDA(filteredProducts.reduce((sum, p) => sum + p.stock * p.sellingPrice, 0))}
                </td>
                <td className="py-3 px-3 font-mono text-teal-900">
                  {formatDA(
                    filteredProducts.reduce(
                      (sum, p) => sum + (p.stock * p.sellingPrice - p.stock * p.purchasePrice),
                      0
                    )
                  )}
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
