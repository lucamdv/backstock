import { useState } from 'react';
import Modal from './Modal';
import { useInventory } from '@/context/InventoryContext';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddItemModal({ open, onClose }: AddItemModalProps) {
  const { addItem, showToast } = useInventory();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [cat, setCat] = useState<'seco' | 'congelado' | 'fresco'>('seco');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('kg');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { showToast('⚠️', 'Digite o nome do produto.', 'warning'); return; }
    addItem({
      name: name.trim(),
      emoji: emoji.trim() || '📦',
      cat,
      qty: parseFloat(qty) || 0,
      unit,
      min: parseFloat(min) || 0,
      max: parseFloat(max) || 100,
    });
    showToast('✅', `"${name.trim()}" adicionado ao estoque!`);
    setName(''); setEmoji(''); setQty(''); setMin(''); setMax('');
    onClose();
  };

  const inputClass = "w-full h-[42px] bg-surface border border-border rounded-lg px-3.5 text-foreground font-sans text-sm outline-none transition-colors focus:border-primary";
  const selectClass = "w-full h-[42px] bg-surface border border-border rounded-lg px-3.5 text-foreground font-sans text-sm outline-none transition-colors focus:border-primary cursor-pointer appearance-none";
  const labelClass = "block text-xs font-semibold text-text-dim uppercase tracking-wider mb-1.5";

  return (
    <Modal open={open} onClose={onClose} title="Novo Produto" subtitle="Adicionar ao estoque geral" footer={
      <>
        <button onClick={onClose} className="h-[38px] px-4 bg-transparent text-primary border border-[hsl(var(--border-bright))] rounded-lg font-sans text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-primary-glow">Cancelar</button>
        <button onClick={handleSubmit} className="h-[38px] px-4 bg-primary text-primary-foreground border-none rounded-lg font-sans text-[13px] font-semibold cursor-pointer transition-all duration-200 hover:bg-primary-deep">Adicionar Produto</button>
      </>
    }>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className={labelClass}>Nome do Produto</label>
          <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Filé de Frango" />
        </div>
        <div>
          <label className={labelClass}>Emoji / Ícone</label>
          <input className={inputClass} value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🍗" />
        </div>
        <div>
          <label className={labelClass}>Categoria</label>
          <select className={selectClass} value={cat} onChange={e => setCat(e.target.value as any)}>
            <option value="seco" className="bg-popover">🌾 Seco</option>
            <option value="congelado" className="bg-popover">❄️ Congelado</option>
            <option value="fresco" className="bg-popover">🥦 Fresco</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Quantidade</label>
          <input type="number" className={inputClass} value={qty} onChange={e => setQty(e.target.value)} placeholder="0" min="0" />
        </div>
        <div>
          <label className={labelClass}>Unidade</label>
          <select className={selectClass} value={unit} onChange={e => setUnit(e.target.value)}>
            {['kg', 'g', 'L', 'ml', 'un', 'cx', 'pct'].map(u => <option key={u} className="bg-popover">{u}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Qtd. Mínima</label>
          <input type="number" className={inputClass} value={min} onChange={e => setMin(e.target.value)} placeholder="5" min="0" />
        </div>
        <div>
          <label className={labelClass}>Qtd. Máxima</label>
          <input type="number" className={inputClass} value={max} onChange={e => setMax(e.target.value)} placeholder="100" min="0" />
        </div>
      </div>
    </Modal>
  );
}
