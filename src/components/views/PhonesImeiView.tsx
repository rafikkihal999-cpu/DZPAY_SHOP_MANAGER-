import React, { useState } from 'react';
import {
  Smartphone,
  Plus,
  Search,
  Barcode,
  ShieldCheck,
  BatteryCharging,
  SlidersHorizontal,
  ChevronLeft,
  X,
  CheckCircle2,
  AlertCircle,
  Tag,
  Building,
  Printer,
  Trash2,
  Edit,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { EmptyState } from '../common/EmptyState';

export interface PhoneRecord {
  id: string;
  brand: string;
  model: string;
  storage: string;
  ram?: string;
  color: string;
  imei1: string;
  imei2?: string;
  condition: 'new' | 'used';
  batteryHealth?: number;
  purchasePrice: number;
  sellingPrice: number;
  warrantyMonths: number;
  supplier: string;
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
}

export const PhonesImeiView: React.FC<{ onNavigateTo: (id: string) => void }> = ({ onNavigateTo }) => {
  const { currency } = useAuth();

  // Local state with empty initial array as mandated by the empty state rule
  const [phones, setPhones] = useState<PhoneRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPhoneForBarcode, setSelectedPhoneForBarcode] = useState<PhoneRecord | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    brand: 'Samsung',
    model: '',
    storage: '128GB',
    ram: '8GB',
    color: 'أسود',
    imei1: '',
    imei2: '',
    condition: 'new' as 'new' | 'used',
    batteryHealth: 100,
    purchasePrice: '',
    sellingPrice: '',
    warrantyMonths: 12,
    supplier: 'مورد الجملة (العلمة)',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const brands = ['all', 'Apple', 'Samsung', 'Xiaomi', 'Realme', 'Oppo', 'Infinix', 'Tecno', 'Honor'];

  const filteredPhones = phones.filter((p) => {
    const matchBrand = brandFilter === 'all' || p.brand === brandFilter;
    const matchCondition = conditionFilter === 'all' || p.condition === conditionFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchQuery =
      query === '' ||
      p.model.toLowerCase().includes(query) ||
      p.imei1.includes(query) ||
      (p.imei2 && p.imei2.includes(query)) ||
      p.brand.toLowerCase().includes(query);
    return matchBrand && matchCondition && matchQuery;
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.model.trim()) errors.model = 'يرجى إدخال موديل الهاتف (مثال: Galaxy S24)';
    if (!formData.imei1.trim() || formData.imei1.length < 14) {
      errors.imei1 = 'يرجى إدخال رقم IMEI صحيح (15 رقماً)';
    }
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) {
      errors.sellingPrice = 'يرجى تحديد سعر البيع بالدينار الجزائري';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newPhone: PhoneRecord = {
      id: `phone-${Date.now()}`,
      brand: formData.brand,
      model: formData.model,
      storage: formData.storage,
      ram: formData.ram,
      color: formData.color,
      imei1: formData.imei1,
      imei2: formData.imei2 || undefined,
      condition: formData.condition,
      batteryHealth: formData.condition === 'used' ? formData.batteryHealth : 100,
      purchasePrice: Number(formData.purchasePrice) || 0,
      sellingPrice: Number(formData.sellingPrice),
      warrantyMonths: formData.warrantyMonths,
      supplier: formData.supplier,
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPhones((prev) => [newPhone, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      brand: 'Samsung',
      model: '',
      storage: '128GB',
      ram: '8GB',
      color: 'أسود',
      imei1: '',
      imei2: '',
      condition: 'new',
      batteryHealth: 100,
      purchasePrice: '',
      sellingPrice: '',
      warrantyMonths: 12,
      supplier: 'مورد الجملة (العلمة)',
    });
    setFormErrors({});
  };

  const addSamplePhoneForDemo = () => {
    const sample: PhoneRecord = {
      id: `phone-${Date.now()}`,
      brand: 'Apple',
      model: 'iPhone 15 Pro Max',
      storage: '256GB',
      ram: '8GB',
      color: 'تيتانيوم أزرق',
      imei1: '358921098234561',
      imei2: '358921098234562',
      condition: 'new',
      batteryHealth: 100,
      purchasePrice: 220000,
      sellingPrice: 245000,
      warrantyMonths: 12,
      supplier: 'سوق دبي بلفور - الحراش',
      status: 'available',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPhones((prev) => [sample, ...prev]);
  };

  return (
    <div id="phones-imei-view" className="space-y-5">
      {/* Header & Breadcrumb */}
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
            <span className="text-slate-800 font-bold">الهواتف وأرقام IMEI</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">الهواتف الذكية وأرقام IMEI</h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {phones.length} أجهزة مسجلة
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                تتبع الأرقام التسلسلية IMEI1 و IMEI2، كفالات الضمان، وسعر البيع بالدينار الجزائري ({currency})
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {phones.length === 0 && (
            <button
              onClick={addSamplePhoneForDemo}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-slate-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>إدراج جهاز تجريبي للمعاينة</span>
            </button>
          )}

          <button
            id="btn-add-phone-modal"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs md:text-sm font-bold shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل هاتف جديد (IMEI)</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500">إجمالي الأجهزة في المخزن</span>
          <div className="text-xl font-black text-slate-900 mt-1">{phones.length}</div>
          <span className="text-[10px] text-slate-600">متوفر للبيع الفوري</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500">أجهزة جديدة (Neuf)</span>
          <div className="text-xl font-black text-emerald-800 mt-1">
            {phones.filter((p) => p.condition === 'new').length}
          </div>
          <span className="text-[10px] text-emerald-700">مع كفالة ضمان المصنع</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500">أجهزة مستعملة (Occasion)</span>
          <div className="text-xl font-black text-blue-700 mt-1">
            {phones.filter((p) => p.condition === 'used').length}
          </div>
          <span className="text-[10px] text-blue-600">تم فحص البطارية والشاشة</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500">قيمة أجهزة الهواتف</span>
          <div className="text-xl font-black text-slate-900 mt-1">
            {phones
              .reduce((acc, p) => acc + p.sellingPrice, 0)
              .toLocaleString('fr-DZ')}{' '}
            <span className="text-xs font-bold text-slate-600">د.ج</span>
          </div>
          <span className="text-[10px] text-slate-600">بسعر البيع الحالي</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث برقم IMEI (15 رقماً)، اسم الموديل، أو اللون..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 bg-slate-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="all">كل الماركات</option>
            {brands
              .filter((b) => b !== 'all')
              .map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
          </select>

          {/* Condition Filter */}
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="all">كل الحالات (جديد / مستعمل)</option>
            <option value="new">جديد فقط (Neuf)</option>
            <option value="used">مستعمل فقط (Occasion)</option>
          </select>

          {/* Status Filter (متوفر / مباع) */}
          <select
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700"
          >
            <option value="all">حالة البيع (الكل)</option>
            <option value="available">متوفر في المحل</option>
            <option value="sold">مباع</option>
          </select>
        </div>
      </div>

      {/* Phones Table or Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredPhones.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">الموديل / الاسم</th>
                  <th className="p-3.5">الماركة</th>
                  <th className="p-3.5">IMEI 1</th>
                  <th className="p-3.5">IMEI 2 (اختياري)</th>
                  <th className="p-3.5">اللون</th>
                  <th className="p-3.5">الذاكرة / RAM</th>
                  <th className="p-3.5">حالة الجهاز</th>
                  <th className="p-3.5">سعر الشراء</th>
                  <th className="p-3.5">سعر البيع</th>
                  <th className="p-3.5">حالة البيع</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredPhones.map((phone) => (
                  <tr key={phone.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Model */}
                    <td className="p-3.5 font-bold text-slate-900">
                      {phone.model}
                    </td>

                    {/* Brand */}
                    <td className="p-3.5 font-semibold text-slate-700">
                      {phone.brand}
                    </td>

                    {/* IMEI 1 */}
                    <td className="p-3.5 font-mono text-slate-800 text-[11px] font-bold">
                      {phone.imei1}
                    </td>

                    {/* IMEI 2 */}
                    <td className="p-3.5 font-mono text-slate-500 text-[11px]">
                      {phone.imei2 || '—'}
                    </td>

                    {/* Color */}
                    <td className="p-3.5 text-slate-700">
                      {phone.color}
                    </td>

                    {/* Storage / RAM */}
                    <td className="p-3.5 text-slate-700 font-medium">
                      {phone.storage} {phone.ram ? `/ ${phone.ram}` : ''}
                    </td>

                    {/* Condition */}
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          phone.condition === 'new'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {phone.condition === 'new' ? 'جديد' : 'مستعمل'}
                      </span>
                    </td>

                    {/* Purchase Price */}
                    <td className="p-3.5 font-mono text-slate-600">
                      {phone.purchasePrice.toLocaleString('fr-DZ')} د.ج
                    </td>

                    {/* Selling Price */}
                    <td className="p-3.5 font-mono font-bold text-emerald-800 text-xs">
                      {phone.sellingPrice.toLocaleString('fr-DZ')} د.ج
                    </td>

                    {/* Sale Status */}
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          phone.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {phone.status === 'available' ? 'متوفر' : 'مباع'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedPhoneForBarcode(phone)}
                          title="طباعة لاصقة الباركود و IMEI"
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Barcode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPhones((prev) => prev.filter((p) => p.id !== phone.id))}
                          title="حذف الجهاز"
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Smartphone}
            title="لا توجد هواتف مسجلة بعد"
            description="سجل أول هاتف لتتبع أرقام الـ IMEI والضمان."
            actionText="+ تسجيل هاتف جديد (IMEI)"
            actionIcon={Plus}
            onAction={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      {/* Add Phone with IMEI Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm">تسجيل هاتف جديد في المخزون (IMEI)</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPhone} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الماركة (Brand) *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50 font-semibold"
                  >
                    <option value="Samsung">Samsung</option>
                    <option value="Apple">Apple iPhone</option>
                    <option value="Xiaomi">Xiaomi / Redmi</option>
                    <option value="Realme">Realme</option>
                    <option value="Oppo">Oppo</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Honor">Honor</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">اسم الموديل *</label>
                  <input
                    type="text"
                    placeholder="مثال: Galaxy S24 Ultra"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                  {formErrors.model && (
                    <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.model}</p>
                  )}
                </div>
              </div>

              {/* IMEI Inputs */}
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                <div className="flex items-center gap-1.5 text-blue-900 font-bold text-[11px]">
                  <Barcode className="w-4 h-4 text-blue-600" />
                  <span>الأرقام التسلسلية الدولية (IMEI 1 & 2)</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم IMEI 1 (15 رقماً) *</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="مثال: 358921098234561"
                    value={formData.imei1}
                    onChange={(e) => setFormData({ ...formData, imei1: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono text-xs bg-white"
                  />
                  {formErrors.imei1 && (
                    <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.imei1}</p>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">رقم IMEI 2 (اختياري)</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="للأجهزة ثنائية الشريحة Dual SIM"
                    value={formData.imei2}
                    onChange={(e) => setFormData({ ...formData, imei2: e.target.value.replace(/\D/g, '') })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-mono text-xs bg-white"
                  />
                </div>
              </div>

              {/* Specs: Storage, RAM, Color */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">سعة التخزين</label>
                  <select
                    value={formData.storage}
                    onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">الرام (RAM)</label>
                  <select
                    value={formData.ram}
                    onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="4GB">4GB</option>
                    <option value="6GB">6GB</option>
                    <option value="8GB">8GB</option>
                    <option value="12GB">12GB</option>
                    <option value="16GB">16GB</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">اللون</label>
                  <input
                    type="text"
                    placeholder="مثال: أسود، أزرق"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              {/* Condition & Battery Health */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">حالة الجهاز</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: 'new' })}
                      className={`p-2 rounded-xl text-center font-bold border transition-colors ${
                        formData.condition === 'new'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      جديد كرتونة
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: 'used' })}
                      className={`p-2 rounded-xl text-center font-bold border transition-colors ${
                        formData.condition === 'used'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      مستعمل مجرب
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    صحة البطارية (%): {formData.condition === 'new' ? '100% (جديد)' : `${formData.batteryHealth}%`}
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    disabled={formData.condition === 'new'}
                    value={formData.batteryHealth}
                    onChange={(e) => setFormData({ ...formData, batteryHealth: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Financials: Purchase & Selling Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    سعر الشراء من المورد (د.ج)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 50000"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    سعر البيع للزبون (د.ج) *
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 56000"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-bold text-emerald-800"
                  />
                  {formErrors.sellingPrice && (
                    <p className="text-[10px] text-rose-600 mt-0.5">{formErrors.sellingPrice}</p>
                  )}
                </div>
              </div>

              {/* Warranty & Supplier */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">فترة الضمان (أشهر)</label>
                  <select
                    value={formData.warrantyMonths}
                    onChange={(e) => setFormData({ ...formData, warrantyMonths: Number(e.target.value) })}
                    className="w-full p-2 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value={0}>بدون ضمان</option>
                    <option value={3}>3 أشهر</option>
                    <option value={6}>6 أشهر</option>
                    <option value={12}>12 شهراً (سنة كاملة)</option>
                    <option value={24}>24 شهراً</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">المورد / المصدر</label>
                  <input
                    type="text"
                    placeholder="سوق بلفور / تاجر الجملة"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold inline-flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>حفظ الهاتف وتوليد الباركود</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Label Modal */}
      {selectedPhoneForBarcode && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl p-5 text-center space-y-4">
            <h3 className="font-bold text-sm text-slate-900">لاصقة الباركود والمخزن (Etiquette)</h3>
            
            <div className="border border-dashed border-slate-300 p-4 rounded-xl bg-slate-50 space-y-2">
              <div className="font-bold text-xs text-slate-900">
                {selectedPhoneForBarcode.brand} {selectedPhoneForBarcode.model}
              </div>
              <div className="text-[10px] text-slate-600">
                {selectedPhoneForBarcode.storage} • {selectedPhoneForBarcode.color}
              </div>
              
              {/* Simulated barcode */}
              <div className="py-2 bg-white rounded border border-slate-200 flex flex-col items-center justify-center">
                <Barcode className="w-44 h-12 text-slate-900" />
                <span className="font-mono text-xs tracking-widest font-bold text-slate-800">
                  {selectedPhoneForBarcode.imei1}
                </span>
              </div>

              <div className="text-sm font-black text-emerald-800">
                {selectedPhoneForBarcode.sellingPrice.toLocaleString('fr-DZ')} د.ج
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedPhoneForBarcode(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                إغلاق
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>طباعة اللاصقة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
