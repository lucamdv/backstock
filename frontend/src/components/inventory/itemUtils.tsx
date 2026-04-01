import { InventoryItem } from '@/types/inventory';

export function getQtyColor(item: InventoryItem) {
  const pct = item.qty / item.max;
  if (item.qty < item.min) return 'text-destructive';
  if (pct < 0.4) return 'text-primary';
  return 'text-success';
}

export function getQtyBarColor(item: InventoryItem) {
  const pct = item.qty / item.max;
  if (item.qty < item.min) return 'bg-destructive';
  if (pct < 0.4) return 'bg-primary';
  return 'bg-success';
}

export function StatusBadge({ item }: { item: InventoryItem }) {
  if (item.qty < item.min)
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-destructive/10 text-destructive">
        ⚠ Baixo
      </span>
    );
  if (item.qty / item.max < 0.4)
    return (
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-primary-glow text-primary border border-[hsl(var(--border-bright))]">
        Médio
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-success/10 text-success">
      OK
    </span>
  );
}
