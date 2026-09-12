import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Lock,
  User,
  CheckCircle2,
  X,
  KeyRound,
  Trash2,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { ConfirmDialog } from '../common/ConfirmDialog';

export type UserRole =
  | 'مدير النظام (Admin / Propriétaire)'
  | 'مسؤول مبيعات (Vendeur)'
  | 'كاشير (Caissier)'
  | 'فني صيانة (Technicien)';

export interface AppUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  branch: string;
  status: 'نشط' | 'معطل';
  lastLogin: string;
}

// 9 Permissions specified by user requirements
const SYSTEM_PERMISSIONS = [
  'الوصول للـ POS',
  'تعديل الأسعار',
  'منح تخفيض',
  'بيع بالدين',
  'فتح الصندوق',
  'تعديل المخزون',
  'عرض الأرباح',
  'عرض التقارير',
  'إدارة المستخدمين',
];

const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'مدير النظام (Admin / Propriétaire)': [
    'الوصول للـ POS',
    'تعديل الأسعار',
    'منح تخفيض',
    'بيع بالدين',
    'فتح الصندوق',
    'تعديل المخزون',
    'عرض الأرباح',
    'عرض التقارير',
    'إدارة المستخدمين',
  ],
  'مسؤول مبيعات (Vendeur)': [
    'الوصول للـ POS',
    'منح تخفيض',
    'بيع بالدين',
    'تعديل المخزون',
  ],
  'كاشير (Caissier)': [
    'الوصول للـ POS',
    'فتح الصندوق',
  ],
  'فني صيانة (Technicien)': [
    'الوصول للـ POS',
  ],
};

interface UsersPermissionsViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const UsersPermissionsView: React.FC<UsersPermissionsViewProps> = ({ onNavigateTo }) => {
  const { activeBranch } = useAuth();

  const [users, setUsers] = useState<AppUser[]>([
    {
      id: 'u-admin',
      name: 'رفيق كيحل (المدير العام)',
      username: 'admin',
      role: 'مدير النظام (Admin / Propriétaire)',
      branch: 'الفرع الرئيسي - قسنطينة (وجميع الفروع)',
      status: 'نشط',
      lastLogin: 'منذ لحظات',
    },
  ]);

  const [selectedRoleForMatrix, setSelectedRoleForMatrix] =
    useState<UserRole>('مدير النظام (Admin / Propriétaire)');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'كاشير (Caissier)' as UserRole,
    password: '',
    branch: activeBranch || 'الفرع الرئيسي - قسنطينة',
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim()) return;

    const newUser: AppUser = {
      id: `u-${Date.now()}`,
      name: formData.name.trim(),
      username: formData.username.toLowerCase().trim(),
      role: formData.role,
      branch: formData.branch,
      status: 'نشط',
      lastLogin: 'لم يسجل دخول بعد',
    };

    setUsers([...users, newUser]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      username: '',
      role: 'كاشير (Caissier)',
      password: '',
      branch: activeBranch || 'الفرع الرئيسي',
    });
  };

  const handleDelete = () => {
    if (deleteTargetId) {
      setUsers(users.filter((u) => u.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  return (
    <div id="users-permissions-view" className="space-y-5">
      <PageHeader
        title="المستخدمون والصلاحيات"
        description="إدارة حسابات الدخول، تعيين الأدوار (Admin، بائع، كاشير، تقني)، وضبط مصفوفة الصلاحيات."
        breadcrumbCurrent="المستخدمون والصلاحيات"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={ShieldCheck}
        primaryActionText="+ إضافة مستخدم جديد"
        primaryActionIcon={Plus}
        onPrimaryAction={() => setIsAddModalOpen(true)}
      />

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900">قائمة مستخدمي النظام</h3>
            <p className="text-[11px] text-slate-500">حسابات تسجيل الدخول إلى المحل</p>
          </div>
          <span className="text-xs text-slate-500 font-bold">{users.length} مستخدم</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">الاسم</th>
                <th className="py-3 px-4">اسم المستخدم</th>
                <th className="py-3 px-4">الدور</th>
                <th className="py-3 px-4">الفرع</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">آخر تسجيل دخول</th>
                <th className="py-3 px-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3 px-4 font-mono text-slate-800">{u.username}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-800 text-[11px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{u.branch}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{u.lastLogin}</td>
                  <td className="py-3 px-4 text-center">
                    {u.username !== 'admin' && (
                      <button
                        onClick={() => setDeleteTargetId(u.id)}
                        title="حذف المستخدم"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Checklist per Role */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>مصفوفة الصلاحيات حسب الدور (Permissions Checklist)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              تحديد الإجراءات المسموح بها لكل دور وظيفي في التطبيق
            </p>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {(
              [
                'مدير النظام (Admin / Propriétaire)',
                'مسؤول مبيعات (Vendeur)',
                'كاشير (Caissier)',
                'فني صيانة (Technicien)',
              ] as UserRole[]
            ).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRoleForMatrix(role)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  selectedRoleForMatrix === role
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {role.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Permissions Grid (9 Permissions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {SYSTEM_PERMISSIONS.map((perm) => {
            const hasPerm = DEFAULT_ROLE_PERMISSIONS[selectedRoleForMatrix]?.includes(perm);
            return (
              <div
                key={perm}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  hasPerm
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-900'
                    : 'bg-slate-50/60 border-slate-200 text-slate-400'
                }`}
              >
                <span className="text-xs font-bold">{perm}</span>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center ${
                    hasPerm ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">إضافة مستخدم جديد</h3>
                  <p className="text-[11px] text-slate-500">إنشاء حساب دخول جديد لطاقم العمل</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الاسم الكامل <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فاروق بلمهدي"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  اسم المستخدم (Login Username) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: farouk_pos"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  الدور الوظيفي <span className="text-rose-600">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                >
                  <option value="مدير النظام (Admin / Propriétaire)">
                    مدير النظام (Admin / Propriétaire)
                  </option>
                  <option value="مسؤول مبيعات (Vendeur)">مسؤول مبيعات (Vendeur)</option>
                  <option value="كاشير (Caissier)">كاشير (Caissier)</option>
                  <option value="فني صيانة (Technicien)">فني صيانة (Technicien)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  كلمة المرور المؤقتة
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
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
                  إنشاء الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="تأكيد حذف المستخدم"
        message="هل أنت متأكد من رغبتك في حذف هذا الحساب؟ لن يتمكن المستخدم من تسجيل الدخول مجدداً."
        confirmText="نعم، حذف الحساب"
        cancelText="إلغاء"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
