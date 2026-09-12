import React from 'react';
import {
  X,
  User,
  Shield,
  MapPin,
  Phone,
  Mail,
  Building,
  KeyRound,
  CheckCircle2,
  Sun,
  Moon,
  Cloud,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGmailSync?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onOpenGmailSync }) => {
  const {
    currentUser,
    activeBranch,
    currency,
    wilaya,
    googleUser,
    isGoogleAuthenticated,
    loginWithGoogle,
    logout,
    lastCloudSync,
  } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  if (!isOpen || !currentUser) return null;

  return (
    <div
      id="profile-modal-container"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="profile-modal-content"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{currentUser.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  نشط
                </span>
              </div>
              <p className="text-emerald-400 text-sm font-semibold mt-0.5">
                {currentUser.roleArabic}
              </p>
              <p className="text-slate-400 text-xs mt-1">{currentUser.email}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Identity breakdown (First Name, Last Name) */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
            <div>
              <span className="text-[11px] text-emerald-800 font-semibold block">الاسم:</span>
              <span className="text-sm font-black text-slate-900">{currentUser.firstName || 'رفيق'}</span>
            </div>
            <div>
              <span className="text-[11px] text-emerald-800 font-semibold block">اللقب:</span>
              <span className="text-sm font-black text-slate-900">{currentUser.lastName || 'كيحل'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">الفرع النشط (الرئيسي)</span>
              <div className="flex items-center gap-2 mt-1 text-slate-800 font-bold text-xs">
                <Building className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{activeBranch}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">الولاية والموقع</span>
              <div className="flex items-center gap-2 mt-1 text-slate-800 font-bold text-xs">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{wilaya}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">رقم الهاتف</span>
              <div className="flex items-center gap-2 mt-1 text-slate-800 font-bold text-xs">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span dir="ltr">{currentUser.phone}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium block">عملة النظام</span>
              <div className="flex items-center gap-2 mt-1 text-emerald-700 font-bold text-xs">
                <span>{currency}</span>
              </div>
            </div>
          </div>

          {/* Permissions and Role Overview */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>صلاحيات الحساب (Super Admin)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>الوصول لجميع الأقسام الـ 21</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>إدارة الصندوق والخزينة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>إدخال الهواتف وأرقام IMEI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>إدارة الديون والأقساط</span>
              </div>
            </div>
          </div>

          {/* Google Auth & Gmail Cloud Sync Status */}
          <div className="p-3.5 rounded-xl border border-sky-200 dark:border-[#1e2f54] bg-sky-50/70 dark:bg-[#132042] text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                  المزامنة السحابية عبر Gmail
                </span>
              </div>
              {isGoogleAuthenticated ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                  ✓ متصل بـ Google
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                  غير متصل
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {isGoogleAuthenticated
                ? `مرتبط بحساب Google (${googleUser?.email || currentUser.email}). يمكنك حفظ بيانات المخزون والمبيعات سحابياً في بريدك بنقرة واحدة.`
                : 'يمكنك تسجيل الدخول مباشرة بواسطة حساب Google الخاص بك ومزامنة بيانات المحل سحابياً على Gmail.'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              {isGoogleAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenGmailSync) onOpenGmailSync();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>فتح لوحة المزامنة السحابية</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#16254a] border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>تسجيل الدخول بحساب Google (Gmail)</span>
                </button>
              )}

              {lastCloudSync && (
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  آخر حفظ: {lastCloudSync}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={toggleTheme}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-blue-950 text-sky-300 border-sky-800 hover:bg-blue-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-sky-600" />}
            <span>{isDark ? 'التبديل للوضع المضيء' : 'النمط الليلي الأزرق Dark Blue'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
