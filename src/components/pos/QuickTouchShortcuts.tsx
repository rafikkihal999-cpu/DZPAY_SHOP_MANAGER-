import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Shield,
  Zap,
  Radio,
  Headphones,
  Star,
  Plus,
  Maximize2,
  Minimize2,
  Check,
  Smartphone,
  Tag,
  Hash,
} from 'lucide-react';
import { PosProduct, CartItem, QuickShortcutFilter } from '../../types/pos';

interface QuickTouchShortcutsProps {
  products: PosProduct[];
  cart: CartItem[];
  onAddToCart: (product: PosProduct, quantityMultiplier?: number) => void;
}

export const QuickTouchShortcuts: React.FC<QuickTouchShortcutsProps> = ({
  products,
  cart,
  onAddToCart,
}) => {
  const [activeFilter, setActiveFilter] = useState<QuickShortcutFilter>('all');
  const [touchScale, setTouchScale] = useState<'large' | 'compact'>('large');
  const [multiplier, setMultiplier] = useState<number>(1);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // Local storage for user-pinned favorites
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dzpay_pos_pinned_favorites');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['p-glass-9d', 'p-cable-baseus', 'p-anker-20w', 'p-magsafe-case', 'p-flexy-mobilis'];
  });

  const togglePin = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedIds((prev) => {
      const next = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      try {
        localStorage.setItem('dzpay_pos_pinned_favorites', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save pinned items', err);
      }
      return next;
    });
  };

  const handleProductPress = (product: PosProduct) => {
    onAddToCart(product, multiplier);
    setLastAddedId(product.id);
    setTimeout(() => {
      setLastAddedId(null);
    }, 600);
    // Reset multiplier to 1 after use if it was changed
    if (multiplier > 1) {
      setMultiplier(1);
    }
  };

  // Keyboard shortcut listener for numeric shortcuts [1..9]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if active element is an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }

      if (['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
        const matched = products.find((p) => p.shortcutKey === e.key);
        if (matched) {
          e.preventDefault();
          handleProductPress(matched);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, multiplier]);

  // Filter products for quick touch section
  const quickItems = products.filter((p) => {
    if (activeFilter === 'favorites') {
      return pinnedIds.includes(p.id);
    }
    if (activeFilter === 'all') {
      return p.isQuickShortcut || pinnedIds.includes(p.id);
    }
    if (activeFilter === 'top_sellers') {
      return p.quickCategory === 'top_sellers' || pinnedIds.includes(p.id);
    }
    if (activeFilter === 'protection') {
      return p.category === 'protection' || p.quickCategory === 'protection';
    }
    if (activeFilter === 'power') {
      return (
        p.category === 'chargers' ||
        p.category === 'cables' ||
        p.quickCategory === 'power'
      );
    }
    if (activeFilter === 'flexy') {
      return p.category === 'flexy' || p.quickCategory === 'flexy';
    }
    if (activeFilter === 'audio') {
      return p.category === 'audio' || p.quickCategory === 'audio';
    }
    return p.isQuickShortcut;
  });

  // Get cart quantity for a product
  const getCartQuantity = (productId: string) => {
    const found = cart.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  // Filter tabs definition
  const filters = [
    { id: 'all' as QuickShortcutFilter, label: 'جميع الاختصارات', icon: Flame, badge: quickItems.length },
    { id: 'favorites' as QuickShortcutFilter, label: 'المفضلة ⭐', icon: Star, badge: pinnedIds.length },
    { id: 'top_sellers' as QuickShortcutFilter, label: 'الأكثر طلباً 🔥', icon: Sparkles },
    { id: 'protection' as QuickShortcutFilter, label: 'واقيات وكفرات', icon: Shield },
    { id: 'power' as QuickShortcutFilter, label: 'شواحن وكابلات', icon: Zap },
    { id: 'flexy' as QuickShortcutFilter, label: 'فليكسي وتعبئة رصيد', icon: Radio },
    { id: 'audio' as QuickShortcutFilter, label: 'سماعات وصوتيات', icon: Headphones },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800/90 shadow-md space-y-3.5">
      {/* Top Header with Touch Info & Multiplier */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
            <Flame className="w-5 h-5 text-amber-200 fill-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-wide text-white">
                لوحة البيع السريع باللمس (Touch POS)
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                شاشة اللمس مفعّلة
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              اضغط مباشرة على الصنف لإضافته فوراً إلى السلة، أو استخدم اختصارات الأرقام [1 - 9]
            </p>
          </div>
        </div>

        {/* Touch Multiplier + Scale Mode */}
        <div className="flex items-center gap-2">
          {/* Quick Multiplier (+1, +2, +5) for touchscreens */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 px-1.5 font-bold">الكمية لكل نقرة:</span>
            {[1, 2, 5, 10].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => setMultiplier(qty)}
                className={`min-w-7 h-7 px-1.5 rounded-lg text-xs font-black transition-all ${
                  multiplier === qty
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                +{qty}
              </button>
            ))}
          </div>

          {/* Touch Scale Toggle */}
          <button
            type="button"
            onClick={() => setTouchScale(touchScale === 'large' ? 'compact' : 'large')}
            title="تبديل حجم أزرار اللمس"
            className="h-9 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            {touchScale === 'large' ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">عرض مدمج</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">أزرار لمس كبيرة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Chips Bar (Optimized for finger touch) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-manipulation">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 border touch-manipulation select-none ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{filter.label}</span>
              {typeof filter.badge === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {filter.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Fast Touch Products Grid */}
      <div
        className={`grid gap-2.5 ${
          touchScale === 'large'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6'
        }`}
      >
        {quickItems.map((product) => {
          const inCartCount = getCartQuantity(product.id);
          const isPinned = pinnedIds.includes(product.id);
          const isJustAdded = lastAddedId === product.id;

          // Border / styling accent
          let accentBorder = 'border-slate-700 hover:border-emerald-500';
          let badgeBg = 'bg-slate-800 text-slate-300';
          if (product.accentColor === 'emerald') {
            badgeBg = 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
          } else if (product.accentColor === 'amber') {
            badgeBg = 'bg-amber-950/80 text-amber-300 border-amber-800';
          } else if (product.accentColor === 'rose') {
            badgeBg = 'bg-rose-950/80 text-rose-300 border-rose-800';
          } else if (product.accentColor === 'blue') {
            badgeBg = 'bg-blue-950/80 text-blue-300 border-blue-800';
          } else if (product.accentColor === 'purple') {
            badgeBg = 'bg-purple-950/80 text-purple-300 border-purple-800';
          }

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => handleProductPress(product)}
              className={`relative text-right group rounded-xl p-3 border transition-all touch-manipulation select-none active:scale-95 flex flex-col justify-between ${
                isJustAdded
                  ? 'bg-emerald-900/90 border-emerald-400 ring-2 ring-emerald-400/50 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-750 ' + accentBorder
              } ${touchScale === 'large' ? 'min-h-[92px]' : 'min-h-[76px]'}`}
            >
              {/* Floating Top Elements: Shortcut key & Pin & Cart count */}
              <div className="flex items-center justify-between gap-1 w-full mb-1">
                <div className="flex items-center gap-1">
                  {product.shortcutKey && (
                    <span className="w-5 h-5 rounded-md bg-slate-900/90 text-slate-300 text-[10px] font-black flex items-center justify-center border border-slate-700">
                      {product.shortcutKey}
                    </span>
                  )}
                  {product.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeBg} truncate max-w-[85px]`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {/* Pinned star toggle */}
                  <button
                    type="button"
                    onClick={(e) => togglePin(product.id, e)}
                    className="p-1 text-slate-500 hover:text-amber-400 transition-colors"
                    title={isPinned ? 'إلغاء التثبيت' : 'تثبيت في المفضلة السريعة'}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        isPinned ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>

                  {/* If in cart, show quantity badge */}
                  {inCartCount > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs">
                      ×{inCartCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Short Name */}
              <div className="my-0.5">
                <h3 className="text-xs font-black text-white group-hover:text-emerald-300 line-clamp-2 leading-tight">
                  {product.shortName || product.name}
                </h3>
              </div>

              {/* Bottom: Price + Quick Stock */}
              <div className="mt-1 pt-1.5 border-t border-slate-700/60 flex items-center justify-between w-full">
                <div className="text-emerald-400 font-black text-xs sm:text-sm">
                  {product.price.toLocaleString('fr-DZ')}{' '}
                  <span className="text-[10px] font-normal text-slate-400">د.ج</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  {isJustAdded ? (
                    <span className="text-emerald-300 font-bold flex items-center gap-0.5 animate-bounce">
                      <Check className="w-3 h-3" />
                      +{multiplier}
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-md bg-slate-700/60 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-colors">
                      <Plus className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {quickItems.length === 0 && (
          <div className="col-span-full py-6 text-center text-slate-400 text-xs bg-slate-800/40 rounded-xl border border-slate-800">
            <Star className="w-6 h-6 mx-auto mb-1.5 text-slate-600" />
            <p className="font-bold text-slate-300">لا توجد منتجات في هذا التبويب السريع</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              يمكنك تثبيت أي منتج بالضغط على رمز النجمة ⭐
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
