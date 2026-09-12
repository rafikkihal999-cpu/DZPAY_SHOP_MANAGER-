/**
 * نظام مراقبة مستويات المخزون والتنبيه الذكي
 * DZPAY SHOP - Stock Monitoring & Low Stock Alert Utility
 */

export interface MonitoredProduct {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  stock?: number;
  stockQuantity?: number;
  minStockAlert?: number;
  minThreshold?: number;
  costPrice?: number;
  sellingPrice?: number;
  barcode?: string;
}

export type AlertSeverity = 'out_of_stock' | 'critical' | 'low';

export interface StockAlertItem {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  currentStock: number;
  minThreshold: number;
  deficit: number;
  stockRatio: number; // currentStock / minThreshold
  severity: AlertSeverity;
  severityLabel: string;
  message: string;
  barcode?: string;
}

export interface StockMonitoringSummary {
  hasLowStockAlert: boolean;
  totalMonitored: number;
  totalAlerts: number;
  outOfStockCount: number;
  criticalCount: number;
  lowStockCount: number;
  items: StockAlertItem[];
}

/**
 * دالة لمراقبة كميات المنتجات وفحص رصيد كل منتج ومقارنته بالحد الأدنى المحدد
 * تُظهر الأصناف المنخفضة والنافذة مع تصنيف درجة الخطورة (حرج / نفد / منخفض)
 * 
 * @param products قائمة المنتجات المطلوب فحص مخزونها
 * @param globalFallbackMin الحد الأدنى الافتراضي في حال عدم تعيين حد خاص للمنتج (الافتراضي 3 قطع)
 * @returns كائن ملخص شامل بالتنبيهات البصرية وقائمة المنتجات الناقصة
 */
export function checkLowStockProducts(
  products: MonitoredProduct[],
  globalFallbackMin: number = 3
): StockMonitoringSummary {
  if (!products || !Array.isArray(products) || products.length === 0) {
    return {
      hasLowStockAlert: false,
      totalMonitored: 0,
      totalAlerts: 0,
      outOfStockCount: 0,
      criticalCount: 0,
      lowStockCount: 0,
      items: [],
    };
  }

  const alertItems: StockAlertItem[] = [];
  let outOfStockCount = 0;
  let criticalCount = 0;
  let lowStockCount = 0;

  for (const product of products) {
    const currentStock = Math.max(0, product.stockQuantity ?? product.stock ?? 0);
    const minThreshold = Math.max(1, product.minStockAlert ?? product.minThreshold ?? globalFallbackMin);

    // إذا كان الرصيد الحالي أقل من أو يساوي الحد الأدنى المحدد
    if (currentStock <= minThreshold) {
      const deficit = minThreshold - currentStock;
      const stockRatio = minThreshold > 0 ? currentStock / minThreshold : 0;

      let severity: AlertSeverity = 'low';
      let severityLabel = 'منخفض';
      let message = `المخزون (${currentStock}) قارب على النفاد، الحد الأدنى: ${minThreshold}`;

      if (currentStock === 0) {
        severity = 'out_of_stock';
        severityLabel = 'نفد بالكامل';
        message = `المنتج غير متوفر حالياً بالمخزن (0 قطع)! يتطلب إعادة طلب فوري`;
        outOfStockCount++;
      } else if (currentStock <= Math.max(1, Math.floor(minThreshold / 2))) {
        severity = 'critical';
        severityLabel = 'حرج جداً';
        message = `رصيد حرج (${currentStock} فقط)! عجز بمقدار ${deficit} قطع عن حد الأمان`;
        criticalCount++;
      } else {
        lowStockCount++;
      }

      alertItems.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        currentStock,
        minThreshold,
        deficit,
        stockRatio,
        severity,
        severityLabel,
        message,
        barcode: product.barcode,
      });
    }
  }

  // ترتيب التنبيهات: أولاً النافدة بالكامل، ثم الحرجة، ثم الأقل رصيداً
  alertItems.sort((a, b) => {
    if (a.currentStock === 0 && b.currentStock !== 0) return -1;
    if (b.currentStock === 0 && a.currentStock !== 0) return 1;
    return a.stockRatio - b.stockRatio;
  });

  return {
    hasLowStockAlert: alertItems.length > 0,
    totalMonitored: products.length,
    totalAlerts: alertItems.length,
    outOfStockCount,
    criticalCount,
    lowStockCount,
    items: alertItems,
  };
}

/**
 * بيانات تجريبية معتمدة لمحلات بيع الهواتف والإكسسوارات لاختبار تنبيهات المخزون
 */
export const SAMPLE_MONITORED_PRODUCTS: MonitoredProduct[] = [
  {
    id: 'prod-s1',
    name: 'شاحن سريع Anker 20W Type-C الأصلي',
    brand: 'Anker',
    category: 'chargers',
    stockQuantity: 1, // أقل من الحد الأدنى (حرج)
    minStockAlert: 5,
    costPrice: 2100,
    sellingPrice: 2800,
    barcode: '848061058291',
  },
  {
    id: 'prod-s2',
    name: 'سماعات بلوتوث AirPods Pro 2 (ANC)',
    brand: 'Apple',
    category: 'audio',
    stockQuantity: 0, // نفد بالكامل
    minStockAlert: 3,
    costPrice: 36000,
    sellingPrice: 43000,
    barcode: '194253397168',
  },
  {
    id: 'prod-s3',
    name: 'كابل Baseus Type-C إلى Type-C 100W',
    brand: 'Baseus',
    category: 'cables',
    stockQuantity: 2, // أقل من الحد الأدنى
    minStockAlert: 8,
    costPrice: 950,
    sellingPrice: 1400,
    barcode: '695315629104',
  },
  {
    id: 'prod-s4',
    name: 'Xiaomi Redmi Note 13 Pro (8/256GB)',
    brand: 'Xiaomi',
    category: 'phones',
    stockQuantity: 2, // منخفض
    minStockAlert: 4,
    costPrice: 46000,
    sellingPrice: 52000,
    barcode: '694181275920',
  },
  {
    id: 'prod-s5',
    name: 'لاصقة حماية زجاجية 9D لهواتف Samsung S24',
    brand: 'Generic',
    category: 'protection',
    stockQuantity: 45, // متوفر بكمية كافية
    minStockAlert: 10,
    costPrice: 150,
    sellingPrice: 500,
    barcode: '690123456789',
  },
  {
    id: 'prod-s6',
    name: 'بطاقة تعبئة فليكسي أوريدو 1000 د.ج',
    brand: 'Ooredoo',
    category: 'flexy',
    stockQuantity: 30, // متوفر
    minStockAlert: 10,
    costPrice: 970,
    sellingPrice: 1000,
    barcode: '613000002000',
  },
];
