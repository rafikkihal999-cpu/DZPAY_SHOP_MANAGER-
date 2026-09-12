export interface PosProduct {
  id: string;
  name: string;
  shortName?: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  hasImei?: boolean;
  imei?: string;
  color?: string;
  storage?: string;
  barcode: string;
  isQuickShortcut?: boolean;
  quickCategory?: 'top_sellers' | 'protection' | 'power' | 'flexy' | 'audio';
  shortcutKey?: string;
  badge?: string;
  accentColor?: string;
}

export interface CartItem {
  product: PosProduct;
  quantity: number;
  customImei?: string;
}

export type QuickShortcutFilter = 'all' | 'top_sellers' | 'protection' | 'power' | 'flexy' | 'audio' | 'favorites';

export interface TouchDenomination {
  label: string;
  value: number;
  isAdd?: boolean;
  type?: 'exact' | 'set' | 'add';
}
