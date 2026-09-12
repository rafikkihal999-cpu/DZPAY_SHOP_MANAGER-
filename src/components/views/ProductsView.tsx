import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Barcode,
  Edit,
  Trash2,
  Printer,
  Boxes,
  History,
  ClipboardList,
  Filter,
  X,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export interface ProductItem {
  id: string;
  name: string;
  barcode: string;
  category: string;
  brand: string;
  model: string;
  purchasePrice: number;
  wholesalePrice: number;
  retailPrice: number;
  stock: number;
  minStockAlert: number;
  notes?: string;
  status: 'متوفر' | 'منخفض' | 'نفد';
}

interface ProductsViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onNavigateTo }) => {
  const { currency } = useAuth();

  // Sub-views / tabs
  const [activeTab, setActiveTab] = useState<'products' | 'stock' | 'movements' | 'reconciliation'>('products');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'متوفر' | 'منخفض' | 'نفد'>('all');

  // Products state (empty by default per requirements)
  const [products, setProducts] = useState<ProductItem[]>([]);

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    category: 'chargers',
    brand: 'Anker',
    model: '',
    purchasePrice: '',
    wholesalePrice: '',
    retailPrice: '',
    stock: '',
    minStockAlert: '5',
    notes: '',
  });

  // Delete confirm dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Barcode Print preview dialog
  const [printingProduct, setPrintingProduct] = useState<ProductItem | null>(null);

  const categories = [
    { id: 'all', label: 'كل الأقسام' },
    { id: 'chargers', label: 'شواحن وبنوك طاقة' },
    { id: 'cables', label: 'كابلات وتحويلات' },
    { id: 'audio', label: 'سماعات وصوتيات' },
    { id: 'protection', label: 'زجاج حماية وكفرات' },
    { id: 'parts', label: 'شاشات وقطع غيار' },
    { id: 'accessories', label: 'إكسسوارات أخرى' },
  ];

  const brands = ['all', 'Apple', 'Samsung', 'Xiaomi', 'Anker', 'Baseus', 'Joyroom', 'LDNIO', 'Oraimo'];

  // Handle Form Submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.retailPrice) return;

    const qty = Number(formData.stock) || 0;
    const alertLimit = Number(formData.minStockAlert) || 5;

    let initialStatus: 'متوفر' | 'منخفض' | 'نفد' = 'متوفر';
    if (qty <= 0) initialStatus = 'نفد';
    else if (qty <= alertLimit) initialStatus = 'منخفض';

    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      name: formData.name.trim(),
      barcode: formData.barcode.trim() || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      category: formData.category,
      brand: formData.brand,
      model: formData.model.trim(),
      purchasePrice: Number(formData.purchasePrice) || 0,
      wholesalePrice: Number(formData.wholesalePrice) || 0,
      retailPrice: Number(formData.retailPrice),
      stock: qty,
      minStockAlert: alertLimit,
      notes: formData.notes.trim(),
      status: initialStatus,
    };

    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      barcode: '',
      category: 'chargers',
      brand: 'Anker',
      model: '',
      purchasePrice: '',
      wholesalePrice: '',
      retailPrice: '',
      stock: '',
      minStockAlert: '5',
      notes: '',
    });
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      setProducts(products.filter((p) => p.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
    const matchStatus = stockStatusFilter === 'all' || p.status === stockStatusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      q === '' ||
      p.name.toLowerCase().includes(q) ||
      p.barcode.includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.model.toLowerCase().includes(q);

    return matchCat && matchBrand && matchStatus && matchQuery;
  });

  return (
    <div id="products-view" className="space-y-5">
      {/* Header with Title and Action */}
      <PageHeader
        title="المنتجات والإكسسوارات"
        description="إدارة بطاقات المنتجات، الأسعار، ومراقبة كميات المخزون في المحل."
        breadcrumbCurrent="المنتجات والمخزون"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={Package}
        primaryActionText="+ إضافة منتج"
        primaryActionIcon={Plus}
        onPrimaryAction={() => setIsAddModalOpen(true)}
      />

      {/* Sub-view Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'products'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>قائمة المنتجات</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'stock'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>مستويات المخزون</span>
        </button>

        <button
          onClick={() => setActiveTab('movements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'movements'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>حركات المخزون</span>
        </button>

        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'reconciliation'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>محاضر الجرد الدوري</span>
        </button>
      </div>

      {/* Main Tab: Products List & Filters */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="بحث باسم المنتج، الباركود، أو الموديل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="all">كل الماركات</option>
                {brands.filter((b) => b !== 'all').map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* Stock Status Filter */}
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="all">كل حالات المخزون</option>
                <option value="متوفر">متوفر</option>
                <option value="منخفض">منخفض (تحت حد التنبيه)</option>
                <option value="نفد">نفد من المخزن</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-bold shrink-0">
              النتائج: <span className="text-emerald-700">{filteredProducts.length}</span> منتج
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredProducts.length === 0 ? (
              <EmptyState
                icon={Package}
                title="لا توجد منتجات مسجلة بعد"
                description="أضف أول منتج للبدء في إدارة المخزون والمبيعات."
                actionText="+ إضافة منتج جديد"
                actionIcon={Plus}
                onAction={() => setIsAddModalOpen(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-3 px-4">اسم المنتج</th>
                      <th className="py-3 px-4">الباركود</th>
                      <th className="py-3 px-4">الماركة</th>
                      <th className="py-3 px-4">سعر الشراء</th>
                      <th className="py-3 px-4">سعر البيع</th>
                      <th className="py-3 px-4">الكمية</th>
                      <th className="py-3 px-4">حالة المخزون</th>
                      <th className="py-3 px-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div>{p.name}</div>
                          {p.model && <div className="text-[10px] text-slate-400 font-normal">{p.model}</div>}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                            {p.barcode}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{p.brand}</td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {p.purchasePrice.toLocaleString('fr-DZ')} {currency}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700 font-mono">
                          {p.retailPrice.toLocaleString('fr-DZ')} {currency}
                        </td>
                        <td className="py-3 px-4 font-black">
                          <span
                            className={
                              p.stock === 0
                                ? 'text-rose-600'
                                : p.stock <= p.minStockAlert
                                ? 'text-amber-600'
                                : 'text-slate-900'
                            }
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setPrintingProduct(p)}
                              title="طباعة ملصق الباركود"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(p.id)}
                              title="حذف المنتج"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-view: Stock Levels */}
      {activeTab === 'stock' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <EmptyState
            icon={Boxes}
            title="مستويات المخزون وقيمته المالية"
            description="ستظهر هنا إحصائيات القيمة الإجمالية للمخزون، وتنبيهات النواقص بعد تسجيل المنتجات."
            actionText="+ إضافة منتج للمخزون"
            actionIcon={Plus}
            onAction={() => setIsAddModalOpen(true)}
          />
        </div>
      )}

      {/* Sub-view: Movements */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <EmptyState
            icon={History}
            title="لا توجد حركات مخزون مسجلة بعد"
            description="يتم تسجيل حركات الدخول (مشتريات) والخروج (مبيعات) والتسويات تلقائياً هنا."
          />
        </div>
      )}

      {/* Sub-view: Reconciliation */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <EmptyState
            icon={ClipboardList}
            title="لا توجد عمليات جرد سابقة"
            description="يمكنك إنشاء جلسة جرد دوري لمطابقة الكميات الفعلية في الرفوف مع الكميات المسجلة في النظام."
            actionText="بدء جرد جديد"
            actionIcon={Plus}
            onAction={() => alert('ميزة الجرد جاهزة وسيتم ربطها بقاعدة البيانات في الخطوة القادمة.')}
          />
        </div>
      )}

      {/* Complete Add Product Modal (11 requested fields) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">إضافة منتج جديد للمخزون</h3>
                  <p className="text-[11px] text-slate-500">سجل بيانات المنتج والأسعار وكمية الافتتاح</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Row 1: Name & Barcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    اسم المنتج <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: شاحن Anker 20W سريع"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الباركود (Barcode)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="امسح بالقارئ أو اترك فارغاً للإنشاء تلقائياً"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      className="w-full pr-8 pl-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 font-mono"
                    />
                    <Barcode className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Row 2: Category, Brand, Model */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الماركة</label>
                  <input
                    type="text"
                    placeholder="Anker, Baseus, Apple..."
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الموديل (Modèle)</label>
                  <input
                    type="text"
                    placeholder="مثال: A2149 / Nano Pro"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Row 3: Prices (Purchase, Wholesale, Retail) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    سعر الشراء (د.ج)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    سعر البيع بالجملة (د.ج)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.wholesalePrice}
                    onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    سعر البيع بالتجزئة (د.ج) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="0"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-bold text-emerald-800 font-mono"
                  />
                </div>
              </div>

              {/* Row 4: Initial Stock & Min Stock Alert */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الكمية الابتدائية في المخزن
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    حد التنبيه عند اقتراب النفاد
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="5"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Row 5: Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  placeholder="مكان التخزين (الرف/الدرج)، الضمان من المورد، إلخ..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs"
                >
                  حفظ المنتج في المخزون
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Print Modal */}
      {printingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-xs">معاينة ملصق الباركود</h4>
              <button onClick={() => setPrintingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 space-y-2">
              <div className="font-bold text-xs text-slate-900">{printingProduct.name}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{printingProduct.brand} • DZPAY SHOP</div>
              <div className="h-10 flex items-center justify-center bg-white border border-slate-200 rounded font-mono tracking-widest text-slate-800 text-sm">
                |||||| | |||| || ||||||
              </div>
              <div className="font-mono text-xs font-bold text-slate-700">{printingProduct.barcode}</div>
              <div className="text-sm font-black text-emerald-800">
                {printingProduct.retailPrice.toLocaleString('fr-DZ')} {currency}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPrintingProduct(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  window.print();
                  setPrintingProduct(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الملصق</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="تأكيد حذف المنتج"
        message="هل أنت متأكد من رغبتك في حذف هذا المنتج من بطاقات المخزون؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="نعم، حذف المنتج"
        cancelText="إلغاء"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
