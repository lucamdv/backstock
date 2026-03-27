import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { InventoryItem, KitchenItem, CompraEntry, ViewMode, TabFilter, Page } from '@/types/inventory';
import { initialItems } from '@/data/initialItems';

interface Toast {
  id: number;
  icon: string;
  message: string;
  type: 'success' | 'warning';
}

interface InventoryContextType {
  items: InventoryItem[];
  kitchenItems: KitchenItem[];
  compraHistory: CompraEntry[];
  viewMode: ViewMode;
  currentTab: TabFilter;
  currentPage: Page;
  searchQuery: string;
  toasts: Toast[];

  setViewMode: (mode: ViewMode) => void;
  setCurrentTab: (tab: TabFilter) => void;
  setCurrentPage: (page: Page) => void;
  setSearchQuery: (q: string) => void;
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  removeItem: (id: number) => void;
  retirarItem: (id: number, qty: number) => void;
  registrarRetirada: (id: number, qty: number) => void;
  confirmarDevolucao: (returns: { itemId: number; qty: number }[]) => void;
  importarItens: (itens: { nome: string; quantidade: number; unidade: string }[], fornecedor: string) => void;
  showToast: (icon: string, message: string, type?: 'success' | 'warning') => void;
  getFilteredItems: () => InventoryItem[];
  getActiveKitchenItems: () => KitchenItem[];
  getStats: () => { total: number; ok: number; low: number; frozen: number; kitchenTotal: number; returned: number; takenToday: number };
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider');
  return ctx;
}

let nextId = 13;
let toastId = 0;

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [kitchenItems, setKitchenItems] = useState<KitchenItem[]>([]);
  const [compraHistory, setCompraHistory] = useState<CompraEntry[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentTab, setCurrentTab] = useState<TabFilter>('all');
  const [currentPage, setCurrentPage] = useState<Page>('estoque');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((icon: string, message: string, type: 'success' | 'warning' = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, icon, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const addItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    setItems(prev => [...prev, { ...item, id: nextId++ }]);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setKitchenItems(prev => prev.filter(k => k.itemId !== id));
    setCompraHistory(prev => prev.filter(c => c.itemId !== id));
  }, []);

  const retirarItem = useCallback((id: number, qty: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty - qty } : i));
    setKitchenItems(prev => {
      const existing = prev.find(k => k.itemId === id && !k.returned);
      if (existing) {
        return prev.map(k => k.itemId === id && !k.returned ? { ...k, qty: k.qty + qty } : k);
      }
      return [...prev, { itemId: id, qty, returned: false, returnedQty: 0 }];
    });
    setCompraHistory(prev => [...prev, { itemId: id, qty, time: new Date() }]);
  }, []);

  const registrarRetirada = useCallback((id: number, qty: number) => {
    retirarItem(id, qty);
  }, [retirarItem]);

  const confirmarDevolucao = useCallback((returns: { itemId: number; qty: number }[]) => {
    setItems(prev => {
      const updated = [...prev];
      returns.forEach(r => {
        const item = updated.find(i => i.id === r.itemId);
        if (item) item.qty += r.qty;
      });
      return updated;
    });
    setKitchenItems(prev => prev.map(k => {
      const ret = returns.find(r => r.itemId === k.itemId);
      if (ret && !k.returned) return { ...k, returned: true, returnedQty: ret.qty };
      return k;
    }));
  }, []);

  const importarItens = useCallback((itens: { nome: string; quantidade: number; unidade: string }[], fornecedor: string) => {
    setItems(prev => {
      const updated = [...prev];
      itens.forEach(itemNota => {
        const existing = updated.find(i => i.name.toLowerCase() === itemNota.nome.toLowerCase());
        if (existing) {
          existing.qty += itemNota.quantidade;
        } else {
          updated.push({
            id: nextId++,
            name: itemNota.nome,
            emoji: '📦',
            cat: 'seco',
            qty: itemNota.quantidade,
            unit: itemNota.unidade,
            min: 5,
            max: itemNota.quantidade > 100 ? itemNota.quantidade * 1.5 : 100,
          });
        }
      });
      return updated;
    });
    showToast('✅', `Nota de ${fornecedor} importada com sucesso!`);
  }, [showToast]);

  const getFilteredItems = useCallback(() => {
    const q = searchQuery.toLowerCase();
    return items.filter(i => {
      const matchTab = currentTab === 'all' || i.cat === currentTab;
      const matchSearch = !q || i.name.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [items, currentTab, searchQuery]);

  const getActiveKitchenItems = useCallback(() => {
    return kitchenItems.filter(k => !k.returned);
  }, [kitchenItems]);

  const getStats = useCallback(() => ({
    total: items.length,
    ok: items.filter(i => i.qty >= i.min).length,
    low: items.filter(i => i.qty < i.min).length,
    frozen: items.filter(i => i.cat === 'congelado').length,
    kitchenTotal: kitchenItems.filter(k => !k.returned).length,
    returned: kitchenItems.filter(k => k.returned).length,
    takenToday: compraHistory.length,
  }), [items, kitchenItems, compraHistory]);

  return (
    <InventoryContext.Provider value={{
      items, kitchenItems, compraHistory, viewMode, currentTab, currentPage, searchQuery, toasts,
      setViewMode, setCurrentTab, setCurrentPage, setSearchQuery,
      addItem, removeItem, retirarItem, registrarRetirada, confirmarDevolucao, importarItens, showToast,
      getFilteredItems, getActiveKitchenItems, getStats,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}
