import React, { useState } from 'react';
import {
  FileCode,
  Search,
  Clock,
  Shield,
  User,
  Calendar,
  Filter,
  Monitor,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';

export type AuditActionType =
  | 'بيع'
  | 'تعديل سعر'
  | 'حذف'
  | 'فتح صندوق'
  | 'تعديل مخزون'
  | 'تسجيل دخول';

export interface AuditRecord {
  id: string;
  dateTime: string;
  user: string;
  actionType: AuditActionType;
  details: string;
  ipAndDevice: string;
}

interface AuditLogsViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ onNavigateTo }) => {
  // Empty initially as per requirement
  const [logs, setLogs] = useState<AuditRecord[]>([]);

  // Filters (حسب المستخدم، حسب نوع العملية، حسب التاريخ)
  const [searchUser, setSearchUser] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = logs.filter((l) => {
    const matchUser =
      searchUser === '' || l.user.toLowerCase().includes(searchUser.toLowerCase().trim());
    const matchAction = actionTypeFilter === 'all' || l.actionType === actionTypeFilter;
    const matchDate = dateFilter === '' || l.dateTime.startsWith(dateFilter);
    return matchUser && matchAction && matchDate;
  });

  return (
    <div id="audit-logs-view" className="space-y-5">
      <PageHeader
        title="سجل العمليات والرقابة (Audit Trail)"
        description="سجل الأمان والشفافية لجميع العمليات الحساسة (تعديل أسعار، حذف، فتح الصندوق، المبيعات)."
        breadcrumbCurrent="سجل العمليات (Audit Logs)"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={FileCode}
      />

      {/* Filters Bar: User, Action Type, Date */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* User Filter */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="تصفية حسب المستخدم..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
            />
          </div>

          {/* Action Type Filter */}
          <select
            value={actionTypeFilter}
            onChange={(e) => setActionTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">كل أنواع العمليات</option>
            <option value="بيع">عمليات البيع</option>
            <option value="تعديل سعر">تعديل الأسعار</option>
            <option value="حذف">عمليات الحذف</option>
            <option value="فتح صندوق">فتح الصندوق</option>
            <option value="تعديل مخزون">تعديل المخزون</option>
            <option value="تسجيل دخول">تسجيل الدخول</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 font-mono focus:outline-hidden"
          />
        </div>

        <div className="text-xs text-slate-500 font-bold shrink-0">
          إجمالي السجلات: <span className="text-emerald-700">{filtered.length}</span>
        </div>
      </div>

      {/* Table / Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="لا توجد سجلات نشاط مسجلة بعد"
            description="يتم تسجيل جميع العمليات الحساسة تلقائياً لضمان الشفافية والأمان."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">الوقت والتاريخ</th>
                  <th className="py-3 px-4">المستخدم</th>
                  <th className="py-3 px-4">نوع العملية</th>
                  <th className="py-3 px-4">التفاصيل</th>
                  <th className="py-3 px-4">عنوان IP / الجهاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600">{log.dateTime}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{log.user}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-800 text-[11px]">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800">{log.details}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{log.ipAndDevice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
