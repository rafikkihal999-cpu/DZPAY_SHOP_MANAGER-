import React, { useState, useMemo } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Truck,
  Phone,
  Tag,
  ShieldCheck,
  Calendar,
  Sparkles,
  Trash2,
  Edit2,
  ExternalLink,
  ChevronDown,
  Layers,
  ArrowRight,
  Info,
  DollarSign,
  Package,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { StatCard } from '../common/StatCard';
import { ConfirmDialog } from '../common/ConfirmDialog';

export interface SupplierPriceQuote {
  id: string;
  productId: string;
  productName: string;
  category: string;
  brand: string;
  supplierName: string;
  region: string;
  supplierPhone?: string;
  purchasePrice: number;
  quality: 'أصلي (Original)' | 'درجة أولى (AAA)' | 'تجاري (Commercial)' | 'مجدد (Refurbished)';
  warrantyMonths?: number;
  inStock: boolean;
  minQuantity?: number;
  notes?: string;
  lastUpdated: string;
}

export const INITIAL_SUPPLIER_QUOTES: SupplierPriceQuote[] = [
  // 1. Anker 20W Charger
  {
    id: 'quote-1',
    productId: 'prod-anker-20w',
    productName: 'شاحن Anker 20W PowerPort III Nano',
    category: 'chargers',
    brand: 'Anker',
    supplierName: 'مؤسسة النور لتوزيع الهواتف',
    region: 'الجزائر - سوق بلفور (الحراش)',
    supplierPhone: '0550 12 34 56',
    purchasePrice: 2350,
    quality: 'أصلي (Original)',
    warrantyMonths: 12,
    inStock: true,
    minQuantity: 5,
    notes: 'ضمان استبدال مباشر، شحن سريع للولايات',
    lastUpdated: '2026-09-08',
  },
  {
    id: 'quote-2',
    productId: 'prod-anker-20w',
    productName: 'شاحن Anker 20W PowerPort III Nano',
    category: 'chargers',
    brand: 'Anker',
    supplierName: 'العالمية للإلكترونيات (دبي العلمة)',
    region: 'سطيف - دبي العلمة (شارع دبي)',
    supplierPhone: '0661 98 76 54',
    purchasePrice: 2550,
    quality: 'أصلي (Original)',
    warrantyMonths: 6,
    inStock: true,
    minQuantity: 10,
    notes: 'علب كاملة مغلقة',
    lastUpdated: '2026-09-05',
  },
  {
    id: 'quote-3',
    productId: 'prod-anker-20w',
    productName: 'شاحن Anker 20W PowerPort III Nano',
    category: 'chargers',
    brand: 'Anker',
    supplierName: 'استيراد وتوزيع الغرب',
    region: 'وهران - المدينة الجديدة',
    supplierPhone: '0770 45 67 89',
    purchasePrice: 2700,
    quality: 'أصلي (Original)',
    warrantyMonths: 6,
    inStock: false,
    minQuantity: 5,
    notes: 'توصيل مجاني لولايات الغرب',
    lastUpdated: '2026-09-02',
  },

  // 2. Samsung A15 Screen Service Pack
  {
    id: 'quote-4',
    productId: 'prod-sam-a15-screen',
    productName: 'شاشة Samsung Galaxy A15 AMOLED (Service Pack)',
    category: 'parts',
    brand: 'Samsung',
    supplierName: 'إلكترونيات العلمة كابا',
    region: 'سطيف - دبي العلمة (شارع دبي)',
    supplierPhone: '0662 11 22 33',
    purchasePrice: 6200,
    quality: 'أصلي (Original)',
    warrantyMonths: 3,
    inStock: true,
    minQuantity: 2,
    notes: 'باك أصلي مع الإطار وبصمة شغالة 100%',
    lastUpdated: '2026-09-09',
  },
  {
    id: 'quote-5',
    productId: 'prod-sam-a15-screen',
    productName: 'شاشة Samsung Galaxy A15 AMOLED (Service Pack)',
    category: 'parts',
    brand: 'Samsung',
    supplierName: 'قطع غيار بلفور سنتر',
    region: 'الجزائر - سوق بلفور (الحراش)',
    supplierPhone: '0551 33 44 55',
    purchasePrice: 6750,
    quality: 'أصلي (Original)',
    warrantyMonths: 1,
    inStock: true,
    minQuantity: 1,
    notes: 'متوفرة بكميات جاهزة للتسليم',
    lastUpdated: '2026-09-07',
  },
  {
    id: 'quote-6',
    productId: 'prod-sam-a15-screen',
    productName: 'شاشة Samsung Galaxy A15 AMOLED (Service Pack)',
    category: 'parts',
    brand: 'Samsung',
    supplierName: 'محطة التوزيع الشرقية',
    region: 'قسنطينة - وسط المدينة',
    supplierPhone: '0560 99 88 77',
    purchasePrice: 6900,
    quality: 'أصلي (Original)',
    warrantyMonths: 1,
    inStock: true,
    minQuantity: 2,
    notes: 'شاملة لصقة الحماية',
    lastUpdated: '2026-08-30',
  },

  // 3. Baseus 100W Type-C Cable
  {
    id: 'quote-7',
    productId: 'prod-baseus-cable',
    productName: 'كابل شحن سريع Type-C إلى Type-C Baseus 100W',
    category: 'cables',
    brand: 'Baseus',
    supplierName: 'العالمية للإلكترونيات (دبي العلمة)',
    region: 'سطيف - دبي العلمة (شارع دبي)',
    supplierPhone: '0661 98 76 54',
    purchasePrice: 480,
    quality: 'أصلي (Original)',
    warrantyMonths: 6,
    inStock: true,
    minQuantity: 20,
    notes: 'سعر بالكرتونة (20 قطعة)، نايلون مقوى',
    lastUpdated: '2026-09-08',
  },
  {
    id: 'quote-8',
    productId: 'prod-baseus-cable',
    productName: 'كابل شحن سريع Type-C إلى Type-C Baseus 100W',
    category: 'cables',
    brand: 'Baseus',
    supplierName: 'مؤسسة النور لتوزيع الهواتف',
    region: 'الجزائر - سوق بلفور (الحراش)',
    supplierPhone: '0550 12 34 56',
    purchasePrice: 580,
    quality: 'أصلي (Original)',
    warrantyMonths: 3,
    inStock: true,
    minQuantity: 10,
    notes: 'بيع نصف كرتونة متاح',
    lastUpdated: '2026-09-06',
  },
  {
    id: 'quote-9',
    productId: 'prod-baseus-cable',
    productName: 'كابل شحن سريع Type-C إلى Type-C Baseus 100W',
    category: 'cables',
    brand: 'Baseus',
    supplierName: 'مستودع باب الزوار للإكسسوارات',
    region: 'الجزائر - باب الزوار',
    supplierPhone: '0540 22 33 44',
    purchasePrice: 650,
    quality: 'درجة أولى (AAA)',
    warrantyMonths: 1,
    inStock: true,
    minQuantity: 5,
    notes: 'تسليم سريع نفس اليوم في العاصمة',
    lastUpdated: '2026-08-25',
  },

  // 4. Oraimo FreePods 4
  {
    id: 'quote-10',
    productId: 'prod-oraimo-freepods4',
    productName: 'سماعات بلوتوث Oraimo FreePods 4 مع ANC',
    category: 'audio',
    brand: 'Oraimo',
    supplierName: 'ديزاد إمبورت مستورد مباشر',
    region: 'مستورد مباشر (Importateur Direct)',
    supplierPhone: '0555 77 88 99',
    purchasePrice: 3850,
    quality: 'أصلي (Original)',
    warrantyMonths: 12,
    inStock: true,
    minQuantity: 10,
    notes: 'سلعة معتمدة من الوكيل الحصري مع ختم الضمان',
    lastUpdated: '2026-09-09',
  },
  {
    id: 'quote-11',
    productId: 'prod-oraimo-freepods4',
    productName: 'سماعات بلوتوث Oraimo FreePods 4 مع ANC',
    category: 'audio',
    brand: 'Oraimo',
    supplierName: 'مؤسسة النور لتوزيع الهواتف',
    region: 'الجزائر - سوق بلفور (الحراش)',
    supplierPhone: '0550 12 34 56',
    purchasePrice: 4200,
    quality: 'أصلي (Original)',
    warrantyMonths: 6,
    inStock: true,
    minQuantity: 5,
    notes: 'متوفر باللونين الأبيض والأسود',
    lastUpdated: '2026-09-04',
  },
  {
    id: 'quote-12',
    productId: 'prod-oraimo-freepods4',
    productName: 'سماعات بلوتوث Oraimo FreePods 4 مع ANC',
    category: 'audio',
    brand: 'Oraimo',
    supplierName: 'استيراد وتوزيع الغرب',
    region: 'وهران - المدينة الجديدة',
    supplierPhone: '0770 45 67 89',
    purchasePrice: 4450,
    quality: 'أصلي (Original)',
    warrantyMonths: 6,
    inStock: false,
    minQuantity: 5,
    notes: 'طلبية قيد الوصول الأسبوع القادم',
    lastUpdated: '2026-08-28',
  },

  // 5. iPhone 11 Pro Max Deji Battery
  {
    id: 'quote-13',
    productId: 'prod-deji-iphone11pm',
    productName: 'بطارية iPhone 11 Pro Max سعة مضاعفة Deji أصلية',
    category: 'parts',
    brand: 'Apple',
    supplierName: 'قطع غيار بلفور سنتر',
    region: 'الجزائر - سوق بلفور (الحراش)',
    supplierPhone: '0551 33 44 55',
    purchasePrice: 3400,
    quality: 'أصلي (Original)',
    warrantyMonths: 6,
    inStock: true,
    minQuantity: 3,
    notes: 'نسبة البطارية تظهر 100% بدون رسائل خطأ',
    lastUpdated: '2026-09-08',
  },
  {
    id: 'quote-14',
    productId: 'prod-deji-iphone11pm',
    productName: 'بطارية iPhone 11 Pro Max سعة مضاعفة Deji أصلية',
    category: 'parts',
    brand: 'Apple',
    supplierName: 'إلكترونيات العلمة كابا',
    region: 'سطيف - دبي العلمة (شارع دبي)',
    supplierPhone: '0662 11 22 33',
    purchasePrice: 3800,
    quality: 'أصلي (Original)',
    warrantyMonths: 3,
    inStock: true,
    minQuantity: 5,
    notes: 'مع طقم مفكات ولصقات تركيب مجاناً',
    lastUpdated: '2026-09-02',
  },
];

const CATEGORY_NAMES: Record<string, string> = {
  all: 'كل الفئات',
  chargers: 'شواحن وبنوك طاقة',
  cables: 'كابلات وتوصيلات',
  parts: 'شاشات وقطع غيار',
  audio: 'سماعات وصوتيات',
  protection: 'حماية وأغلفة',
  phones: 'هواتف ذكية',
  accessories: 'إكسسوارات متنوعة',
};

interface SupplierPriceComparisonProps {
  existingSuppliers: Array<{ supplierName: string; region: string; phone?: string }>;
  onNavigateTo?: (sectionId: string) => void;
}

export const SupplierPriceComparison: React.FC<SupplierPriceComparisonProps> = ({
  existingSuppliers,
}) => {
  const { currency } = useAuth();
  const { language } = useLanguage();

  // Storage key for quotes
  const STORAGE_KEY = 'dzpay_supplier_price_quotes_v1';

  const [quotes, setQuotes] = useState<SupplierPriceQuote[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load quotes from storage:', e);
      }
    }
    return INITIAL_SUPPLIER_QUOTES;
  });

  // Save to local storage on change
  const updateQuotes = (newQuotes: SupplierPriceQuote[]) => {
    setQuotes(newQuotes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuotes));
    } catch (e) {
      console.error('Failed to persist quotes:', e);
    }
  };

  // View state
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductFilter, setSelectedProductFilter] = useState('all');
  const [sortOption, setSortOption] = useState<'spread_desc' | 'name_asc' | 'quotes_desc'>('spread_desc');

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    category: 'chargers',
    brand: '',
    supplierName: existingSuppliers[0]?.supplierName || 'مؤسسة النور لتوزيع الهواتف',
    region: existingSuppliers[0]?.region || 'الجزائر - سوق بلفور (الحراش)',
    supplierPhone: existingSuppliers[0]?.phone || '',
    purchasePrice: '',
    quality: 'أصلي (Original)' as SupplierPriceQuote['quality'],
    warrantyMonths: '6',
    inStock: true,
    minQuantity: '1',
    notes: '',
  });

  // Group quotes by product name (or productId)
  const groupedProducts = useMemo(() => {
    const map = new Map<string, SupplierPriceQuote[]>();

    quotes.forEach((q) => {
      const key = q.productName.trim();
      const existing = map.get(key) || [];
      existing.push(q);
      map.set(key, existing);
    });

    const result: Array<{
      productName: string;
      category: string;
      brand: string;
      quotes: SupplierPriceQuote[];
      minPrice: number;
      maxPrice: number;
      avgPrice: number;
      priceSpread: number; // max - min
      spreadPercent: number;
      bestQuote: SupplierPriceQuote;
    }> = [];

    map.forEach((itemQuotes, productName) => {
      // Sort quotes ascending by purchase price (cheapest first)
      const sorted = [...itemQuotes].sort((a, b) => a.purchasePrice - b.purchasePrice);
      const minPrice = sorted[0].purchasePrice;
      const maxPrice = sorted[sorted.length - 1].purchasePrice;
      const sum = sorted.reduce((acc, curr) => acc + curr.purchasePrice, 0);
      const avgPrice = Math.round(sum / sorted.length);
      const priceSpread = maxPrice - minPrice;
      const spreadPercent = minPrice > 0 ? Math.round((priceSpread / minPrice) * 100) : 0;

      result.push({
        productName,
        category: sorted[0].category,
        brand: sorted[0].brand,
        quotes: sorted,
        minPrice,
        maxPrice,
        avgPrice,
        priceSpread,
        spreadPercent,
        bestQuote: sorted[0],
      });
    });

    return result;
  }, [quotes]);

  // Unique list of product names for quick filter
  const productOptions = useMemo(() => {
    return Array.from(new Set(quotes.map((q) => q.productName)));
  }, [quotes]);

  // Filtered grouped products
  const filteredProducts = useMemo(() => {
    let filtered = groupedProducts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        p.productName.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.quotes.some(
          (item) =>
            item.supplierName.toLowerCase().includes(q) ||
            item.region.toLowerCase().includes(q)
        );

      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      const matchesProduct =
        selectedProductFilter === 'all' || p.productName === selectedProductFilter;

      return matchesSearch && matchesCategory && matchesProduct;
    });

    // Sorting
    if (sortOption === 'spread_desc') {
      filtered.sort((a, b) => b.priceSpread - a.priceSpread);
    } else if (sortOption === 'name_asc') {
      filtered.sort((a, b) => a.productName.localeCompare(b.productName, 'ar'));
    } else if (sortOption === 'quotes_desc') {
      filtered.sort((a, b) => b.quotes.length - a.quotes.length);
    }

    return filtered;
  }, [groupedProducts, searchQuery, selectedCategory, selectedProductFilter, sortOption]);

  // Overall comparison metrics
  const totalComparedProducts = groupedProducts.length;
  const totalQuotesCount = quotes.length;
  const totalPotentialSavings = useMemo(() => {
    return groupedProducts.reduce((sum, p) => sum + p.priceSpread, 0);
  }, [groupedProducts]);

  // Supplier ranking (which supplier has the most "best price" badges)
  const topWinningSupplier = useMemo(() => {
    const winsMap: Record<string, number> = {};
    groupedProducts.forEach((p) => {
      const best = p.bestQuote.supplierName;
      winsMap[best] = (winsMap[best] || 0) + 1;
    });

    let bestSupplier = 'لا يوجد';
    let maxWins = 0;
    Object.entries(winsMap).forEach(([sup, count]) => {
      if (count > maxWins) {
        maxWins = count;
        bestSupplier = sup;
      }
    });
    return { name: bestSupplier, count: maxWins };
  }, [groupedProducts]);

  // Add new quote
  const handleAddQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim() || !formData.supplierName.trim() || !formData.purchasePrice) {
      return;
    }

    const price = Number(formData.purchasePrice) || 0;
    const newQuote: SupplierPriceQuote = {
      id: `quote-${Date.now()}`,
      productId: `prod-${Date.now().toString().slice(-4)}`,
      productName: formData.productName.trim(),
      category: formData.category,
      brand: formData.brand.trim() || 'عام',
      supplierName: formData.supplierName.trim(),
      region: formData.region.trim(),
      supplierPhone: formData.supplierPhone.trim(),
      purchasePrice: price,
      quality: formData.quality,
      warrantyMonths: Number(formData.warrantyMonths) || 0,
      inStock: formData.inStock,
      minQuantity: Number(formData.minQuantity) || 1,
      notes: formData.notes.trim(),
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    updateQuotes([newQuote, ...quotes]);
    setIsAddModalOpen(false);

    // Reset form partially
    setFormData({
      ...formData,
      productName: '',
      purchasePrice: '',
      notes: '',
    });
  };

  // Delete quote
  const handleDeleteQuote = () => {
    if (deleteTargetId) {
      updateQuotes(quotes.filter((q) => q.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  return (
    <div id="supplier-price-comparison" className="space-y-5" dir="rtl">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="المنتجات قيد المقارنة"
          value={`${totalComparedProducts} منتج`}
          helperText="تحليل أسعار الشراء عبر أسواق الجملة"
          icon={Package}
          colorScheme="slate"
        />
        <StatCard
          label="إجمالي عروض الموردين"
          value={`${totalQuotesCount} عرض مسجل`}
          helperText="عروض أسعار من بلفور، العلمة، والغرب"
          icon={Truck}
          colorScheme="blue"
        />
        <StatCard
          label="فارق التوفير الإجمالي"
          value={`${totalPotentialSavings.toLocaleString('fr-DZ')} ${currency}`}
          helperText="فرق التكلفة بين أرخص وأعلى مورد"
          icon={TrendingDown}
          colorScheme="emerald"
        />
        <StatCard
          label="المورد الأفضل سعراً"
          value={topWinningSupplier.count > 0 ? topWinningSupplier.name : 'قيد المقارنة'}
          helperText={`${topWinningSupplier.count} منتجات بأفضل سعر شراء متاح`}
          icon={Award}
          colorScheme="amber"
        />
      </div>

      {/* Guide Banner for Visual Indicators */}
      <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-rose-50 dark:from-emerald-950/20 dark:via-[#0f172a] dark:to-rose-950/20 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              نظام المؤشرات المرئية لأسعار الشراء (Visual Price Indicator)
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              يميز النظام تلقائياً عروض الموردين: الأخضر لأفضل وأرخص سعر متوفر، والأحمر للأسعار المرتفعة مع حساب الفارق بالدينار الجزائري.
            </p>
          </div>
        </div>

        {/* Legend pills */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            أفضل سعر شراء (الأرخص 🟢)
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 font-bold text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            أعلى من أفضل سعر (🔴 بفارق التكلفة)
          </span>
        </div>
      </div>

      {/* Control Bar: Filters, Search & Add Action */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ابحث باسم المنتج، الماركة، أو اسم المورد..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600 transition-colors"
            />
          </div>

          {/* Action buttons & View mode */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View mode toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                بطاقات مقارنة
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                جدول مفصل
              </button>
            </div>

            {/* Add Quote Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ إضافة عرض سعر</span>
            </button>
          </div>
        </div>

        {/* Category Chips and Product Selector */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === key
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-[11px] font-medium">الفرز:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="py-1 px-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden"
            >
              <option value="spread_desc">الأعلى فارق سعر (فرص التوفير)</option>
              <option value="quotes_desc">الأكثر عروضاً من الموردين</option>
              <option value="name_asc">اسم المنتج (أبجدياً)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content: Cards or Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            لا توجد عروض أسعار مطابقة للبحث
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            قم بتعديل شروط التصفية أو إضافة عرض سعر مورد جديد للمنتجات التي تود مقارنتها.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 cursor-pointer shadow-xs"
          >
            + إضافة عرض سعر جديد
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Cards Comparison View */
        <div className="space-y-4">
          {filteredProducts.map((group, idx) => {
            const hasMultipleQuotes = group.quotes.length > 1;

            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Product Header */}
                <div className="p-4 bg-slate-50/90 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold shadow-2xs">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {group.productName}
                        </h3>
                        {group.brand && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {group.brand}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                          {CATEGORY_NAMES[group.category] || group.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{group.quotes.length} موردين مسجلين لهذا المنتج</span>
                        {hasMultipleQuotes && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                              أفضل سعر شراء: {group.minPrice.toLocaleString('fr-DZ')} {currency}
                            </span>
                            <span>•</span>
                            <span className="text-slate-600 dark:text-slate-400">
                              متوسط السعر: {group.avgPrice.toLocaleString('fr-DZ')} {currency}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Highlight of the Best Deal */}
                  {hasMultipleQuotes && group.priceSpread > 0 && (
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl">
                      <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          أقصى فارق توفير
                        </div>
                        <div className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                          {group.priceSpread.toLocaleString('fr-DZ')} {currency} ({group.spreadPercent}%)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suppliers List for this product */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {group.quotes.map((quote, qIdx) => {
                    const isBestPrice = quote.purchasePrice === group.minPrice;
                    const priceDiff = quote.purchasePrice - group.minPrice;
                    const diffPercent =
                      group.minPrice > 0 ? Math.round((priceDiff / group.minPrice) * 100) : 0;

                    return (
                      <div
                        key={quote.id}
                        className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
                          isBestPrice
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                        }`}
                      >
                        {/* Supplier Info */}
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Rank indicator badge */}
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                              isBestPrice
                                ? 'bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-300 dark:ring-emerald-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {qIdx + 1}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                {quote.supplierName}
                              </span>

                              {/* VISUAL INDICATOR: Green if Best Price, Red if Higher Price */}
                              {isBestPrice ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white shadow-2xs animate-pulse">
                                  <CheckCircle2 className="w-3 h-3" />
                                  أفضل سعر شراء (الأرخص 🟢)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300">
                                  <TrendingUp className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                                  أعلى بـ +{priceDiff.toLocaleString('fr-DZ')} {currency} (+{diffPercent}%) 🔴
                                </span>
                              )}

                              {/* Stock status */}
                              {quote.inStock ? (
                                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                  متوفر
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium text-slate-400">
                                  غير متوفر حالياً
                                </span>
                              )}
                            </div>

                            {/* Details: Region, Phone, Quality */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5 text-slate-400" />
                                {quote.region}
                              </span>

                              {quote.supplierPhone && (
                                <span className="flex items-center gap-1 font-mono text-slate-700 dark:text-slate-300">
                                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                  <a
                                    href={`tel:${quote.supplierPhone.replace(/\s+/g, '')}`}
                                    className="hover:underline"
                                    dir="ltr"
                                  >
                                    {quote.supplierPhone}
                                  </a>
                                </span>
                              )}

                              <span className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                {quote.quality}
                                {quote.warrantyMonths ? ` (${quote.warrantyMonths} أشهر ضمان)` : ''}
                              </span>

                              {quote.minQuantity && quote.minQuantity > 1 && (
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                                  الحد الأدنى: {quote.minQuantity} قطع
                                </span>
                              )}
                            </div>

                            {quote.notes && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-1">
                                ملاحظة: {quote.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price & Actions Column */}
                        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-medium">سعر الشراء بالجملة</div>
                            <div
                              className={`text-base sm:text-lg font-black font-mono ${
                                isBestPrice
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {quote.purchasePrice.toLocaleString('fr-DZ')} {currency}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              تحديث: {quote.lastUpdated}
                            </div>
                          </div>

                          {/* Delete quote action */}
                          <div className="flex items-center gap-1">
                            {quote.supplierPhone && (
                              <a
                                href={`tel:${quote.supplierPhone.replace(/\s+/g, '')}`}
                                title="اتصال بالمورد"
                                className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => setDeleteTargetId(quote.id)}
                              title="حذف هذا العرض"
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table Comparison View */
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                <tr>
                  <th className="py-3 px-4">المنتج والماركة</th>
                  <th className="py-3 px-4">المورد والمنطقة</th>
                  <th className="py-3 px-4">الهاتف</th>
                  <th className="py-3 px-4">سعر الشراء</th>
                  <th className="py-3 px-4 text-center">مؤشر السعر (أخضر/أحمر)</th>
                  <th className="py-3 px-4">الجودة والضمان</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredProducts.flatMap((group) =>
                  group.quotes.map((quote) => {
                    const isBestPrice = quote.purchasePrice === group.minPrice;
                    const priceDiff = quote.purchasePrice - group.minPrice;

                    return (
                      <tr
                        key={quote.id}
                        className={`transition-colors ${
                          isBestPrice
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {quote.productName}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {quote.brand} • {CATEGORY_NAMES[quote.category] || quote.category}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {quote.supplierName}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {quote.region}
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono">
                          {quote.supplierPhone ? (
                            <a
                              href={`tel:${quote.supplierPhone.replace(/\s+/g, '')}`}
                              className="text-emerald-700 dark:text-emerald-400 hover:underline"
                              dir="ltr"
                            >
                              {quote.supplierPhone}
                            </a>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-sm">
                          <span
                            className={
                              isBestPrice
                                ? 'text-emerald-700 dark:text-emerald-400 font-black'
                                : 'text-slate-900 dark:text-white'
                            }
                          >
                            {quote.purchasePrice.toLocaleString('fr-DZ')} {currency}
                          </span>
                        </td>

                        {/* Visual Indicator Cell */}
                        <td className="py-3 px-4 text-center">
                          {isBestPrice ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              أفضل سعر 🟢
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300">
                              + {priceDiff.toLocaleString('fr-DZ')} دج 🔴
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                            {quote.quality}
                          </div>
                          {quote.warrantyMonths ? (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              ضمان {quote.warrantyMonths} أشهر
                            </div>
                          ) : null}
                        </td>

                        <td className="py-3 px-4">
                          {quote.inStock ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              متوفر
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              غير متوفر
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setDeleteTargetId(quote.id)}
                            title="حذف هذا العرض"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Supplier Quote Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          dir="rtl"
        >
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    إضافة عرض سعر شراء من مورد
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    تسجيل تسعيرة الجملة لتحديث المقارنة والمؤشرات المرئية تلقائياً
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddQuote} className="p-5 space-y-3.5 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المنتج / الموديل <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شاحن Anker 20W أو شاشة Redmi Note 13"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  list="known-products-list"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
                <datalist id="known-products-list">
                  {productOptions.map((name, i) => (
                    <option key={i} value={name} />
                  ))}
                </datalist>
              </div>

              {/* Category & Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الفئة
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="chargers">شواحن وبنوك طاقة</option>
                    <option value="cables">كابلات وتوصيلات</option>
                    <option value="parts">شاشات وقطع غيار</option>
                    <option value="audio">سماعات وصوتيات</option>
                    <option value="protection">حماية وأغلفة</option>
                    <option value="phones">هواتف ذكية</option>
                    <option value="accessories">إكسسوارات أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الماركة (Brand)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: Apple, Samsung, Anker"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Supplier Selection */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المورد / تاجر الجملة <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مؤسسة النور لتوزيع الهواتف (بلفور)"
                  value={formData.supplierName}
                  onChange={(e) => {
                    const supName = e.target.value;
                    const matched = existingSuppliers.find((s) => s.supplierName === supName);
                    setFormData({
                      ...formData,
                      supplierName: supName,
                      region: matched ? matched.region : formData.region,
                      supplierPhone: matched && matched.phone ? matched.phone : formData.supplierPhone,
                    });
                  }}
                  list="known-suppliers-list"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-600"
                />
                <datalist id="known-suppliers-list">
                  {existingSuppliers.map((s, idx) => (
                    <option key={idx} value={s.supplierName}>
                      {s.region}
                    </option>
                  ))}
                  <option value="مؤسسة النور لتوزيع الهواتف" />
                  <option value="العالمية للإلكترونيات (دبي العلمة)" />
                  <option value="قطع غيار بلفور سنتر" />
                  <option value="ديزاد إمبورت مستورد مباشر" />
                  <option value="استيراد وتوزيع الغرب (وهران)" />
                </datalist>
              </div>

              {/* Region and Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المنطقة / المركز التجاري
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: بلفور الحراش، شارع دبي العلمة"
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم هاتف المورد
                  </label>
                  <input
                    type="tel"
                    placeholder="05 / 06 / 07 ..."
                    value={formData.supplierPhone}
                    onChange={(e) => setFormData({ ...formData, supplierPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Purchase Price & Quality */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    سعر الشراء بالجملة ({currency}) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="مثال: 2400"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-mono font-bold focus:outline-hidden focus:border-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الجودة / الصنف
                  </label>
                  <select
                    value={formData.quality}
                    onChange={(e) =>
                      setFormData({ ...formData, quality: e.target.value as SupplierPriceQuote['quality'] })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="أصلي (Original)">أصلي (Original)</option>
                    <option value="درجة أولى (AAA)">درجة أولى (AAA)</option>
                    <option value="تجاري (Commercial)">تجاري (Commercial)</option>
                    <option value="مجدد (Refurbished)">مجدد (Refurbished)</option>
                  </select>
                </div>
              </div>

              {/* Warranty & Availability */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    مدة الضمان (أشهر)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.warrantyMonths}
                    onChange={(e) => setFormData({ ...formData, warrantyMonths: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    توفر السلعة
                  </label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={() => setFormData({ ...formData, inStock: true })}
                        className="text-emerald-700 focus:ring-emerald-600"
                      />
                      <span className="text-slate-800 dark:text-slate-200 font-bold">متوفرة</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="inStock"
                        checked={!formData.inStock}
                        onChange={() => setFormData({ ...formData, inStock: false })}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-slate-500">غير متوفرة</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات أو شروط التوريد (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: خصم 5% عند شراء كرتون كامل، توصيل مجاني..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-xs cursor-pointer"
                >
                  حفظ وتحديث المقارنة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="تأكيد حذف عرض السعر"
        message="هل أنت متأكد من رغبتك في إزالة هذا العرض من قائمة مقارنة الأسعار؟"
        confirmText="نعم، حذف"
        cancelText="إلغاء"
        variant="danger"
        onConfirm={handleDeleteQuote}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
