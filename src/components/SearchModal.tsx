import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowLeft, Store } from 'lucide-react';
import { NAVIGATION_ITEMS, ICON_MAP } from '../constants/navigation';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSection,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via custom event or prop
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredItems = NAVIGATION_ITEMS.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="search-modal-container"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="search-modal-content"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            id="quick-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن عميل، منتج، IMEI، فاتورة..."
            className="w-full bg-transparent text-sm md:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-white text-slate-500 px-2 py-1 rounded border border-slate-200 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              لم يتم العثور على قسم يطابق &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item) => {
              const IconComp = ICON_MAP[item.icon] || Store;
              return (
                <button
                  key={item.id}
                  id={`search-result-${item.id}`}
                  onClick={() => {
                    onSelectSection(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50 text-right group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-700 flex items-center justify-center shrink-0 transition-colors">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-600">
                          ({item.titleEn})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between">
          <span>التنقل السريع بين أقسام DZPAY SHOP MANAGER الـ 21</span>
          <span>د.ج (DZD)</span>
        </div>
      </div>
    </div>
  );
};
