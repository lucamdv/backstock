export interface InventoryItem {
  id: number;
  name: string;
  emoji: string;
  cat: 'seco' | 'congelado' | 'fresco';
  qty: number;
  unit: string;
  min: number;
  max: number;
  ean?: string;
}

export interface KitchenItem {
  itemId: number;
  qty: number;
  returned: boolean;
  returnedQty: number;
}

export interface CompraEntry {
  itemId: number;
  qty: number;
  time: Date;
}

export type ViewMode = 'grid' | 'list';
export type TabFilter = 'all' | 'seco' | 'congelado' | 'fresco';
export type Page = 'estoque' | 'cozinha' | 'compra' | 'relatorios';

export const CATEGORY_LABELS: Record<string, string> = {
  seco: '🌾 Seco',
  congelado: '❄️ Congelado',
  fresco: '🥦 Fresco',
};
