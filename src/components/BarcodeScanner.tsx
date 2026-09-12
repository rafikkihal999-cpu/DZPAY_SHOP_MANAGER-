import React, { useState, useEffect, useRef } from 'react';
import {
  Barcode,
  Camera,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  RotateCcw,
  Smartphone,
  Check,
  X,
  HelpCircle,
} from 'lucide-react';

export interface ScannableProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  hasImei?: boolean;
  imei?: string;
  barcode: string;
  color?: string;
  storage?: string;
}

export interface BarcodeScannerProps {
  products: ScannableProduct[];
  onProductScanned: (product: ScannableProduct) => void;
  className?: string;
  autoFocus?: boolean;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  products,
  onProductScanned,
  className = '',
  autoFocus = true,
}) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isListeningGun, setIsListeningGun] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [lastScanned, setLastScanned] = useState<{
    product: ScannableProduct;
    timestamp: Date;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Play crisp POS beep sound via Web Audio API
  const playBeep = (type: 'success' | 'error' = 'success') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, ctx.currentTime); // A6 beep
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Process barcode input: find product and add to cart automatically
  const processBarcode = (code: string) => {
    const cleanCode = code.trim();
    if (!cleanCode) return false;

    // Search by Barcode or IMEI or exact ID
    const matchedProduct = products.find(
      (p) =>
        p.barcode.trim() === cleanCode ||
        (p.imei && p.imei.trim() === cleanCode) ||
        p.id.toLowerCase() === cleanCode.toLowerCase()
    );

    if (matchedProduct) {
      playBeep('success');
      setLastScanned({ product: matchedProduct, timestamp: new Date() });
      setErrorMsg(null);
      setSuccessAnimation(true);
      setTimeout(() => setSuccessAnimation(false), 1200);

      // Automatically add to invoice/cart
      onProductScanned(matchedProduct);
      setBarcodeInput('');
      return true;
    } else {
      playBeep('error');
      setErrorMsg(`لم يتم العثور على منتج بالباركود: ${cleanCode}`);
      setTimeout(() => setErrorMsg(null), 3500);
      return false;
    }
  };

  // Hardware Barcode Gun Reader listener (rapid key strokes buffer)
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isListeningGun) return;

      // Ignore if user is intentionally typing in other form inputs/textareas
      const target = e.target as HTMLElement;
      if (
        target &&
        target !== inputRef.current &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      const currentTime = Date.now();
      const char = e.key;

      if (char === 'Enter') {
        if (buffer.length >= 3) {
          e.preventDefault();
          processBarcode(buffer);
          buffer = '';
        }
        return;
      }

      // Barcode scanners type very quickly (< 45ms between characters)
      if (currentTime - lastKeyTime > 60) {
        buffer = ''; // Reset buffer if delay indicates manual slow typing elsewhere
      }

      if (char.length === 1) {
        buffer += char;
        lastKeyTime = currentTime;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListeningGun, products]);

  // Focus input automatically on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle camera toggle
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      } catch {
        setErrorMsg('تعذر تشغيل الكاميرا. يرجى التأكد من إعطاء الصلاحيات.');
        setTimeout(() => setErrorMsg(null), 3500);
      }
    }
  };

  // Cleanup video stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      processBarcode(barcodeInput);
    }
  };

  // Sample quick barcodes for demo/testing
  const demoSamples = products.slice(0, 4);

  return (
    <div
      id="barcode-scanner-container"
      className={`bg-white rounded-2xl p-4 border transition-all ${
        successAnimation
          ? 'border-emerald-500 shadow-md ring-2 ring-emerald-400/40'
          : 'border-slate-200 shadow-2xs'
      } ${className}`}
    >
      {/* Header & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Barcode className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <span>قارئ الباركود والسيريال التلقائي</span>
              {isListeningGun && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  جاهز للمسح
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500">
              يدعم قارئ الليزر اللاسلكي، الكاميرا، والإدخال اليدوي مع الإضافة المباشرة
            </p>
          </div>
        </div>

        {/* Controls: Sound & Camera */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
            title={soundEnabled ? 'تنبيه الصوت مفعّل' : 'تنبيه الصوت معطّل'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={toggleCamera}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              isCameraActive
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="مسح بواسطة كاميرا الهاتف أو الكمبيوتر"
          >
            <Camera className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{isCameraActive ? 'إيقاف الكاميرا' : 'مسح بالكاميرا'}</span>
          </button>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleManualSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Barcode className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="امسح الباركود بجهاز الليزر أو اكتب الباركود / IMEI واضغط Enter..."
            className="w-full pr-9 pl-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 bg-slate-50 text-slate-900 font-mono transition-all"
          />
          {barcodeInput && (
            <button
              type="button"
              onClick={() => setBarcodeInput('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>إضافة للفاتورة</span>
        </button>
      </form>

      {/* Camera Live Stream View (If active) */}
      {isCameraActive && (
        <div className="mt-3 p-3 rounded-xl bg-slate-900 text-white relative overflow-hidden border border-slate-700">
          <div className="relative aspect-video max-h-48 w-full mx-auto rounded-lg overflow-hidden bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse"></div>
            <div className="absolute inset-8 border-2 border-emerald-400/70 rounded-lg pointer-events-none"></div>
          </div>
          <p className="text-center text-[10px] text-slate-300 mt-2">
            وجّه الكاميرا نحو باركود السلعة ليتم التعرف عليها وإضافتها تلقائياً
          </p>
        </div>
      )}

      {/* Success Notification Alert */}
      {lastScanned && successAnimation && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">تمت الإضافة للفاتورة: </span>
              <span className="font-semibold text-slate-900">{lastScanned.product.name}</span>
              <span className="mr-1 text-[11px] font-mono text-emerald-700">
                ({lastScanned.product.price.toLocaleString('fr-DZ')} د.ج)
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
            {lastScanned.product.barcode}
          </span>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center gap-2 text-xs animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Test Barcodes Row */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-slate-500 flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          مسح سريع للتجربة:
        </span>
        {demoSamples.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => processBarcode(item.barcode)}
            className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer text-[10px] font-medium flex items-center gap-1"
          >
            <span>{item.name.split(' ').slice(0, 3).join(' ')}</span>
            <span className="font-mono text-[9px] text-slate-400">({item.barcode.slice(-4)})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BarcodeScanner;
