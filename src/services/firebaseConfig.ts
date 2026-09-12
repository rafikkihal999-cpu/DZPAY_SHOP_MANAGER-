/**
 * DZPAY SHOP MANAGER - Firebase Architecture Stub
 * 
 * Note: Database and Firebase live services are deferred as requested.
 * This file provides the structured schema constants, collection paths,
 * and service interfaces ready for Firebase Firestore & Authentication integration.
 */

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  PHONES_IMEI: 'phones_imei',
  SALES: 'sales',
  CUSTOMERS: 'customers',
  INSTALLMENTS: 'installments',
  SUPPLIERS: 'suppliers',
  PURCHASES: 'purchases',
  CASHBOX_SESSIONS: 'cashbox_sessions',
  EXPENSES: 'expenses',
  RECURRING_EXPENSES: 'recurring_expenses',
  EMPLOYEES: 'employees',
  PAYROLL: 'payroll',
  DIGITAL_SERVICES: 'digital_services',
  REPORTS: 'reports',
  AUDIT_LOGS: 'audit_logs',
  NOTIFICATIONS: 'notifications',
  SHOP_SETTINGS: 'shop_settings',
} as const;

export interface FirebaseConfigSchema {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const isFirebaseConfigured = (): boolean => {
  return false; // Deferred until Firebase provisioning step
};

export const getFirestoreStatus = () => {
  return {
    isReady: false,
    statusText: 'بانتظار تفعيل خادم Firebase Firestore',
    statusArabic: 'غير مفعل حالياً (المرحلة القادمة)',
  };
};
