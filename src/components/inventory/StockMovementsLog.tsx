import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ArrowDownRight,
  ArrowUpRight,
  RotateCcw,
  SlidersHorizontal,
  AlertTriangle,
  Plus,
  Calendar,
  User,
  Package,
} from 'lucide-react';
import { InventoryMovement, StockMovementType } from '../../types/inventory';
import { formatDA } from '../../services/inventoryService';

interface StockMovementsLogProps {
  movements: InventoryMovement[];
  onOpenNewMovementModal: () => void;
}

export const StockMovementsLog: React.FC<StockMovementsLogProps> = ({
  movements,
  onOpenNewMovementModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = movements.filter((m) => {
    const matchType = typeFilter === 'all' || m.type === typeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      q === '' ||
      m.productName.toLowerCase().includes(q) ||
      m.employeeName.toLowerCase().includes(q) ||
      (m.note && m.note.toLowerCase().includes(q)) ||
      (m.barcode && m.barcode.includes(q));

    return matchType && matchQuery;
  });

  const getBadgeForType = (type: StockMovementType) => {
    switch (type) {
      case 'sale':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-700" />
            <span>بيع (-)</span>
          </span>
        );
      case 'purchase':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-700" />
            <span>شراء وتوريد (+)</span>
          </span>
        );
      case 'return':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-700" />
            <span>إرجاع بضاعة (+)</span>
          </span>
        );
      case 'manual_adjust':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
            <span>تعديل يدوي (جرد)</span>
          </span>
        );
      case 'damage_loss':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-900 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            <span>تلف أو ضياع (-)</span>
          </span>
        );
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleString('ar-DZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث باسم المنتج، الموظف، أو رقم الفاتورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-emerald-600"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">جميع أنواع العمليات</option>
            <option value="sale">بيع (-)</option>
            <option value="purchase">شراء وتوريد (+)</option>
            <option value="return">إرجاع بضاعة (+)</option>
            <option value="manual_adjust">تعديل يدوي (جرد)</option>
            <option value="damage_loss">تلف أو ضياع (-)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewMovementModal}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل حركة مخزون</span>
          </button>
        </div>
      </div>

      {/* Movements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">لا توجد حركات مخزنية مطابقة</div>
            <p className="text-xs text-slate-400">
              قم بتسجيل حركة بيع، شراء أو تعديل جرد لرؤية التتبع اللحظي هنا.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="py-3 px-4">التاريخ والوقت</th>
                  <th className="py-3 px-4">نوع العملية</th>
                  <th className="py-3 px-4">المنتج / الصنف</th>
                  <th className="py-3 px-3 text-center">الكمية</th>
                  <th className="py-3 px-3 text-center">الكمية قبل</th>
                  <th className="py-3 px-3 text-center">الكمية بعد</th>
                  <th className="py-3 px-4">الموظف المسؤول</th>
                  <th className="py-3 px-4">ملاحظة العملية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filtered.map((m) => {
                  const isPositive = m.type === 'purchase' || m.type === 'return';
                  const isNegative = m.type === 'sale' || m.type === 'damage_loss';

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatTimestamp(m.timestamp)}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getBadgeForType(m.type)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{m.productName}</div>
                        {m.barcode && (
                          <div className="text-[10px] text-slate-500 font-mono">
                            باركود: {m.barcode}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            isPositive
                              ? 'text-emerald-700 font-black'
                              : isNegative
                              ? 'text-rose-700 font-black'
                              : 'text-amber-700 font-black'
                          }`}
                        >
                          {isPositive ? `+${m.quantity}` : isNegative ? `-${m.quantity}` : m.quantity}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {m.previousStock}
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 bg-slate-50">
                        {m.newStock}
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{m.employeeName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                        {m.note || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
