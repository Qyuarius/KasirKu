import { useState, useReducer, useRef, useEffect } from "react";
import api from "./api";

/* ─────────────────────────────────────────────────────────────────
   GOOGLE MATERIAL SYMBOLS  (rounded variant, filled on active)
   Usage: <MI icon="shopping_cart" fill size={24} />
───────────────────────────────────────────────────────────────── */
function MI({ icon, size = 22, fill = false, className = "", style = {} }) {
  return (
    <span
      className={`material-symbols-rounded select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        ...style,
      }}
    >
      {icon}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MEDIA QUERY HOOK
───────────────────────────────────────────────────────────────── */
function useMediaQuery(query) {
  const get = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(query);
    const h = () => setMatches(mql.matches);
    h();
    mql.addEventListener ? mql.addEventListener("change", h) : mql.addListener(h);
    return () => (mql.removeEventListener ? mql.removeEventListener("change", h) : mql.removeListener(h));
  }, [query]);
  return matches;
}

/* ─────────────────────────────────────────────────────────────────
   CART REDUCER
───────────────────────────────────────────────────────────────── */
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const ex = state.find(i => i.id === action.product.id);
      return ex ? state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state, { ...action.product, qty: 1 }];
    }
    case "REMOVE": return state.filter(i => i.id !== action.id);
    case "INC": return state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case "DEC": return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i);
    case "CLEAR": return [];
    default: return state;
  }
}

const fmt = n => "Rp " + Number(n).toLocaleString("id-ID");
const CATEGORIES = ["Semua", "Makanan", "Minuman", "Snack", "Kesehatan", "Rumah Tangga"];

/* ─────────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────────── */
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
      <MI icon="check_circle" fill size={18} className="text-emerald-400" />
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LOGIN PAGE  — casual card, soft shadows, warm tones
───────────────────────────────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) { setError("Username dan password wajib diisi."); return; }
    setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-4 py-10 font-['Inter',sans-serif]">
      {/* soft blobs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative w-full max-w-[400px]">
        {/* logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.6)]">
            <MI icon="storefront" size={32} fill className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">KasirKu</h1>
          <p className="mt-1 text-sm text-slate-400">Point of Sale · Management System</p>
        </div>

        {/* card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-xl">
          <h2 className="mb-1 text-lg font-semibold text-white">Masuk ke akun kamu</h2>
          <p className="mb-6 text-sm text-slate-400">Gunakan akun yang diberikan admin.</p>

          <div className="space-y-4">
            {/* username */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Username</label>
              <div className="relative">
                <MI icon="person" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="contoh: budi"
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
              <div className="relative">
                <MI icon="lock" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-12 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition"
                />
                <button
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 hover:text-slate-200 transition"
                >
                  <MI icon={showPass ? "visibility_off" : "visibility"} size={18} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-3 text-sm text-rose-300">
                <MI icon="error" size={16} fill className="text-rose-400 shrink-0" />
                {error}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(16,185,129,0.5)] transition hover:bg-emerald-600 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Memverifikasi...</>
            ) : (
              <><MI icon="login" size={18} /> Masuk</>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-slate-500">Lupa password? Hubungi admin.</p>
        </div>

        <p className="mt-5 text-center text-xs text-slate-600">KasirKu v1.0 · 2025</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   RECEIPT MODAL
───────────────────────────────────────────────────────────────── */
function ReceiptModal({ tx, user, onClose }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const cashierName = tx.user?.nama || user.nama;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className={`flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ${isMobile ? "max-h-[90vh]" : "max-h-[85vh] max-w-[380px]"}`}>
        {/* header */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-6 py-6 text-white text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <MI icon="check_circle" size={32} fill className="text-white" />
          </div>
          <div className="text-xl font-bold">Pembayaran Berhasil! 🎉</div>
          <div className="mt-1 text-sm text-white/70">{tx.nomor_nota}</div>
        </div>

        {/* receipt body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 font-mono text-[13px] text-slate-800">
          <div className="mb-3 text-center">
            <div className="text-base font-bold">KasirKu Store</div>
            <div className="text-xs text-slate-500 mt-0.5">Jl. Contoh No. 1, Jakarta</div>
            <div className="text-xs text-slate-500">{new Date(tx.created_at).toLocaleString("id-ID")}</div>
            <div className="text-xs text-slate-500">Kasir: {cashierName}</div>
          </div>
          <div className="my-3 border-t border-dashed border-slate-200" />
          <div className="space-y-1.5">
            {tx.detail.map(i => (
              <div key={i.id} className="flex justify-between gap-3">
                <span className="flex-1 min-w-0 truncate">{i.nama_produk} ×{i.qty}</span>
                <span className="font-semibold">{fmt(i.harga_satuan * i.qty)}</span>
              </div>
            ))}
          </div>
          <div className="my-3 border-t border-dashed border-slate-200" />
          <div className="space-y-1">
            <div className="flex justify-between"><span>Total</span><b>{fmt(tx.total)}</b></div>
            <div className="flex justify-between"><span>Bayar</span><b>{fmt(tx.bayar)}</b></div>
            <div className="flex justify-between font-bold text-emerald-600"><span>Kembalian</span><span>{fmt(tx.bayar - tx.total)}</span></div>
          </div>
          <div className="my-3 border-t border-dashed border-slate-200" />
          <div className="text-center text-xs text-slate-400 italic">Terima kasih sudah belanja! 🛍️</div>
        </div>

        <div className="flex gap-3 px-6 pb-5">
          <button onClick={() => window.print()} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.99]">
            <MI icon="print" size={18} /> Cetak
          </button>
          <button onClick={onClose} className="h-11 flex-1 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.99]">
            Nota Baru
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   BARCODE SCANNER MODAL
───────────────────────────────────────────────────────────────── */
function BarcodeScannerModal({ onClose, onDetected }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const detectorRef = useRef(null);
  const zxingRef = useRef(null);
  const lastRef = useRef({ value: "", at: 0 });
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const stop = async () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      if (zxingRef.current) { try { zxingRef.current.reset(); } catch (e) { void e; } zxingRef.current = null; }
      if (streamRef.current) { for (const t of streamRef.current.getTracks()) t.stop(); streamRef.current = null; }
      if (videoRef.current) videoRef.current.srcObject = null;
      detectorRef.current = null;
      setReady(false);
    };
    const start = async () => {
      setError(""); setReady(false);
      if (!window.isSecureContext && window.location.hostname !== "localhost") { setError("Scan kamera butuh HTTPS."); return; }
      if (!navigator.mediaDevices?.getUserMedia) { setError("Browser tidak mendukung akses kamera."); return; }
      const hasBD = "BarcodeDetector" in window;
      if (hasBD) { try { detectorRef.current = new window.BarcodeDetector({ formats: ["code_128", "ean_13", "ean_8", "code_39", "qr_code", "upc_a", "upc_e"] }); } catch { detectorRef.current = new window.BarcodeDetector(); } }
      let stream;
      try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false }); }
      catch (e) { setError(e?.name === "NotAllowedError" ? "Izin kamera ditolak." : "Gagal membuka kamera."); return; }
      if (cancelled) { for (const t of stream.getTracks()) t.stop(); return; }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); setReady(true); } catch { setError("Tidak bisa memutar video."); return; }
      }
      if (!hasBD) {
        try {
          const mod = await import("@zxing/browser");
          if (cancelled) return;
          const reader = new mod.BrowserMultiFormatReader();
          zxingRef.current = reader;
          const result = await reader.decodeOnceFromVideoElement(videoRef.current);
          const code = String(result?.getText?.() || "").trim();
          if (code) { onDetected?.(code); onClose?.(); }
        } catch { setError("Scan barcode tidak didukung. Gunakan Chrome / HTTPS."); }
        return;
      }
      const tick = async () => {
        if (cancelled) return;
        const video = videoRef.current; const detector = detectorRef.current;
        if (!video || !detector || video.readyState < 2) { rafRef.current = requestAnimationFrame(tick); return; }
        try {
          const barcodes = await detector.detect(video);
          if (barcodes?.length) {
            const code = barcodes[0]?.rawValue;
            if (code) {
              const now = Date.now(); const last = lastRef.current;
              if (last.value !== code || now - last.at > 1500) { lastRef.current = { value: code, at: now }; onDetected?.(code); onClose?.(); return; }
            }
          }
        } catch { void 0; }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };
    start();
    return () => { cancelled = true; stop(); };
  }, [onClose, onDetected]);

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4">
      <div className={`flex w-full flex-col overflow-hidden bg-slate-900 ${isMobile ? "h-[90vh] rounded-t-3xl" : "max-w-[500px] rounded-3xl"}`}>
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5 text-white">
            <MI icon="qr_code_scanner" size={20} className="text-emerald-400" />
            <span className="font-semibold">Scan Barcode</span>
          </div>
          <button onClick={onClose} className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/15 transition">
            <MI icon="close" size={16} /> Tutup
          </button>
        </div>
        <div className="relative bg-black flex-1">
          <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-[160px] w-[70%] max-w-[340px] rounded-3xl border-2 border-emerald-400/80" />
          </div>
          {!ready && !error && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 px-4 py-3 text-sm text-white backdrop-blur">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" /> Membuka kamera...
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 grid place-items-center p-6">
              <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-center text-sm text-rose-200">{error}</div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 px-5 py-4 text-xs text-slate-400">
          <MI icon="info" size={14} className="text-slate-500 shrink-0" />
          Arahkan kamera ke barcode — terdeteksi otomatis.
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CASHIER PAGE
───────────────────────────────────────────────────────────────── */
function CashierPage({ user, isMobile, isTablet }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [search, setSearch] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [mobileTab, setMobileTab] = useState("products");
  const [category, setCategory] = useState("Semua");
  const [receipt, setReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [orderNum] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const [paid, setPaid] = useState("");
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");

  const fetchProducts = async (q = "") => {
    try { setProductsError(""); setProductsLoading(true); const res = await api.get("/produk" + (q ? `?search=${encodeURIComponent(q)}` : "")); setProducts(res.data); }
    catch { setProductsError("Gagal memuat produk. Coba lagi."); }
    finally { setProductsLoading(false); }
  };

  useEffect(() => { let cancelled = false; (async () => { try { setProductsError(""); setProductsLoading(true); const res = await api.get("/produk" + (search ? `?search=${encodeURIComponent(search)}` : "")); if (!cancelled) setProducts(res.data); } catch { if (!cancelled) setProductsError("Gagal memuat produk."); } finally { if (!cancelled) setProductsLoading(false); } })(); return () => { cancelled = true; }; }, [search]);

  const filtered = products.filter(p => category === "Semua" || p.category === category);
  const subtotal = cart.reduce((s, i) => s + i.harga * i.qty, 0);
  const paidNum = parseInt(paid.replace(/\D/g, "") || "0");
  const change = paidNum - subtotal;
  const validPayment = cart.length > 0 && paidNum >= subtotal;
  const quickAmounts = [...new Set([subtotal, Math.ceil(subtotal / 10000) * 10000, Math.ceil(subtotal / 50000) * 50000, 100000])].filter(Boolean).slice(0, 4);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleAdd = p => { if (p.stok === 0) return; dispatch({ type: "ADD", product: p }); setToast(`${p.nama} ditambahkan ke keranjang`); };

  const handleBarcodeDetected = async code => {
    const cleaned = String(code || "").trim(); if (!cleaned) return;
    setShowScanner(false);
    try { const res = await api.get(`/produk?search=${encodeURIComponent(cleaned)}`); const list = Array.isArray(res.data) ? res.data : []; const exact = list.find(p => p?.barcode === cleaned || p?.kode === cleaned); const chosen = exact || (list.length === 1 ? list[0] : null); if (chosen) { handleAdd(chosen); setSearch(""); return; } } catch { void 0; }
    setSearch(cleaned);
  };

  const handleConfirmPayment = async () => {
    try { const res = await api.post("/transaksi", { cart, total: subtotal, bayar: paidNum }); setReceipt(res.data); fetchProducts(search); }
    catch (err) { alert(err.response?.data?.message || "Gagal memproses transaksi."); }
  };

  const handleCloseReceipt = () => { setReceipt(null); dispatch({ type: "CLEAR" }); setPaid(""); };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-slate-50">
      {showScanner && <BarcodeScannerModal onClose={() => setShowScanner(false)} onDetected={handleBarcodeDetected} />}

      {/* mobile tab bar */}
      {isMobile && (
        <div className="flex gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
          {["products", "cart"].map(tab => (
            <button key={tab} onClick={() => setMobileTab(tab)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition ${mobileTab === tab ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50"}`}>
              <MI icon={tab === "products" ? "grid_view" : "shopping_cart"} size={18} fill={mobileTab === tab} />
              {tab === "products" ? "Produk" : `Keranjang${cartCount ? ` (${cartCount})` : ""}`}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT: Products ── */}
        {(!isMobile || mobileTab === "products") && (
          <section className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
            {/* search bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MI icon="search" size={20} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari produk, kode, atau barcode..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition"
                />
              </div>
              <button onClick={() => setShowScanner(true)} title="Scan barcode"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-emerald-600 active:scale-[0.97]">
                <MI icon="qr_code_scanner" size={20} />
              </button>
            </div>

            {/* category chips */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`h-8 shrink-0 rounded-full px-4 text-xs font-medium transition active:scale-[0.97] ${category === c ? "bg-emerald-500 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                  {c}
                </button>
              ))}
            </div>

            {productsError && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium text-rose-700">
                  <MI icon="warning" size={16} fill className="text-rose-500" /> {productsError}
                </div>
                <button onClick={() => fetchProducts(search)} className="rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-50">Coba lagi</button>
              </div>
            )}

            {/* product grid */}
            <div className="min-h-0 flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {productsLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 mb-3" />
                      <div className="h-4 w-3/4 rounded bg-slate-100 mb-2" />
                      <div className="h-3 w-1/2 rounded bg-slate-100 mb-4" />
                      <div className="h-4 w-2/3 rounded bg-slate-100" />
                    </div>
                  ))
                  : filtered.map(p => {
                    const disabled = p.stok === 0;
                    return (
                      <button key={p.id} onClick={() => handleAdd(p)} disabled={disabled}
                        className={`group relative rounded-2xl border bg-white p-4 text-left shadow-sm transition ${disabled ? "cursor-not-allowed border-slate-100 opacity-55" : "border-slate-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md active:scale-[0.98]"}`}>
                        {/* icon placeholder */}
                        <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${disabled ? "bg-slate-100" : "bg-emerald-50 group-hover:bg-emerald-100"} transition`}>
                          <MI icon="inventory_2" size={22} fill={!disabled} className={disabled ? "text-slate-300" : "text-emerald-600"} />
                        </div>
                        {/* stock badge */}
                        <div className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold ${disabled ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-700"}`}>
                          {disabled ? "Habis" : `${p.stok}`}
                        </div>
                        <div className="text-sm font-semibold text-slate-800 leading-tight">{p.nama}</div>
                        <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">{p.kode}</div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900">{fmt(p.harga)}</span>
                          <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition ${disabled ? "bg-slate-100 text-slate-300" : "bg-emerald-500 text-white group-hover:bg-emerald-600"}`}>
                            <MI icon="add" size={18} />
                          </div>
                        </div>
                      </button>
                    );
                  })
                }
                {!productsLoading && filtered.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                      <MI icon="search_off" size={26} className="text-slate-400" />
                    </div>
                    <div className="text-sm font-semibold text-slate-600">Produk tidak ditemukan</div>
                    <div className="text-xs text-slate-400">Coba kata kunci lain atau scan barcode</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── RIGHT: Cart ── */}
        {(!isMobile || mobileTab === "cart") && (
          <aside className={`flex flex-col overflow-hidden border-l border-slate-200 bg-white ${isMobile ? "w-full border-l-0" : isTablet ? "w-[360px]" : "w-[400px]"} shrink-0`}>
            {/* cart header */}
            <div className="border-b border-slate-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Nota #{orderNum}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{cartCount} item · {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <button onClick={() => { dispatch({ type: "CLEAR" }); setPaid(""); }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100 active:scale-[0.97]" title="Bersihkan">
                  <MI icon="delete_sweep" size={20} />
                </button>
              </div>
            </div>

            {/* cart items */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "thin" }}>
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <MI icon="shopping_cart" size={28} className="text-slate-300" />
                  </div>
                  <div className="text-sm font-medium text-slate-500">Keranjang masih kosong</div>
                  <div className="text-xs text-slate-400">Tap produk di sebelah kiri untuk menambahkan</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                        <MI icon="inventory_2" size={18} fill className="text-emerald-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-800">{item.nama}</div>
                        <div className="text-xs text-slate-400">{fmt(item.harga)}</div>
                      </div>
                      {/* qty controls */}
                      <div className="flex items-center gap-1">
                        <button onClick={() => dispatch({ type: "DEC", id: item.id })}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 transition hover:bg-slate-50 active:scale-[0.95]">
                          <MI icon="remove" size={14} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold text-slate-800">{item.qty}</span>
                        <button onClick={() => dispatch({ type: "INC", id: item.id })}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white transition hover:bg-emerald-600 active:scale-[0.95]">
                          <MI icon="add" size={14} />
                        </button>
                      </div>
                      <div className="w-20 text-right text-sm font-bold text-slate-900">{fmt(item.harga * item.qty)}</div>
                      <button onClick={() => dispatch({ type: "REMOVE", id: item.id })}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:text-slate-500 active:scale-[0.95]">
                        <MI icon="close" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* cart footer / payment */}
            <div className="border-t border-slate-100 bg-white px-5 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Subtotal</span><span className="font-semibold text-slate-700">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total</span>
                <span className="text-2xl font-extrabold text-slate-900">{fmt(subtotal)}</span>
              </div>

              {/* payment input */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">Uang Bayar</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">Rp</span>
                  <input inputMode="numeric" value={paid}
                    onChange={e => setPaid(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
                    placeholder="0"
                    onKeyDown={e => e.key === "Enter" && validPayment && handleConfirmPayment()}
                    className={`h-11 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition ${validPayment ? "border-emerald-400 focus:ring-2 focus:ring-emerald-400/20" : "border-slate-200 focus:border-slate-300"}`}
                  />
                </div>
              </div>

              {/* quick amounts */}
              <div className="flex flex-wrap gap-1.5">
                {quickAmounts.filter(a => a > 0).map(a => (
                  <button key={a} onClick={() => setPaid(a.toLocaleString("id-ID"))}
                    className={`h-8 flex-1 rounded-xl border px-2 text-xs font-semibold transition active:scale-[0.97] ${paidNum === a ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                    {fmt(a)}
                  </button>
                ))}
              </div>

              {/* change */}
              <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${validPayment ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
                <span className={`text-sm font-medium ${validPayment ? "text-emerald-700" : "text-slate-400"}`}>Kembalian</span>
                <span className={`text-sm font-bold ${validPayment ? "text-emerald-700" : "text-slate-300"}`}>{validPayment ? fmt(change) : "—"}</span>
              </div>

              {/* action buttons */}
              <div className="flex gap-2">
                <button onClick={() => { dispatch({ type: "CLEAR" }); setPaid(""); }}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 active:scale-[0.98]">
                  <MI icon="cancel" size={16} /> Batal
                </button>
                <button onClick={() => validPayment && handleConfirmPayment()} disabled={!validPayment}
                  className={`flex h-11 flex-[2] items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white transition active:scale-[0.98] ${validPayment ? "bg-emerald-500 shadow-lg shadow-emerald-500/25 hover:bg-emerald-600" : "cursor-not-allowed bg-slate-200 text-slate-400"}`}>
                  <MI icon="payments" size={18} /> Bayar Sekarang
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>

      {receipt && <ReceiptModal tx={receipt} user={user} onClose={handleCloseReceipt} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────────────────────────── */
function DashboardPage({ isMobile, isTablet }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/dashboard").then(r => { setStats(r.data); setLoading(false); }).catch(console.error); }, []);
  if (loading) return <LoadingState label="Memuat dashboard..." />;

  const cards = [
    { label: "Omzet Hari Ini", value: fmt(stats.summary.totalSalesToday), icon: "payments", color: "emerald" },
    { label: "Transaksi Hari Ini", value: `${stats.summary.transactionCountToday} Nota`, icon: "receipt_long", color: "blue" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* stat cards */}
      <div className={`grid gap-4 ${isTablet ? "grid-cols-1" : "grid-cols-2"}`}>
        {cards.map(c => (
          <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${c.color === "emerald" ? "bg-emerald-50" : "bg-blue-50"}`}>
              <MI icon={c.icon} size={24} fill className={c.color === "emerald" ? "text-emerald-600" : "text-blue-600"} />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">{c.label}</div>
              <div className={`mt-1 text-2xl font-extrabold ${c.color === "emerald" ? "text-emerald-600" : "text-slate-900"}`}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* chart + performance */}
      <div className={`grid gap-4 ${isTablet ? "grid-cols-1" : "grid-cols-[2fr_1fr]"}`}>
        <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
            <MI icon="bar_chart" size={20} className="text-emerald-500" /> Penjualan 7 Hari Terakhir
          </div>
          <div className="flex items-end gap-2 h-44">
            {stats.chart.map(d => {
              const max = Math.max(...stats.chart.map(x => x.total)) || 1;
              const pct = (d.total / max) * 100;
              return (
                <div key={d.tanggal} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full rounded-t-lg bg-emerald-400 transition-all hover:bg-emerald-500" style={{ height: `${pct}%`, minHeight: 4 }} />
                  <div className="text-[9px] text-slate-400 text-center">{d.tanggal}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
            <MI icon="leaderboard" size={20} className="text-emerald-500" /> Performa Kasir
          </div>
          <div className="space-y-4">
            {stats.performance.map(p => (
              <div key={p.nama} className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{p.nama}</div>
                  <div className="text-xs text-slate-400">{p.count} transaksi</div>
                </div>
                <div className="text-sm font-bold text-emerald-600">{fmt(p.total)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   TRANSACTIONS PAGE
───────────────────────────────────────────────────────────────── */
function TransactionsPage() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [txs, setTxs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  useEffect(() => { api.get("/transaksi").then(r => { setTxs(r.data); setLoading(false); }).catch(console.error); }, []);
  const filtered = txs.filter(t => t.nomor_nota.toLowerCase().includes(search.toLowerCase()) || (t.user?.nama || "").toLowerCase().includes(search.toLowerCase()));
  if (loading) return <LoadingState label="Memuat transaksi..." />;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <MI icon="receipt_long" size={22} className="text-emerald-500" /> Riwayat Transaksi
        </div>
        <div className="relative">
          <MI icon="search" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nota atau kasir..."
            className="h-9 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-700 outline-none focus:border-emerald-400 transition" style={{ width: isMobile ? 180 : 260 }} />
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 truncate">{t.nomor_nota}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{new Date(t.created_at).toLocaleString("id-ID")}</div>
                  <div className="mt-1 text-xs text-slate-500">Kasir: {t.user?.nama || "—"}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">{fmt(t.total)}</div>
                  <button onClick={() => setSelected(t)} className="mt-2 flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100">
                    <MI icon="visibility" size={14} /> Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-left" style={{ minWidth: 700 }}>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Nota / Tanggal", "Kasir", "Total", ""].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-4"><div className="font-semibold text-slate-800">{t.nomor_nota}</div><div className="text-xs text-slate-400">{new Date(t.created_at).toLocaleString("id-ID")}</div></td>
                  <td className="px-5 py-4 text-sm text-slate-600">{t.user?.nama || "—"}</td>
                  <td className="px-5 py-4 font-bold text-emerald-600">{fmt(t.total)}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setSelected(t)} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                      <MI icon="open_in_new" size={13} /> Lihat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && <ReceiptModal tx={selected} user={{}} onClose={() => setSelected(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   INVENTORY PAGE
───────────────────────────────────────────────────────────────── */
function InventoryPage({ isMobile }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [form, setForm] = useState({ nama: "", barcode: "", harga: "", stok: "" });
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => { try { const r = await api.get("/produk"); setProducts(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try { editId ? await api.patch(`/produk/${editId}`, form) : await api.post("/produk", form); setShowModal(false); setEditId(null); setForm({ nama: "", barcode: "", harga: "", stok: "" }); fetchProducts(); }
    catch { alert("Gagal simpan produk"); }
  };
  const handleEdit = p => { setEditId(p.id); setForm({ nama: p.nama, barcode: p.barcode || "", harga: p.harga, stok: p.stok }); setShowModal(true); };
  const handleDelete = async id => { if (!confirm("Hapus produk ini?")) return; try { await api.delete(`/produk/${id}`); fetchProducts(); } catch { alert("Gagal hapus"); } };

  if (loading) return <LoadingState label="Memuat inventaris..." />;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <MI icon="inventory_2" size={22} className="text-emerald-500" /> Inventaris Barang
        </div>
        <button onClick={() => { setEditId(null); setForm({ nama: "", barcode: "", harga: "", stok: "" }); setShowModal(true); }}
          className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]">
          <MI icon="add" size={18} /> Produk Baru
        </button>
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold text-slate-800 truncate">{p.nama}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{p.kode}{p.barcode ? ` · ${p.barcode}` : ""}</div>
                  <div className="mt-2 text-sm font-bold text-slate-900">{fmt(p.harga)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${p.stok <= 5 ? "text-rose-500" : "text-slate-700"}`}>Stok: {p.stok}</div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => handleEdit(p)} className="flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100">
                      <MI icon="edit" size={13} /> Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100">
                      <MI icon="delete" size={13} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-left" style={{ minWidth: 720 }}>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Kode / Barcode", "Nama Produk", "Harga", "Stok", "Aksi"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(p => (
                <tr key={p.id} className={`hover:bg-slate-50/60 transition ${p.stok <= 5 ? "bg-amber-50/40" : ""}`}>
                  <td className="px-5 py-4"><div className="font-semibold text-slate-700">{p.kode}</div><div className="text-xs text-slate-400">{p.barcode || "—"}</div></td>
                  <td className="px-5 py-4 font-medium text-slate-800">{p.nama}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{fmt(p.harga)}</td>
                  <td className="px-5 py-4"><span className={`font-bold ${p.stok <= 5 ? "text-rose-500" : "text-slate-700"}`}>{p.stok}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(p)} className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100">
                        <MI icon="edit" size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100">
                        <MI icon="delete" size={13} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
          {showScanner && <BarcodeScannerModal onClose={() => setShowScanner(false)} onDetected={code => { setForm(f => ({ ...f, barcode: code })); setShowScanner(false); }} />}
          <div className={`w-full bg-white ${isMobile ? "rounded-t-3xl" : "max-w-[420px] rounded-3xl"} p-6 shadow-2xl`}>
            <div className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-800">
              <MI icon={editId ? "edit" : "add_circle"} size={22} className="text-emerald-500" />
              {editId ? "Edit Produk" : "Tambah Produk Baru"}
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[{ key: "nama", placeholder: "Nama Produk", icon: "label" }, { key: "harga", placeholder: "Harga Jual", icon: "attach_money", type: "number" }, { key: "stok", placeholder: "Jumlah Stok", icon: "inventory", type: "number" }].map(f => (
                <div key={f.key} className="relative">
                  <MI icon={f.icon} size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={f.type || "text"} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                    className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition" />
                </div>
              ))}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MI icon="barcode_reader" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Barcode (opsional)" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })}
                    className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-emerald-400 transition" />
                </div>
                <button type="button" onClick={() => setShowScanner(true)} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50">
                  <MI icon="qr_code_scanner" size={20} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Batal</button>
                <button type="submit" className="flex-1 rounded-2xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   EMPLOYEES PAGE
───────────────────────────────────────────────────────────────── */
function EmployeesPage() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: "", username: "", password: "", role: "kasir" });
  const [error, setError] = useState("");

  const fetchUsers = async () => { try { const r = await api.get("/pegawai"); setUsers(r.data); } catch (e) { console.error(e); } finally { setLoading(false); } };
  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async id => { try { await api.patch(`/pegawai/${id}/toggle`); fetchUsers(); } catch { alert("Gagal ubah status"); } };
  const handleReset = async id => { const p = prompt("Password baru:"); if (!p) return; try { await api.patch(`/pegawai/${id}/reset-password`, { newPassword: p }); alert("Password berhasil direset"); } catch { alert("Gagal reset"); } };
  const handleSubmit = async e => { e.preventDefault(); setError(""); try { await api.post("/pegawai", form); setShowModal(false); setForm({ nama: "", username: "", password: "", role: "kasir" }); fetchUsers(); } catch (err) { setError(err.response?.data?.message || "Gagal menambah pegawai"); } };

  if (loading) return <LoadingState label="Memuat data pegawai..." />;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <MI icon="group" size={22} className="text-emerald-500" /> Manajemen Pegawai
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]">
          <MI icon="person_add" size={18} /> Tambah Pegawai
        </button>
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-sm font-bold text-white">
                    {u.nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{u.nama}</div>
                    <div className="text-xs text-slate-400">@{u.username}</div>
                    <div className="mt-1.5 flex gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{u.role.toUpperCase()}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${u.aktif ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>{u.aktif ? "Aktif" : "Nonaktif"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleToggle(u.id)} className={`rounded-xl border px-3 py-1.5 text-xs font-medium transition ${u.aktif ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                    {u.aktif ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button onClick={() => handleReset(u.id)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100">Reset Pass</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full text-left" style={{ minWidth: 800 }}>
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Nama", "Username", "Role", "Status", "Aksi"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white">
                        {u.nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{u.nama}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">@{u.username}</td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{u.role.toUpperCase()}</span></td>
                  <td className="px-5 py-4"><span className={`flex items-center gap-1.5 text-sm font-semibold ${u.aktif ? "text-emerald-600" : "text-rose-500"}`}><MI icon="circle" size={10} fill />{u.aktif ? "Aktif" : "Nonaktif"}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleToggle(u.id)} className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${u.aktif ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                        <MI icon={u.aktif ? "person_off" : "person_check"} size={13} /> {u.aktif ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button onClick={() => handleReset(u.id)} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                        <MI icon="key" size={13} /> Reset Pass
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
          <div className={`w-full bg-white ${isMobile ? "rounded-t-3xl" : "max-w-[420px] rounded-3xl"} p-6 shadow-2xl`}>
            <div className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-800">
              <MI icon="person_add" size={22} className="text-emerald-500" /> Tambah Pegawai Baru
            </div>
            {error && <div className="mb-4 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600"><MI icon="error" size={16} fill className="text-rose-500 shrink-0" />{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-3">
              {[{ key: "nama", placeholder: "Nama Lengkap", icon: "badge" }, { key: "username", placeholder: "Username", icon: "alternate_email" }, { key: "password", placeholder: "Password", icon: "lock", type: "password" }].map(f => (
                <div key={f.key} className="relative">
                  <MI icon={f.icon} size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={f.type || "text"} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                    className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition" />
                </div>
              ))}
              <div className="relative">
                <MI icon="admin_panel_settings" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="h-11 w-full rounded-2xl border border-slate-200 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-emerald-400 transition bg-white">
                  <option value="kasir">Kasir</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 rounded-2xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">Batal</button>
                <button type="submit" className="flex-1 rounded-2xl bg-emerald-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   REPORTS PAGE
───────────────────────────────────────────────────────────────── */
function ReportsPage({ isMobile }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get("/transaksi").then(r => { setTxs(r.data); setLoading(false); }); }, []);
  if (loading) return <LoadingState label="Memuat laporan..." />;

  const totalRevenue = txs.reduce((s, t) => s + t.total, 0);
  const totalItems = txs.reduce((s, t) => s + t.detail.reduce((ss, d) => ss + d.qty, 0), 0);
  const productSales = {};
  txs.forEach(t => t.detail.forEach(d => { productSales[d.nama_produk] = (productSales[d.nama_produk] || 0) + d.qty; }));
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const summaryCards = [
    { label: "Total Pendapatan", value: fmt(totalRevenue), icon: "account_balance_wallet", color: "emerald" },
    { label: "Total Transaksi", value: txs.length, icon: "receipt_long", color: "blue" },
    { label: "Produk Terjual", value: `${totalItems} unit`, icon: "inventory_2", color: "purple" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
        <MI icon="analytics" size={22} className="text-emerald-500" /> Laporan Penjualan
      </div>

      <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
        {summaryCards.map(c => (
          <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${c.color === "emerald" ? "bg-emerald-50" : c.color === "blue" ? "bg-blue-50" : "bg-purple-50"}`}>
              <MI icon={c.icon} size={24} fill className={c.color === "emerald" ? "text-emerald-600" : c.color === "blue" ? "text-blue-600" : "text-purple-600"} />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{c.label}</div>
              <div className={`mt-1 text-2xl font-extrabold ${c.color === "emerald" ? "text-emerald-600" : "text-slate-900"}`}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
          <MI icon="emoji_events" size={20} className="text-amber-500" /> Produk Terlaris
        </div>
        <div className="space-y-3">
          {topProducts.map(([name, qty], i) => (
            <div key={name} className="flex items-center gap-4">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-200 text-slate-600" : "bg-slate-100 text-slate-500"}`}>{i + 1}</div>
              <div className="flex-1 text-sm font-medium text-slate-700">{name}</div>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${(qty / topProducts[0][1]) * 80}px`, minWidth: 8 }} />
                <span className="w-16 text-right text-xs font-semibold text-slate-500">{qty} terjual</span>
              </div>
            </div>
          ))}
          {topProducts.length === 0 && <div className="text-sm text-slate-400">Belum ada data penjualan.</div>}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   LOADING STATE
───────────────────────────────────────────────────────────────── */
function LoadingState({ label }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 text-slate-400">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-slate-200 border-t-emerald-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────────── */
export default function App() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isNarrow = isTablet;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(() => { try { const s = localStorage.getItem("user"); return s ? JSON.parse(s) : null; } catch { return null; } });
  const [page, setPage] = useState("cashier");

  const handleLogin = u => { setUser(u); setPage(u.role === "admin" ? "dashboard" : "cashier"); };
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); setUser(null); setPage("cashier"); };

  if (!user) return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
      <LoginPage onLogin={handleLogin} />
    </>
  );

  const navItems = user.role === "admin"
    ? [
      { id: "dashboard", icon: "dashboard", label: "Dashboard" },
      { id: "cashier", icon: "point_of_sale", label: "Kasir" },
      { id: "transactions", icon: "receipt_long", label: "Transaksi" },
      { id: "inventory", icon: "inventory_2", label: "Inventory" },
      { id: "employees", icon: "group", label: "Pegawai" },
      { id: "reports", icon: "analytics", label: "Laporan" },
    ]
    : [
      { id: "cashier", icon: "point_of_sale", label: "Kasir" },
      { id: "transactions", icon: "receipt_long", label: "Riwayat" },
    ];

  const pages = {
    cashier: <CashierPage user={user} isMobile={isMobile} isTablet={isTablet} />,
    dashboard: <DashboardPage isMobile={isMobile} isTablet={isTablet} />,
    transactions: <TransactionsPage />,
    inventory: <InventoryPage isMobile={isMobile} />,
    employees: <EmployeesPage />,
    reports: <ReportsPage isMobile={isMobile} />,
  };

  const pageLabels = {
    cashier: "Kasir", dashboard: "Dashboard", transactions: "Transaksi",
    inventory: "Inventory", employees: "Pegawai", reports: "Laporan",
  };
  const pageIcons = {
    cashier: "point_of_sale", dashboard: "dashboard", transactions: "receipt_long",
    inventory: "inventory_2", employees: "group", reports: "analytics",
  };

  /* sidebar content shared between desktop sidebar & mobile drawer */
  const SidebarContent = ({ onNav }) => (
    <>
      {/* logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/30">
            <MI icon="storefront" size={20} fill className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white leading-tight">KasirKu</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Management Pro</div>
          </div>
        </div>
      </div>

      {/* role badge */}
      <div className="mx-4 mb-3 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: user.role === "admin" ? "rgba(245,197,24,0.1)" : "rgba(74,222,128,0.08)", border: `1px solid ${user.role === "admin" ? "rgba(245,197,24,0.2)" : "rgba(74,222,128,0.15)"}` }}>
        <MI icon={user.role === "admin" ? "shield_person" : "badge"} size={16} fill className={user.role === "admin" ? "text-amber-400" : "text-emerald-400"} />
        <span className={`text-xs font-semibold uppercase tracking-wider ${user.role === "admin" ? "text-amber-400" : "text-emerald-400"}`}>{user.role}</span>
      </div>

      {/* nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {navItems.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => { setPage(n.id); onNav?.(); }}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-emerald-500/15 text-emerald-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
              <MI icon={n.icon} size={20} fill={active} className={active ? "text-emerald-400" : ""} />
              {n.label}
              {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </nav>

      {/* user card */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white">
            {user.nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-200">{user.nama}</div>
            <div className="text-xs text-slate-500">@{user.username}</div>
          </div>
          <button onClick={handleLogout} title="Logout"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 transition hover:bg-rose-500/20">
            <MI icon="logout" size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-slate-50 font-['Inter',sans-serif]">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />

      {/* Mobile/Tablet drawer overlay */}
      {isNarrow && drawerOpen && (
        <div className="fixed inset-0 z-[300] flex" onClick={() => setDrawerOpen(false)}>
          <div className="flex h-full w-[280px] max-w-[85vw] flex-col bg-slate-950 shadow-2xl" onClick={e => e.stopPropagation()}>
            <SidebarContent onNav={() => setDrawerOpen(false)} />
          </div>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" />
        </div>
      )}

      {/* Desktop sidebar */}
      {!isNarrow && (
        <aside className="flex w-[220px] shrink-0 flex-col bg-slate-950">
          <SidebarContent />
        </aside>
      )}

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
          <div className="flex items-center gap-3">
            {isNarrow && (
              <button onClick={() => setDrawerOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50">
                <MI icon="menu" size={20} />
              </button>
            )}
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <MI icon={pageIcons[page]} size={20} className="text-emerald-500" fill />
              {pageLabels[page]}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isMobile && (
              <div className="rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                {new Date().toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </div>
            )}
            {!isMobile && (
              <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else document.exitFullscreen?.(); }}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-500 transition hover:bg-slate-50">
                <MI icon="fullscreen" size={16} /> Fullscreen
              </button>
            )}
            <button onClick={handleLogout}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-600 transition hover:bg-rose-100">
              <MI icon="logout" size={15} />
              {!isMobile && "Logout"}
            </button>
          </div>
        </header>

        {/* page content */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {pages[page] || pages.cashier}
        </div>
      </div>
    </div>
  );
}