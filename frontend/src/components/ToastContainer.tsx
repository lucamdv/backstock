import { useInventory } from '@/context/InventoryContext';

export default function ToastContainer() {
  const { toasts } = useInventory();

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`bg-surface border rounded-xl py-3.5 px-[18px] text-[13px] font-medium flex items-center gap-2.5 animate-toast-in shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-[320px] ${
            toast.type === 'success' ? 'border-success/40' : 'border-primary/40'
          }`}
        >
          <span className="text-lg">{toast.icon}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
