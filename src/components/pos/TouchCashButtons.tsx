import React, { useState } from 'react';
import { Banknote, Calculator, Check, RotateCcw, Delete } from 'lucide-react';

interface TouchCashButtonsProps {
  finalTotal: number;
  cashReceived: string;
  onCashChange: (val: string) => void;
}

export const TouchCashButtons: React.FC<TouchCashButtonsProps> = ({
  finalTotal,
  cashReceived,
  onCashChange,
}) => {
  const [showKeypad, setShowKeypad] = useState<boolean>(false);

  const numReceived = parseFloat(cashReceived) || 0;
  const changeDue = Math.max(0, numReceived - finalTotal);
  const remainingNeeded = Math.max(0, finalTotal - numReceived);

  // Exact match
  const handleExact = () => {
    onCashChange(String(finalTotal));
  };

  // Set specific note
  const handleSetAmount = (amount: number) => {
    onCashChange(String(amount));
  };

  // Add note to current received
  const handleAddAmount = (amount: number) => {
    const current = parseFloat(cashReceived) || 0;
    onCashChange(String(current + amount));
  };

  // Keypad press
  const handleKeypadPress = (key: string) => {
    if (key === 'C') {
      onCashChange('');
      return;
    }
    if (key === 'BACKSPACE') {
      onCashChange(cashReceived.slice(0, -1));
      return;
    }
    if (key === '00') {
      if (!cashReceived || cashReceived === '0') return;
      onCashChange(cashReceived + '00');
      return;
    }
    if (key === '000') {
      if (!cashReceived || cashReceived === '0') return;
      onCashChange(cashReceived + '000');
      return;
    }
    onCashChange(cashReceived + key);
  };

  // Algerian common notes & denominations
  const quickNotes = [
    { label: '500 د.ج', value: 500 },
    { label: '1,000 د.ج', value: 1000 },
    { label: '2,000 د.ج', value: 2000 },
    { label: '5,000 د.ج', value: 5000 },
    { label: '10,000 د.ج', value: 10000 },
    { label: '20,000 د.ج', value: 20000 },
  ];

  const quickAdds = [
    { label: '+500', value: 500 },
    { label: '+1,000', value: 1000 },
    { label: '+2,000', value: 2000 },
  ];

  return (
    <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Banknote className="w-4 h-4 text-emerald-700" />
          <span>المبلغ المستلم نقدًا (Espèces):</span>
        </div>

        <button
          type="button"
          onClick={() => setShowKeypad(!showKeypad)}
          className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1.5 transition-colors ${
            showKeypad
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>{showKeypad ? 'إخفاء اللوحة' : 'لوحة أرقام لمسية (Keypad)'}</span>
        </button>
      </div>

      {/* Input Display Row with Clear and Exact */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            placeholder="0"
            value={cashReceived}
            onChange={(e) => onCashChange(e.target.value)}
            className="w-full pl-12 pr-3.5 py-2.5 text-sm font-black text-slate-900 bg-slate-50 border border-slate-300/80 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white transition-all shadow-inner"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
            د.ج
          </span>
        </div>

        {/* Exact amount button */}
        <button
          type="button"
          onClick={handleExact}
          className="min-h-[42px] px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-black transition-all shadow-xs shrink-0 flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>تماماً</span>
        </button>

        {/* Clear button */}
        {cashReceived && (
          <button
            type="button"
            onClick={() => onCashChange('')}
            className="min-h-[42px] w-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 active:scale-95 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-200"
            title="مسح"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Fast Denomination Touch Buttons (Algerian Dinar notes) */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 touch-manipulation">
          {quickNotes.map((note) => (
            <button
              key={note.value}
              type="button"
              onClick={() => handleSetAmount(note.value)}
              className="min-h-[38px] py-1.5 px-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-800 text-[11px] font-bold active:scale-95 transition-all text-center"
            >
              {note.label}
            </button>
          ))}
        </div>

        {/* Quick additive buttons (+500, +1000, +2000) */}
        <div className="flex items-center gap-1.5 touch-manipulation">
          <span className="text-[10px] font-bold text-slate-600 shrink-0">إضافة نقدية:</span>
          {quickAdds.map((add) => (
            <button
              key={add.value}
              type="button"
              onClick={() => handleAddAmount(add.value)}
              className="min-h-[32px] flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-black active:scale-95 transition-all text-center"
            >
              {add.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Touch Numeric Keypad for custom numbers without soft-keyboard */}
      {showKeypad && (
        <div className="p-2 bg-slate-100 rounded-xl border border-slate-200 grid grid-cols-4 gap-1.5 touch-manipulation">
          {['7', '8', '9', 'C', '4', '5', '6', '00', '1', '2', '3', '000', '0', 'BACKSPACE'].map(
            (key) => {
              if (key === 'BACKSPACE') {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeypadPress(key)}
                    className="col-span-2 min-h-[42px] rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-xs flex items-center justify-center active:scale-95"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                );
              }
              if (key === 'C') {
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleKeypadPress(key)}
                    className="min-h-[42px] rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-xs active:scale-95"
                  >
                    C
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypadPress(key)}
                  className={`min-h-[42px] rounded-lg text-xs font-black active:scale-95 transition-all ${
                    ['00', '000'].includes(key)
                      ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                      : 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-2xs'
                  }`}
                >
                  {key}
                </button>
              );
            }
          )}
        </div>
      )}

      {/* Change Due / Remaining needed display */}
      {numReceived > 0 && (
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
          {numReceived >= finalTotal ? (
            <>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>المتبقي للزبون (الصرف / Monnaie):</span>
              </div>
              <span className="text-base font-black text-emerald-700">
                {changeDue.toLocaleString('fr-DZ')}{' '}
                <span className="text-xs font-bold text-slate-500">د.ج</span>
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold text-amber-700">المبلغ المتبقي لإتمام الدفع:</span>
              <span className="text-sm font-black text-amber-700 font-mono">
                {remainingNeeded.toLocaleString('fr-DZ')}{' '}
                <span className="text-xs font-bold text-slate-500">د.ج</span>
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
