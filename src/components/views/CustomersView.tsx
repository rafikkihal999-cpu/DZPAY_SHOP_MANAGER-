import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Edit,
  Trash2,
  Filter,
  X,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { ConfirmDialog } from '../common/ConfirmDialog';

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  secondaryPhone?: string;
  wilaya: string;
  address?: string;
  customerType: 'retail' | 'wholesale' | 'technician';
  creditLimit: number;
  purchasesCount: number;
  totalPurchases: number;
  currentDebt: number;
  notes?: string;
}

const ALGERIAN_WILAYAS = [
  '25 - قسنطينة', '16 - الجزائر', '19 - سطيف', '23 - عنابة',
  '05 - باتنة', '06 - بجاية', '07 - بسكرة', '09 - البليدة',
  '13 - تلمسان', '15 - تيزي وزو', '17 - الجلفة', '26 - المدية',
  '27 - مستغانم', '28 - المسيلة', '30 - ورقلة', '31 - وهران',
  '35 - بومرداس', '38 - تيسمسيلت', '42 - تيبازة', '47 - غرداية',
];

interface CustomersViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onNavigateTo }) => {
  const { currency } = useAuth();

  // State: customers list (empty initially as per requirement)
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'retail' | 'wholesale' | 'technician'>('all');
  const [debtFilter, setDebtFilter] = useState<'all' | 'with_debt' | 'no_debt'>('all');

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form data for 8 requested fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    secondaryPhone: '',
    wilaya: '25 - قسنطينة',
    address: '',
    customerType: 'retail' as 'retail' | 'wholesale' | 'technician',
    creditLimit: '50000',
    notes: '',
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const newCustomer: CustomerRecord = {
      id: `cust-${Date.now()}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      secondaryPhone: formData.secondaryPhone.trim() || undefined,
      wilaya: formData.wilaya,
      address: formData.address.trim() || undefined,
      customerType: formData.customerType,
      creditLimit: Number(formData.creditLimit) || 0,
      purchasesCount: 0,
      totalPurchases: 0,
      currentDebt: 0,
      notes: formData.notes.trim() || undefined,
    };

    setCustomers([newCustomer, ...customers]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      phone: '',
      secondaryPhone: '',
      wilaya: '25 - قسنطينة',
      address: '',
      customerType: 'retail',
      creditLimit: '50000',
      notes: '',
    });
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      setCustomers(customers.filter((c) => c.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      q === '' ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.secondaryPhone && c.secondaryPhone.includes(q));

    const matchType = typeFilter === 'all' || c.customerType === typeFilter;

    let matchDebt = true;
    if (debtFilter === 'with_debt') matchDebt = c.currentDebt > 0;
    if (debtFilter === 'no_debt') matchDebt = c.currentDebt === 0;

    return matchSearch && matchType && matchDebt;
  });

  const getCustomerTypeLabel = (type: string) => {
    switch (type) {
      case 'wholesale':
        return 'جملة (Grossiste)';
      case 'technician':
        return 'فني صيانة (Réparateur)';
      default:
        return 'تجزئة (Détail)';
    }
  };

  return (
    <div id="customers-view" className="space-y-5">
      <PageHeader
        title="الزبائن والعملاء"
        description="سجل العملاء، أرقام الهواتف، ديون الزبائن، والحدود الائتمانية للمعاملات."
        breadcrumbCurrent="العملاء والزبائن"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={Users}
        primaryActionText="+ إضافة عميل جديد"
        primaryActionIcon={Plus}
        onPrimaryAction={() => setIsAddModalOpen(true)}
      />

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Search by Name or Phone */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="البحث بالاسم أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
            />
          </div>

          {/* Customer Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">كل التصنيفات</option>
            <option value="retail">زبون تجزئة</option>
            <option value="wholesale">تاجر جملة</option>
            <option value="technician">فني صيانة</option>
          </select>

          {/* Debt Filter */}
          <select
            value={debtFilter}
            onChange={(e) => setDebtFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">كل حالات الديون</option>
            <option value="with_debt">عليه ديون ومستحقات</option>
            <option value="no_debt">سجل نظيف (بدون ديون)</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-bold shrink-0">
          إجمالي العملاء: <span className="text-emerald-700">{filtered.length}</span>
        </div>
      </div>

      {/* Table / Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="لا يوجد عملاء مسجلون بعد"
            description="أضف عميلاً جديداً أو سيتم إنشاؤه تلقائياً عند تسجيل المبيعات."
            actionText="+ إضافة عميل جديد"
            actionIcon={Plus}
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">اسم العميل</th>
                  <th className="py-3 px-4">رقم الهاتف</th>
                  <th className="py-3 px-4">الولاية / العنوان</th>
                  <th className="py-3 px-4">عدد المشتريات</th>
                  <th className="py-3 px-4">إجمالي المشتريات</th>
                  <th className="py-3 px-4">الرصيد / الديون</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{customer.name}</div>
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                        {getCustomerTypeLabel(customer.customerType)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      <div>{customer.phone}</div>
                      {customer.secondaryPhone && (
                        <div className="text-[10px] text-slate-400 font-normal">
                          {customer.secondaryPhone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{customer.wilaya}</div>
                      {customer.address && (
                        <div className="text-[10px] text-slate-400">{customer.address}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {customer.purchasesCount} طلب
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      {customer.totalPurchases.toLocaleString('fr-DZ')} {currency}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {customer.currentDebt > 0 ? (
                        <span className="font-bold text-rose-600">
                          {customer.currentDebt.toLocaleString('fr-DZ')} {currency} (دين)
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">لا يوجد ديون</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setDeleteTargetId(customer.id)}
                          title="حذف العميل"
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

      {/* Add Customer Modal (8 requested fields) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">إضافة عميل جديد</h3>
                  <p className="text-[11px] text-slate-500">سجل معلومات الاتصال وتصنيف الزبون والحد الائتماني</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-5 space-y-4 text-xs">
              {/* Field 1: Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم العميل الكامل <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: عبد القادر مرابط"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              {/* Field 2 & 3: Primary Phone & Secondary Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رقم الهاتف الرئيسي <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الهاتف الثاني (اختياري)
                  </label>
                  <input
                    type="tel"
                    placeholder="هاتف ثانٍ للتواصل أو الواتساب"
                    value={formData.secondaryPhone}
                    onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Field 4 & 5: Wilaya & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الولاية</label>
                  <select
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {ALGERIAN_WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">العنوان / الحي</label>
                  <input
                    type="text"
                    placeholder="البلدية أو الحي"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Field 6 & 7: Customer Type & Credit Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع العميل</label>
                  <select
                    value={formData.customerType}
                    onChange={(e) => setFormData({ ...formData, customerType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="retail">زبون تجزئة (Détail)</option>
                    <option value="wholesale">تاجر جملة (Grossiste)</option>
                    <option value="technician">فني صيانة (Réparateur)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الحد الائتماني للكريدي (د.ج)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Field 8: Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">ملاحظات إضافية</label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات حول طريقة التعامل، المواعيد المفضلة، الضامن، إلخ..."
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
                  حفظ العميل في السجل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="تأكيد حذف العميل"
        message="هل أنت متأكد من رغبتك في حذف هذا العميل من السجل؟"
        confirmText="نعم، حذف العميل"
        cancelText="إلغاء"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
