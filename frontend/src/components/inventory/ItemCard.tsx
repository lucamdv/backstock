import { InventoryItem, CATEGORY_LABELS } from '@/types/inventory';

function getQtyColor(item: InventoryItem) {
  const pct = item.qty / item.max;
  if (item.qty < item.min) return 'text-destructive';
  if (pct < 0.4) return 'text-primary';
  return 'text-success';
}

function getQtyBarColor(item: InventoryItem) {
  const pct = item.qty / item.max;
  if (item.qty < item.min) return 'bg-destructive';
  if (pct < 0.4) return 'bg-primary';
  return 'bg-success';
}

function StatusBadge({ item }: { item: InventoryItem }) {
  if (item.qty < item.min) return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-destructive/10 text-destructive">⚠ Baixo</span>;
  if (item.qty / item.max < 0.4) return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-primary-glow text-primary border border-[hsl(var(--border-bright))]">Médio</span>;
  return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-success/10 text-success">OK</span>;
}

interface ItemCardProps {
  item: InventoryItem;
  index: number;
  onRetirar: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function ItemCard({ item, index, onRetirar, onRemove }: ItemCardProps) {
  const pct = Math.min(100, (item.qty / item.max) * 100);

  return (
    <div
      className="bg-surface border border-border rounded-2xl p-[18px] cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)] relative overflow-hidden animate-fade-up hover:border-[hsl(var(--border-bright))] hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_hsl(var(--border-bright))]"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      <span className="text-[32px] mb-3 block drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">{item.emoji}</span>
      <div className="text-sm font-bold mb-1 leading-tight">{item.name}</div>
      <div className="text-[11px] text-text-dim uppercase tracking-wider mb-3.5">{CATEGORY_LABELS[item.cat]}</div>

      <div className="flex items-center justify-between mb-2.5">
        <div>
          <div className={`font-mono text-[22px] font-medium ${getQtyColor(item)}`}>{item.qty}</div>
          <div className="text-[11px] text-text-dim mt-0.5">{item.unit}</div>
        </div>
        <StatusBadge item={item} />
      </div>

      <div className="h-1 bg-surface-2 rounded overflow-hidden">
        <div className={`h-full rounded transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)] ${getQtyBarColor(item)}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="flex gap-1.5 mt-3.5">
        <button onClick={() => onRetirar(item.id)} className="flex-1 h-8 rounded-lg border border-border bg-surface-2 text-muted-foreground text-xs font-semibold cursor-pointer transition-all duration-200 font-sans flex items-center justify-center gap-1 hover:border-primary hover:text-primary hover:bg-primary-glow">
          🛒 Retirar
        </button>
        <button onClick={() => onRemove(item.id)} className="flex-1 h-8 rounded-lg border border-border bg-surface-2 text-muted-foreground text-xs font-semibold cursor-pointer transition-all duration-200 font-sans flex items-center justify-center gap-1 hover:border-destructive hover:text-destructive hover:bg-destructive/10">
          🗑
        </button>
      </div>
    </div>
  );
}
