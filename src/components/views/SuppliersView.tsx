import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  MapPin,
  Building,
  Trash2,
  Edit,
  X,
  CreditCard,
  Banknote,
  Scale,
  TrendingDown,
  Tag,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { SupplierPriceComparison } from '../suppliers/SupplierPriceComparison';

export interface SupplierRecord {
  id: string;
  supplierName: string;
  contactPerson: string;
  phone: string;
  region: string;
  balanceOwed: number;
}

const DEFAULT_ALGERIAN_SUPPLIERS: SupplierRecord[] = [
  {
    id: 'sup-1',
    supplierName: 'مؤسسة النور لتوزيع الهواتف',
    contactPerson: 'الحاج مراد بن عيسى',
    phone: '0550 12 34 56',
    region: 'الجزائر - سوق بلفور (الحراش)',
    balanceOwed: 45000,
  },
  {
    id: 'sup-2',
    supplierName: 'العالمية للإلكترونيات (دبي العلمة)',
    contactPerson: 'كمال سطايفي',
    phone: '0661 98 76 54',
    region: 'سطيف - دبي العلمة (شارع دبي)',
    balanceOwed: 0,
  },
  {
    id: 'sup-3',
    supplierName: 'قطع غيار بلفور سنتر',
    contactPerson: 'عادل تكنيسيان',
    phone: '0551 33 44 55',
    region: 'الجزائر - سوق بلفور (الحراش)',
    balanceOwed: 12000,
  },
  {
    id: 'sup-4',
    supplierName: 'ديزاد إمبورت مستورد مباشر',
    contactPerson: 'فريد إيمبورت',
    phone: '0555 77 88 99',
    region: 'مستورد مباشر (Importateur Direct)',
    balanceOwed: 0,
  },
  {
    id: 'sup-5',
    supplierName: 'استيراد وتوزيع الغرب',
    contactPerson: 'محمد وهراني',
    phone: '0770 45 67 89',
    region: 'وهران - المدينة الجديدة',
    balanceOwed: 0,
  },
];

const ALGERIAN_SUPPLY_HUBS = [
  'الجزائر - سوق بلفور (الحراش)',
  'سطيف - دبي العلمة (شارع دبي)',
  'باتنة - وادي الشعبة',
  'وهران - المدينة الجديدة',
  'قسنطينة - وسط المدينة',
  'برج بوعريريج - الإلكترونيات',
  'مستورد مباشر (Importateur Direct)',
];

interface SuppliersViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({ onNavigateTo }) => {
  const { currency } = useAuth();
  const STORAGE_KEY = 'dzpay_suppliers_list_v1';

  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load suppliers:', e);
      }
    }
    return DEFAULT_ALGERIAN_SUPPLIERS;
  });

  const saveSuppliers = (newSuppliers: SupplierRecord[]) => {
    setSuppliers(newSuppliers);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSuppliers));
    } catch (e) {
      console.error('Failed to persist suppliers:', e);
    }
  };

  // Sub-tabs: 'comparison' (مقارنة أسعار الشراء) or 'directory' (دليل الموردين)
  const [activeTab, setActiveTab] = useState<'comparison' | 'directory'>('comparison');

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    supplierName: '',
    contactPerson: '',
    phone: '',
    region: 'الجزائر - سوق بلفور (الحراش)',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplierName.trim() || !formData.phone.trim()) return;

    const newSup: SupplierRecord = {
      id: `sup-${Date.now()}`,
      supplierName: formData.supplierName.trim(),
      contactPerson: formData.contactPerson.trim() || formData.supplierName.trim(),
      phone: formData.phone.trim(),
      region: formData.region,
      balanceOwed: 0,
    };

    saveSuppliers([newSup, ...suppliers]);
    setIsAddModalOpen(false);
    setFormData({
      supplierName: '',
      contactPerson: '',
      phone: '',
      region: 'الجزائر - سوق بلفور (الحراش)',
    });
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      saveSuppliers(suppliers.filter((s) => s.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const filtered = suppliers.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      q === '' ||
      s.supplierName.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.region.toLowerCase().includes(q)
    );
  });

  return (
    <div id="suppliers-view" className="space-y-5" dir="rtl">
      <PageHeader
        title="الموردون ومقارنة الأسعار"
        description="مقارنة أسعار شراء المنتجات من مختلف الموردين وتجار الجملة مع مؤشرات أفضل سعر، وإدارة الحسابات والمستحقات."
        breadcrumbCurrent="الموردون وتجار الجملة"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={Truck}
        primaryActionText={activeTab === 'directory' ? '+ إضافة مورد جديد' : '+ إضافة مورد'}
        primaryActionIcon={Plus}
        onPrimaryAction={() => setIsAddModalOpen(true)}
      />

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>مقارنة أسعار المنتجات</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === 'comparison'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
            }`}
          >
            مؤشر أفضل سعر 🟢/🔴
          </span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>سجل حسابات الموردين</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'directory'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
            }`}
          >
            {suppliers.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Price Comparison */}
      {activeTab === 'comparison' && (
        <SupplierPriceComparison
          existingSuppliers={suppliers}
          onNavigateTo={onNavigateTo}
        />
      )}

      {/* Tab 2: Supplier Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث باسم المورد، الشخص المسؤول، أو المنطقة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:border-emerald-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="text-xs text-slate-500 font-bold shrink-0">
              إجمالي الموردين: <span className="text-emerald-700 dark:text-emerald-400">{filtered.length}</span>
            </div>
          </div>

          {/* Table / Empty State */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Truck}
                title="لا يوجد موردون مسجلون بعد"
                description="أضف بيانات تجار الجملة والموردين لمتابعة الفواتير والمستحقات."
                actionText="+ إضافة مورد جديد"
                actionIcon={Plus}
                onAction={() => setIsAddModalOpen(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="py-3 px-4">اسم المورد</th>
                      <th className="py-3 px-4">الشخص المسؤول</th>
                      <th className="py-3 px-4">الهاتف</th>
                      <th className="py-3 px-4">الولاية / المنطقة</th>
                      <th className="py-3 px-4">مستحقات المورد</th>
                      <th className="py-3 px-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {s.supplierName}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                          {s.contactPerson}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200">
                          <a href={`tel:${s.phone.replace(/\s+/g, '')}`} className="hover:underline text-emerald-700 dark:text-emerald-400" dir="ltr">
                            {s.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {s.region}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold">
                          {s.balanceOwed > 0 ? (
                            <span className="text-rose-600 dark:text-rose-400">
                              {s.balanceOwed.toLocaleString('fr-DZ')} {currency} (مستحق)
                            </span>
                          ) : (
                            <span className="text-emerald-700 dark:text-emerald-400">خالص (0 دج)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setDeleteTargetId(s.id)}
                              title="حذف المورد"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">إضافة مورد جديد</h3>
                  <p className="text-[11px] text-slate-500">تسجيل بيانات تاجر الجملة أو المستورد</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم المؤسسة / المورد <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شركة النور لتوزيع الهواتف"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الشخص المسؤول / جهة الاتصال
                </label>
                <input
                  type="text"
                  placeholder="مثال: الحاج مراد"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رقم الهاتف <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="05 / 06 / 07 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الولاية / المنطقة
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {ALGERIAN_SUPPLY_HUBS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

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
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs"
                >
                  حفظ المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="تأكيد حذف المورد"
        message="هل أنت متأكد من رغبتك في حذف هذا المورد؟"
        confirmText="نعم، حذف"
        cancelText="إلغاء"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
