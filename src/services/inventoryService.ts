/**
 * DZPAY SHOP MANAGER - Inventory & Valuation Service
 * محرك احتساب تقييم المخزون، تكلفة البضاعة المباعة (COGS)،
 * ومبالغ إعادة تكوين المخزون وسجلات الحركة.
 */

import {
  InventoryProduct,
  InventoryMovement,
  InventoryValuationSummary,
  ReorderSuggestionItem,
  StockMovementType,
} from '../types/inventory';

const STORAGE_PRODUCTS_KEY = 'dzpay_inventory_products_v2';
const STORAGE_MOVEMENTS_KEY = 'dzpay_inventory_movements_v2';

/**
 * قائمة أولية غنية للمنتجات في محلات الهواتف والإكسسوارات الجزائرية
 * تتضمن منتج Samsung A17 كما ورد في طلب المستخدم بدقة تامة.
 */
export const INITIAL_INVENTORY_PRODUCTS: InventoryProduct[] = [
  {
    id: 'prod-samsung-a17',
    name: 'Samsung Galaxy A17',
    barcode: '880609124501',
    brand: 'Samsung',
    category: 'phones',
    model: 'Galaxy A17 128GB',
    purchasePrice: 25000,
    sellingPrice: 30000,
    stock: 2, // المخزون الحالي: 2
    minStockAlert: 3, // حد إعادة الطلب: 3
    suggestedReorderQty: 5, // الكمية المقترحة: 5 => تكلفة 125,000 DA
    unitsSold: 6,
    lastMovementDate: '2026-09-09T14:30:00Z',
    status: 'منخفض',
  },
  {
    id: 'prod-iphone-15-pm',
    name: 'iPhone 15 Pro Max 256GB',
    barcode: '195949038291',
    brand: 'Apple',
    category: 'phones',
    model: 'Titanium 256GB',
    purchasePrice: 210000,
    sellingPrice: 245000,
    stock: 3,
    minStockAlert: 2,
    suggestedReorderQty: 4,
    unitsSold: 4,
    lastMovementDate: '2026-09-10T11:15:00Z',
    status: 'متوفر',
  },
  {
    id: 'prod-redmi-note-13',
    name: 'Xiaomi Redmi Note 13 Pro',
    barcode: '694181275920',
    brand: 'Xiaomi',
    category: 'phones',
    model: 'Redmi Note 13 Pro 8/256GB',
    purchasePrice: 44000,
    sellingPrice: 52000,
    stock: 6,
    minStockAlert: 4,
    suggestedReorderQty: 5,
    unitsSold: 8,
    lastMovementDate: '2026-09-08T16:20:00Z',
    status: 'متوفر',
  },
  {
    id: 'prod-anker-20w',
    name: 'شاحن سريع Anker 20W USB-C',
    barcode: '848061058291',
    brand: 'Anker',
    category: 'chargers',
    model: 'PowerPort III 20W Cube',
    purchasePrice: 1800,
    sellingPrice: 2800,
    stock: 18,
    minStockAlert: 10,
    suggestedReorderQty: 25,
    unitsSold: 32,
    lastMovementDate: '2026-09-10T10:00:00Z',
    status: 'متوفر',
  },
  {
    id: 'prod-baseus-cable',
    name: 'كابل Baseus Type-C إلى Type-C 100W',
    barcode: '695315629104',
    brand: 'Baseus',
    category: 'cables',
    model: 'Cafule 100W PD 2m',
    purchasePrice: 850,
    sellingPrice: 1400,
    stock: 35,
    minStockAlert: 15,
    suggestedReorderQty: 30,
    unitsSold: 45,
    lastMovementDate: '2026-09-09T18:45:00Z',
    status: 'متوفر',
  },
  {
    id: 'prod-airpods-pro-2',
    name: 'سماعات بلوتوث AirPods Pro 2 (ANC)',
    barcode: '194253397168',
    brand: 'Apple',
    category: 'audio',
    model: 'AirPods Pro 2 Type-C',
    purchasePrice: 36000,
    sellingPrice: 43000,
    stock: 1,
    minStockAlert: 3,
    suggestedReorderQty: 4,
    unitsSold: 6,
    lastMovementDate: '2026-09-07T12:10:00Z',
    status: 'منخفض',
  },
  {
    id: 'prod-glass-9d',
    name: 'لاصقة حماية زجاجية 9D لجميع الموديلات',
    barcode: '690123456789',
    brand: 'Generic',
    category: 'protection',
    model: 'Tempered Glass 9D Full Cover',
    purchasePrice: 180,
    sellingPrice: 500,
    stock: 85,
    minStockAlert: 30,
    suggestedReorderQty: 100,
    unitsSold: 120,
    lastMovementDate: '2026-09-10T12:00:00Z',
    status: 'متوفر',
  },
  {
    id: 'prod-magsafe-case',
    name: 'كفر حماية سيليكون مع ماج سيف MagSafe',
    barcode: '690987654321',
    brand: 'Generic',
    category: 'protection',
    model: 'Magnetic Silicone Case',
    purchasePrice: 900,
    sellingPrice: 1800,
    stock: 24,
    minStockAlert: 10,
    suggestedReorderQty: 20,
    unitsSold: 18,
    lastMovementDate: '2026-09-06T15:30:00Z',
    status: 'متوفر',
  },
  {
    id: 'prod-screen-a54',
    name: 'شاشة هاتف Samsung Galaxy A54 5G (OLED)',
    barcode: '792182910245',
    brand: 'Samsung',
    category: 'parts',
    model: 'Original OLED Display + Touch',
    purchasePrice: 9500,
    sellingPrice: 14000,
    stock: 0, // صنف نفد بالكامل
    minStockAlert: 2,
    suggestedReorderQty: 3,
    unitsSold: 5,
    lastMovementDate: '2026-09-05T09:40:00Z',
    status: 'نفد',
  },
  {
    id: 'prod-stagnant-microusb',
    name: 'كابل Micro-USB قديم 0.5m (منتج راكد)',
    barcode: '692138901234',
    brand: 'Generic',
    category: 'cables',
    model: 'Legacy Micro USB Cable',
    purchasePrice: 300,
    sellingPrice: 600,
    stock: 28, // كمية متبقية راكدة
    minStockAlert: 5,
    suggestedReorderQty: 0,
    unitsSold: 0, // 0 مبيعات منذ فترة طويلة
    lastMovementDate: '2026-06-12T10:00:00Z',
    status: 'متوفر',
  },
];

export const INITIAL_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    productId: 'prod-samsung-a17',
    productName: 'Samsung Galaxy A17',
    barcode: '880609124501',
    type: 'sale',
    quantity: 1,
    previousStock: 3,
    newStock: 2,
    unitCostPrice: 25000,
    unitSellingPrice: 30000,
    employeeName: 'يوسف بن عيسى (كاشير)',
    timestamp: '2026-09-09T14:30:00Z',
    note: 'بيع نقدي للزبون مع فاتورة DZ-2026-0041',
  },
  {
    id: 'mov-2',
    productId: 'prod-iphone-15-pm',
    productName: 'iPhone 15 Pro Max 256GB',
    barcode: '195949038291',
    type: 'sale',
    quantity: 1,
    previousStock: 4,
    newStock: 3,
    unitCostPrice: 210000,
    unitSellingPrice: 245000,
    employeeName: 'يوسف بن عيسى (كاشير)',
    timestamp: '2026-09-10T11:15:00Z',
    note: 'بيع عبر بريدي موب مع تسجيل الـ IMEI',
  },
  {
    id: 'mov-3',
    productId: 'prod-screen-a54',
    productName: 'شاشة هاتف Samsung Galaxy A54 5G (OLED)',
    barcode: '792182910245',
    type: 'sale',
    quantity: 1,
    previousStock: 1,
    newStock: 0,
    unitCostPrice: 9500,
    unitSellingPrice: 14000,
    employeeName: 'أمين دحماني (فني صيانة)',
    timestamp: '2026-09-05T09:40:00Z',
    note: 'تركيب الشاشة في ورشة الصيانة للزبون',
  },
  {
    id: 'mov-4',
    productId: 'prod-anker-20w',
    productName: 'شاحن سريع Anker 20W USB-C',
    barcode: '848061058291',
    type: 'purchase',
    quantity: 20,
    previousStock: 8,
    newStock: 28,
    unitCostPrice: 1800,
    unitSellingPrice: 2800,
    employeeName: 'الحاج بلقاسم (المدير)',
    timestamp: '2026-09-01T10:00:00Z',
    note: 'فاتورة توريد من مؤسسة النور بلفور',
  },
  {
    id: 'mov-5',
    productId: 'prod-airpods-pro-2',
    productName: 'سماعات بلوتوث AirPods Pro 2 (ANC)',
    barcode: '194253397168',
    type: 'damage_loss',
    quantity: 1,
    previousStock: 2,
    newStock: 1,
    unitCostPrice: 36000,
    unitSellingPrice: 43000,
    employeeName: 'أمين دحماني',
    timestamp: '2026-09-07T12:10:00Z',
    note: 'عينة تجريبية تعرضت لكسر في العلبة',
  },
];

/**
 * قراءة المنتجات المحفوظة في التخزين المحلي
 */
export function getStoredInventoryProducts(): InventoryProduct[] {
  if (typeof window === 'undefined') return INITIAL_INVENTORY_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load inventory products:', err);
  }
  return INITIAL_INVENTORY_PRODUCTS;
}

/**
 * حفظ المنتجات في التخزين المحلي
 */
export function saveStoredInventoryProducts(products: InventoryProduct[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save inventory products:', err);
  }
}

/**
 * قراءة سجل الحركات من التخزين المحلي
 */
export function getStoredInventoryMovements(): InventoryMovement[] {
  if (typeof window === 'undefined') return INITIAL_INVENTORY_MOVEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_MOVEMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to load inventory movements:', err);
  }
  return INITIAL_INVENTORY_MOVEMENTS;
}

/**
 * حفظ سجل الحركات في التخزين المحلي
 */
export function saveStoredInventoryMovements(movements: InventoryMovement[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_MOVEMENTS_KEY, JSON.stringify(movements));
  } catch (err) {
    console.error('Failed to save inventory movements:', err);
  }
}

/**
 * إعادة تعيين البيانات إلى البيانات الافتراضية التجريبية
 */
export function resetInventoryToDefaults(): { products: InventoryProduct[]; movements: InventoryMovement[] } {
  saveStoredInventoryProducts(INITIAL_INVENTORY_PRODUCTS);
  saveStoredInventoryMovements(INITIAL_INVENTORY_MOVEMENTS);
  return { products: INITIAL_INVENTORY_PRODUCTS, movements: INITIAL_INVENTORY_MOVEMENTS };
}

/**
 * احتساب ملخص تقييم المخزون، تكلفة البضاعة المباعة (COGS)،
 * ومبلغ إعادة تكوين المخزون
 */
export function calculateInventoryValuation(
  products: InventoryProduct[],
  movements: InventoryMovement[]
): InventoryValuationSummary {
  let totalQuantity = 0;
  let totalPurchaseValue = 0;
  let totalSellingValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  products.forEach((p) => {
    const qty = Math.max(0, p.stock || 0);
    const cost = Math.max(0, p.purchasePrice || 0);
    const sell = Math.max(0, p.sellingPrice || 0);

    totalQuantity += qty;
    // قيمة المخزون بسعر الشراء = مجموع (الكمية الحالية × سعر الشراء)
    totalPurchaseValue += qty * cost;
    // قيمة المخزون بسعر البيع = مجموع (الكمية الحالية × سعر البيع)
    totalSellingValue += qty * sell;

    if (qty === 0) {
      outOfStockCount++;
    } else if (qty <= p.minStockAlert) {
      lowStockCount++;
    }
  });

  // الربح المتوقع = قيمة المخزون بسعر البيع - قيمة المخزون بسعر الشراء
  const expectedProfit = totalSellingValue - totalPurchaseValue;
  const expectedProfitMargin =
    totalSellingValue > 0 ? Math.round((expectedProfit / totalSellingValue) * 100) : 0;

  // احتساب مبيعات وتكلفة البضاعة المباعة (COGS) ومبلغ إعادة تكوين المخزون
  // نحسبها استناداً لحركات البيع المسجلة أو إجمالي الوحدات المباعة
  let totalSalesRevenue = 0;
  let totalCogs = 0;

  // أولاً من خلال سجل حركات البيع الفعلية
  const salesMovements = movements.filter((m) => m.type === 'sale');
  if (salesMovements.length > 0) {
    salesMovements.forEach((m) => {
      const q = Math.abs(m.quantity);
      totalSalesRevenue += q * (m.unitSellingPrice || 0);
      totalCogs += q * (m.unitCostPrice || 0);
    });
  }

  // إضافة رصيد مبيعات المنتجات الإجمالية (unitsSold) إن كانت أكبر
  let unitsSoldRevenue = 0;
  let unitsSoldCogs = 0;
  products.forEach((p) => {
    if (p.unitsSold > 0) {
      unitsSoldRevenue += p.unitsSold * p.sellingPrice;
      unitsSoldCogs += p.unitsSold * p.purchasePrice;
    }
  });

  if (unitsSoldRevenue > totalSalesRevenue) {
    totalSalesRevenue = unitsSoldRevenue;
    totalCogs = unitsSoldCogs;
  }

  // الربح الإجمالي = المبيعات - تكلفة البضاعة
  const totalGrossProfit = totalSalesRevenue - totalCogs;

  // مبلغ إعادة تكوين المخزون = تكلفة البضاعة المباعة المطلوب تخصيصها للموردين لإعادة الشراء
  const restockingReserve = totalCogs;

  return {
    totalProductsCount: products.length,
    totalQuantity,
    totalPurchaseValue,
    totalSellingValue,
    expectedProfit,
    expectedProfitMargin,
    lowStockCount,
    outOfStockCount,
    totalSalesRevenue,
    totalCogs,
    totalGrossProfit,
    restockingReserve,
  };
}

/**
 * تحليل وحساب قائمة مقترحات إعادة الشراء بناءً على النواقص وحد الطلب
 */
export function getReorderSuggestions(products: InventoryProduct[]): ReorderSuggestionItem[] {
  const list: ReorderSuggestionItem[] = [];

  products.forEach((p) => {
    const current = Math.max(0, p.stock || 0);
    const threshold = Math.max(1, p.minStockAlert || 3);

    // إذا كان المخزون أقل من أو يساوي حد إعادة الطلب
    if (current <= threshold) {
      // الكمية المقترحة: إن تم تحديدها بالصنف أو (حد الطلب * 2 - المخزون الحالي)
      let suggestedQty = p.suggestedReorderQty;
      if (!suggestedQty || suggestedQty <= 0) {
        suggestedQty = Math.max(1, threshold * 2 - current);
      }

      // تكلفة الشراء المتوقعة = الكمية المقترحة × سعر الشراء
      const expectedCost = suggestedQty * p.purchasePrice;

      let status: 'نفد' | 'حرج' | 'منخفض' = 'منخفض';
      if (current === 0) status = 'نفد';
      else if (current <= Math.floor(threshold / 2)) status = 'حرج';

      list.push({
        id: `reorder-${p.id}`,
        productId: p.id,
        productName: p.name,
        brand: p.brand,
        category: p.category,
        currentStock: current,
        reorderThreshold: threshold,
        suggestedQuantity: suggestedQty,
        purchasePrice: p.purchasePrice,
        expectedPurchaseCost: expectedCost,
        status,
      });
    }
  });

  // ترتيب القائمة: أولاً المنتجات النافدة ثم الحرجة فالأقل مخزوناً
  return list.sort((a, b) => {
    if (a.currentStock === 0 && b.currentStock > 0) return -1;
    if (b.currentStock === 0 && a.currentStock > 0) return 1;
    return a.currentStock - b.currentStock;
  });
}

/**
 * المنتجات الأكثر مبيعاً
 */
export function getTopSellingProducts(products: InventoryProduct[]): InventoryProduct[] {
  return [...products]
    .filter((p) => (p.unitsSold || 0) > 0)
    .sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0))
    .slice(0, 5);
}

/**
 * المنتجات الراكدة (بطيئة الحركة أو ذات مبيعات منعدمة والمخزون معطل)
 */
export function getStagnantProducts(products: InventoryProduct[]): InventoryProduct[] {
  return products.filter((p) => {
    const hasStock = p.stock > 0;
    const lowSales = (p.unitsSold || 0) <= 1;
    return hasStock && lowSales;
  });
}

/**
 * تسجيل حركة مخزون جديدة وتحديث أرصدة المنتج تلقائياً
 */
export function executeStockMovement(
  movementData: {
    productId: string;
    type: StockMovementType;
    quantity: number;
    employeeName: string;
    note?: string;
    unitCostPrice?: number;
    unitSellingPrice?: number;
  },
  currentProducts: InventoryProduct[],
  currentMovements: InventoryMovement[]
): {
  updatedProducts: InventoryProduct[];
  updatedMovements: InventoryMovement[];
  newMovement: InventoryMovement;
} {
  const targetProduct = currentProducts.find((p) => p.id === movementData.productId);
  if (!targetProduct) {
    throw new Error('المنتج المطلوب تسجيل حركته غير موجود في المخزن');
  }

  const prevStock = targetProduct.stock || 0;
  const qty = Math.abs(movementData.quantity);
  let newStock = prevStock;
  let newUnitsSold = targetProduct.unitsSold || 0;

  switch (movementData.type) {
    case 'purchase':
    case 'return':
      newStock = prevStock + qty;
      if (movementData.type === 'return' && newUnitsSold >= qty) {
        newUnitsSold -= qty;
      }
      break;

    case 'sale':
      newStock = Math.max(0, prevStock - qty);
      newUnitsSold += qty;
      break;

    case 'damage_loss':
      newStock = Math.max(0, prevStock - qty);
      break;

    case 'manual_adjust':
      // تعديل يدوي: قد تكون الكمية موجبة أو سالبة
      newStock = Math.max(0, movementData.quantity);
      break;
  }

  // تحديث حالة المخزون
  let newStatus: 'متوفر' | 'منخفض' | 'نفد' = 'متوفر';
  if (newStock === 0) newStatus = 'نفد';
  else if (newStock <= targetProduct.minStockAlert) newStatus = 'منخفض';

  const unitCost = movementData.unitCostPrice ?? targetProduct.purchasePrice;
  const unitSell = movementData.unitSellingPrice ?? targetProduct.sellingPrice;

  const newMovementRecord: InventoryMovement = {
    id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    productId: targetProduct.id,
    productName: targetProduct.name,
    barcode: targetProduct.barcode,
    type: movementData.type,
    quantity: movementData.type === 'manual_adjust' ? newStock - prevStock : qty,
    previousStock: prevStock,
    newStock,
    unitCostPrice: unitCost,
    unitSellingPrice: unitSell,
    employeeName: movementData.employeeName || 'مدير النظام',
    timestamp: new Date().toISOString(),
    note: movementData.note?.trim() || '',
  };

  const updatedProducts = currentProducts.map((p) => {
    if (p.id === targetProduct.id) {
      return {
        ...p,
        stock: newStock,
        unitsSold: newUnitsSold,
        purchasePrice: unitCost,
        sellingPrice: unitSell,
        status: newStatus,
        lastMovementDate: newMovementRecord.timestamp,
      };
    }
    return p;
  });

  const updatedMovements = [newMovementRecord, ...currentMovements];

  // حفظ التحديثات في التخزين المحلي
  saveStoredInventoryProducts(updatedProducts);
  saveStoredInventoryMovements(updatedMovements);

  return {
    updatedProducts,
    updatedMovements,
    newMovement: newMovementRecord,
  };
}

/**
 * تنسيق المبالغ بالدينار الجزائري بالصيغة القياسية (e.g. 125,000 DA)
 */
export function formatDA(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 DA';
  return `${amount.toLocaleString('fr-DZ')} DA`;
}
