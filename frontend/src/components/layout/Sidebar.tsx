import { useInventory } from '@/context/InventoryContext';
import { Page } from '@/types/inventory';

const navItems: { page: Page; icon: string; label: string }[] = [
  { page: 'estoque', icon: '📦', label: 'Estoque Geral' },
  { page: 'cozinha', icon: '🍳', label: 'Estoque Cozinha' },
  { page: 'compra', icon: '🛒', label: 'Compra do Dia' },
];

const navItems2: { page?: Page; icon: string; label: string; action?: string }[] = [
  { page: 'relatorios', icon: '📊', label: 'Relatórios' },
  { icon: '↩️', label: 'Devolução', action: 'devolver' },
];

interface SidebarProps {
  onOpenReturn: () => void;
}

export default function Sidebar({ onOpenReturn }: SidebarProps) {
  const { currentPage, setCurrentPage } = useInventory();

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-[72px] hover:w-[220px] bg-popover border-r border-border flex flex-col items-center py-5 gap-2 z-[100] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] group">
      <div className="w-[42px] h-[42px] bg-primary rounded-xl flex items-center justify-center text-xl font-extrabold text-primary-foreground mb-6 flex-shrink-0 relative overflow-hidden">
        B
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      </div>

      {navItems.map(item => (
        <button
          key={item.page}
          onClick={() => setCurrentPage(item.page)}
          className={`w-[calc(100%-16px)] h-11 rounded-lg flex items-center gap-3 px-[13px] cursor-pointer transition-all duration-200 relative overflow-hidden whitespace-nowrap border-none bg-transparent ${
            currentPage === item.page
              ? 'bg-primary-glow text-primary'
              : 'text-muted-foreground hover:bg-primary-glow hover:text-primary'
          }`}
        >
          {currentPage === item.page && (
            <div className="absolute right-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-l" />
          )}
          <span className="text-lg flex-shrink-0 w-[18px] text-center">{item.icon}</span>
          <span className="text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">{item.label}</span>
        </button>
      ))}

      <div className="w-10 h-px bg-border my-2 group-hover:w-[188px] transition-all duration-300" />

      {navItems2.map((item, idx) => (
        <button
          key={idx}
          onClick={() => item.action === 'devolver' ? onOpenReturn() : item.page && setCurrentPage(item.page)}
          className={`w-[calc(100%-16px)] h-11 rounded-lg flex items-center gap-3 px-[13px] cursor-pointer transition-all duration-200 relative overflow-hidden whitespace-nowrap border-none bg-transparent ${
            item.page && currentPage === item.page
              ? 'bg-primary-glow text-primary'
              : 'text-muted-foreground hover:bg-primary-glow hover:text-primary'
          }`}
        >
          {item.page && currentPage === item.page && (
            <div className="absolute right-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-l" />
          )}
          <span className="text-lg flex-shrink-0 w-[18px] text-center">{item.icon}</span>
          <span className="text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
