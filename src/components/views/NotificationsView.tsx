import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  CalendarClock,
  Package,
  CreditCard,
  CheckCircle2,
  Info,
  Trash2,
  Filter,
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';

export interface NotificationItem {
  id: string;
  type: 'stock' | 'debt' | 'expense' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  severity: 'low' | 'medium' | 'high';
}

interface NotificationsViewProps {
  onNavigateTo: (sectionId: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onNavigateTo }) => {
  // Empty by default as per rule "NO fake data", or ready for real notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'stock' | 'debt' | 'expense' | 'system'>('all');

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filtered = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div id="notifications-view" className="space-y-5">
      <PageHeader
        title="مركز الإشعارات والتنبيهات"
        description="تنبيهات انخفاض المخزون، مواعيد استحقاق أقساط الزبائن، والالتزامات المالية."
        breadcrumbCurrent="الإشعارات والتنبيهات"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={Bell}
        secondaryActionText={notifications.length > 0 ? "تحديد الكل كمقروء" : undefined}
        secondaryActionIcon={CheckCheck}
        onSecondaryAction={handleMarkAllAsRead}
      />

      {/* Filter Tabs & Quick Actions */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل {notifications.length > 0 && `(${notifications.length})`}
          </button>
          <button
            onClick={() => setFilterType('stock')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'stock'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            تنبيهات المخزون
          </button>
          <button
            onClick={() => setFilterType('debt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'debt'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الديون والأقساط
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'expense'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            المصاريف الدورية
          </button>
          <button
            onClick={() => setFilterType('system')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'system'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            تنبيهات النظام والمعاملات
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>تحديد الكل كمقروء</span>
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح الكل</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications List / Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="لا توجد إشعارات جديدة"
            description="كل شيء على ما يرام! ستظهر التنبيهات المهمة هنا."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-start justify-between gap-3 transition-colors ${
                  item.isRead ? 'bg-white' : 'bg-emerald-50/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'stock'
                        ? 'bg-amber-100 text-amber-800'
                        : item.type === 'debt'
                        ? 'bg-rose-100 text-rose-800'
                        : item.type === 'expense'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.type === 'stock' && <Package className="w-4 h-4" />}
                    {item.type === 'debt' && <CalendarClock className="w-4 h-4" />}
                    {item.type === 'expense' && <CreditCard className="w-4 h-4" />}
                    {item.type === 'system' && <Info className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{item.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    setNotifications((prev) => prev.filter((n) => n.id !== item.id))
                  }
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
