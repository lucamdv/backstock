import { useInventory } from '@/context/InventoryContext';

const PAGE_TITLES: Record<string, { text: string; highlight: string }> = {
  estoque: { text: 'Estoque ', highlight: 'Geral' },
  cozinha: { text: 'Estoque ', highlight: 'Cozinha' },
  compra: { text: 'Compra ', highlight: 'do Dia' },
  relatorios: { text: '', highlight: 'Relatórios' },
};

interface TopbarProps {
  onOpenAddItem: () => void;
  onOpenReturn: () => void;
  onOpenImportNfe: () => void;
  onOpenScanner: () => void;
}

export default function Topbar({ onOpenAddItem, onOpenReturn, onOpenImportNfe, onOpenScanner }: TopbarProps) {
  const { viewMode, setViewMode, searchQuery, setSearchQuery, currentPage } = useInventory();
  const title = PAGE_TITLES[currentPage] || PAGE_TITLES.estoque;

  return (
    <header className="h-16 border-b border-border flex items-center px-7 gap-4 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="text-base font-bold flex-1">
        {title.text}<span className="text-primary">{title.highlight}</span>
      </div>

      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3.5 h-[38px] w-60 focus-within:border-primary transition-colors">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-transparent border-none outline-none text-foreground font-sans text-[13px] w-full placeholder:text-text-dim"
        />
      </div>

      <div className="flex bg-surface border border-border rounded-lg overflow-hidden">
        <button
          onClick={() => setViewMode('grid')}
          className={`w-[38px] h-[38px] flex items-center justify-center cursor-pointer border-none text-base transition-all duration-200 ${
            viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground'
          }`}
        >⊞</button>
        <button
          onClick={() => setViewMode('list')}
          className={`w-[38px] h-[38px] flex items-center justify-center cursor-pointer border-none text-base transition-all duration-200 ${
            viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground'
          }`}
        >☰</button>
      </div>

      <button onClick={onOpenReturn} className="h-[38px] px-4 bg-transparent text-primary border border-[hsl(var(--border-bright))] rounded-lg font-sans text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 hover:bg-primary-glow">
        ↩ Devolver
      </button>
      <button onClick={onOpenScanner} className="h-[38px] px-4 bg-surface text-foreground border border-border rounded-lg font-sans text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 hover:border-primary hover:text-primary">
        📷 Scanner
      </button>
      <button onClick={onOpenImportNfe} className="h-[38px] px-4 bg-info text-primary-foreground border-none rounded-lg font-sans text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 hover:opacity-90 hover:-translate-y-px">
        📄 Importar NF-e
      </button>
      <button onClick={onOpenAddItem} className="h-[38px] px-4 bg-primary text-primary-foreground border-none rounded-lg font-sans text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 hover:bg-primary-deep hover:-translate-y-px hover:shadow-[0_4px_16px_hsl(var(--primary)/0.3)]">
        ＋ Novo Item
      </button>
    </header>
  );
}
