import React, { useState } from 'react';
import {
  Wallet,
  Coins,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Receipt,
  FileText,
  Printer,
  ChevronLeft,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyState } from '../common/EmptyState';

export interface CashTransaction {
  id: string;
  type: 'in' | 'out';
  category: string;
  amount: number;
  reason: string;
  paymentMethod: 'cash' | 'baridimob';
  timestamp: string;
  operator: string;
}

export const CashboxView: React.FC<{ onNavigateTo: (id: string) => void }> = ({ onNavigateTo }) => {
  const { activeBranch, currency } = useAuth();

  // Session state: 'closed' or 'open'
  const [sessionStatus, setSessionStatus] = useState<'closed' | 'open'>('closed');
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<string>('');
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);

  // Modals
  const [isOpenSessionModalOpen, setIsOpenSessionModalOpen] = useState(false);
  const [isCloseSessionModalOpen, setIsCloseSessionModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Forms
  const [inputOpening, setInputOpening] = useState('20000');
  const [transForm, setTransForm] = useState({
    type: 'out' as 'in' | 'out',
    category: 'مشتريات ونثريات',
    amount: '',
    reason: '',
    paymentMethod: 'cash' as 'cash' | 'baridimob',
  });
  const [actualCashAtClose, setActualCashAtClose] = useState('');

  // Calculations
  const cashIn = transactions
    .filter((t) => t.type === 'in' && t.paymentMethod === 'cash')
    .reduce((acc, t) => acc + t.amount, 0);
  const cashOut = transactions
    .filter((t) => t.type === 'out' && t.paymentMethod === 'cash')
    .reduce((acc, t) => acc + t.amount, 0);
  const baridiMobTotal = transactions
    .filter((t) => t.paymentMethod === 'baridimob')
    .reduce((acc, t) => acc + (t.type === 'in' ? t.amount : -t.amount), 0);

  const expectedCashInDrawer = sessionStatus === 'open' ? openingBalance + cashIn - cashOut : 0;

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(inputOpening) || 0;
    setOpeningBalance(val);
    setSessionStatus('open');
    setSessionStartTime(new Date().toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' }));
    setIsOpenSessionModalOpen(false);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transForm.amount || Number(transForm.amount) <= 0) return;

    const newT: CashTransaction = {
      id: `tx-${Date.now()}`,
      type: transForm.type,
      category: transForm.category,
      amount: Number(transForm.amount),
      reason: transForm.reason || (transForm.type === 'in' ? 'إيداع نقدي' : 'مصروف من الصندوق'),
      paymentMethod: transForm.paymentMethod,
      timestamp: new Date().toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' }),
      operator: 'يوسف أحمد (الكاشير)',
    };

    setTransactions([newT, ...transactions]);
    setIsTransactionModalOpen(false);
    setTransForm({
      type: 'out',
      category: 'مشتريات ونثريات',
      amount: '',
      reason: '',
      paymentMethod: 'cash',
    });
  };

  const handleCloseSession = (e: React.FormEvent) => {
    e.preventDefault();
    setSessionStatus('closed');
    setIsCloseSessionModalOpen(false);
  };

  const handleSimulateDemoTransactions = () => {
    setSessionStatus('open');
    setOpeningBalance(15000);
    setSessionStartTime('09:00');
    setTransactions([
      {
        id: 'tx-1',
        type: 'in',
        category: 'مبيعات POS',
        amount: 245000,
        reason: 'فاتورة هاتف iPhone 15 Pro Max',
        paymentMethod: 'cash',
        timestamp: '10:30',
        operator: 'يوسف أحمد',
      },
      {
        id: 'tx-2',
        type: 'in',
        category: 'بريدي موب',
        amount: 52000,
        reason: 'تحويل بريدي موب BaridiMob - هاتف ردمي',
        paymentMethod: 'baridimob',
        timestamp: '11:15',
        operator: 'يوسف أحمد',
      },
      {
        id: 'tx-3',
        type: 'out',
        category: 'مصاريف ونثريات',
        amount: 2500,
        reason: 'شراء كرتون لاصقات من الموزع',
        paymentMethod: 'cash',
        timestamp: '12:00',
        operator: 'يوسف أحمد',
      },
    ]);
  };

  return (
    <div id="cashbox-view" className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1.5">
            <button
              onClick={() => onNavigateTo('dashboard')}
              className="hover:text-emerald-700 transition-colors"
            >
              الرئيسية
            </button>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-bold">الصندوق والخزينة</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">الصندوق والخزينة اليومية</h1>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    sessionStatus === 'open'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {sessionStatus === 'open' ? (
                    <>
                      <Unlock className="w-3 h-3 text-emerald-600" />
                      <span>الصندوق مفتوح (جلسة نشطة)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>الصندوق مغلق</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                متابعة السيولة النقدية في الدرج ومطابقتها مع تحويلات بريدي موب بالدينار الجزائري ({currency})
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {sessionStatus === 'closed' && (
            <button
              onClick={handleSimulateDemoTransactions}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>معاينة جلسة نشطة</span>
            </button>
          )}

          {sessionStatus === 'closed' ? (
            <button
              onClick={() => setIsOpenSessionModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs md:text-sm font-bold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Unlock className="w-4 h-4" />
              <span>فتح جلسة صندوق جديدة</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTransactionModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-slate-300"
              >
                <Coins className="w-4 h-4 text-emerald-700" />
                <span>سحب / إيداع نقدي</span>
              </button>
              <button
                onClick={() => setIsCloseSessionModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                <span>إغلاق الصندوق (Z-Report)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cashbox Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tile 1: Cash in drawer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>السيولة النقدية المتوقعة في الدرج</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800 mt-2">
            {expectedCashInDrawer.toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold text-slate-600">د.ج</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            افتتاحي: {openingBalance.toLocaleString('fr-DZ')} د.ج • مقبوضات: +{cashIn.toLocaleString('fr-DZ')} د.ج
          </div>
        </div>

        {/* Tile 2: BaridiMob Received */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>إجمالي تحويلات بريدي موب</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-800 mt-2">
            {baridiMobTotal.toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold text-slate-600">د.ج</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            في حساب بريدي موب المحل مباشرة
          </div>
        </div>

        {/* Tile 3: Cash Expenses taken */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>مصاريف وسحوبات من الصندوق</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">
            {cashOut.toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold text-slate-600">د.ج</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            نثريات، مشتريات فورية، أو تسبيقات
          </div>
        </div>

        {/* Tile 4: Session Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>وقت وتفاصيل الجلسة</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-slate-900 mt-2">
            {sessionStatus === 'open' ? (
              <span className="text-emerald-700">بدأت الساعة {sessionStartTime}</span>
            ) : (
              <span className="text-slate-500">لا توجد جلسة نشطة</span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            الكاشير المسؤول: يوسف أحمد
          </div>
        </div>
      </div>

      {/* Transactions Table or Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">سجل حركات الصندوق اليومية</h3>
            <p className="text-[11px] text-slate-500">
              جميع عمليات الإدخال والإخراج النقدي وتحويلات بريدي موب
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            {transactions.length} حركات مسجلة
          </span>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">الوقت</th>
                  <th className="p-3.5">نوع الحركة</th>
                  <th className="p-3.5">المبلغ (د.ج)</th>
                  <th className="p-3.5">البيان / السبب</th>
                  <th className="p-3.5">المستخدم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono text-slate-600">{t.timestamp}</td>
                    <td className="p-3.5">
                      {t.type === 'in' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>إيداع / بيع</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          <span>سحب / مصروف</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`text-sm font-black ${
                          t.type === 'in' ? 'text-emerald-800' : 'text-rose-700'
                        }`}
                      >
                        {t.type === 'in' ? '+' : '-'}
                        {t.amount.toLocaleString('fr-DZ')}{' '}
                        <span className="text-[10px] font-bold text-slate-600">د.ج</span>
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{t.reason}</div>
                      <div className="text-[10px] text-slate-600">{t.category} • {t.paymentMethod === 'cash' ? 'نقداً' : 'بريدي موب'}</div>
                    </td>
                    <td className="p-3.5 text-slate-600">{t.operator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Wallet}
            title="لا توجد حركات صندوق لليوم"
            description="ابدأ بفتح جلسة الصندوق اليومية."
            actionText={sessionStatus === 'closed' ? "فتح جلسة الصندوق اليومية" : "تسجيل حركة نقدية"}
            actionIcon={sessionStatus === 'closed' ? Unlock : Coins}
            onAction={() => sessionStatus === 'closed' ? setIsOpenSessionModalOpen(true) : setIsTransactionModalOpen(true)}
          />
        )}
      </div>

      {/* Open Session Modal */}
      {isOpenSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">بدء جلسة الصندوق اليومية</h3>
              </div>
              <button
                onClick={() => setIsOpenSessionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartSession} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  الرصيد الافتتاحي في درج الكاشير (الصرف) بالدينار الجزائري *
                </label>
                <input
                  type="number"
                  placeholder="مثال: 20000"
                  value={inputOpening}
                  onChange={(e) => setInputOpening(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-base text-emerald-800"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  هذا هو المبلغ النقدي الموجود في الدرج قبل بدء أول عملية بيع اليوم.
                </p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 text-[11px]">
                سيتم توثيق وقت فتح الصندوق وهوية الكاشير المسؤول تلقائياً.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpenSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد فتح الصندوق</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Cash Transaction Modal (Expense / Deposit) */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">سحب أو إيداع نقدي في الصندوق</h3>
              </div>
              <button
                onClick={() => setIsTransactionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTransForm({ ...transForm, type: 'out' })}
                  className={`p-2 rounded-xl font-bold border transition-colors ${
                    transForm.type === 'out'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  سحب مصروف (خارج)
                </button>
                <button
                  type="button"
                  onClick={() => setTransForm({ ...transForm, type: 'in' })}
                  className={`p-2 rounded-xl font-bold border transition-colors ${
                    transForm.type === 'in'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  إيداع نقدي (داخل)
                </button>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">المبلغ (د.ج) *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={transForm.amount}
                  onChange={(e) => setTransForm({ ...transForm, amount: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">بيان وسبب الحركة *</label>
                <input
                  type="text"
                  placeholder="مثال: شراء قهوة وضيافة للزبائن / تسديد فاتورة بنزين"
                  value={transForm.reason}
                  onChange={(e) => setTransForm({ ...transForm, reason: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">طريقة المعاملة</label>
                <select
                  value={transForm.paymentMethod}
                  onChange={(e) => setTransForm({ ...transForm, paymentMethod: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="cash">نقداً من درج المحل</option>
                  <option value="baridimob">تحويل عبر بريدي موب BaridiMob</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransactionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ الحركة في الصندوق</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Session / Z-Report Modal */}
      {isCloseSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-5 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900">إغلاق جلسة الصندوق (Z-Report)</h3>
              </div>
              <button
                onClick={() => setIsCloseSessionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between">
                <span>الرصيد الافتتاحي:</span>
                <span className="font-bold">{openingBalance.toLocaleString('fr-DZ')} د.ج</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>إجمالي المقبوضات النقدية:</span>
                <span className="font-bold">+{cashIn.toLocaleString('fr-DZ')} د.ج</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>إجمالي المسحوبات والمصاريف:</span>
                <span className="font-bold">-{cashOut.toLocaleString('fr-DZ')} د.ج</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200 flex justify-between font-black text-xs text-slate-900">
                <span>الرصيد المحسوب المفترض في الدرج:</span>
                <span>{expectedCashInDrawer.toLocaleString('fr-DZ')} د.ج</span>
              </div>
            </div>

            <form onSubmit={handleCloseSession} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  المبلغ الفعلي المعدود في الدرج الآن (د.ج) *
                </label>
                <input
                  type="number"
                  placeholder="المبلغ بعد عد النقود في الدرج"
                  value={actualCashAtClose}
                  onChange={(e) => setActualCashAtClose(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-base"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCloseSessionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>إغلاق وطباعة تقرير Z</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
