import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  Mail,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileJson,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowDownToLine,
  ExternalLink,
  Lock,
  Database,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  syncBackupToGmail,
  listGmailBackups,
  ShopBackupPayload,
  GmailBackupMessage,
} from '../services/gmailSync';
import { SAMPLE_MONITORED_PRODUCTS } from '../utils/stockMonitor';

interface GmailCloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInstantBackup?: () => void;
}

export const GmailCloudSyncModal: React.FC<GmailCloudSyncModalProps> = ({
  isOpen,
  onClose,
  onOpenInstantBackup,
}) => {
  const {
    currentUser,
    googleUser,
    isGoogleAuthenticated,
    isLoggingInWithGoogle,
    googleAuthError,
    accessToken,
    loginWithGoogle,
    logout,
    activeBranch,
    currency,
    wilaya,
    lastCloudSync,
    setLastCloudSync,
  } = useAuth();
  const { isDark } = useTheme();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);

  // Mandatory User Confirmation Modal for Cloud Sync
  const [showConfirmSync, setShowConfirmSync] = useState(false);

  // Previous backups list
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  const [backups, setBackups] = useState<GmailBackupMessage[]>([]);

  // Load backups when authenticated and modal opened
  useEffect(() => {
    if (isOpen && isGoogleAuthenticated && accessToken) {
      loadBackups();
    }
  }, [isOpen, isGoogleAuthenticated, accessToken]);

  const loadBackups = async () => {
    if (!accessToken) return;
    setIsLoadingBackups(true);
    try {
      const items = await listGmailBackups(accessToken);
      setBackups(items);
    } catch (err) {
      console.warn('Failed to fetch Gmail backups:', err);
    } finally {
      setIsLoadingBackups(false);
    }
  };

  if (!isOpen) return null;

  // Prepare backup payload
  const prepareBackupPayload = (): ShopBackupPayload => {
    const totalProducts = SAMPLE_MONITORED_PRODUCTS.length;
    const totalUnits = SAMPLE_MONITORED_PRODUCTS.reduce((acc, p) => acc + (p.stockQuantity || p.stock || 0), 0);
    const totalValuation = SAMPLE_MONITORED_PRODUCTS.reduce(
      (acc, p) => acc + (p.stockQuantity || p.stock || 0) * (p.sellingPrice || 0),
      0
    );
    const lowStockCount = SAMPLE_MONITORED_PRODUCTS.filter(
      (p) => (p.stockQuantity || p.stock || 0) <= (p.minStockAlert || 3)
    ).length;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      shopName: 'DZPAY SHOP - هواتف وإكسسوارات',
      branchName: activeBranch,
      managerEmail: googleUser?.email || currentUser?.email || 'rafikkihal999@gmail.com',
      wilaya: wilaya,
      currency: currency,
      timestamp: now.toISOString(),
      formattedDate: formattedDate,
      metrics: {
        totalProductsCount: totalProducts,
        totalStockUnits: totalUnits,
        inventoryValuationDZD: totalValuation,
        lowStockAlertsCount: lowStockCount,
        todaySalesCount: 14,
        todayRevenueDZD: 185400,
        customersCount: 48,
      },
      inventorySample: SAMPLE_MONITORED_PRODUCTS.map((p) => ({
        name: p.name,
        brand: p.brand,
        stock: p.stockQuantity || p.stock || 0,
        sellingPrice: p.sellingPrice || 0,
        barcode: p.barcode,
      })),
    };
  };

  const executeCloudSync = async () => {
    if (!accessToken) {
      setSyncStatus('error');
      setSyncMessage('يرجى تسجيل الدخول بحساب Google أولاً.');
      return;
    }

    setShowConfirmSync(false);
    setIsSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('');

    try {
      const payload = prepareBackupPayload();
      const res = await syncBackupToGmail(accessToken, payload);
      setSyncStatus('success');
      setLastMessageId(res.messageId);
      const timestampStr = new Date().toLocaleTimeString('ar-DZ', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'numeric',
      });
      setLastCloudSync(timestampStr);
      setSyncMessage('تم حفظ النسخة الاحتياطية وإرسالها سحابياً إلى بريد Gmail بنجاح!');
      // Reload backups list
      loadBackups();
    } catch (err: unknown) {
      setSyncStatus('error');
      const errText = err instanceof Error ? err.message : 'حدث خطأ أثناء الاتصال بخدمة Gmail';
      setSyncMessage(errText);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="gmail-cloud-sync-modal"
        className="w-full max-w-2xl bg-white dark:bg-[#0f1a36] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1e2f54] overflow-hidden flex flex-col max-h-[90vh] text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 dark:from-[#0b162f] dark:via-[#132347] dark:to-[#172b56] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shadow-inner">
              <Cloud className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base">المزامنة السحابية عبر Gmail</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-400/20 text-sky-200 border border-sky-300/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                تسجيل الدخول وحفظ نسخ احتياطية للمخزون والبيانات مباشرة في بريد Google
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-100 flex-1">
          {/* 1. Google Authentication Status Card */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-[#1e2f54] bg-slate-50/70 dark:bg-[#121e3d] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#19274e] border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5 shadow-2xs">
                  {/* Official Google 'G' logo */}
                  <svg className="w-full h-full" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    حساب Google المُتصل لتسجيل الدخول والمزامنة
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isGoogleAuthenticated
                      ? 'تم تسجيل الدخول والربط بحساب Google بنجاح'
                      : 'سجل دخولك بحساب Google لتفعيل الحفظ التلقائي في Gmail'}
                  </p>
                </div>
              </div>

              {isGoogleAuthenticated ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>متصل</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>غير مسجل</span>
                </span>
              )}
            </div>

            {isGoogleAuthenticated && googleUser ? (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-[#0d162f] rounded-xl border border-slate-200 dark:border-[#1e2f54]">
                <div className="flex items-center gap-3">
                  {googleUser.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt={googleUser.displayName}
                      className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      {googleUser.displayName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {googleUser.displayName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-sky-500" />
                      <span>{googleUser.email}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  تبديل الحساب
                </button>
              </div>
            ) : (
              /* Official Google Sign-In button */
              <div className="pt-2">
                <button
                  id="modal-google-sign-in-btn"
                  type="button"
                  onClick={() => loginWithGoogle()}
                  disabled={isLoggingInWithGoogle}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-[#162447] dark:hover:bg-[#1a2d5a] text-slate-700 dark:text-white font-bold text-xs flex items-center justify-center gap-3 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>{isLoggingInWithGoogle ? 'جاري الاتصال بـ Google...' : 'تسجيل الدخول بواسطة حساب Google (Gmail)'}</span>
                </button>
                {googleAuthError ? (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-2 text-center">
                    {googleAuthError}
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 text-center">
                    ستفتح نافذة منبثقة رسمية لتسجيل الدخول بـ Google ومنح إذن المزامنة السحابية على Gmail.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 2. Cloud Backup Payload Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-500" />
                <span>البيانات الجاهزة للمزامنة السحابية الحالية</span>
              </h4>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {lastCloudSync ? `آخر مزامنة: ${lastCloudSync}` : 'لم تتم أي مزامنة بعد'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 dark:bg-[#121e3d] rounded-xl border border-slate-200 dark:border-[#1e2f54] text-center">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">عدد المنتجات</div>
                <div className="text-base font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                  {SAMPLE_MONITORED_PRODUCTS.length} صنف
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#121e3d] rounded-xl border border-slate-200 dark:border-[#1e2f54] text-center">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">قطع المخزون</div>
                <div className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {SAMPLE_MONITORED_PRODUCTS.reduce((acc, p) => acc + (p.stockQuantity || p.stock || 0), 0)} قطعة
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#121e3d] rounded-xl border border-slate-200 dark:border-[#1e2f54] text-center">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">قيمة المخزون</div>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {SAMPLE_MONITORED_PRODUCTS.reduce(
                    (acc, p) => acc + (p.stockQuantity || p.stock || 0) * (p.sellingPrice || 0),
                    0
                  ).toLocaleString()}{' '}
                  <span className="text-[10px]">د.ج</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#121e3d] rounded-xl border border-slate-200 dark:border-[#1e2f54] text-center">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">الفرع النشط</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate">
                  {activeBranch.split('-')[0]}
                </div>
              </div>
            </div>

            {/* Sync Action Button */}
            <div className="pt-2">
              <button
                id="modal-trigger-sync-btn"
                type="button"
                onClick={() => {
                  if (!isGoogleAuthenticated) {
                    loginWithGoogle();
                  } else {
                    setShowConfirmSync(true);
                  }
                }}
                disabled={isSyncing}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري إرسال النسخة السحابية إلى Gmail...</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4" />
                    <span>
                      {isGoogleAuthenticated
                        ? 'مزامنة وحفظ نسخة احتياطية الآن في Gmail'
                        : 'سجل دخولك بحساب Google أولاً للمزامنة'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Sync Status Banner */}
            {syncStatus === 'success' && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">{syncMessage}</div>
                  {lastMessageId && (
                    <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                      معرف الرسالة في Gmail: <code className="font-mono">{lastMessageId}</code>
                    </div>
                  )}
                </div>
              </div>
            )}

            {syncStatus === 'error' && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>{syncMessage}</div>
              </div>
            )}

            {/* Instant Full Database Backup Banner */}
            {onOpenInstantBackup && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-950 dark:text-emerald-200">
                      نسخة احتياطية فورية وشاملة لقاعدة البيانات ⚡
                    </div>
                    <div className="text-[10px] text-emerald-800/80 dark:text-emerald-400">
                      تضمين كافة جداول قاعدة البيانات بملف JSON رسمي مع توثيق التجزئة وتفاصيل المخزون والخزينة
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  id="gmail-modal-open-instant-backup-btn"
                  onClick={() => {
                    onClose();
                    onOpenInstantBackup();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 transition-colors shadow-2xs cursor-pointer text-center"
                >
                  أخذ نسخة فورية الآن
                </button>
              </div>
            )}
          </div>

          {/* 3. Backups Archive in Gmail */}
          {isGoogleAuthenticated && (
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#1e2f54]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-slate-300">
                  <FileJson className="w-4 h-4 text-sky-500" />
                  <span>النسخ الاحتياطية المسجلة سابقاً في بريدك</span>
                </div>
                <button
                  type="button"
                  onClick={loadBackups}
                  disabled={isLoadingBackups}
                  className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingBackups ? 'animate-spin' : ''}`} />
                  <span>تحديث السجل</span>
                </button>
              </div>

              {isLoadingBackups ? (
                <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                  جاري جلب سجل النسخ من بريدك الإلكتروني...
                </div>
              ) : backups.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {backups.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-50 dark:bg-[#121e3d] rounded-xl border border-slate-200 dark:border-[#1e2f54] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {item.subject}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>📅 {item.date}</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            ✓ مرفق JSON متوفر
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shrink-0">
                        في صندوق Gmail
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-[#1e2f54] text-center text-xs text-slate-500 dark:text-slate-400">
                  لا توجد نسخ احتياطية مسجلة مسبقاً في بريدك. انقر على "مزامنة وحفظ نسخة احتياطية" لحفظ نسختك الأولى.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0c152b] border-t border-slate-200 dark:border-[#1e2f54] flex items-center justify-between text-xs">
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>نقل سحابي مشفر وآمن بتفويض OAuth2 المباشر</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DATA SYNC TO GMAIL */}
      {showConfirmSync && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-white dark:bg-[#0f1a36] rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-[#1e2f54] space-y-4 text-right"
            dir="rtl"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                تأكيد المزامنة السحابية عبر Gmail
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                أنت على وشك إنشاء نسخة احتياطية سحابية كاملة لبيانات المحل والمخزون وإرسالها بأمان عبر
                خدمة Gmail إلى بريدك الإلكتروني:
              </p>
              <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-mono text-xs font-bold border border-sky-200 dark:border-sky-800">
                {googleUser?.email || currentUser?.email || 'rafikkihal999@gmail.com'}
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-[#162244] rounded-xl text-xs space-y-1.5 border border-slate-200 dark:border-[#1e2f54]">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>أصناف المنتجات:</span>
                <span className="font-bold text-slate-900 dark:text-white">{SAMPLE_MONITORED_PRODUCTS.length} صنف</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>تنسيق الملف:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">JSON معتمد + تقرير HTML تفاعلي</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                id="confirm-sync-btn"
                onClick={executeCloudSync}
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                تأكيد وحفظ في Gmail الآن
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmSync(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
