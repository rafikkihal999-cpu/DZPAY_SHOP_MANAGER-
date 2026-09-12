import React, { useState } from 'react';
import { X, Bell, CheckCircle, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (sectionId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onNavigateTo,
}) => {
  const [filter, setFilter] = useState<'all' | 'system' | 'alerts'>('all');

  if (!isOpen) return null;

  return (
    <div
      id="notifications-modal-container"
      className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-slate-900/40 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="notifications-modal-panel"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] mt-12 animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">التنبيهات والإشعارات</h3>
              <p className="text-[11px] text-slate-500">مركز مراقبة عمليات المحل ونظام DZPAY</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-100 flex gap-2 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              filter === 'system'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            حالة النظام
          </button>
          <button
            onClick={() => setFilter('alerts')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              filter === 'alerts'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            المخزون والديون
          </button>
        </div>

        {/* List of Notification Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Notification 1: System Readiness */}
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-800">واجهة DZPAY SHOP جاهزة</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                تم تهيئة واجهة إدارة المحل بـ 21 قسماً مخصصاً لمحلات الهواتف والإكسسوارات وخدمات الفليكسي في الجزائر.
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                النظام في وضع الاستعداد
              </span>
            </div>
          </div>

          {/* Notification 2: Architecture Readiness for Firebase */}
          <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-800">هيكلة البيانات معدة مسبقاً</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                تم تجهيز أنواع البيانات والمجموعات الخاصة بـ Firebase Firestore و Authentication لتفعيل قاعدة البيانات.
              </p>
              <span className="text-[10px] text-blue-700 font-semibold block mt-1">
                بانتظار ربط Firestore
              </span>
            </div>
          </div>

          {/* Notification 3: Cashbox Status */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-800">الصندوق والخزينة اليومية</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                لا توجد جلسة صندوق مفتوحة حالياً. يمكنك فتح جلسة جديدة من قسم الصندوق عند بدء المبيعات.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTo('cashbox');
                }}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                الانتقال إلى الصندوق والخزينة ←
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={() => {
              onClose();
              onNavigateTo('notifications');
            }}
            className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors"
          >
            عرض كافة الإشعارات وسجل التنبيهات
          </button>
        </div>
      </div>
    </div>
  );
};
