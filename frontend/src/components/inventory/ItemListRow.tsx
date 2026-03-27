import { InventoryItem, CATEGORY_LABELS } from '@/types/inventory';

function getQtyColor(item: InventoryItem) {
  const pct = item.qty / item.max;
  if (item.qty < item.min) return 'text-destructive';
  if (pct < 0.4) return 'text-primary';
  return 'text-success';
}

function StatusBadge({ item }: { item: InventoryItem }) {
  if (item.qty < item.min) return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-destructive/10 text-destructive">⚠ Baixo</span>;
  if (item.qty / item.max < 0.4) return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-primary-glow text-primary border border-[hsl(var(--border-bright))]">Médio</span>;
  return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-success/10 text-success">OK</span>;
}

interface ItemListRowProps {
  item: InventoryItem;
  index: number;
  onRetirar: (id: number) => void;
  onRemove: (id: number) => void;
}

export default function ItemListRow({ item, index, onRetirar, onRemove }: ItemListRowProps) {
  return (
    <div
      className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 py-3.5 px-5 bg-surface border border-border rounded-xl items-center cursor-pointer transition-all duration-200 animate-fade-up hover:border-[hsl(var(--border-bright))] hover:translate-x-1"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="flex items-center gap-3 font-semibold text-sm">
        <span className="text-xl">{item.emoji}</span>
        {item.name}
      </div>
      <div>{CATEGORY_LABELS[item.cat]}</div>
      <div className={`font-mono text-[15px] font-medium ${getQtyColor(item)}`}>{item.qty} {item.unit}</div>
      <div><StatusBadge item={item} /></div>
      <div className="flex gap-1.5 justify-end">
        <button onClick={() => onRetirar(item.id)} title="Retirar" className="w-[30px] h-[30px] rounded-lg border border-border bg-surface-2 text-muted-foreground cursor-pointer flex items-center justify-center text-sm transition-all duration-200 hover:border-primary hover:text-primary">🛒</button>
        <button onClick={() => onRemove(item.id)} title="Remover" className="w-[30px] h-[30px] rounded-lg border border-border bg-surface-2 text-muted-foreground cursor-pointer flex items-center justify-center text-sm transition-all duration-200 hover:border-destructive hover:text-destructive">🗑</button>
      </div>
    </div>
  );
}
