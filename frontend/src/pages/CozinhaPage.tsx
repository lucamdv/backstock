import { useInventory } from '@/context/InventoryContext';
import StatCard from '@/components/inventory/StatCard';
import { CATEGORY_LABELS } from '@/types/inventory';

interface CozinhaPageProps {
  onOpenReturn: () => void;
}

export default function CozinhaPage({ onOpenReturn }: CozinhaPageProps) {
  const { items, viewMode, getActiveKitchenItems, getStats } = useInventory();
  const stats = getStats();
  const active = getActiveKitchenItems();

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon="🍳" label="Itens na Cozinha" value={stats.kitchenTotal} sub="aguardando devolução" color="primary" />
        <StatCard icon="↩️" label="Já Devolvidos" value={stats.returned} sub="hoje" color="success" />
        <StatCard icon="🛒" label="Retirados Hoje" value={stats.takenToday} sub="total do dia" color="info" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-lg font-bold flex items-center gap-2">🍳 Estoque Cozinha</div>
        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-primary-glow text-primary border border-[hsl(var(--border-bright))]">
          {stats.kitchenTotal} itens
        </span>
      </div>

      {!active.length ? (
        <div className="text-center py-[60px] text-text-dim">
          <div className="text-5xl mb-4 opacity-50">🍳</div>
          <div className="text-base font-semibold text-muted-foreground mb-2">Cozinha sem itens</div>
          <div className="text-[13px]">Faça retiradas do estoque geral para começar o dia</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
          {active.map((k, i) => {
            const item = items.find(x => x.id === k.itemId);
            if (!item) return null;
            return (
              <div key={k.itemId} className="bg-surface border border-border rounded-2xl p-[18px] cursor-pointer transition-all duration-[250ms] relative overflow-hidden animate-fade-up hover:border-[hsl(var(--border-bright))] hover:-translate-y-[3px]" style={{ animationDelay: `${i * 0.04}s` }}>
                <span className="text-[32px] mb-3 block">{item.emoji}</span>
                <div className="text-sm font-bold mb-1">{item.name}</div>
                <div className="text-[11px] text-text-dim uppercase tracking-wider mb-3.5">{CATEGORY_LABELS[item.cat]}</div>
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <div className="font-mono text-[22px] font-medium">{k.qty}</div>
                    <div className="text-[11px] text-text-dim mt-0.5">{item.unit}</div>
                  </div>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-primary-glow text-primary border border-[hsl(var(--border-bright))]">Cozinha</span>
                </div>
                <div className="h-1 bg-surface-2 rounded overflow-hidden">
                  <div className="h-full rounded bg-primary w-full" />
                </div>
                <div className="flex gap-1.5 mt-3.5">
                  <button onClick={onOpenReturn} className="flex-1 h-8 rounded-lg border border-border bg-surface-2 text-muted-foreground text-xs font-semibold cursor-pointer transition-all duration-200 font-sans flex items-center justify-center gap-1 hover:border-primary hover:text-primary hover:bg-primary-glow">↩ Devolver</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 px-5 py-2 text-[11px] font-semibold text-text-dim uppercase tracking-wider">
            <div>Produto</div><div>Categoria</div><div>Qtd Retirada</div><div>Status</div><div className="text-right">Ações</div>
          </div>
          {active.map((k, i) => {
            const item = items.find(x => x.id === k.itemId);
            if (!item) return null;
            return (
              <div key={k.itemId} className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 py-3.5 px-5 bg-surface border border-border rounded-xl items-center transition-all duration-200 animate-fade-up hover:border-[hsl(var(--border-bright))] hover:translate-x-1" style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="flex items-center gap-3 font-semibold text-sm"><span className="text-xl">{item.emoji}</span>{item.name}</div>
                <div>{CATEGORY_LABELS[item.cat]}</div>
                <div className="font-mono text-[15px] font-medium">{k.qty} {item.unit}</div>
                <div><span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-primary-glow text-primary">Cozinha</span></div>
                <div className="flex justify-end"><button onClick={onOpenReturn} title="Devolver" className="w-[30px] h-[30px] rounded-lg border border-border bg-surface-2 text-muted-foreground cursor-pointer flex items-center justify-center text-sm transition-all duration-200 hover:border-primary hover:text-primary">↩</button></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
