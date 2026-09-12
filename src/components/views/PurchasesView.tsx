import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Truck,
  Calendar,
  Trash2,
  Receipt,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { PrintLayout } from '../common/PrintLayout';

export interface PurchaseBill {
  id: string;
  billNumber: string;
  supplierName: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: 'مدفوع' | 'دفع جزئي' | 'غير مدفوع';
}

interface PurchasesViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({ onNavigateTo }) => {
  const { currency, activeBranch } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseBill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isPrintPurchasesOpen, setIsPrintPurchasesOpen] = useState(false);

  const [formData, setFormData] = useState({
    billNumber: '',
    supplierName: 'مورد الجملة (سوق بلفور)',
    date: new Date().toISOString().split('T')[0],
    itemsCount: '1',
    totalAmount: '',
    paidAmount: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.totalAmount) return;

    const total = Number(formData.totalAmount) || 0;
    const paid = Number(formData.paidAmount) || 0;
    const remaining = Math.max(0, total - paid);

    let status: 'مدفوع' | 'دفع جزئي' | 'غير مدفوع' = 'مدفوع';
    if (paid === 0) status = 'غير مدفوع';
    else if (remaining > 0) status = 'دفع جزئي';

    const newBill: PurchaseBill = {
      id: `pch-${Date.now()}`,
      billNumber: formData.billNumber.trim() || `BL-${Date.now().toString().slice(-4)}`,
      supplierName: formData.supplierName.trim(),
      date: formData.date,
      itemsCount: Number(formData.itemsCount) || 1,
      totalAmount: total,
      paidAmount: paid,
      remainingAmount: remaining,
      paymentStatus: status,
    };

    setPurchases([newBill, ...purchases]);
    setIsAddModalOpen(false);
    setFormData({
      billNumber: '',
      supplierName: 'مورد الجملة (سوق بلفور)',
      date: new Date().toISOString().split('T')[0],
      itemsCount: '1',
      totalAmount: '',
      paidAmount: '',
    });
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      setPurchases(purchases.filter((p) => p.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const filtered = purchases.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      q === '' ||
      p.billNumber.toLowerCase().includes(q) ||
      p.supplierName.toLowerCase().includes(q)
    );
  });

  return (
    <div id="purchases-view" className="space-y-5">
      <PageHeader
        title="المشتريات وفواتير التوريد"
        description="تسجيل فواتير الشراء وأوصال الاستلام (Bon de Livraison) من الموردين وتتبع الدفعات."
        breadcrumbCurrent="المشتريات"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={ShoppingBag}
        onPrint={() => setIsPrintPurchasesOpen(true)}
        printText="طباعة"
        primaryActionText="+ تسجيل فاتورة شراء"
        primaryActionIcon={Plus}
        onPrimaryAction={() => setIsAddModalOpen(true)}
      />

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث برقم الوصل أو اسم المورد..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
          />
        </div>
        <div className="text-xs text-slate-500 font-bold shrink-0">
          إجمالي الفواتير: <span className="text-emerald-700">{filtered.length}</span>
        </div>
      </div>

      {/* Table / Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="لا توجد فواتير شراء مسجلة بعد"
            description="سجل فواتير وصول السلع من الموردين لتغذية المخزون وتتبع الديون."
            actionText="+ تسجيل فاتورة شراء"
            actionIcon={Plus}
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">رقم وصل الشراء</th>
                  <th className="py-3 px-4">المورد</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">عدد المواد</th>
                  <th className="py-3 px-4">الإجمالي</th>
                  <th className="py-3 px-4">المدفوع</th>
                  <th className="py-3 px-4">المتبقي</th>
                  <th className="py-3 px-4">حالة الدفع</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {p.billNumber}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {p.supplierName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {p.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      {p.itemsCount} صنف
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {p.totalAmount.toLocaleString('fr-DZ')} {currency}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                      {p.paidAmount.toLocaleString('fr-DZ')} {currency}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-rose-600">
                      {p.remainingAmount.toLocaleString('fr-DZ')} {currency}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.paymentStatus} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setDeleteTargetId(p.id)}
                          title="حذف الفاتورة"
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

      {/* Add Bill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">تسجيل فاتورة شراء جديدة</h3>
                  <p className="text-[11px] text-slate-500">إدخال بيانات وصل استلام سلع من المورد</p>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رقم وصل الشراء (Bon N°)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: BL-2025-089"
                    value={formData.billNumber}
                    onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ الفاتورة</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المورد</label>
                <input
                  type="text"
                  required
                  placeholder="اسم المورد أو الشركة"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عدد المواد / السلع</label>
                <input
                  type="number"
                  min="1"
                  value={formData.itemsCount}
                  onChange={(e) => setFormData({ ...formData, itemsCount: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    إجمالي الفاتورة (د.ج) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="0"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    المبلغ المدفوع (د.ج)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono font-bold text-emerald-800"
                  />
                </div>
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
                  حفظ الفاتورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="تأكيد حذف فاتورة الشراء"
        message="هل أنت متأكد من رغبتك في حذف فاتورة الشراء هذه؟"
        confirmText="نعم، حذف"
        cancelText="إلغاء"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />

      {/* Purchases Invoices / Bills Print Layout Modal */}
      {isPrintPurchasesOpen && (
        <PrintLayout
          mode="modal"
          isOpen={isPrintPurchasesOpen}
          onClose={() => setIsPrintPurchasesOpen(false)}
          documentType="report"
          documentTitle="سجل فواتير المشتريات والتوريد (JOURNAL DES ACHATS)"
          documentSubtitle={`فرع: ${activeBranch || 'الفرع الرئيسي - قسنطينة'} • إجمالي فواتير التوريد: ${purchases.length} فاتورة`}
          documentNumber={`ACHATS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`}
          defaultPaperSize="a4"
          allowPaperSizeChange={true}
          totals={{
            subtotal: purchases.reduce((acc, curr) => acc + curr.totalAmount, 0),
            grandTotal: purchases.reduce((acc, curr) => acc + curr.totalAmount, 0),
            paidAmount: purchases.reduce((acc, curr) => acc + curr.paidAmount, 0),
            remainingAmount: purchases.reduce((acc, curr) => acc + curr.remainingAmount, 0),
          }}
          showSignatures={true}
          showStampBox={true}
          showBarcode={true}
          showAmountInWords={true}
          notes="سجل استلام بضائع وتوريدات معتمد للمحاسبة ومتابعة ديون الموردين."
        >
          <div className="space-y-4">
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">رقم الفاتورة / الوصل</th>
                    <th className="py-2.5 px-3">التاريخ</th>
                    <th className="py-2.5 px-3">المورد / تاجر الجملة</th>
                    <th className="py-2.5 px-3">حالة السداد</th>
                    <th className="py-2.5 px-3 text-left">المبلغ الإجمالي (د.ج)</th>
                    <th className="py-2.5 px-3 text-left">المتبقي (دين)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {purchases.length > 0 ? (
                    purchases.map((bill, idx) => (
                      <tr key={bill.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-950">
                          {bill.billNumber}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {bill.date}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {bill.supplierName}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[11px] font-bold">
                            {bill.paymentStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-950">
                          {bill.totalAmount.toLocaleString('fr-DZ')} د.ج
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold text-rose-700">
                          {bill.remainingAmount.toLocaleString('fr-DZ')} د.ج
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500 font-medium">
                        لا توجد فواتير شراء وتوريد مسجلة حتى الآن.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </PrintLayout>
      )}
    </div>
  );
};
