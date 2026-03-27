import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useInventory } from '@/context/InventoryContext';

interface ReturnModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReturnModal({ open, onClose }: ReturnModalProps) {
  const { items, getActiveKitchenItems, confirmarDevolucao, showToast } = useInventory();
  const active = getActiveKitchenItems();
  const [returnQtys, setReturnQtys] = useState<Record<number, number>>({});

  useEffect(() => {
    if (open) {
      const initial: Record<number, number> = {};
      active.forEach(k => { initial[k.itemId] = k.qty; });
      setReturnQtys(initial);
    }
  }, [open]);

  const adjust = (itemId: number, delta: number, max: number) => {
    setReturnQtys(prev => ({
      ...prev,
      [itemId]: Math.max(0, Math.min(max, (prev[itemId] || 0) + delta)),
    }));
  };

  const handleConfirm = () => {
    const returns = Object.entries(returnQtys)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, qty]) => ({ itemId: parseInt(itemId), qty }));

    if (returns.length > 0) {
      confirmarDevolucao(returns);
      showToast('✅', `${returns.length} item(ns) devolvido(s) ao estoque!`);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="↩ Devolução ao Estoque" subtitle="Registrar sobras da cozinha" footer={
      <>
        <button onClick={onClose} className="h-[38px] px-4 bg-transparent text-primary border border-[hsl(var(--border-bright))] rounded-lg font-sans text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-primary-glow">Cancelar</button>
        <button onClick={handleConfirm} className="h-[38px] px-4 bg-primary text-primary-foreground border-none rounded-lg font-sans text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-primary-deep">Confirmar Devolução</button>
      </>
    }>
      <div className="max-h-[360px] overflow-y-auto">
        {!active.length ? (
          <div className="text-text-dim text-[13px] text-center py-5">Nenhum item na cozinha para devolver.</div>
        ) : (
          active.map(k => {
            const item = items.find(x => x.id === k.itemId);
            if (!item) return null;
            return (
              <div key={k.itemId} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-lg mb-2">
                <span className="text-[22px]">{item.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{item.name}</div>
                  <div className="text-[11px] text-text-dim">Retirado: {k.qty} {item.unit}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => adjust(k.itemId, -1, k.qty)} className="w-7 h-7 rounded-[7px] border border-border bg-surface-2 text-foreground text-base cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-primary hover:text-primary font-mono leading-none">−</button>
                  <input
                    type="number"
                    value={returnQtys[k.itemId] ?? k.qty}
                    onChange={e => setReturnQtys(prev => ({ ...prev, [k.itemId]: Math.max(0, Math.min(k.qty, parseFloat(e.target.value) || 0)) }))}
                    className="w-[52px] h-7 bg-surface-2 border border-border rounded-[7px] text-center text-foreground font-mono text-[13px] outline-none"
                    min="0"
                    max={k.qty}
                    step="0.5"
                  />
                  <button onClick={() => adjust(k.itemId, 1, k.qty)} className="w-7 h-7 rounded-[7px] border border-border bg-surface-2 text-foreground text-base cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-primary hover:text-primary font-mono leading-none">+</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
}
