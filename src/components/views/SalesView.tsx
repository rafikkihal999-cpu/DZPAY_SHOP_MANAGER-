import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Printer,
  ChevronLeft,
  X,
  CreditCard,
  Banknote,
  Send,
  Eye,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PageHeader } from '../common/PageHeader';
import { PrintLayout } from '../common/PrintLayout';

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerName: string;
  itemsCount: number;
  total: number;
  paymentMethod: 'cash' | 'baridimob' | 'card' | 'debt';
  date: string;
  time: string;
  cashier: string;
  itemsSummary: string;
}

export const SalesView: React.FC<{ onNavigateTo: (id: string) => void }> = ({ onNavigateTo }) => {
  const { currency, activeBranch } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [isPrintJournalOpen, setIsPrintJournalOpen] = useState(false);

  const handlePrint = () => {
    setIsPrintJournalOpen(true);
  };

  const filtered = invoices.filter((inv) => {
    const matchPay = paymentFilter === 'all' || inv.paymentMethod === paymentFilter;
    const q = searchQuery.toLowerCase();
    const matchQ =
      q === '' ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.itemsSummary.toLowerCase().includes(q);
    return matchPay && matchQ;
  });

  const totalSalesAmount = invoices.reduce((acc, inv) => acc + inv.total, 0);

  const addSampleInvoices = () => {
    setInvoices([
      {
        id: 'inv-1',
        invoiceNumber: 'DZ-2025-0041',
        customerName: 'زبون عابر',
        itemsCount: 2,
        total: 247800,
        paymentMethod: 'cash',
        date: '2025-05-10',
        time: '14:20',
        cashier: 'يوسف أحمد',
        itemsSummary: 'iPhone 15 Pro Max + شاحن Anker 20W',
      },
      {
        id: 'inv-2',
        invoiceNumber: 'DZ-2025-0040',
        customerName: 'كريم بن عيسى',
        itemsCount: 1,
        total: 52000,
        paymentMethod: 'baridimob',
        date: '2025-05-10',
        time: '11:45',
        cashier: 'يوسف أحمد',
        itemsSummary: 'Xiaomi Redmi Note 13 Pro (256GB)',
      },
      {
        id: 'inv-3',
        invoiceNumber: 'DZ-2025-0039',
        customerName: 'زبون عابر',
        itemsCount: 3,
        total: 3700,
        paymentMethod: 'cash',
        date: '2025-05-09',
        time: '18:10',
        cashier: 'يوسف أحمد',
        itemsSummary: 'كابل Baseus 100W + 2 لاصقة 9D',
      },
    ]);
  };

  return (
    <div id="sales-view" className="space-y-5">
      {/* PageHeader with Print Button */}
      <PageHeader
        title="سجل فواتير المبيعات"
        description={`أرشيف الفواتير الصادرة من نقطة البيع (POS) وإعادة طباعة الوصل الحراري بالدينار (${currency})`}
        breadcrumbCurrent="المبيعات والفواتير"
        onNavigateHome={() => onNavigateTo('dashboard')}
        icon={Receipt}
        badgeText={`${invoices.length} فاتورة مسجلة`}
        badgeVariant="slate"
        onPrint={handlePrint}
        printText="طباعة"
        primaryActionText="الانتقال لنقطة البيع (POS)"
        onPrimaryAction={() => onNavigateTo('pos')}
        extraActions={
          invoices.length === 0 ? (
            <button
              onClick={addSampleInvoices}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>معاينة فواتير تجريبية</span>
            </button>
          ) : undefined
        }
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500">إجمالي المبيعات المفوترة</span>
          <div className="text-xl font-black text-emerald-800 mt-1">
            {totalSalesAmount.toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold text-slate-600">د.ج</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500">فواتير مسددة نقداً (كاش)</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {invoices.filter((i) => i.paymentMethod === 'cash').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500">فواتير عبر بريدي موب</span>
          <div className="text-xl font-black text-blue-800 mt-1">
            {invoices.filter((i) => i.paymentMethod === 'baridimob').length}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث برقم الفاتورة (DZ-2025-xxxx)، اسم الزبون، أو السلعة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'cash', 'baridimob', 'card', 'debt'].map((m) => (
            <button
              key={m}
              onClick={() => setPaymentFilter(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                paymentFilter === m
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m === 'all' && 'كل الطرق'}
              {m === 'cash' && 'نقداً'}
              {m === 'baridimob' && 'بريدي موب'}
              {m === 'card' && 'بطاقة CIB'}
              {m === 'debt' && 'كريدي'}
            </button>
          ))}
        </div>
      </div>

      {/* Table or Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">رقم الفاتورة</th>
                  <th className="p-3.5">التاريخ والوقت</th>
                  <th className="p-3.5">الزبون</th>
                  <th className="p-3.5">موجز الأصناف المباعة</th>
                  <th className="p-3.5">طريقة الدفع</th>
                  <th className="p-3.5">المبلغ الإجمالي</th>
                  <th className="p-3.5 text-center">معاينة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3.5 font-mono text-slate-500">
                      {inv.date} • {inv.time}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800">{inv.customerName}</td>
                    <td className="p-3.5 text-slate-600 truncate max-w-xs">
                      {inv.itemsSummary}
                    </td>
                    <td className="p-3.5">
                      {inv.paymentMethod === 'cash' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          نقداً
                        </span>
                      )}
                      {inv.paymentMethod === 'baridimob' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          بريدي موب
                        </span>
                      )}
                      {inv.paymentMethod === 'debt' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          دين / تقسيط
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-black text-emerald-800 text-sm">
                        {inv.total.toLocaleString('fr-DZ')}{' '}
                        <span className="text-[10px] font-bold text-slate-600">د.ج</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        title="معاينة الوصل وطباعته"
                        className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg inline-flex items-center gap-1 font-bold text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>عرض</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <Receipt className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">لا توجد فواتير مبيعات مسجلة حتى الآن</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              كل عملية بيع تصدر من نقطة البيع السريعة (POS) تُسجل هنا تلقائياً، مع توثيق الأرقام التسلسلية للهواتف وضمان الأجهزة.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => onNavigateTo('pos')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>بدء فاتورة في نقطة البيع</span>
              </button>
              <button
                onClick={addSampleInvoices}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                معاينة فواتير تجريبية
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Details and Print Layout Modal */}
      {selectedInvoice && (
        <PrintLayout
          mode="modal"
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          documentType="invoice"
          documentTitle="فاتورة مبيعات تجارية (FACTURE DE VENTE)"
          documentNumber={selectedInvoice.invoiceNumber}
          documentDate={`${selectedInvoice.date} ${selectedInvoice.time}`}
          operatorName={selectedInvoice.cashier}
          customerInfo={{
            name: selectedInvoice.customerName,
          }}
          defaultPaperSize="a4"
          allowPaperSizeChange={true}
          items={[
            {
              id: '1',
              name: selectedInvoice.itemsSummary,
              quantity: selectedInvoice.itemsCount,
              unitPrice: selectedInvoice.total / Math.max(1, selectedInvoice.itemsCount),
              totalPrice: selectedInvoice.total,
            },
          ]}
          totals={{
            subtotal: selectedInvoice.total,
            grandTotal: selectedInvoice.total,
            paidAmount: selectedInvoice.paymentMethod === 'debt' ? 0 : selectedInvoice.total,
            remainingAmount: selectedInvoice.paymentMethod === 'debt' ? selectedInvoice.total : 0,
            paymentMethod:
              selectedInvoice.paymentMethod === 'cash'
                ? 'نقداً (Espèces / Cash)'
                : selectedInvoice.paymentMethod === 'baridimob'
                ? 'بريدي موب BaridiMob'
                : selectedInvoice.paymentMethod === 'card'
                ? 'بطاقة بنكية CIB / Edahabia'
                : 'بالدين / كريدي',
          }}
          showSignatures={true}
          showStampBox={true}
          showBarcode={true}
          showAmountInWords={true}
        />
      )}

      {/* Sales Invoices Journal / Registry Print Layout Modal */}
      {isPrintJournalOpen && (
        <PrintLayout
          mode="modal"
          isOpen={isPrintJournalOpen}
          onClose={() => setIsPrintJournalOpen(false)}
          documentType="report"
          documentTitle="سجل وفهرس فواتير المبيعات التجارية (JOURNAL DES VENTES)"
          documentSubtitle={`فرع: ${activeBranch || 'الفرع الرئيسي - قسنطينة'} • إجمالي الفواتير: ${invoices.length} فاتورة مسجلة`}
          documentNumber={`JOURNAL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`}
          defaultPaperSize="a4"
          allowPaperSizeChange={true}
          totals={{
            subtotal: totalSalesAmount,
            grandTotal: totalSalesAmount,
            paidAmount: totalSalesAmount,
            remainingAmount: 0,
            paymentMethod: 'مجموع المبيعات (نقداً، بريدي موب، بطاقات)',
          }}
          showSignatures={true}
          showStampBox={true}
          showBarcode={true}
          showAmountInWords={true}
          notes="سجل رسمي مستخرج آلياً يوثق حركة فواتير المبيعات لنقطة البيع DZPAY SHOP."
        >
          <div className="space-y-4">
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">رقم الفاتورة</th>
                    <th className="py-2.5 px-3">التاريخ والوقت</th>
                    <th className="py-2.5 px-3">الزبون / المشتري</th>
                    <th className="py-2.5 px-3">طريقة الدفع</th>
                    <th className="py-2.5 px-3">الكاشير</th>
                    <th className="py-2.5 px-3 text-left">المبلغ الإجمالي (د.ج)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {invoices.length > 0 ? (
                    invoices.map((inv, idx) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-950">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {inv.date} {inv.time}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {inv.customerName}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="text-[11px] font-bold">
                            {inv.paymentMethod === 'cash' && 'نقداً'}
                            {inv.paymentMethod === 'baridimob' && 'بريدي موب'}
                            {inv.paymentMethod === 'card' && 'بطاقة بنكية'}
                            {inv.paymentMethod === 'debt' && 'بالدين / كريدي'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-600">
                          {inv.cashier}
                        </td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-950">
                          {inv.total.toLocaleString('fr-DZ')} د.ج
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-slate-500 font-medium">
                        لا توجد فواتير مبيعات مسجلة حتى الآن.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </PrintLayout>
      )}
    </div>
  );
};
