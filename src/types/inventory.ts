/**
 * DZPAY SHOP MANAGER - Inventory & Valuation Types
 * مصمم لدعم التقييم المالي للمخزون، تتبع تكلفة البضاعة المباعة (COGS)،
 * وحساب مبالغ إعادة تكوين المخزون وسجل حركات السلع.
 * متوافق تماماً مع بنية التخزين في Firebase Firestore لاحقاً.
 */

export type StockMovementType =
  | 'purchase'      // شراء وتوريد بضاعة جديدة (+)
  | 'sale'          // بيع بضاعة من المخزن (-)
  | 'return'        // إرجاع بضاعة مباعة (+)
  | 'manual_adjust' // تعديل يدوي ناتج عن جرد فعلي (+/-)
  | 'damage_loss';  // تلف أو ضياع (-)

export interface InventoryProduct {
  id: string;
  name: string;
  barcode: string;
  category: string;
  brand: string;
  model?: string;
  purchasePrice: number;        // سعر الشراء / التكلفة بالدينار (DA)
  sellingPrice: number;         // سعر البيع بالدينار (DA)
  stock: number;                // الكمية المتوفرة حالياً في المخزن
  minStockAlert: number;        // حد إعادة الطلب والتنبيه بالنواقص
  suggestedReorderQty?: number; // الكمية المقترحة للشراء
  unitsSold: number;            // إجمالي الوحدات المباعة تاريخياً
  lastMovementDate?: string;    // تاريخ آخر حركة مخزنية
  status: 'متوفر' | 'منخفض' | 'نفد';
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  barcode?: string;
  type: StockMovementType;
  quantity: number;             // الكمية المتأثرة
  previousStock: number;        // الكمية قبل الحركة
  newStock: number;             // الكمية بعد الحركة
  unitCostPrice: number;        // سعر شراء الوحدة عند الحركة
  unitSellingPrice: number;     // سعر بيع الوحدة عند الحركة (إن وجد)
  employeeName: string;         // الموظف أو المستخدم الذي سجل العملية
  timestamp: string;            // تاريخ وتوقيت الحركة (ISO)
  note?: string;                // ملاحظة اختيارية
}

export interface InventoryValuationSummary {
  totalProductsCount: number;      // إجمالي عدد الأصناف والمنتجات
  totalQuantity: number;           // إجمالي عدد القطع في المخزن
  totalPurchaseValue: number;      // إجمالي قيمة المخزون بسعر الشراء = مجموع (الكمية × سعر الشراء)
  totalSellingValue: number;       // إجمالي قيمة المخزون بسعر البيع = مجموع (الكمية × سعر البيع)
  expectedProfit: number;          // الربح المتوقع = قيمة البيع - قيمة الشراء
  expectedProfitMargin: number;    // هامش الربح المتوقع (%)
  lowStockCount: number;           // عدد المنتجات منخفضة المخزون
  outOfStockCount: number;         // عدد المنتجات التي نفدت بالكامل
  
  // تتبع المبيعات وتكلفة البضاعة المباعة (COGS)
  totalSalesRevenue: number;       // إجمالي مبيعات البضائع
  totalCogs: number;               // تكلفة البضاعة المباعة (COGS) = مجموع (الوحدات المباعة × سعر الشراء)
  totalGrossProfit: number;        // الربح الإجمالي = المبيعات - تكلفة البضاعة المباعة
  
  // ميزة مبلغ إعادة تكوين المخزون (Restocking Capital Reserve)
  restockingReserve: number;       // المبلغ المطلوب لإعادة شراء نفس كميات البضاعة المباعة من الموردين
}

export interface ReorderSuggestionItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  currentStock: number;
  reorderThreshold: number;        // حد إعادة الطلب
  suggestedQuantity: number;       // الكمية المقترحة للشراء
  purchasePrice: number;           // سعر الشراء المتوقع
  expectedPurchaseCost: number;    // تكلفة الشراء المتوقعة = الكمية المقترحة × سعر الشراء
  status: 'نفد' | 'حرج' | 'منخفض';
}
