interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  sub: string;
  color: 'primary' | 'success' | 'destructive' | 'info';
}

const colorMap = {
  primary: 'bg-primary',
  success: 'bg-success',
  destructive: 'bg-destructive',
  info: 'bg-info',
};

export default function StatCard({ icon, label, value, sub, color }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 relative overflow-hidden transition-all duration-200 hover:border-[hsl(var(--border-bright))] hover:-translate-y-0.5">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-[0_16px_0_80px] opacity-[0.08] ${colorMap[color]}`} />
      <div className="absolute top-[18px] right-[18px] text-[22px] opacity-50">{icon}</div>
      <div className="text-[11px] font-medium text-text-dim uppercase tracking-wider mb-2.5">{label}</div>
      <div className="text-[28px] font-extrabold leading-none mb-1.5">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
