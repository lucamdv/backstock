import { useInventory } from '@/context/InventoryContext';
import StatCard from '@/components/inventory/StatCard';
import ItemCard from '@/components/inventory/ItemCard';
import ItemListRow from '@/components/inventory/ItemListRow';
import { TabFilter } from '@/types/inventory';

const tabs: { value: TabFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'seco', label: '🌾 Secos' },
  { value: 'congelado', label: '❄️ Congelados' },
  { value: 'fresco', label: '🥦 Frescos' },
];

export default function EstoquePage() {
  const { viewMode, currentTab, setCurrentTab, getFilteredItems, getStats, retirarItem, removeItem, showToast, items } = useInventory();
  const stats = getStats();
  const filtered = getFilteredItems();

  const handleRetirar = (id: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const qtyStr = prompt(`Quantos ${item.unit} de "${item.name}" retirar?\nDisponível: ${item.qty} ${item.unit}`);
    if (!qtyStr) return;
    const qty = parseFloat(qtyStr);
    if (!qty || qty <= 0) return;
    if (qty > item.qty) { showToast('⚠️', 'Quantidade indisponível!', 'warning'); return; }
    retirarItem(id, qty);
    showToast('🛒', `${qty} ${item.unit} de "${item.name}" enviados à cozinha!`);
  };

  const handleRemove = (id: number) => {
    const item = items.find(i => i.id === id);
    removeItem(id);
    if (item) showToast('🗑', `"${item.name}" removido.`, 'warning');
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6 max-md:grid-cols-2">
        <StatCard icon="📦" label="Total de Itens" value={stats.total} sub="no estoque geral" color="primary" />
        <StatCard icon="✅" label="Disponíveis" value={stats.ok} sub="acima do mínimo" color="success" />
        <StatCard icon="⚠️" label="Baixo Estoque" value={stats.low} sub="atenção necessária" color="destructive" />
        <StatCard icon="❄️" label="Congelados" value={stats.frozen} sub="itens no freezer" color="info" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="text-lg font-bold flex items-center gap-2">📋 Produtos</div>
        <div className="flex bg-surface border border-border rounded-lg p-[3px] gap-0.5">
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setCurrentTab(tab.value)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 border-none font-sans ${
                currentTab === tab.value ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {!filtered.length ? (
        <div className="text-center py-[60px] text-text-dim">
          <div className="text-5xl mb-4 opacity-50">📦</div>
          <div className="text-base font-semibold text-muted-foreground mb-2">Nenhum produto encontrado</div>
          <div className="text-[13px]">Tente ajustar os filtros ou adicionar um novo item</div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
          {filtered.map((item, i) => (
            <ItemCard key={item.id} item={item} index={i} onRetirar={handleRetirar} onRemove={handleRemove} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_120px] gap-4 px-5 py-2 text-[11px] font-semibold text-text-dim uppercase tracking-wider">
            <div>Produto</div><div>Categoria</div><div>Quantidade</div><div>Status</div><div className="text-right">Ações</div>
          </div>
          {filtered.map((item, i) => (
            <ItemListRow key={item.id} item={item} index={i} onRetirar={handleRetirar} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
