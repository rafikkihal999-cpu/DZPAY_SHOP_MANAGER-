/**
 * DZPAY SHOP MANAGER - Domain Types & Data Models
 * Prepared for Firebase Firestore & Authentication Architecture
 */

export type UserRole = 'super_admin' | 'shop_manager' | 'sales_cashier' | 'inventory_manager' | 'accountant';

export interface UserProfile {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  role: UserRole;
  roleArabic: string;
  branchName: string;
  wilaya: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
}

export type Currency = 'DZD';

export interface NavigationItem {
  id: string;
  title: string;
  titleEn: string;
  titleFr?: string;
  category: 'core' | 'operations' | 'inventory' | 'crm' | 'purchases' | 'finance' | 'hr' | 'reports' | 'system';
  icon: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'blue' | 'rose' | 'slate';
  description: string;
  descriptionFr?: string;
  descriptionEn?: string;
}

// 1. Products & Accessories
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  barcode: string;
  costPrice: number; // in DZD
  sellingPrice: number; // in DZD
  stockQuantity: number;
  minStockAlert: number;
  isPhone: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 2. Phones & IMEI
export interface PhoneIMEIItem {
  id: string;
  brand: string;
  model: string;
  imei1: string;
  imei2?: string;
  storage: string;
  color: string;
  condition: 'new' | 'used';
  batteryHealth?: number;
  costPrice: number;
  sellingPrice: number;
  status: 'in_stock' | 'sold' | 'reserved' | 'under_repair';
  supplierId?: string;
  soldInvoiceId?: string;
  warrantyMonths: number;
  notes?: string;
}

// 3. POS & Sales
export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imei?: string;
  serialNumber?: string;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  customerId?: string;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingDebt: number;
  paymentMethod: 'cash' | 'baridimob' | 'cib' | 'installment' | 'split';
  cashierId: string;
  cashierName: string;
  status: 'completed' | 'refunded' | 'pending';
  createdAt: string;
}

// 4. Customers & Debts
export interface Customer {
  id: string;
  name: string;
  phone: string;
  nationalIdCard?: string;
  wilaya: string;
  totalDebts: number;
  totalPurchases: number;
  loyaltyPoints: number;
  notes?: string;
  createdAt: string;
}

export interface InstallmentDebt {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  saleInvoiceId: string;
  totalDebt: number;
  remainingDebt: number;
  paidDebt: number;
  installmentCount: number;
  nextDueDate: string;
  status: 'active' | 'paid' | 'overdue' | 'defaulted';
}

// 5. Suppliers & Purchases
export interface Supplier {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  wilaya: string;
  totalBalanceDue: number;
  totalPurchases: number;
}

export interface PurchaseBill {
  id: string;
  billNumber: string;
  supplierId: string;
  supplierName: string;
  totalCost: number;
  paidAmount: number;
  remainingAmount: number;
  itemsCount: number;
  date: string;
  status: 'received' | 'partial' | 'draft';
}

// 6. Cashbox & Financials
export interface CashboxSession {
  id: string;
  sessionNumber: string;
  cashierId: string;
  cashierName: string;
  openingBalance: number;
  currentBalance: number;
  closingBalance?: number;
  totalCashIn: number;
  totalCashOut: number;
  difference?: number;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
}

export interface Expense {
  id: string;
  category: 'rent' | 'electricity' | 'internet' | 'transport' | 'maintenance' | 'supplies' | 'other';
  title: string;
  amount: number;
  date: string;
  paidBy: string;
  receiptUrl?: string;
  notes?: string;
}

export interface RecurringExpense {
  id: string;
  title: string;
  category: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDueDate: string;
  autoDeduct: boolean;
}

// 7. Employees & Payroll
export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  wilaya: string;
  idCardNumber: string;
  baseSalary: number;
  joinDate: string;
  status: 'active' | 'on_leave' | 'terminated';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // e.g., "2026-09"
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'paid';
  paymentDate?: string;
}

// 8. Digital Services (Algerian Context: Flexy, Cards, ADSL, BaridiMob)
export interface DigitalServiceTransaction {
  id: string;
  operator: 'mobilis' | 'djezzy' | 'ooredoo' | 'algerie_telecom' | 'google_play' | 'itunes' | 'playstation' | 'freefire' | 'pubg';
  serviceType: 'flexy' | 'card' | 'bill_payment';
  targetNumberOrAccount: string;
  faceValue: number;
  costPrice: number;
  sellingPrice: number;
  commission: number;
  status: 'successful' | 'failed' | 'pending';
  createdAt: string;
}

// 9. System & Logs
export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  timestamp: string;
  details: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  timestamp: string;
  isRead: boolean;
  linkSection?: string;
}

export interface ShopSettings {
  shopName: string;
  slogan: string;
  tradeRegisterNumber: string; // سجل تجاري
  nifNumber: string; // رقم التعريف الضريبي
  nisNumber: string; // رقم التعريف الإحصائي
  phonePrimary: string;
  phoneSecondary?: string;
  wilaya: string;
  commune: string;
  fullAddress: string;
  currencySymbol: string;
  receiptFooterNote: string;
  lowStockThreshold: number;
  imeiTrackingEnabled: boolean;
  baridiMobNumber?: string;
  ripNumber?: string;
}
