import { useEffect, useRef, useState, useCallback } from 'react';
import Modal from './Modal';
import { useInventory } from '@/context/InventoryContext';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { InventoryItem } from '@/types/inventory';

interface BarcodeScannerModalProps {
  open: boolean;
  onClose: () => void;
}

// Todos os formatos lineares 1D + QR — ZXing engine vai tentar todos
const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
];

const SCANNER_ELEMENT_ID = 'bs-camera-feed';
const DEBOUNCE_MS = 1000;

export default function BarcodeScannerModal({ open, onClose }: BarcodeScannerModalProps) {
  const { items, importarItens, showToast } = useInventory();

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const isMountedRef = useRef(true);
  const lastScannedRef = useRef('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Sempre aponta para items mais recente — evita stale closure
  const itemsRef = useRef<InventoryItem[]>(items);

  const [scannedCode, setScannedCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState('');
  const [scannerReady, setScannerReady] = useState(false);
  const [matchedItem, setMatchedItem] = useState<InventoryItem | null>(null);
  const [qty, setQty] = useState(1);
  const [scanning, setScanning] = useState(false);

  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const resolveMatch = useCallback((code: string): InventoryItem | null => {
    return itemsRef.current.find(
      (i) =>
        (i.ean && i.ean === code) ||
        i.name.toLowerCase().includes(code.toLowerCase()) ||
        i.id.toString() === code
    ) ?? null;
  }, []);

  const handleCodeDetected = useCallback((code: string) => {
    if (code === lastScannedRef.current) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      lastScannedRef.current = code;
      setScannedCode(code);
      setMatchedItem(resolveMatch(code));
    }, DEBOUNCE_MS);
  }, [resolveMatch]);

  // ─── Inicializa usando Html5Qrcode (API de baixo nível, sem UI própria) ───
  const startScanner = useCallback(async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    setError('');

    try {
      const el = document.getElementById(SCANNER_ELEMENT_ID);
      if (!el) throw new Error('Elemento do scanner não encontrado no DOM.');

      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, {
        formatsToSupport: SUPPORTED_FORMATS,
        verbose: false,
      });
      scannerRef.current = scanner;

      // Tenta câmera traseira primeiro (melhor pra barcodes), cai pra frontal
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) throw new Error('Nenhuma câmera encontrada.');

      const backCamera = cameras.find(
        (c) =>
          c.label.toLowerCase().includes('back') ||
          c.label.toLowerCase().includes('traseira') ||
          c.label.toLowerCase().includes('environment') ||
          c.label.toLowerCase().includes('rear')
      );
      const cameraId = backCamera?.id ?? cameras[cameras.length - 1].id;

      await scanner.start(
        cameraId,
        {
          fps: 25,
          // Região de scan dinâmica — 90% da largura e 35% da altura do viewfinder
          // Essencial para EAN-13 e Code-128 que são códigos largos
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const w = Math.min(Math.floor(viewfinderWidth * 0.9), 500);
            const h = Math.min(Math.floor(viewfinderHeight * 0.35), 160);
            return { width: w, height: h };
          },
          aspectRatio: 1.7778, // 16:9
          disableFlip: false,
        },
        (decodedText) => handleCodeDetected(decodedText),
        (_err) => { /* erros de frame são normais, ignorar */ }
      );

      if (isMountedRef.current) {
        setScannerReady(true);
        setScanning(true);
      }
    } catch (e: unknown) {
      isRunningRef.current = false;
      if (isMountedRef.current) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
          setError('Permissão de câmera negada. Permita o acesso nas configurações do navegador.');
        } else {
          setError(`Não foi possível iniciar a câmera: ${msg}`);
        }
      }
    }
  }, [handleCodeDetected]);

  // ─── Cleanup ───
  const cleanup = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    lastScannedRef.current = '';

    if (scannerRef.current) {
      const scanner = scannerRef.current;
      scannerRef.current = null;
      isRunningRef.current = false;
      try {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
      } catch {
        // ignora erros de cleanup
      }
    }

    isRunningRef.current = false;
    if (isMountedRef.current) {
      setScannerReady(false);
      setScanning(false);
      setScannedCode('');
      setManualCode('');
      setError('');
      setMatchedItem(null);
      setQty(1);
    }
  }, []);

  // ─── Ciclo de vida do modal ───
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => startScanner(), 400);
      return () => clearTimeout(timer);
    } else {
      cleanup();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Busca manual ───
  const handleManualSearch = useCallback(() => {
    const code = manualCode.trim();
    if (!code) return;
    lastScannedRef.current = '';
    setScannedCode(code);
    setMatchedItem(resolveMatch(code));
  }, [manualCode, resolveMatch]);

  // ─── Adicionar ao estoque ───
  const handleAddToStock = useCallback(() => {
    if (!matchedItem) return;
    importarItens(
      [{ nome: matchedItem.name, quantidade: qty, unidade: matchedItem.unit }],
      'Scanner'
    );
    showToast('📷', `${qty} ${matchedItem.unit} de ${matchedItem.name} adicionado(s) ao estoque!`);
    cleanup();
    onClose();
  }, [matchedItem, qty, importarItens, showToast, cleanup, onClose]);

  const handleClose = useCallback(() => {
    cleanup();
    onClose();
  }, [cleanup, onClose]);

  return (
    <Modal open={open} onClose={handleClose} title="📷 Scanner de Código de Barras">
      <div className="flex flex-col gap-4">

        {/* Viewfinder — html5-qrcode renderiza o <video> aqui */}
        <div
          className="relative rounded-xl overflow-hidden border border-border bg-black"
          style={{ minHeight: 260 }}
        >
          <div id={SCANNER_ELEMENT_ID} className="w-full" />

          {/* Linha de scan animada quando ativo */}
          {scanning && !scannedCode && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none px-4">
              <div
                className="h-0.5 w-full bg-primary/80 rounded-full shadow-[0_0_8px_2px_hsl(var(--primary)/0.5)]"
                style={{ animation: 'scanLine 2s ease-in-out infinite' }}
              />
            </div>
          )}

          {/* Overlay de loading enquanto câmera não abre */}
          {!scannerReady && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">Iniciando câmera...</span>
            </div>
          )}
        </div>

        <style>{`
          @keyframes scanLine {
            0%   { transform: translateY(-60px); opacity: 0.4; }
            50%  { transform: translateY(0px);   opacity: 1;   }
            100% { transform: translateY(60px);  opacity: 0.4; }
          }
        `}</style>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {scannerReady && !scannedCode && (
          <div className="bg-surface/50 border border-border rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">
              💡 <strong>Dica:</strong> Centralize o código de barras na linha iluminada. Mantenha
              o dispositivo estável a ~15–25 cm do código.
            </p>
            <p className="text-xs text-muted-foreground">
              Suporta EAN-13, EAN-8, UPC, Code 128, QR Code e outros. Se não reconhecer, use o
              campo abaixo.
            </p>
          </div>
        )}

        {/* Input manual */}
        <div className="border-t border-border pt-4">
          <label className="text-xs text-muted-foreground font-semibold mb-1.5 block">
            Buscar por código ou nome do produto:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              placeholder="EAN, código ou nome do produto..."
              className="flex-1 h-10 px-3 bg-surface border border-border rounded-lg text-foreground text-sm outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleManualSearch}
              className="h-10 px-4 bg-info text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Resultado */}
        {scannedCode && (
          <div className="border-t border-border pt-4">
            <div className="text-xs text-muted-foreground mb-2">
              Código:{' '}
              <span className="text-primary font-mono font-bold">{scannedCode}</span>
            </div>

            {matchedItem ? (
              <div className="bg-success/10 border border-success/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{matchedItem.emoji}</span>
                  <div>
                    <div className="font-bold text-foreground">{matchedItem.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Estoque atual: {matchedItem.qty} {matchedItem.unit}
                      {matchedItem.ean && (
                        <span className="ml-2">• EAN: {matchedItem.ean}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground font-semibold">
                    Qtd a adicionar:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-20 h-8 px-2 bg-surface border border-border rounded-lg text-foreground text-sm text-center outline-none focus:border-primary"
                  />
                  <span className="text-xs text-muted-foreground">{matchedItem.unit}</span>
                </div>
                <button
                  onClick={handleAddToStock}
                  className="mt-3 w-full h-10 bg-success text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-all"
                >
                  ✅ Adicionar ao Estoque
                </button>
              </div>
            ) : (
              <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-sm text-warning">
                ⚠️ Nenhum item encontrado com este código. Você pode buscar pelo nome do produto
                ou cadastrar um novo item.
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}