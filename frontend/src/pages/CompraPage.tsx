import { useState } from 'react';
import { useInventory } from '@/context/InventoryContext';

export default function CompraPage() {
  const { items, compraHistory, kitchenItems, retirarItem, showToast } = useInventory();
  const [selectedId, setSelectedId] = useState<number>(items[0]?.id || 0);
  const [qty, setQty] = useState('');

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleRetirada = () => {
    const q = parseFloat(qty);
    if (!q || q <= 0) { showToast('⚠️', 'Informe a quantidade.', 'warning'); return; }
    const item = items.find(i => i.id === selectedId);
    if (!item) return;
    if (q > item.qty) { showToast('⚠️', 'Quantidade indisponível!', 'warning'); return; }
    retirarItem(selectedId, q);
    setQty('');
    showToast('✅', `${q} ${item.unit} de "${item.name}" retirados!`);
  };

  return (
    <div>
      <div className="bg-surface border border-border rounded-2xl p-5 mb-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary-light to-primary" />
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-bold flex items-center gap-2">🛒 Compra do Dia</div>
            <div className="text-[13px] text-muted-foreground mt-1">{dateStr}</div>
          </div>
          <div className="flex items-center gap-2 bg-primary-glow border border-[hsl(var(--border-bright))] rounded-full py-1 px-3.5 pl-2 text-[13px] font-semibold text-primary">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-dot" />
            Turno Ativo
          </div>
        </div>

        <div className="text-[13px] text-muted-foreground mb-3">Itens retirados do estoque geral hoje:</div>

        <div className="flex flex-wrap gap-2">
          {!compraHistory.length ? (
            <div className="text-text-dim text-[13px] py-2">Nenhuma retirada registrada hoje.</div>
          ) : (
            compraHistory.map((c, i) => {
              const item = items.find(x => x.id === c.itemId);
              if (!item) return null;
              const returned = kitchenItems.find(k => k.itemId === c.itemId && k.returned);
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 bg-surface-2 border border-border rounded-lg py-2 px-3 text-[13px] transition-all duration-200 ${returned ? 'opacity-50 line-through' : ''}`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                  <span className="font-mono text-xs text-primary font-semibold">{c.qty} {item.unit}</span>
                  {returned && <span className="text-[11px] text-success">↩ devolvido</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-lg font-bold flex items-center gap-2">➕ Registrar Retirada</div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-text-dim uppercase tracking-wider mb-1.5">Produto</label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(parseInt(e.target.value))}
              className="w-full h-[42px] bg-surface border border-border rounded-lg px-3.5 text-foreground font-sans text-sm outline-none transition-colors focus:border-primary cursor-pointer appearance-none"
            >
              {items.map(i => (
                <option key={i.id} value={i.id} className="bg-popover">
                  {i.emoji} {i.name} ({i.qty} {i.unit})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-dim uppercase tracking-wider mb-1.5">Quantidade</label>
            <input
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
              placeholder="0"
              min="1"
              className="w-full h-[42px] bg-surface border border-border rounded-lg px-3.5 text-foreground font-sans text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
        </div>
        <button
          onClick={handleRetirada}
          className="w-full h-[38px] bg-primary text-primary-foreground border-none rounded-lg font-sans text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-primary-deep hover:-translate-y-px"
        >
          Confirmar Retirada
        </button>
      </div>
    </div>
  );
}
