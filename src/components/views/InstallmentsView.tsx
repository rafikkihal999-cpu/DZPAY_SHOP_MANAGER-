import React, { useState } from 'react';
import {
  CalendarClock,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  FileSpreadsheet,
  Clock,
  Printer,
  X,
  CreditCard,
  Banknote,
  Send,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';

export interface InstallmentRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  invoiceRef: string;
  totalDebt: number;
  paidAmount: number;
  remainingAmount: number;
  nextDueDate: string;
  status: 'نشط' | 'متأخر' | 'مسدد';
}

interface InstallmentsViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const InstallmentsView: React.FC<InstallmentsViewProps> = ({ onNavigateTo }) => {
  const { currency } = useAuth();

  // State: records (empty by default as per rule)
  const [records, setRecords] = useState<InstallmentRecord[]>([]);

  // Sub-views / filters
  const [activeFilter, setActiveFilter] = useState<'all' | 'due' | 'overdue' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment Recording Modal
  const [selectedRecordForPayment, setSelectedRecordForPayment] = useState<InstallmentRecord | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'cash' | 'baridimob' | 'ccp'>('cash');

  // Account Statement Modal
  const [statementRecord, setStatementRecord] = useState<InstallmentRecord | null>(null);

  // Filter logic
  const filtered = records.filter((r) => {
    let matchFilter = true;
    if (activeFilter === 'due') matchFilter = r.status === 'نشط';
    if (activeFilter === 'overdue') matchFilter = r.status === 'متأخر';
    if (activeFilter === 'completed') matchFilter = r.status === 'مسدد';

    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      q === '' ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      r.invoiceRef.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  // KPI Calculations
  const totalOutstandingDebt = records
    .filter((r) => r.status !== 'مسدد')
    .reduce((acc, r) => acc + r.remainingAmount, 0);

  const totalOverdueDebt = records
    .filter((r) => r.status === 'متأخر')
    .reduce((acc, r) => acc + r.remainingAmount, 0);

  const totalCollectedThisMonth = records
    .reduce((acc, r) => acc + r.paidAmount, 0);

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForPayment || !payAmount) return;

    const amt = Number(payAmount);
    if (amt <= 0) return;

    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === selectedRecordForPayment.id) {
          const newRemaining = Math.max(0, r.remainingAmount - amt);
          const newPaid = r.paidAmount + amt;
          const newStatus: 'نشط' | 'متأخر' | 'مسدد' = newRemaining === 0 ? 'مسدد' : r.status;
          return {
            ...r,
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            status: newStatus,
          };
        }
        return r;
      })
    );

    setSelectedRecordForPayment(null);
    setPayAmount('');
  };

  return (
    <div id="installments-view" className="space-y-5">
      <PageHeader
        title="الديون والأقساط الشهرية"
        description="متابعة ديون الزبائن، جدول الأقساط، التواريخ المستحقة، وتحصيل الدفعات."
        breadcrumbCurrent="الديون والأقساط"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={CalendarClock}
        primaryActionText="+ بيع بالتقسيط (POS)"
        primaryActionIcon={Plus}
        onPrimaryAction={() => onNavigateTo('pos')}
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="إجمالي الديون المستحقة"
          value={`${totalOutstandingDebt.toLocaleString('fr-DZ')} ${currency}`}
          helperText="مجموع المبالغ المتبقية في ذمة الزبائن"
          icon={CreditCard}
          iconColor="text-blue-700"
        />
        <StatCard
          label="ديون متأخرة عن السداد"
          value={`${totalOverdueDebt.toLocaleString('fr-DZ')} ${currency}`}
          helperText="أقساط تجاوزت تاريخ الاستحقاق"
          icon={AlertTriangle}
          iconColor="text-rose-700"
        />
        <StatCard
          label="مبالغ محصلة هذا الشهر"
          value={`${totalCollectedThisMonth.toLocaleString('fr-DZ')} ${currency}`}
          helperText="إجمالي الدفعات المسددة من الأقساط"
          icon={CheckCircle2}
          iconColor="text-emerald-700"
        />
      </div>

      {/* Sub-views / Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-view filter tabs */}
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFilter === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setActiveFilter('due')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFilter === 'due'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ديون مستحقة (نشطة)
          </button>
          <button
            onClick={() => setActiveFilter('overdue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFilter === 'overdue'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ديون متأخرة
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeFilter === 'completed'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            مسددة بالكامل
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث باسم العميل، الهاتف، أو الفاتورة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
          />
        </div>
      </div>

      {/* Table / Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="لا توجد ديون أو أقساط مسجلة بعد"
            description="ستظهر هنا بعد إجراء مبيعات بالتقسيط أو بالآجل."
            actionText="الذهاب لنقطة البيع (POS)"
            actionIcon={Plus}
            onAction={() => onNavigateTo('pos')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">العميل</th>
                  <th className="py-3 px-4">الهاتف</th>
                  <th className="py-3 px-4">الفاتورة / العملية</th>
                  <th className="py-3 px-4">إجمالي الدين</th>
                  <th className="py-3 px-4">المدفوع</th>
                  <th className="py-3 px-4">المتبقي</th>
                  <th className="py-3 px-4">تاريخ الاستحقاق القادم</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {item.customerName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      {item.customerPhone}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {item.invoiceRef}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {item.totalDebt.toLocaleString('fr-DZ')} {currency}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                      {item.paidAmount.toLocaleString('fr-DZ')} {currency}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-rose-600">
                      {item.remainingAmount.toLocaleString('fr-DZ')} {currency}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {item.nextDueDate}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {item.remainingAmount > 0 && (
                          <button
                            onClick={() => {
                              setSelectedRecordForPayment(item);
                              setPayAmount(String(item.remainingAmount));
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-800 transition-colors inline-flex items-center gap-1"
                          >
                            <Banknote className="w-3 h-3" />
                            <span>تسجيل دفعة</span>
                          </button>
                        )}
                        <button
                          onClick={() => setStatementRecord(item)}
                          title="كشف حساب العميل"
                          className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
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

      {/* Record Payment Modal */}
      {selectedRecordForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">تسجيل دفعة قسط / سداد دين</h3>
                  <p className="text-[11px] text-slate-500">{selectedRecordForPayment.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecordForPayment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>المبلغ الإجمالي للدين:</span>
                  <span className="font-bold">{selectedRecordForPayment.totalDebt.toLocaleString('fr-DZ')} {currency}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>المبلغ المتبقي الحالي:</span>
                  <span>{selectedRecordForPayment.remainingAmount.toLocaleString('fr-DZ')} {currency}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  المبلغ المسدد الآن (د.ج) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  max={selectedRecordForPayment.remainingAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-emerald-400 font-bold text-emerald-800 text-base font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">طريقة الدفع</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('cash')}
                    className={`py-2 rounded-xl font-bold border text-center transition-colors ${
                      payMethod === 'cash'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    نقداً (Cash)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('baridimob')}
                    className={`py-2 rounded-xl font-bold border text-center transition-colors ${
                      payMethod === 'baridimob'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    BaridiMob
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('ccp')}
                    className={`py-2 rounded-xl font-bold border text-center transition-colors ${
                      payMethod === 'ccp'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    CCP
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecordForPayment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs"
                >
                  تأكيد استلام الدفعة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Statement Modal */}
      {statementRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">كشف حساب دين (Relevé de Crédit)</h4>
              <button onClick={() => setStatementRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-600">العميل:</span>
                <span className="font-bold text-slate-900">{statementRecord.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">الهاتف:</span>
                <span className="font-mono text-slate-800">{statementRecord.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">رقم الوصل:</span>
                <span className="font-mono text-slate-800">{statementRecord.invoiceRef}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-600">المبلغ الإجمالي:</span>
                <span className="font-bold">{statementRecord.totalDebt.toLocaleString('fr-DZ')} {currency}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>المسدد حتى الآن:</span>
                <span>{statementRecord.paidAmount.toLocaleString('fr-DZ')} {currency}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-black pt-1 border-t border-slate-200">
                <span>المتبقي في الذمة:</span>
                <span>{statementRecord.remainingAmount.toLocaleString('fr-DZ')} {currency}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStatementRecord(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  window.print();
                  setStatementRecord(null);
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة الكشف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
