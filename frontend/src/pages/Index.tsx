import { useState } from 'react';
import { InventoryProvider, useInventory } from '@/context/InventoryContext';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import ToastContainer from '@/components/ToastContainer';
import AddItemModal from '@/components/modals/AddItemModal';
import ReturnModal from '@/components/modals/ReturnModal';
import ImportNfeModal from '@/components/modals/ImportNfeModal';
import BarcodeScannerModal from '@/components/modals/BarcodeScannerModal';
import EstoquePage from '@/pages/EstoquePage';
import CozinhaPage from '@/pages/CozinhaPage';
import CompraPage from '@/pages/CompraPage';
import RelatoriosPage from '@/pages/RelatoriosPage';

function AppContent() {
  const { currentPage } = useInventory();
  const [addOpen, setAddOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [nfeOpen, setNfeOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <div>
      <Sidebar onOpenReturn={() => setReturnOpen(true)} />
      <div className="ml-[72px] min-h-screen relative z-[1]">
        <Topbar onOpenAddItem={() => setAddOpen(true)} onOpenReturn={() => setReturnOpen(true)} onOpenImportNfe={() => setNfeOpen(true)} onOpenScanner={() => setScannerOpen(true)} />
        <div className="p-6 px-7">
          {currentPage === 'estoque' && <EstoquePage />}
          {currentPage === 'cozinha' && <CozinhaPage onOpenReturn={() => setReturnOpen(true)} />}
          {currentPage === 'compra' && <CompraPage />}
          {currentPage === 'relatorios' && <RelatoriosPage />}
        </div>
      </div>

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ReturnModal open={returnOpen} onClose={() => setReturnOpen(false)} />
      <ImportNfeModal open={nfeOpen} onClose={() => setNfeOpen(false)} />
      <BarcodeScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} />
      <ToastContainer />
    </div>
  );
}

export default function Index() {
  return (
    <InventoryProvider>
      <AppContent />
    </InventoryProvider>
  );
}
