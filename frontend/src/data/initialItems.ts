import { InventoryItem } from '@/types/inventory';

export const initialItems: InventoryItem[] = [
  { id: 1, name: 'Filé de Frango', emoji: '🍗', cat: 'congelado', qty: 15, unit: 'kg', min: 5, max: 30, ean: '7891000100103' },
  { id: 2, name: 'Arroz Agulhinha', emoji: '🍚', cat: 'seco', qty: 20, unit: 'kg', min: 10, max: 50, ean: '7891234560012' },
  { id: 3, name: 'Feijão Carioca', emoji: '🫘', cat: 'seco', qty: 8, unit: 'kg', min: 5, max: 25, ean: '7891234560029' },
  { id: 4, name: 'Óleo de Soja', emoji: '🫙', cat: 'seco', qty: 4, unit: 'L', min: 5, max: 20, ean: '7891000315507' },
  { id: 5, name: 'Contrafilé', emoji: '🥩', cat: 'congelado', qty: 10, unit: 'kg', min: 3, max: 20, ean: '7891234560036' },
  { id: 6, name: 'Tomate', emoji: '🍅', cat: 'fresco', qty: 3, unit: 'kg', min: 2, max: 10, ean: '7891234560043' },
  { id: 7, name: 'Cebola', emoji: '🧅', cat: 'fresco', qty: 5, unit: 'kg', min: 3, max: 15, ean: '7891234560050' },
  { id: 8, name: 'Alho', emoji: '🧄', cat: 'fresco', qty: 1, unit: 'kg', min: 0.5, max: 3, ean: '7891234560067' },
  { id: 9, name: 'Macarrão Penne', emoji: '🍝', cat: 'seco', qty: 12, unit: 'pct', min: 5, max: 30, ean: '7891234560074' },
  { id: 10, name: 'Salmão', emoji: '🐟', cat: 'congelado', qty: 6, unit: 'kg', min: 2, max: 15, ean: '7891234560081' },
  { id: 11, name: 'Manteiga', emoji: '🧈', cat: 'congelado', qty: 3, unit: 'kg', min: 1, max: 8, ean: '7891234560098' },
  { id: 12, name: 'Farinha de Trigo', emoji: '🌾', cat: 'seco', qty: 9, unit: 'kg', min: 5, max: 25, ean: '7891234560104' },
];
