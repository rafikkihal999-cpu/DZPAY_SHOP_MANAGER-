import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Clock,
  FileCode,
  HardDrive,
  Layers,
  Sparkles,
  ArrowRight,
  Smartphone,
  Package,
  Users,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  executeInstantDatabaseBackup,
  generateDatabaseSnapshot,
  downloadDatabaseJsonFile,
  getStoredInstantBackups,
  CompleteDatabaseSnapshot,
  BackupHistoryItem,
} from '../services/databaseBackupService';
import { getAccessToken } from '../services/googleAuth';

interface InstantDatabaseBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstantDatabaseBackupModal: React.FC<InstantDatabaseBackupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentUser,
    googleUser,
    isGoogleAuthenticated,
    loginWithGoogle,
    isLoggingInWithGoogle,
    googleAuthError,
    activeBranch,
    wilaya,
    currency,
  } = useAuth();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupStep, setBackupStep] = useState<number>(0);
  const [lastBackupResult, setLastBackupResult] = useState<{
    backupSnapshot: CompleteDatabaseSnapshot;
    messageId: string;
    historyItem: BackupHistoryItem;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<BackupHistoryItem[]>([]);

  // Preview snapshot of the database
  const previewSnapshot = React.useMemo(() => {
    return generateDatabaseSnapshot({
      branchName: activeBranch,
      wilaya: wilaya,
      managerEmail: googleUser?.email || currentUser?.email || 'rafikkihal999@gmail.com',
      currency,
    });
  }, [activeBranch, wilaya, googleUser, currentUser, currency]);

  useEffect(() => {
    if (isOpen) {
      setHistoryItems(getStoredInstantBackups());
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentEmail = googleUser?.email || currentUser?.email || 'rafikkihal999@gmail.com';

  const handleStartBackup = async () => {
    setErrorMessage(null);

    // If user is not authenticated with Google, trigger sign in first
    let token = await getAccessToken();
    if (!token || !isGoogleAuthenticated) {
      const loginSuccess = await loginWithGoogle();
      if (!loginSuccess) {
        return;
      }
      token = await getAccessToken();
    }

    if (!token) {
      setErrorMessage('تعذر الحصول على تصريح الوصول لحساب Google. يرجى تسجيل الدخول وإعادة المحاولة.');
      return;
    }

    setIsBackingUp(true);
    setBackupStep(1);

    try {
      // Step 1: Collecting records
      await new Promise((r) => setTimeout(r, 600));
      setBackupStep(2);

      // Step 2: Encoding & Checksum
      await new Promise((r) => setTimeout(r, 600));
      setBackupStep(3);

      // Step 3: Sending to Gmail Cloud Storage
      const result = await executeInstantDatabaseBackup(token, currentEmail, activeBranch, wilaya);

      setBackupStep(4);
      await new Promise((r) => setTimeout(r, 400));

      setLastBackupResult(result);
      setHistoryItems(getStoredInstantBackups());
      setIsConfirming(false);
    } catch (err: unknown) {
      console.error('Instant backup error:', err);
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء أخذ النسخة الاحتياطية السحابية';
      setErrorMessage(msg);
    } finally {
      setIsBackingUp(false);
      setBackupStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="instant-database-backup-modal"
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0c1630] border border-slate-200 dark:border-[#1e305e] rounded-3xl shadow-2xl flex flex-col text-slate-900 dark:text-slate-100"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-[#1e2f54] bg-white/95 dark:bg-[#0c1630]/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  النسخ الاحتياطي الفوري لقاعدة البيانات
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/90 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  Instant Cloud Backup
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                حفظ نسخة كاملة وفورية لقاعدة بيانات المحل في التخزين السحابي المرتبط بحساب الجيمايل
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#162447] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Current Gmail Account Card */}
          <div className="p-4 rounded-2xl border border-sky-200 dark:border-[#1e3366] bg-sky-50/80 dark:bg-[#101f42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#16254a] border border-sky-200 dark:border-sky-800 flex items-center justify-center shadow-xs">
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    حساب الجيمايل المستهدف للنسخ السحابي:
                  </span>
                  {isGoogleAuthenticated ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      ✓ متصل ومفعل
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      يتطلب الربط
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono font-bold text-sky-700 dark:text-sky-300 mt-0.5" dir="ltr">
                  {currentEmail}
                </p>
              </div>
            </div>

            {!isGoogleAuthenticated && (
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                disabled={isLoggingInWithGoogle}
                className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#16254a] border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-[#1c2e5c] text-slate-800 dark:text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <span>{isLoggingInWithGoogle ? 'جاري الاتصال...' : 'ربط الحساب الآن'}</span>
              </button>
            )}
          </div>

          {/* Error notice if any */}
          {errorMessage && (
            <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <div>
                <span className="font-bold block">تنبيه أثناء النسخ الاحتياطي:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Card if freshly completed */}
          {lastBackupResult && !isBackingUp && (
            <div className="p-5 rounded-3xl border-2 border-emerald-400/80 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-sky-50/60 dark:from-[#0f2824] dark:via-[#0c2226] dark:to-[#0f1d38] shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-emerald-950 dark:text-emerald-100 text-base">
                        تم أخذ وحفظ النسخة الاحتياطية السحابية بنجاح!
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 border border-emerald-400">
                        حفظ سحابي مشفر
                      </span>
                    </div>
                    <p className="text-xs text-emerald-900/80 dark:text-emerald-200/80 mt-1">
                      تم حفظ قاعدة بيانات المحل بالكامل وأرشفتها في بريدك الإلكتروني{' '}
                      <strong className="underline" dir="ltr">
                        {currentEmail}
                      </strong>
                      .
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px] text-emerald-800 dark:text-emerald-300">
                      <span className="bg-white/80 dark:bg-[#132238] px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                        معرّف النسخة: {lastBackupResult.backupSnapshot.backupMetadata.backupId}
                      </span>
                      <span className="bg-white/80 dark:bg-[#132238] px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
                        السجلات: {lastBackupResult.backupSnapshot.backupMetadata.totalRecordsCount} سجل
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-emerald-200 dark:border-emerald-900">
                <button
                  type="button"
                  onClick={() => downloadDatabaseJsonFile(lastBackupResult.backupSnapshot)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#14233c] hover:bg-emerald-50 dark:hover:bg-[#1a2e4e] text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>تحميل نسخة محلية (JSON)</span>
                </button>

                <a
                  href={`https://mail.google.com/mail/u/${encodeURIComponent(currentEmail)}/#search/DZPAY+SHOP`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>فتح في صندوق بريد Gmail</span>
                </a>

                <button
                  type="button"
                  onClick={() => setLastBackupResult(null)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 underline cursor-pointer mr-auto"
                >
                  أخذ نسخة احتياطية جديدة
                </button>
              </div>
            </div>
          )}

          {/* In-Progress Backup Animation */}
          {isBackingUp && (
            <div className="p-6 rounded-3xl border-2 border-sky-400 bg-sky-50/90 dark:bg-[#102244] shadow-lg text-center space-y-4 animate-pulse">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-600/30">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  جاري أخذ النسخة الاحتياطية وحفظها في سحابة Gmail...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  يرجى الانتظار، يتم تجميع وتشفير جداول قاعدة البيانات وإرسالها للتخزين السحابي
                </p>
              </div>

              {/* Steps Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-bold pt-2">
                <div
                  className={`p-2 rounded-xl border transition-all ${
                    backupStep >= 1
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'bg-white/60 dark:bg-[#152750] text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  1. تجميع الجداول
                </div>
                <div
                  className={`p-2 rounded-xl border transition-all ${
                    backupStep >= 2
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'bg-white/60 dark:bg-[#152750] text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  2. تشفير أرشيف JSON
                </div>
                <div
                  className={`p-2 rounded-xl border transition-all ${
                    backupStep >= 3
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'bg-white/60 dark:bg-[#152750] text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  3. الاتصال بسحابة Gmail
                </div>
                <div
                  className={`p-2 rounded-xl border transition-all ${
                    backupStep >= 4
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200'
                      : 'bg-white/60 dark:bg-[#152750] text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  4. توثيق الحفظ السحابي
                </div>
              </div>
            </div>
          )}

          {/* Database Live Overview & Snapshot Card */}
          {!isBackingUp && !lastBackupResult && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    محتويات قاعدة البيانات الجاهزة للنسخ السحابي:
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  الإجمالي: {previewSnapshot.backupMetadata.totalRecordsCount} سجل
                </span>
              </div>

              {/* Grid of database tables */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1e2f54] bg-slate-50/70 dark:bg-[#101b38] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">المنتجات والإكسسوارات</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {previewSnapshot.recordCounts.products} صنف
                    </div>
                  </div>
                  <Package className="w-5 h-5 text-sky-500/80" />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1e2f54] bg-slate-50/70 dark:bg-[#101b38] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">الهواتف وأرقام IMEI</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {previewSnapshot.recordCounts.phonesIMEI} أجهزة
                    </div>
                  </div>
                  <Smartphone className="w-5 h-5 text-emerald-500/80" />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1e2f54] bg-slate-50/70 dark:bg-[#101b38] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">سجل الزبائن والكريدي</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {previewSnapshot.recordCounts.customers} عميل
                    </div>
                  </div>
                  <Users className="w-5 h-5 text-indigo-500/80" />
                </div>

                <div className="p-3 rounded-xl border border-slate-200 dark:border-[#1e2f54] bg-slate-50/70 dark:bg-[#101b38] flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">الصندوق والدرج النقدي</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">
                      {previewSnapshot.financialSummary.cashboxCurrentBalanceDZD.toLocaleString()} د.ج
                    </div>
                  </div>
                  <Wallet className="w-5 h-5 text-amber-500/80" />
                </div>
              </div>

              {/* Financial Snapshot summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-200 dark:border-[#1c384a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white">
                      القيمة التقديرية للمخزون بالدينار الجزائري:
                    </span>{' '}
                    <span className="font-black text-emerald-700 dark:text-emerald-400">
                      {previewSnapshot.financialSummary.inventoryValuationDZD.toLocaleString()} د.ج
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">تنسيق النسخة السحابية:</span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-[#132448] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px]">
                    JSON (RFC 2822 Multipart)
                  </span>
                </div>
              </div>

              {/* Confirmation Prompt per Workspace SKILL instructions */}
              {isConfirming ? (
                <div className="p-5 rounded-2xl border-2 border-amber-300 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-950/30 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-950 dark:text-amber-200">
                        تأكيد إرسال وحفظ النسخة الاحتياطية السحابية:
                      </h4>
                      <p className="text-xs text-amber-900/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                        سيتم تجميع كافة سجلات الجداول الـ 11 وإرسالها كملف أرشيف مشفر ومرفق بتقرير HTML إلى بريدك
                        الإلكتروني <strong dir="ltr">{currentEmail}</strong> عبر Gmail API. هل تود الاستمرار؟
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsConfirming(false)}
                      className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="button"
                      id="btn-confirm-instant-backup-exec"
                      onClick={handleStartBackup}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>نعم، ابدأ النسخ السحابي الفوري</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => downloadDatabaseJsonFile(previewSnapshot)}
                    className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#16254a] text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>تحميل نسخة JSON محلية أولاً</span>
                  </button>

                  <button
                    type="button"
                    id="btn-trigger-instant-cloud-backup"
                    onClick={() => setIsConfirming(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer"
                  >
                    <Cloud className="w-5 h-5" />
                    <span>⚡ أخذ نسخة احتياطية فورية وحفظها سحابياً الآن</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Previous Instant Cloud Backups History */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#1e2f54] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                <Clock className="w-4 h-4 text-sky-500" />
                <span>سجل النسخ الاحتياطية السحابية السابقة:</span>
              </div>
              <span className="text-[11px] text-slate-500">
                {historyItems.length} نسخ مسجلة
              </span>
            </div>

            {historyItems.length === 0 ? (
              <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                لم يتم أخذ نسخ احتياطية فورية بعد. اضغط على الزر الأخضر أعلاه لبدء أول نسخة سحابية.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-2xl border border-slate-200 dark:border-[#1e2f54] bg-slate-50/50 dark:bg-[#0e1935] overflow-hidden">
                {historyItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-slate-100/50 dark:hover:bg-[#142345] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-800 dark:text-white">
                          <span>{item.backupId}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-sans">
                            سحابي
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.formattedDate} • {item.totalRecords} سجل • {item.sizeKb} KB
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <a
                        href={`https://mail.google.com/mail/u/${encodeURIComponent(item.managerEmail)}/#search/${encodeURIComponent(item.backupId)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#16254a] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-[11px] font-bold flex items-center gap-1.5 shadow-2xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>فتح في Gmail</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-[#1e2f54] bg-slate-50 dark:bg-[#0c1630] rounded-b-3xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
            <Cloud className="w-4 h-4 text-sky-500" />
            <span>مزود التخزين السحابي: Google Workspace / Gmail API</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
