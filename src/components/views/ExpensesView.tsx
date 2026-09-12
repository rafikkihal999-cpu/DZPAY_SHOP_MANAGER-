import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Calendar,
  Tag,
  Trash2,
  Receipt,
  Repeat,
  X,
  Building,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export interface ExpenseRecord {
  id: string;
  date: string;
  category: string;
  amount: number;
  paymentMethod: 'نقداً' | 'بريدي موب' | 'حساب بنكي';
  description: string;
  responsibleEmployee: string;
}

export interface RecurringExpenseRecord {
  id: string;
  name: string;
  amount: number;
  frequency: 'شهري' | 'سنوي';
  nextDueDate: string;
  status: 'نشط' | 'متوقف';
}

const EXPENSE_CATEGORIES = [
  'إيجار',
  'كهرباء',
  'إنترنت',
  'نقل',
  'ضيافة',
  'صيانة',
  'أخرى',
];

interface ExpensesViewProps {
  onNavigateTo: (sectionId: string) => void;
  defaultTab?: 'daily' | 'recurring';
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ onNavigateTo, defaultTab = 'daily' }) => {
  const { currency } = useAuth();
  const [activeTab, setActiveTab] = useState<'daily' | 'recurring'>(defaultTab);

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpenseRecord[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddRecurringModalOpen, setIsAddRecurringModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form for Daily Expense
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'إيجار',
    amount: '',
    paymentMethod: 'نقداً' as 'نقداً' | 'بريدي موب' | 'حساب بنكي',
    description: '',
    responsibleEmployee: 'يوسف أحمد',
  });

  // Form for Recurring Expense
  const [recurringForm, setRecurringForm] = useState({
    name: '',
    amount: '',
    frequency: 'شهري' as 'شهري' | 'سنوي',
    nextDueDate: new Date().toISOString().split('T')[0],
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount) return;

    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: formData.date,
      category: formData.category,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      description: formData.description.trim(),
      responsibleEmployee: formData.responsibleEmployee.trim(),
    };

    setExpenses([newExp, ...expenses]);
    setIsAddModalOpen(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: 'إيجار',
      amount: '',
      paymentMethod: 'نقداً',
      description: '',
      responsibleEmployee: 'يوسف أحمد',
    });
  };

  const handleAddRecurring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recurringForm.name.trim() || !recurringForm.amount) return;

    const newRec: RecurringExpenseRecord = {
      id: `rec-${Date.now()}`,
      name: recurringForm.name.trim(),
      amount: Number(recurringForm.amount),
      frequency: recurringForm.frequency,
      nextDueDate: recurringForm.nextDueDate,
      status: 'نشط',
    };

    setRecurringExpenses([newRec, ...recurringExpenses]);
    setIsAddRecurringModalOpen(false);
    setRecurringForm({
      name: '',
      amount: '',
      frequency: 'شهري',
      nextDueDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      setExpenses(expenses.filter((e) => e.id !== deleteTargetId));
      setRecurringExpenses(recurringExpenses.filter((r) => r.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchCat = selectedCat === 'all' || e.category === selectedCat;
    const q = searchQuery.toLowerCase().trim();
    const matchQ =
      q === '' ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.responsibleEmployee.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div id="expenses-view" className="space-y-5">
      <PageHeader
        title="المصاريف والنفقات"
        description="تسجيل المصاريف اليومية للنشاط (إيجار، فواتير، نقل) وإدارة الالتزامات الدورية."
        breadcrumbCurrent="المصاريف والنفقات"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={CreditCard}
        primaryActionText={activeTab === 'daily' ? "+ تسجيل مصروف جديد" : "+ إضافة التزام دوري"}
        primaryActionIcon={Plus}
        onPrimaryAction={() => activeTab === 'daily' ? setIsAddModalOpen(true) : setIsAddRecurringModalOpen(true)}
      />

      {/* Tabs Switcher */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'daily'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          المصاريف اليومية
        </button>
        <button
          onClick={() => setActiveTab('recurring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'recurring'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          المصاريف والالتزامات الدورية (Recurring)
        </button>
      </div>

      {activeTab === 'daily' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="بحث في البيان أو الموظف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
                />
              </div>

              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="all">كل التصنيفات</option>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-slate-500 font-bold shrink-0">
              المجموع: <span className="text-emerald-700">{filteredExpenses.reduce((a, b) => a + b.amount, 0).toLocaleString('fr-DZ')} {currency}</span>
            </div>
          </div>

          {/* Daily Table / Empty State */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredExpenses.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="لا توجد مصاريف مسجلة بعد"
                description="سجل فواتير المحل والنثريات لمتابعة التكاليف وصافي الأرباح بدقة."
                actionText="+ تسجيل أول مصروف"
                actionIcon={Plus}
                onAction={() => setIsAddModalOpen(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3 px-4">التاريخ</th>
                      <th className="py-3 px-4">التصنيف</th>
                      <th className="py-3 px-4">المبلغ</th>
                      <th className="py-3 px-4">طريقة الدفع</th>
                      <th className="py-3 px-4">البيان</th>
                      <th className="py-3 px-4">الموظف المسؤول</th>
                      <th className="py-3 px-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-600">{exp.date}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-800">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-600">
                          {exp.amount.toLocaleString('fr-DZ')} {currency}
                        </td>
                        <td className="py-3 px-4 text-slate-700">{exp.paymentMethod}</td>
                        <td className="py-3 px-4 text-slate-800 font-medium">{exp.description}</td>
                        <td className="py-3 px-4 text-slate-600">{exp.responsibleEmployee}</td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setDeleteTargetId(exp.id)}
                            title="حذف المصروف"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Recurring Table / Empty State */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {recurringExpenses.length === 0 ? (
            <EmptyState
              icon={Repeat}
              title="لا توجد مصاريف دورية مسجلة بعد"
              description="أضف التزامات المحل الشهرية أو السنوية كإيجار المحل واشتراك الإنترنت للتذكير بمواعيد الاستحقاق."
              actionText="+ إضافة التزام دوري"
              actionIcon={Plus}
              onAction={() => setIsAddRecurringModalOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">اسم المصروف</th>
                    <th className="py-3 px-4">المبلغ</th>
                    <th className="py-3 px-4">التكرار</th>
                    <th className="py-3 px-4">تاريخ الاستحقاق القادم</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recurringExpenses.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                      <td className="py-3 px-4 font-mono font-bold text-rose-600">
                        {r.amount.toLocaleString('fr-DZ')} {currency}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{r.frequency}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{r.nextDueDate}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setDeleteTargetId(r.id)}
                          title="حذف"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">تسجيل مصروف جديد</h3>
                  <p className="text-[11px] text-slate-500">سجل بيانات وتفاصيل النفقة والمبلغ</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التاريخ</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التصنيف</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    المبلغ (د.ج) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">طريقة الدفع</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="نقداً">نقداً (من الدرج)</option>
                    <option value="بريدي موب">بريدي موب</option>
                    <option value="حساب بنكي">حساب بنكي / صك</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  البيان / الوصف <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فاتورة كهرباء شهر مايو"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الموظف المسؤول</label>
                <input
                  type="text"
                  value={formData.responsibleEmployee}
                  onChange={(e) => setFormData({ ...formData, responsibleEmployee: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
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
                  تسجيل المصروف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Recurring Modal */}
      {isAddRecurringModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">إضافة التزام دوري</h3>
                  <p className="text-[11px] text-slate-500">مصاريف تتكرر شهرياً أو سنوياً</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddRecurringModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecurring} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المصروف</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: إيجار المحل أو اشتراك الإنترنت"
                  value={recurringForm.name}
                  onChange={(e) => setRecurringForm({ ...recurringForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المبلغ (د.ج)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="0"
                    value={recurringForm.amount}
                    onChange={(e) => setRecurringForm({ ...recurringForm, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التكرار</label>
                  <select
                    value={recurringForm.frequency}
                    onChange={(e) => setRecurringForm({ ...recurringForm, frequency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="شهري">شهري</option>
                    <option value="سنوي">سنوي</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">تاريخ الاستحقاق القادم</label>
                <input
                  type="date"
                  value={recurringForm.nextDueDate}
                  onChange={(e) => setRecurringForm({ ...recurringForm, nextDueDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddRecurringModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs"
                >
                  حفظ الالتزام الدوري
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="تأكيد حذف المصروف"
        message="هل أنت متأكد من رغبتك في حذف هذا السجل؟"
        confirmText="نعم، حذف"
        cancelText="إلغاء"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
