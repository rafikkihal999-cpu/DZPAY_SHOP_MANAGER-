import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Barcode,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Printer,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  User,
  CreditCard,
  Banknote,
  Coins,
  Send,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { PrintLayout } from '../common/PrintLayout';
import { BarcodeScanner } from '../BarcodeScanner';
import { PosProduct, CartItem } from '../../types/pos';
import { INITIAL_POS_PRODUCTS } from '../../data/posProducts';
import { QuickTouchShortcuts } from '../pos/QuickTouchShortcuts';
import { TouchCashButtons } from '../pos/TouchCashButtons';

export const PosView: React.FC = () => {
  const { activeBranch, currency } = useAuth();

  // Load POS products with inventory integration
  const [productsList] = useState<PosProduct[]>(() => {
    try {
      const storedInv = localStorage.getItem('dzpay_inventory_products_v2');
      if (storedInv) {
        const parsed = JSON.parse(storedInv);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customItems: PosProduct[] = parsed
            .filter(
              (ip: any) =>
                !INITIAL_POS_PRODUCTS.some(
                  (p) => p.id === ip.id || (ip.barcode && p.barcode === ip.barcode)
                )
            )
            .map((ip: any) => ({
              id: ip.id,
              name: ip.name,
              shortName: ip.name.split(' ')[0] + ' ' + (ip.name.split(' ')[1] || ''),
              brand: ip.brand || 'عام',
              category: ip.category || 'phones',
              price: ip.sellingPrice || 0,
              stock: ip.stock || 0,
              hasImei: ip.category === 'phones',
              barcode: ip.barcode || `INV-${ip.id}`,
            }));
          return [...INITIAL_POS_PRODUCTS, ...customItems];
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_POS_PRODUCTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerType, setCustomerType] = useState<'walkin' | 'registered'>('walkin');
  const [customerName, setCustomerName] = useState('زبون عابر');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('أمين الصندوق الرئيسي');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'bank_transfer' | 'ccp' | 'baridimob' | 'partial' | 'installment'
  >('cash');
  const [partialAmountPaid, setPartialAmountPaid] = useState<string>('');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [baridiMobRef, setBaridiMobRef] = useState<string>('');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [lastInvoiceNumber, setLastInvoiceNumber] = useState<string>('DZ-2025-0042');

  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'phones', label: 'هواتف ذكية' },
    { id: 'chargers', label: 'شواحن وبنوك طاقة' },
    { id: 'cables', label: 'كابلات وتحويلات' },
    { id: 'audio', label: 'سماعات وصوتيات' },
    { id: 'protection', label: 'كفرات وزجاج حماية' },
    { id: 'flexy', label: 'فليكسي وبطاقات' },
  ];

  const brands = ['all', 'Apple', 'Samsung', 'Xiaomi', 'Anker', 'Baseus', 'Mobilis'];

  const filteredProducts = productsList.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
    const query = searchQuery.trim().toLowerCase();
    const matchQuery =
      query === '' ||
      p.name.toLowerCase().includes(query) ||
      p.barcode.includes(query) ||
      (p.imei && p.imei.includes(query)) ||
      p.brand.toLowerCase().includes(query);
    return matchCat && matchBrand && matchQuery;
  });

  const addToCart = (product: PosProduct, quantityMultiplier: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityMultiplier }
            : item
        );
      }
      return [
        ...prev,
        { product, quantity: quantityMultiplier, customImei: product.imei },
      ];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountAmount(0);
    setCashReceived('');
    setBaridiMobRef('');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const numCashReceived = parseFloat(cashReceived) || 0;
  const changeDue = Math.max(0, numCashReceived - finalTotal);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const randomInv = `DZ-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastInvoiceNumber(randomInv);
    setIsReceiptModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="pos-view" className="space-y-4">
      {/* Top Bar / Status */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900">نقطة البيع السريعة (POS)</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                كاشير جاهز
              </span>
            </div>
            <p className="text-xs text-slate-500">
              فرع: <span className="font-semibold text-slate-700">{activeBranch}</span> • العملة: بالدينار الجزائري ({currency})
            </p>
          </div>
        </div>

        {/* Catalog textual search input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في كتالوج المنتجات بالاسم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 w-52 sm:w-64 bg-slate-50"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold border border-slate-200"
            >
              مسح البحث
            </button>
          )}
        </div>
      </div>

      {/* Barcode Scanner Component (Hardware Gun, Camera, Auto-add to Invoice) */}
      <BarcodeScanner
        products={productsList}
        onProductScanned={(scannedProduct) => {
          addToCart(scannedProduct);
        }}
      />

      {/* Main Grid: Catalog (Left) + Cart & Checkout (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Product Catalog Section (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Touch Shortcuts Panel (Fast items & Touch screen ergonomics) */}
          <QuickTouchShortcuts
            products={productsList}
            cart={cart}
            onAddToCart={addToCart}
          />

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors border ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Brands Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-600 shrink-0">الماركة:</span>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedBrand === b
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {b === 'all' ? 'الكل' : b}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {product.brand}
                    </span>
                    {product.hasImei ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                        <Smartphone className="w-2.5 h-2.5" />
                        <span>IMEI</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-600">
                        متبقي: {product.stock}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                    {product.name}
                  </h3>

                  {product.storage && (
                    <p className="text-[10px] text-slate-600 mt-1">
                      {product.storage} • {product.color}
                    </p>
                  )}

                  {product.imei && (
                    <div className="mt-1 font-mono text-[10px] text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 truncate">
                      IMEI: {product.imei}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-sm font-black text-emerald-800">
                    {product.price.toLocaleString('fr-DZ')}{' '}
                    <span className="text-[10px] font-bold text-slate-600">د.ج</span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="p-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1 text-xs font-bold px-2.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-slate-200">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">لا توجد منتجات مطابقة لبحثك</p>
                <p className="text-[11px] text-slate-600 mt-1">
                  جرب تغيير كلمات البحث أو اختر قسماً آخر
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Active Cart & Checkout Panel (5 Cols on desktop) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Cart Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-700" />
              <h2 className="text-sm font-bold text-slate-900">سلة البيع الحالية</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {cart.length}
              </span>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إفراغ السلة</span>
              </button>
            )}
          </div>

            {/* Employee & Customer Selection Quick Bar */}
            <div className="p-3 border-b border-slate-200 bg-white space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700"
                >
                  <option value="walkin">زبون عابر (Passager)</option>
                  <option value="registered">زبون مسجل / حساب دائم</option>
                </select>

                {customerType === 'registered' ? (
                  <input
                    type="text"
                    placeholder="اسم الزبون أو رقم هاتفه (05/06/07)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs"
                  />
                ) : (
                  <span className="text-[11px] text-slate-600 flex-1 text-left">
                    فاتورة مباشرة بدون حساب
                  </span>
                )}
              </div>

              {/* Employee Selection */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600">الموظف المسؤول:</span>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700"
                >
                  <option value="أمين الصندوق الرئيسي">أمين الصندوق الرئيسي</option>
                  <option value="يوسف (مبيعات وهواتف)">يوسف (مبيعات وهواتف)</option>
                  <option value="كريم (إكسسوارات وخدمات)">كريم (إكسسوارات وخدمات)</option>
                </select>
              </div>
            </div>

          {/* Cart Items List */}
          <div className="p-3 max-h-72 overflow-y-auto divide-y divide-slate-100 min-h-44">
            {cart.map((item) => (
              <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[10px] text-slate-600 flex items-center gap-2 mt-0.5">
                    <span>
                      {item.product.price.toLocaleString('fr-DZ')} د.ج × {item.quantity}
                    </span>
                    {item.product.hasImei && (
                      <span className="font-mono text-blue-600 font-semibold bg-blue-50 px-1 rounded">
                        IMEI: {item.customImei?.slice(-6)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Touch-Friendly Quantity Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="min-w-[34px] min-h-[34px] flex items-center justify-center hover:bg-slate-200 active:scale-90 text-slate-700 transition-transform touch-manipulation"
                      title="إنقاص الكمية"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-black text-slate-900 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="min-w-[34px] min-h-[34px] flex items-center justify-center hover:bg-slate-200 active:scale-90 text-slate-700 transition-transform touch-manipulation"
                      title="زيادة الكمية"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="min-w-[34px] min-h-[34px] flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl active:scale-90 transition-all touch-manipulation"
                    title="حذف من السلة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">السلة فارغة</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  اضغط على أي منتج أو امسح الباركود لإضافته هنا
                </p>
              </div>
            )}
          </div>

          {/* Calculations & Discounts */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>المجموع الفرعي:</span>
              <span className="font-bold text-slate-900">
                {subtotal.toLocaleString('fr-DZ')} د.ج
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span>تخفيض للزبون (د.ج):</span>
              </span>
              <input
                type="number"
                min="0"
                value={discountAmount || ''}
                placeholder="0"
                onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                className="w-24 px-2 py-0.5 text-xs text-left font-bold rounded border border-slate-300 bg-white"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">الإجمالي النهائي:</span>
              <span className="text-lg font-black text-emerald-800">
                {finalTotal.toLocaleString('fr-DZ')}{' '}
                <span className="text-xs font-bold text-slate-600">د.ج</span>
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                طريقة الدفع (Mode de Règlement):
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition-colors ${
                    paymentMethod === 'cash'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>نقداً</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('baridimob')}
                  className={`p-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition-colors ${
                    paymentMethod === 'baridimob'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>BaridiMob</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ccp')}
                  className={`p-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition-colors ${
                    paymentMethod === 'ccp'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>CCP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>تحويل بنكي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('partial')}
                  className={`p-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition-colors ${
                    paymentMethod === 'partial'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>دفع جزئي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('installment')}
                  className={`p-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center justify-center gap-1 border transition-colors ${
                    paymentMethod === 'installment'
                      ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>بالتقسيط</span>
                </button>
              </div>
            </div>

            {/* If Cash: Touch-Ready Denominations, Additive Buttons, and Keypad */}
            {paymentMethod === 'cash' && finalTotal > 0 && (
              <TouchCashButtons
                finalTotal={finalTotal}
                cashReceived={cashReceived}
                onCashChange={setCashReceived}
              />
            )}

            {/* If BaridiMob or CCP: Ref Input */}
            {(paymentMethod === 'baridimob' || paymentMethod === 'ccp' || paymentMethod === 'bank_transfer') && (
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-xs">
                <label className="text-[11px] text-slate-600 block mb-1">
                  رقم الحوالة أو وصل التحويل (Référence de transaction):
                </label>
                <input
                  type="text"
                  placeholder="مثال: TXN-98234190 أو رقم الحساب"
                  value={baridiMobRef}
                  onChange={(e) => setBaridiMobRef(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 font-mono text-xs"
                />
              </div>
            )}

            {/* If Partial Payment: specify paid amount */}
            {paymentMethod === 'partial' && (
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-amber-800 font-bold">المبلغ المدفوع حالياً:</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={partialAmountPaid}
                    onChange={(e) => setPartialAmountPaid(e.target.value)}
                    className="w-28 px-2 py-0.5 rounded border border-amber-300 text-left font-bold bg-white"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-900 pt-1 border-t border-amber-200">
                  <span>المتبقي في ذمة الزبون (كريدي):</span>
                  <span className="font-bold">
                    {Math.max(0, finalTotal - (Number(partialAmountPaid) || 0)).toLocaleString('fr-DZ')} د.ج
                  </span>
                </div>
              </div>
            )}

            {/* If Installment */}
            {paymentMethod === 'installment' && (
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                <span>سيتم تسجيل الفاتورة في سجل الديون والأقساط الشهرية للعميل.</span>
              </div>
            )}

            {/* Final Checkout Button */}
            <button
              id="btn-complete-sale"
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-3 rounded-xl font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 shadow-xs ${
                cart.length > 0
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>إتمام البيع وطباعة الوصل الحراري (Ticket)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Print Modal using Generic PrintLayout */}
      {isReceiptModalOpen && (
        <PrintLayout
          mode="modal"
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false);
            clearCart();
          }}
          documentType="receipt"
          documentTitle="وصل مبيعات تجاري - TICKET DE CAISSE"
          documentNumber={lastInvoiceNumber}
          operatorName={selectedEmployee}
          customerInfo={{
            name: customerType === 'walkin' ? 'زبون عابر' : customerPhone || 'زبون مسجل',
            phone: customerPhone,
          }}
          defaultPaperSize="80mm"
          allowPaperSizeChange={true}
          items={cart.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            imei: item.customImei,
            quantity: item.quantity,
            unitPrice: item.product.price,
            totalPrice: item.quantity * item.product.price,
            warrantyPeriod: item.product.category === 'phones' ? '12 شهراً' : undefined,
          }))}
          totals={{
            subtotal,
            discount: discountAmount,
            grandTotal: finalTotal,
            paidAmount:
              paymentMethod === 'partial'
                ? Number(partialAmountPaid)
                : paymentMethod === 'installment'
                ? 0
                : finalTotal,
            remainingAmount:
              paymentMethod === 'partial'
                ? Math.max(0, finalTotal - Number(partialAmountPaid))
                : paymentMethod === 'installment'
                ? finalTotal
                : 0,
            paymentMethod:
              paymentMethod === 'cash'
                ? 'نقداً (Espèces / Cash)'
                : paymentMethod === 'baridimob'
                ? `بريدي موب BaridiMob (${baridiMobRef || 'تم التحويل'})`
                : paymentMethod === 'ccp'
                ? `حوالة بريدية CCP (${baridiMobRef || 'تم الدفع'})`
                : paymentMethod === 'bank_transfer'
                ? `تحويل بنكي (${baridiMobRef || 'حوالة بنكية'})`
                : paymentMethod === 'partial'
                ? `دفع جزئي (${Number(partialAmountPaid).toLocaleString('fr-DZ')} د.ج مدفوع)`
                : 'بالتقسيط / كريدي',
            paymentReference: baridiMobRef || undefined,
          }}
          showSignatures={true}
          showStampBox={true}
          showBarcode={true}
          showAmountInWords={true}
        />
      )}
    </div>
  );
};
