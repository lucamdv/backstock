import { useState } from 'react';
import Modal from './Modal';
import { useInventory } from '@/context/InventoryContext';

interface ImportNfeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportNfeModal({ open, onClose }: ImportNfeModalProps) {
  const { importarItens, showToast } = useInventory();
  const [chave, setChave] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBuscar = async () => {
    const clean = chave.replace(/\D/g, '');
    if (clean.length !== 44) {
      showToast('⚠️', 'A chave de acesso precisa ter exatos 44 números.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch('http://localhost:3000/api/importar-nota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chave: clean }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.erro || 'Erro desconhecido ao procurar a nota.');
      importarItens(data.itens, data.fornecedor);
      setChave('');
      onClose();
    } catch (err: any) {
      showToast('❌', err.message, 'warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="📄 Importar Nota Fiscal" subtitle="Digite a chave de acesso" footer={
      <>
        <button onClick={onClose} className="h-[38px] px-4 bg-transparent text-primary border border-[hsl(var(--border-bright))] rounded-lg font-sans text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-primary-glow">Cancelar</button>
        <button onClick={handleBuscar} disabled={loading} className="h-[38px] px-4 bg-info text-primary-foreground border-none rounded-lg font-sans text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">🔍 Buscar na SEFAZ</button>
      </>
    }>
      <div>
        <label className="block text-xs font-semibold text-text-dim uppercase tracking-wider mb-1.5">Chave de Acesso (44 dígitos)</label>
        <input
          type="text"
          value={chave}
          onChange={e => setChave(e.target.value)}
          placeholder="Ex: 262603251375..."
          maxLength={44}
          className="w-full h-[42px] bg-surface border border-border rounded-lg px-3.5 text-foreground font-sans text-sm outline-none transition-colors focus:border-primary"
        />
        {loading && <div className="text-center text-info text-[13px] mt-2.5">⏳ A procurar nota na SEFAZ... aguarde.</div>}
      </div>
    </Modal>
  );
}
