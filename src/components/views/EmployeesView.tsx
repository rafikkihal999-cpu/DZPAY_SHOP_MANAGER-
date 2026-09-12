import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Phone,
  Banknote,
  Briefcase,
  Calendar,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export interface EmployeeRecord {
  id: string;
  name: string;
  role: 'بائع' | 'كاشير' | 'فني صيانة' | 'مدير فرع';
  phone: string;
  baseSalary: number;
  commissionRate: number;
  hireDate: string;
  status: 'نشط' | 'متوقف';
}

export interface PayrollRecord {
  id: string;
  employeeName: string;
  month: string;
  baseSalary: number;
  commissionsAndBonus: number;
  deductions: number;
  netSalary: number;
  disbursementStatus: 'مصروف' | 'معلق';
  disbursementDate: string;
}

interface EmployeesViewProps {
  onNavigateTo: (sectionId: string) => void;
  defaultTab?: 'employees' | 'payroll';
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  onNavigateTo,
  defaultTab = 'employees',
}) => {
  const { currency } = useAuth();
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll'>(defaultTab);

  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isAddPayrollModalOpen, setIsAddPayrollModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Forms
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    role: 'بائع' as EmployeeRecord['role'],
    phone: '',
    baseSalary: '45000',
    commissionRate: '2',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'نشط' as 'نشط' | 'متوقف',
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeName: '',
    month: 'مايو 2025',
    baseSalary: '45000',
    commissionsAndBonus: '5000',
    deductions: '0',
    disbursementStatus: 'معلق' as 'مصروف' | 'معلق',
    disbursementDate: new Date().toISOString().split('T')[0],
  });

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.name.trim() || !employeeForm.phone.trim()) return;

    const newEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      name: employeeForm.name.trim(),
      role: employeeForm.role,
      phone: employeeForm.phone.trim(),
      baseSalary: Number(employeeForm.baseSalary) || 0,
      commissionRate: Number(employeeForm.commissionRate) || 0,
      hireDate: employeeForm.hireDate,
      status: employeeForm.status,
    };

    setEmployees([newEmp, ...employees]);
    setIsAddEmployeeModalOpen(false);
    setEmployeeForm({
      name: '',
      role: 'بائع',
      phone: '',
      baseSalary: '45000',
      commissionRate: '2',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'نشط',
    });
  };

  const handleAddPayroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payrollForm.employeeName.trim()) return;

    const base = Number(payrollForm.baseSalary) || 0;
    const bonus = Number(payrollForm.commissionsAndBonus) || 0;
    const ded = Number(payrollForm.deductions) || 0;
    const net = base + bonus - ded;

    const newPay: PayrollRecord = {
      id: `pay-${Date.now()}`,
      employeeName: payrollForm.employeeName.trim(),
      month: payrollForm.month,
      baseSalary: base,
      commissionsAndBonus: bonus,
      deductions: ded,
      netSalary: net,
      disbursementStatus: payrollForm.disbursementStatus,
      disbursementDate: payrollForm.disbursementDate,
    };

    setPayrolls([newPay, ...payrolls]);
    setIsAddPayrollModalOpen(false);
    setPayrollForm({
      employeeName: '',
      month: 'مايو 2025',
      baseSalary: '45000',
      commissionsAndBonus: '5000',
      deductions: '0',
      disbursementStatus: 'معلق',
      disbursementDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      setEmployees(employees.filter((e) => e.id !== deleteTargetId));
      setPayrolls(payrolls.filter((p) => p.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const filteredEmployees = employees.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = q === '' || e.name.toLowerCase().includes(q) || e.phone.includes(q);
    const matchRole = roleFilter === 'all' || e.role === roleFilter;
    return matchSearch && matchRole;
  });

  const filteredPayrolls = payrolls.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return q === '' || p.employeeName.toLowerCase().includes(q) || p.month.includes(q);
  });

  return (
    <div id="employees-view" className="space-y-5">
      <PageHeader
        title="الموظفون ومسير الرواتب"
        description="إدارة فريق عمل المحل، تتبع العمولات على المبيعات، ومسير الأجور الشهرية."
        breadcrumbCurrent="الموظفون والرواتب"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={UserCheck}
        primaryActionText={activeTab === 'employees' ? "+ إضافة موظف جديد" : "+ إنشاء مسير راتب"}
        primaryActionIcon={Plus}
        onPrimaryAction={() =>
          activeTab === 'employees'
            ? setIsAddEmployeeModalOpen(true)
            : setIsAddPayrollModalOpen(true)
        }
      />

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'employees'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          فريق العمل والموظفين
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            activeTab === 'payroll'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          مسير الرواتب والأجور (Fiche de Paie)
        </button>
      </div>

      {activeTab === 'employees' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="بحث باسم الموظف أو الهاتف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
              >
                <option value="all">كل المسميات الوظيفية</option>
                <option value="بائع">بائع</option>
                <option value="كاشير">كاشير</option>
                <option value="فني صيانة">فني صيانة</option>
                <option value="مدير فرع">مدير فرع</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-bold shrink-0">
              إجمالي الموظفين: <span className="text-emerald-700">{filteredEmployees.length}</span>
            </div>
          </div>

          {/* Employees Table / Empty State */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredEmployees.length === 0 ? (
              <EmptyState
                icon={UserCheck}
                title="لا يوجد موظفون مسجلون بعد"
                description="أضف أفراد طاقم العمل، وحدد صلاحياتهم ونسب عمولاتهم."
                actionText="+ إضافة أول موظف"
                actionIcon={Plus}
                onAction={() => setIsAddEmployeeModalOpen(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3 px-4">اسم الموظف</th>
                      <th className="py-3 px-4">المسمى الوظيفي</th>
                      <th className="py-3 px-4">رقم الهاتف</th>
                      <th className="py-3 px-4">الراتب الأساسي</th>
                      <th className="py-3 px-4">العمولة / النسبة</th>
                      <th className="py-3 px-4">تاريخ التوظيف</th>
                      <th className="py-3 px-4">الحالة</th>
                      <th className="py-3 px-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{emp.name}</td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-800 text-[11px]">
                            {emp.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-800">{emp.phone}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {emp.baseSalary.toLocaleString('fr-DZ')} {currency}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700">
                          {emp.commissionRate}%
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{emp.hireDate}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={emp.status} />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setDeleteTargetId(emp.id)}
                            title="حذف الموظف"
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
        /* Payroll Table / Empty State */
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث باسم الموظف أو الشهر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
              />
            </div>
            <div className="text-xs text-slate-500 font-bold shrink-0">
              إجمالي المسيرات: <span className="text-emerald-700">{filteredPayrolls.length}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredPayrolls.length === 0 ? (
              <EmptyState
                icon={Banknote}
                title="لا يوجد مسير رواتب مسجل بعد"
                description="أنشئ كشوف الرواتب الشهرية لاحتساب الأجور، العمولات، والخصومات بدقة."
                actionText="+ إنشاء مسير راتب"
                actionIcon={Plus}
                onAction={() => setIsAddPayrollModalOpen(true)}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3 px-4">الموظف</th>
                      <th className="py-3 px-4">الشهر</th>
                      <th className="py-3 px-4">الراتب الأساسي</th>
                      <th className="py-3 px-4">العمولات والمكافآت</th>
                      <th className="py-3 px-4">الخصومات</th>
                      <th className="py-3 px-4">الصافي</th>
                      <th className="py-3 px-4">حالة الصرف</th>
                      <th className="py-3 px-4">تاريخ الصرف</th>
                      <th className="py-3 px-4 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredPayrolls.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{p.employeeName}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{p.month}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                          {p.baseSalary.toLocaleString('fr-DZ')} {currency}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                          +{p.commissionsAndBonus.toLocaleString('fr-DZ')} {currency}
                        </td>
                        <td className="py-3 px-4 font-mono text-rose-600 font-bold">
                          -{p.deductions.toLocaleString('fr-DZ')} {currency}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-slate-900 text-sm">
                          {p.netSalary.toLocaleString('fr-DZ')} {currency}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={p.disbursementStatus} />
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {p.disbursementDate}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setDeleteTargetId(p.id)}
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
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">إضافة موظف جديد</h3>
                  <p className="text-[11px] text-slate-500">سجل بيانات العامل، منصبه، والراتب المتفق عليه</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEmployeeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم الموظف الكامل <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: حسام الدين بوقرة"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المسمى الوظيفي</label>
                  <select
                    value={employeeForm.role}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, role: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="بائع">بائع</option>
                    <option value="كاشير">كاشير</option>
                    <option value="فني صيانة">فني صيانة</option>
                    <option value="مدير فرع">مدير فرع</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    رقم الهاتف <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07 ..."
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    الراتب الأساسي (د.ج)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={employeeForm.baseSalary}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, baseSalary: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نسبة العمولة (%)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={employeeForm.commissionRate}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, commissionRate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ التوظيف</label>
                  <input
                    type="date"
                    value={employeeForm.hireDate}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, hireDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الحالة</label>
                  <select
                    value={employeeForm.status}
                    onChange={(e) =>
                      setEmployeeForm({ ...employeeForm, status: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="نشط">نشط</option>
                    <option value="متوقف">متوقف</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs"
                >
                  حفظ الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payroll Modal */}
      {isAddPayrollModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">إنشاء مسير راتب شهري</h3>
                  <p className="text-[11px] text-slate-500">حساب مستحقات الشهر والاقتطاعات</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddPayrollModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPayroll} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم الموظف</label>
                <input
                  type="text"
                  required
                  placeholder="اسم الموظف"
                  value={payrollForm.employeeName}
                  onChange={(e) => setPayrollForm({ ...payrollForm, employeeName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">شهر الاستحقاق</label>
                  <input
                    type="text"
                    value={payrollForm.month}
                    onChange={(e) => setPayrollForm({ ...payrollForm, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الراتب الأساسي (د.ج)</label>
                  <input
                    type="number"
                    value={payrollForm.baseSalary}
                    onChange={(e) => setPayrollForm({ ...payrollForm, baseSalary: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">العمولات والمكافآت (د.ج)</label>
                  <input
                    type="number"
                    value={payrollForm.commissionsAndBonus}
                    onChange={(e) =>
                      setPayrollForm({ ...payrollForm, commissionsAndBonus: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-emerald-700 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الخصومات (د.ج)</label>
                  <input
                    type="number"
                    value={payrollForm.deductions}
                    onChange={(e) =>
                      setPayrollForm({ ...payrollForm, deductions: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">حالة الصرف</label>
                  <select
                    value={payrollForm.disbursementStatus}
                    onChange={(e) =>
                      setPayrollForm({ ...payrollForm, disbursementStatus: e.target.value as any })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="معلق">معلق</option>
                    <option value="مصروف">مصروف</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ الصرف</label>
                  <input
                    type="date"
                    value={payrollForm.disbursementDate}
                    onChange={(e) =>
                      setPayrollForm({ ...payrollForm, disbursementDate: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPayrollModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs"
                >
                  حفظ مسير الراتب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="تأكيد الحذف"
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
