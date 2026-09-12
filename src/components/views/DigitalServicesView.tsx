import React, { useState } from 'react';
import {
  Zap,
  PhoneCall,
  Smartphone,
  CheckCircle2,
  Receipt,
  Printer,
  ChevronLeft,
  X,
  CreditCard,
  Gamepad2,
  Wifi,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { EmptyState } from '../common/EmptyState';

interface FlexyRecord {
  id: string;
  operator: 'Mobilis' | 'Djezzy' | 'Ooredoo' | 'Idoom' | 'Gaming';
  clientPhone: string;
  amount: number;
  commission: number;
  timestamp: string;
  status: 'success' | 'pending';
}

export const DigitalServicesView: React.FC<{ onNavigateTo: (id: string) => void }> = ({ onNavigateTo }) => {
  const { currency } = useAuth();

  // Active tab
  const [activeTab, setActiveTab] = useState<'flexy' | 'idoom' | 'gaming'>('flexy');

  // Flexy Form
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<'Mobilis' | 'Djezzy' | 'Ooredoo'>('Mobilis');
  const [amountInput, setAmountInput] = useState('500');
  const [flexyHistory, setFlexyHistory] = useState<FlexyRecord[]>([]);
  const [lastFlexyTicket, setLastFlexyTicket] = useState<FlexyRecord | null>(null);

  // Shop SIM Balances (Starting at 0 as per empty state rule)
  const [simBalances, setSimBalances] = useState({
    mobilis: 0,
    djezzy: 0,
    ooredoo: 0,
  });

  // Auto-detect Algerian operator from phone number prefix
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setPhoneInput(cleaned);

    if (cleaned.startsWith('06') || cleaned.startsWith('6')) {
      setSelectedOperator('Mobilis');
    } else if (cleaned.startsWith('07') || cleaned.startsWith('7')) {
      setSelectedOperator('Djezzy');
    } else if (cleaned.startsWith('05') || cleaned.startsWith('5')) {
      setSelectedOperator('Ooredoo');
    }
  };

  const quickAmounts = [100, 200, 500, 1000, 1500, 2000];

  const handleExecuteFlexy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 9 || !amountInput) return;

    const amt = Number(amountInput);
    const comm = Math.round(amt * 0.02); // 2% Algerian standard shop commission

    const newRecord: FlexyRecord = {
      id: `flx-${Date.now()}`,
      operator: selectedOperator,
      clientPhone: phoneInput,
      amount: amt,
      commission: comm,
      timestamp: new Date().toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' }),
      status: 'success',
    };

    setFlexyHistory([newRecord, ...flexyHistory]);
    setLastFlexyTicket(newRecord);
    setPhoneInput('');
  };

  const handleSimulateDemoFlexy = () => {
    setSimBalances({
      mobilis: 25000,
      djezzy: 18500,
      ooredoo: 12000,
    });
    setFlexyHistory([
      {
        id: 'flx-1',
        operator: 'Mobilis',
        clientPhone: '0661234567',
        amount: 1000,
        commission: 20,
        timestamp: '10:14',
        status: 'success',
      },
      {
        id: 'flx-2',
        operator: 'Djezzy',
        clientPhone: '0770987654',
        amount: 500,
        commission: 10,
        timestamp: '11:02',
        status: 'success',
      },
      {
        id: 'flx-3',
        operator: 'Ooredoo',
        clientPhone: '0555112233',
        amount: 2000,
        commission: 40,
        timestamp: '11:45',
        status: 'success',
      },
    ]);
  };

  return (
    <div id="digital-services-view" className="space-y-5">
      {/* Header */}
      <PageHeader
        title="الخدمات الرقمية وفليكسي"
        description="شحن أرصدة الهاتف النقال الجزائري (Mobilis, Djezzy, Ooredoo)، اشتراكات الإنترنت Idoom، وبطاقات الألعاب."
        breadcrumbCurrent="الخدمات الرقمية وفليكسي"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={Zap}
      />

      {/* Operator SIM Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Mobilis */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              06
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">رصيد شريحة موبيليس</span>
              <span className="text-[10px] text-slate-500">Mobilis Flexy SIM</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-emerald-800">
              {simBalances.mobilis.toLocaleString('fr-DZ')} <span className="text-[10px]">د.ج</span>
            </div>
            <span className="text-[10px] text-slate-400">رصيد البيع المتاح</span>
          </div>
        </div>

        {/* Djezzy */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              07
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">رصيد شريحة جيزي</span>
              <span className="text-[10px] text-slate-500">Djezzy Flexy SIM</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-red-700">
              {simBalances.djezzy.toLocaleString('fr-DZ')} <span className="text-[10px]">د.ج</span>
            </div>
            <span className="text-[10px] text-slate-400">رصيد البيع المتاح</span>
          </div>
        </div>

        {/* Ooredoo */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              05
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">رصيد شريحة أوريدو</span>
              <span className="text-[10px] text-slate-500">Ooredoo Storm SIM</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black text-rose-700">
              {simBalances.ooredoo.toLocaleString('fr-DZ')} <span className="text-[10px]">د.ج</span>
            </div>
            <span className="text-[10px] text-slate-400">رصيد البيع المتاح</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Flexy Recharger + Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Recharge Terminal (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-sm font-bold text-slate-900">محطة الشحن السريع (لوحة فليكسي)</h2>
            <p className="text-[11px] text-slate-500">
              أدخل رقم هاتف الزبون، وسيتم تحديد المتعامل تلقائياً
            </p>
          </div>

          <form onSubmit={handleExecuteFlexy} className="space-y-3.5 text-xs">
            {/* Operator Buttons */}
            <div>
              <label className="font-bold text-slate-700 block mb-1.5">متعامل الهاتف النقال:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOperator('Mobilis')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                    selectedOperator === 'Mobilis'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  موبيليس (06)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOperator('Djezzy')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                    selectedOperator === 'Djezzy'
                      ? 'bg-red-600 text-white border-red-600 shadow-xs ring-2 ring-red-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  جيزي (07)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOperator('Ooredoo')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-center ${
                    selectedOperator === 'Ooredoo'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  أوريدو (05)
                </button>
              </div>
            </div>

            {/* Phone Number Input */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                رقم هاتف الزبون (10 أرقام) *
              </label>
              <div className="relative">
                <PhoneCall className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  maxLength={10}
                  placeholder="06 / 07 / 05 xx xx xx xx"
                  value={phoneInput}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-300 font-mono text-sm tracking-wider font-bold text-slate-900 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                المبلغ المراد شحنه (بالدينار د.ج) *
              </label>
              <input
                type="number"
                min="50"
                step="10"
                placeholder="500"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-black text-lg text-emerald-800"
                required
              />
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">مبالغ شائعة وسريعة:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmountInput(amt.toString())}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    {amt} د.ج
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Flexy Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Zap className="w-4 h-4" />
              <span>تأكيد شحن الفليكسي وطباعة الوصل</span>
            </button>
          </form>
        </div>

        {/* Flexy History & Digital Services Catalog (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tabs: Flexy History vs Gaming Cards vs Idoom */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('flexy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'flexy'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              سجل عمليات فليكسي اليوم
            </button>
            <button
              onClick={() => setActiveTab('gaming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'gaming'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              بطاقات الألعاب والتطبيقات
            </button>
            <button
              onClick={() => setActiveTab('idoom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'idoom'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              إنترنت اتصالات الجزائر (Idoom)
            </button>
          </div>

          {/* Active Tab Content */}
          {activeTab === 'flexy' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">العمليات المنفذة</span>
                <span className="text-xs text-slate-500">
                  إجمالي الشحن:{' '}
                  <span className="font-bold text-slate-900">
                    {flexyHistory.reduce((acc, r) => acc + r.amount, 0).toLocaleString('fr-DZ')} د.ج
                  </span>
                </span>
              </div>

              {flexyHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">الوقت</th>
                        <th className="p-3">المتعامل</th>
                        <th className="p-3">رقم الهاتف</th>
                        <th className="p-3">المبلغ المشحون</th>
                        <th className="p-3">العمولة المقدرة</th>
                        <th className="p-3">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {flexyHistory.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/80">
                          <td className="p-3 font-mono text-slate-600">{rec.timestamp}</td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${
                                rec.operator === 'Mobilis'
                                  ? 'bg-emerald-600'
                                  : rec.operator === 'Djezzy'
                                  ? 'bg-red-600'
                                  : 'bg-rose-600'
                              }`}
                            >
                              {rec.operator}
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {rec.clientPhone}
                          </td>
                          <td className="p-3 font-black text-slate-900">
                            {rec.amount.toLocaleString('fr-DZ')} د.ج
                          </td>
                          <td className="p-3 text-emerald-700 font-semibold">
                            +{rec.commission} د.ج
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                              تم الشحن بنجاح
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={Zap}
                  title="لا توجد خدمات رقمية أو عمليات فليكسي مسجلة بعد"
                  description="أضف رصيد فليكسي أو بطاقات التعبئة للبدء."
                />
              )}
            </div>
          )}

          {activeTab === 'gaming' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'Free Fire 1080 جوهرة', price: 2200, category: 'Garena' },
                { title: 'PUBG Mobile 660 UC', price: 2400, category: 'Tencent' },
                { title: 'Google Play 10$ بطاقة', price: 2300, category: 'Gift Card' },
                { title: 'PlayStation Store 10$ FR', price: 2500, category: 'Sony' },
                { title: 'Netflix 1 Mois Premium', price: 1800, category: 'Streaming' },
                { title: 'Roblox 800 Robux', price: 2600, category: 'Gaming' },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Gamepad2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{card.title}</div>
                      <div className="text-[10px] text-slate-500">{card.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xs text-emerald-800">{card.price} د.ج</div>
                    <button className="text-[10px] text-emerald-700 font-bold hover:underline">
                      شحن فوري
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'idoom' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    تعبئة اشتراك إنترنت اتصالات الجزائر (Idoom ADSL / 4G LTE / Fibre)
                  </h3>
                  <p className="text-[10px] text-slate-500">شحن مباشر برقم الهاتف الثابت</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">بطاقة 500 د.ج</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Idoom 4G LTE</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">تعبئة 1600 د.ج</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Idoom ADSL 10 Mbps</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">تعبئة 2100 د.ج</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Idoom Fibre 15 Mbps</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flexy Ticket Modal */}
      {lastFlexyTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full border border-slate-200 shadow-2xl p-5 text-center space-y-3 text-xs">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">تم شحن الفليكسي بنجاح</h4>
              <p className="text-[10px] text-slate-500">وصل شحن رصيد إلكتروني</p>
            </div>

            <div className="border border-dashed border-slate-300 p-3 rounded-xl bg-slate-50 text-right space-y-1 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">المتعامل:</span>
                <span className="font-bold text-slate-900">{lastFlexyTicket.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الهاتف:</span>
                <span className="font-bold text-slate-900">{lastFlexyTicket.clientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">المبلغ المشحون:</span>
                <span className="font-black text-emerald-800">
                  {lastFlexyTicket.amount.toLocaleString('fr-DZ')} د.ج
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">التوقيت:</span>
                <span>{lastFlexyTicket.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setLastFlexyTicket(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs inline-flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة التذكرة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
