import { useState, useReducer, useRef, useEffect } from "react";
import api from "./api";

function Icon({ size = 18, children, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function IconSearch(props) {
  return (
    <Icon {...props}>
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
      <path d="M21 21l-4.3-4.3" />
    </Icon>
  );
}

function IconCamera(props) {
  return (
    <Icon {...props}>
      <path d="M20 20H4a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3l2-2h6l2 2h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3Z" />
      <path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
    </Icon>
  );
}

function IconX(props) {
  return (
    <Icon {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </Icon>
  );
}

function IconTrash(props) {
  return (
    <Icon {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </Icon>
  );
}

function IconMinus(props) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

function IconPlus(props) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

function IconPrint(props) {
  return (
    <Icon {...props}>
      <path d="M6 9V4h12v5" />
      <path d="M6 18h12v2H6z" />
      <path d="M6 14h12v4H6z" />
      <path d="M6 12H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1" />
    </Icon>
  );
}

function useMediaQuery(query) {
  const getMatch = () => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(query);
    const handler = () => setMatches(mql.matches);
    handler();

    if (mql.addEventListener) mql.addEventListener("change", handler);
    else mql.addListener(handler);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else mql.removeListener(handler);
    };
  }, [query]);

  return matches;
}

// Mock data dihapus karena sekarang mengambil dari database via API


// ── LOGIN PAGE ─────────────────────────────────────────────────────────────────
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
      const response = await api.post("/auth/login", { username, password });
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError(err.response?.data?.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  const hints = [
    { label: "Admin", user: "admin", pass: "admin123" },
    { label: "Kasir", user: "budi", pass: "budi123" },
  ];

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-slate-950 px-6 py-10 font-['Manrope',sans-serif]">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.10) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute left-[10%] top-[15%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22)_0%,transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute bottom-[10%] right-[8%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(74,222,128,0.12)_0%,transparent_70%)] blur-2xl" />

      <div className="relative w-full max-w-[420px]">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-400 text-2xl font-extrabold text-white shadow-[0_18px_50px_-28px_rgba(16,185,129,0.65)]">
            K
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">KasirKu</h1>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Point of Sale</p>
        </div>

        <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_28px_80px_-46px_rgba(2,6,23,0.9)] backdrop-blur-xl">
          <div className="text-lg font-extrabold tracking-tight text-white">Masuk</div>
          <div className="mt-1 text-sm text-slate-400">Gunakan akun yang diberikan admin.</div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Username</label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Icon size={18}><path d="M20 21a8 8 0 1 0-16 0" /><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></Icon>
                </div>
                <input
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="contoh: budi"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/15"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Icon size={18}><path d="M7 11V8a5 5 0 0 1 10 0v3" /><path d="M6 11h12v10H6z" /></Icon>
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-12 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/15"
                />
                <button
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 active:scale-[0.99]"
                  title={showPass ? "Sembunyikan" : "Tampilkan"}
                >
                  {showPass ? (
                    <Icon size={18}><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9 5l-.6 1.2A10 10 0 0 0 3 12a10 10 0 0 0 18 0 10 10 0 0 0-3.4-4.8" /><path d="M2 2l20 20" /></Icon>
                  ) : (
                    <Icon size={18}><path d="M3 12s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z" /><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></Icon>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
                {error}
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={[
              "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold text-white transition active:scale-[0.99]",
              loading
                ? "cursor-not-allowed bg-emerald-600/60"
                : "bg-emerald-600 shadow-[0_18px_50px_-28px_rgba(16,185,129,0.65)] hover:bg-emerald-700",
            ].join(" ")}
          >
            {loading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
            {loading ? "Memverifikasi" : "Masuk"}
          </button>

          <div className="mt-4 text-center text-xs text-slate-500">Lupa password? Hubungi admin.</div>
        </div>

        <div className="mt-5 rounded-3xl border border-emerald-500/15 bg-emerald-500/10 p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-200/90">Demo</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {hints.map(h => (
              <button
                key={h.user}
                onClick={() => { setUsername(h.user); setPassword(h.pass); setError(""); }}
                className="h-10 rounded-2xl border border-white/10 bg-white/5 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10 active:scale-[0.99]"
              >
                {h.label} <span className="text-slate-400">({h.user})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-600">KasirKu</div>
      </div>
    </div>
  );
}

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
// Produk sekarang diambil dari API
const CATEGORIES = ["All Items", "Beverages", "Snacks", "Fresh", "Daily Needs", "Health"];


// ── CART REDUCER ───────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) {
        return state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...state, { ...action.product, qty: 1 }];
    }
    case "REMOVE":
      return state.filter(i => i.id !== action.id);
    case "INC":
      return state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case "DEC":
      return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
const fmt = n => "Rp " + n.toLocaleString("id-ID");
 

// ── TOAST ──────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(2,6,23,0.65)] backdrop-blur">
      {msg}
    </div>
  );
}

// ── RECEIPT MODAL ──────────────────────────────────────────────────────────────
function ReceiptModal({ tx, user, onClose }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const cashierName = tx.user?.nama || user.nama;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
      <div
        className={[
          "flex w-full flex-col overflow-hidden border border-slate-200/60 bg-white shadow-[0_32px_80px_-40px_rgba(2,6,23,0.55)]",
          isMobile ? "h-full rounded-none" : "h-auto max-h-[86vh] w-[380px] rounded-3xl",
        ].join(" ")}
      >
        <div className="border-b border-white/10 bg-emerald-700 px-6 py-5 text-white">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
            <div className="h-5 w-5 rounded-full border-2 border-white/35 border-t-white" />
          </div>
          <div className="mt-3 text-center text-lg font-extrabold tracking-tight">Pembayaran Berhasil</div>
          <div className="mt-1 text-center text-xs font-medium text-white/70">{tx.nomor_nota}</div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 font-mono text-[13px] text-slate-900">
          <div className="mb-3 text-center">
            <div className="text-[15px] font-extrabold">KasirKu Store</div>
            <div className="mt-1 text-[11px] text-slate-500">Jl. Contoh No. 1, Jakarta</div>
            <div className="text-[11px] text-slate-500">{new Date(tx.created_at).toLocaleString("id-ID")}</div>
            <div className="text-[11px] text-slate-500">Kasir: {cashierName}</div>
          </div>

          <div className="my-3 border-t border-dashed border-slate-200" />

          <div className="space-y-1">
            {tx.detail.map(i => (
              <div key={i.id} className="flex items-start justify-between gap-3">
                <span className="min-w-0 flex-1">{i.nama_produk} x{i.qty}</span>
                <span className="font-semibold">{fmt(i.harga_satuan * i.qty)}</span>
              </div>
            ))}
          </div>

          <div className="my-3 border-t border-dashed border-slate-200" />

          <div className="space-y-1">
            <div className="flex justify-between"><span>Total</span><span className="font-bold">{fmt(tx.total)}</span></div>
            <div className="flex justify-between"><span>Bayar</span><span className="font-bold">{fmt(tx.bayar)}</span></div>
            <div className="flex justify-between font-extrabold text-emerald-700"><span>Kembalian</span><span>{fmt(tx.kembalian)}</span></div>
          </div>

          <div className="my-3 border-t border-dashed border-slate-200" />
          <div className="text-center text-[11px] italic text-slate-500">Terima kasih telah berbelanja.</div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={() => window.print()}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-[0_18px_40px_-28px_rgba(16,185,129,0.55)] transition hover:bg-emerald-700 active:scale-[0.99]"
          >
            <IconPrint className="text-white" size={18} />
            Cetak
          </button>
          <button
            onClick={onClose}
            className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
          >
            Nota Baru
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SIDEBAR ────────────────────────────────────────────────────────────────────
// ── INVENTORY PAGE ────────────────────────────────────────────────────────────
function InventoryPage({ isMobile }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [form, setForm] = useState({ nama: "", barcode: "", harga: "", stok: "" });
  const [editId, setEditId] = useState(null);

  const handleBarcodeDetected = (code) => {
    const cleaned = String(code || "").trim();
    if (!cleaned) return;
    setForm(prev => ({ ...prev, barcode: cleaned }));
    setShowScanner(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/produk");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/produk").then(res => {
      setProducts(res.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.patch(`/produk/${editId}`, form);
      } else {
        await api.post("/produk", form);
      }
      setShowModal(false);
      setEditId(null);
      setForm({ nama: "", barcode: "", harga: "", stok: "" });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Gagal simpan produk");
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ nama: p.nama, barcode: p.barcode || "", harga: p.harga, stok: p.stok });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await api.delete(`/produk/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Gagal hapus produk");
    }
  };

  if (loading) return <div style={{ padding: isMobile ? 16 : 40 }}>Memuat inventory...</div>;

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontFamily: "Space Grotesk" }}>Inventaris Barang</h2>
        <button onClick={() => { setEditId(null); setForm({ nama: "", barcode: "", harga: "", stok: "" }); setShowModal(true); }}
          style={{ padding: "10px 20px", background: "#006c49", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
          + Produk Baru
        </button>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontFamily: "Space Grotesk", fontSize: 14, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.nama}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>{p.kode}{p.barcode ? ` · ${p.barcode}` : ""}</div>
                </div>
                <div style={{ fontWeight: 900, color: "#0f172a" }}>{fmt(p.harga)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  Stok: <span style={{ color: p.stok <= 5 ? "#ef4444" : "#0f172a", fontWeight: 900 }}>{p.stok}</span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => handleEdit(p)} style={{ padding: "10px 12px", background: "#f0fdf4", color: "#006c49", border: "1px solid #bbf7d0", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={{ padding: "10px 12px", background: "#fff5f5", color: "#ef4444", border: "1px solid #fecaca", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 20, overflowX: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>KODE / BARCODE</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>NAMA PRODUK</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>HARGA</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>STOK</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ fontWeight: 600 }}>{p.kode}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.barcode || "—"}</div>
                  </td>
                  <td style={{ padding: "16px 24px", fontWeight: 700 }}>{p.nama}</td>
                  <td style={{ padding: "16px 24px" }}>{fmt(p.harga)}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ color: p.stok <= 5 ? "#ef4444" : "#0f172a", fontWeight: 800 }}>{p.stok}</span>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <button onClick={() => handleEdit(p)} style={{ marginRight: 8, background: "none", border: "none", color: "#006c49", cursor: "pointer", fontWeight: 700 }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontWeight: 700 }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: isMobile ? "stretch" : "center", justifyContent: "center", zIndex: 100 }}>
          {showScanner && (
            <BarcodeScannerModal
              onClose={() => setShowScanner(false)}
              onDetected={handleBarcodeDetected}
            />
          )}
          <div style={{ background: "#fff", padding: 20, borderRadius: isMobile ? 0 : 24, width: isMobile ? "100%" : 400, height: isMobile ? "100%" : "auto", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 20px" }}>{editId ? "Edit Produk" : "Tambah Produk"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input placeholder="Nama Produk" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Barcode (Opsional)" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0", flex: 1 }} />
                <button type="button" onClick={() => setShowScanner(true)} title="Scan Barcode (butuh HTTPS + kamera)" style={{ width: 48, borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 18 }}>
                  📷
                </button>
              </div>
              <input type="number" placeholder="Harga Jual" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} required style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <input type="number" placeholder="Stok Awal" value={form.stok} onChange={e => setForm({ ...form, stok: e.target.value })} required style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#f1f5f9", cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#006c49", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── TRANSACTIONS PAGE ──────────────────────────────────────────────────────────
function TransactionsPage() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [txs, setTxs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/transaksi").then(res => {
      setTxs(res.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const filtered = txs.filter(t => 
    t.nomor_nota.toLowerCase().includes(search.toLowerCase()) ||
    (t.user?.nama || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: isMobile ? 16 : 40 }}>Memuat riwayat transaksi...</div>;

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontFamily: "Space Grotesk" }}>Riwayat Transaksi</h2>
        <input 
          placeholder="Cari nomor nota atau kasir..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: 12, border: "1px solid #e2e8f0", width: isMobile ? 160 : 300 }}
        />
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, color: "#0f172a", fontFamily: "Space Grotesk", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.nomor_nota}</div>
                  <div style={{ marginTop: 4, fontSize: 12, color: "#94a3b8" }}>{new Date(t.created_at).toLocaleString("id-ID")}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>Kasir: {t.user?.nama || "—"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 900, color: "#006c49" }}>{fmt(t.total)}</div>
                  <button onClick={() => setSelected(t)} style={{ marginTop: 10, background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>Detail</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 20, overflowX: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>NOTA / TANGGAL</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>KASIR</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>TOTAL</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 24px" }}>
                    <div style={{ fontWeight: 800 }}>{t.nomor_nota}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{new Date(t.created_at).toLocaleString("id-ID")}</div>
                  </td>
                  <td style={{ padding: "16px 24px" }}>{t.user?.nama}</td>
                  <td style={{ padding: "16px 24px", fontWeight: 800, color: "#006c49" }}>{fmt(t.total)}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <button onClick={() => setSelected(t)} style={{ background: "#f1f5f9", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Lihat</button>
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

// ── REPORTS PAGE ───────────────────────────────────────────────────────────────
function ReportsPage({ isMobile }) {
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/transaksi").then(res => {
      setTxs(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: isMobile ? 16 : 40 }}>Memuat laporan...</div>;

  const totalRevenue = txs.reduce((s, t) => s + t.total, 0);
  const totalItems = txs.reduce((s, t) => s + t.detail.reduce((ss, d) => ss + d.qty, 0), 0);

  // Simple product sales summary
  const productSales = {};
  txs.forEach(t => {
    t.detail.forEach(d => {
      productSales[d.nama_produk] = (productSales[d.nama_produk] || 0) + d.qty;
    });
  });

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1, overflowY: "auto" }}>
      <h2 style={{ margin: "0 0 24px", fontFamily: "Space Grotesk" }}>Laporan Penjualan</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 32 }}>
        <div style={{ background: "#fff", padding: 24, borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>TOTAL PENDAPATAN</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#006c49" }}>{fmt(totalRevenue)}</div>
        </div>
        <div style={{ background: "#fff", padding: 24, borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>TOTAL TRANSAKSI</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{txs.length}</div>
        </div>
        <div style={{ background: "#fff", padding: 24, borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>PRODUK TERJUAL</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{totalItems}</div>
        </div>
      </div>

      <div style={{ background: "#fff", padding: 24, borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 20px", fontFamily: "Space Grotesk" }}>Produk Terlaris</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {topProducts.map(([name, qty]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 600 }}>{name}</div>
              <div style={{ background: "#f1f5f9", padding: "4px 12px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>{qty} terjual</div>
            </div>
          ))}
          {topProducts.length === 0 && <div style={{ color: "#94a3b8" }}>Belum ada data penjualan.</div>}
        </div>
      </div>
    </div>
  );
}

// ── EMPLOYEES PAGE ────────────────────────────────────────────────────────────
function EmployeesPage() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: "", username: "", password: "", role: "kasir" });
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/pegawai");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/pegawai").then(res => {
      setUsers(res.data);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleToggle = async (id) => {
    try {
      await api.patch(`/pegawai/${id}/toggle`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status");
    }
  };

  const handleReset = async (id) => {
    const newPass = prompt("Masukkan password baru:");
    if (!newPass) return;
    try {
      await api.patch(`/pegawai/${id}/reset-password`, { newPassword: newPass });
      alert("Password berhasil direset");
    } catch (err) {
      console.error(err);
      alert("Gagal reset password");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/pegawai", form);
      setShowModal(false);
      setForm({ nama: "", username: "", password: "", role: "kasir" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambah pegawai");
    }
  };

  if (loading) return <div style={{ padding: isMobile ? 16 : 40 }}>Memuat data pegawai...</div>;

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontFamily: "Space Grotesk" }}>Manajemen Pegawai</h2>
        <button onClick={() => setShowModal(true)} style={{ padding: "10px 20px", background: "#006c49", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
          + Tambah Pegawai
        </button>
      </div>

      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {users.map(u => (
            <div key={u.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 900, fontFamily: "Space Grotesk", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.nama}</div>
                  <div style={{ marginTop: 4, color: "#64748b", fontSize: 12 }}>@{u.username}</div>
                  <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 800, background: u.role === "admin" ? "#fef3c7" : "#f1f5f9", color: u.role === "admin" ? "#92400e" : "#475569" }}>{u.role.toUpperCase()}</span>
                    <span style={{ padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 800, background: u.aktif ? "#dcfce7" : "#fee2e2", color: u.aktif ? "#16a34a" : "#ef4444" }}>{u.aktif ? "Aktif" : "Nonaktif"}</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button onClick={() => handleToggle(u.id)} style={{ padding: "10px 12px", background: u.aktif ? "#fff5f5" : "#f0fdf4", color: u.aktif ? "#ef4444" : "#16a34a", border: "1px solid " + (u.aktif ? "#fecaca" : "#bbf7d0"), borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                    {u.aktif ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button onClick={() => handleReset(u.id)} style={{ padding: "10px 12px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                    Reset Pass
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 20, overflowX: "auto", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", minWidth: 820, borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>NAMA</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>USERNAME</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>ROLE</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>STATUS</th>
                <th style={{ padding: "16px 24px", fontSize: 13, color: "#64748b" }}>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "16px 24px", fontWeight: 600 }}>{u.nama}</td>
                  <td style={{ padding: "16px 24px", color: "#64748b" }}>@{u.username}</td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 700, background: u.role === "admin" ? "#fef3c7" : "#f1f5f9", color: u.role === "admin" ? "#92400e" : "#475569" }}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px" }}>
                    <span style={{ color: u.aktif ? "#16a34a" : "#ef4444", fontWeight: 700, fontSize: 13 }}>
                      {u.aktif ? "● Aktif" : "○ Nonaktif"}
                    </span>
                  </td>
                  <td style={{ padding: "16px 24px", display: "flex", gap: 8 }}>
                    <button onClick={() => handleToggle(u.id)} style={{ padding: "6px 12px", background: u.aktif ? "#fee2e2" : "#dcfce7", color: u.aktif ? "#ef4444" : "#16a34a", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      {u.aktif ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                    <button onClick={() => handleReset(u.id)} style={{ padding: "6px 12px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Reset Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: isMobile ? "stretch" : "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", padding: 20, borderRadius: isMobile ? 0 : 24, width: isMobile ? "100%" : 400, height: isMobile ? "100%" : "auto", overflowY: "auto" }}>
            <h3 style={{ margin: "0 0 20px" }}>Tambah Pegawai Baru</h3>
            {error && <div style={{ color: "#ef4444", marginBottom: 16, fontSize: 13 }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input placeholder="Nama Lengkap" value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} required style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }} />
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ padding: 12, borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <option value="kasir">Kasir</option>
                <option value="admin">Admin</option>
              </select>
              <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#f1f5f9", cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#006c49", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── DASHBOARD PAGE ────────────────────────────────────────────────────────────
function DashboardPage({ isMobile, isTablet }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard").then(res => {
      setStats(res.data);
      setLoading(false);
    }).catch(err => console.error(err));
  }, []);

  if (loading) return <div style={{ padding: isMobile ? 16 : 40 }}>Memuat dashboard...</div>;

  return (
    <div style={{ padding: isMobile ? 16 : 32, flex: 1, overflowY: "auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: isMobile ? 12 : 24, marginBottom: isMobile ? 16 : 32 }}>
        <div style={{ background: "#fff", padding: isMobile ? 16 : 24, borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>OMZET HARI INI</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#006c49" }}>{fmt(stats.summary.totalSalesToday)}</div>
        </div>
        <div style={{ background: "#fff", padding: isMobile ? 16 : 24, borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ color: "#64748b", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>TRANSAKSI HARI INI</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a" }}>{stats.summary.transactionCountToday} <span style={{ fontSize: 14, color: "#94a3b8" }}>Nota</span></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr" : "2fr 1fr", gap: isMobile ? 12 : 24 }}>
        <div style={{ background: "#fff", padding: isMobile ? 16 : 24, borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 20px", fontFamily: "Space Grotesk" }}>Grafik Penjualan 7 Hari</h3>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 200, paddingBottom: 20 }}>
            {stats.chart.map(d => {
              const max = Math.max(...stats.chart.map(x => x.total)) || 1;
              const height = (d.total / max) * 100;
              return (
                <div key={d.tanggal} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: "100%", background: "#006c49", height: height + "%", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>{d.tanggal}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: "#fff", padding: isMobile ? 16 : 24, borderRadius: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 20px", fontFamily: "Space Grotesk" }}>Performa Kasir</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {stats.performance.map(p => (
              <div key={p.nama} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.nama}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.count} Transaksi</div>
                </div>
                <div style={{ fontWeight: 800, color: "#006c49" }}>{fmt(p.total)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PLACEHOLDER PAGES ──────────────────────────────────────────────────────────
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (zxingRef.current) {
        try { zxingRef.current.reset(); } catch (e) { void e; }
        zxingRef.current = null;
      }
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) track.stop();
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      detectorRef.current = null;
      setReady(false);
    };

    const start = async () => {
      setError("");
      setReady(false);

      const isSecure = window.isSecureContext || window.location.hostname === "localhost";
      if (!isSecure) {
        setError("Scan kamera butuh HTTPS (atau localhost).");
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Browser tidak mendukung akses kamera.");
        return;
      }

      const hasBarcodeDetector = "BarcodeDetector" in window;
      if (hasBarcodeDetector) {
        let detector;
        try {
          detector = new window.BarcodeDetector({
            formats: ["code_128", "ean_13", "ean_8", "code_39", "qr_code", "upc_a", "upc_e"],
          });
        } catch (e) {
          void e;
          detector = new window.BarcodeDetector();
        }
        detectorRef.current = detector;
      }

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (e) {
        setError(e?.name === "NotAllowedError" ? "Izin kamera ditolak." : "Gagal membuka kamera.");
        return;
      }

      if (cancelled) {
        for (const track of stream.getTracks()) track.stop();
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
          setReady(true);
        } catch (e) {
          void e;
          setError("Tidak bisa memutar video kamera.");
          return;
        }
      }

      if (!hasBarcodeDetector) {
        try {
          const mod = await import("@zxing/browser");
          if (cancelled) return;
          const reader = new mod.BrowserMultiFormatReader();
          zxingRef.current = reader;

          const result = await reader.decodeOnceFromVideoElement(videoRef.current);
          const code = result?.getText?.() || "";
          const cleaned = String(code).trim();
          if (cleaned) {
            onDetected?.(cleaned);
            onClose?.();
            return;
          }
        } catch (e) {
          void e;
          setError("Scan barcode tidak didukung di perangkat ini. Pastikan Chrome Android/desktop, atau gunakan HTTPS.");
          return;
        }
        return;
      }

      const tick = async () => {
        if (cancelled) return;

        const video = videoRef.current;
        const detector = detectorRef.current;

        if (!video || !detector || video.readyState < 2) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }

        try {
          const barcodes = await detector.detect(video);
          if (barcodes && barcodes.length > 0) {
            const code = barcodes[0]?.rawValue;
            if (code) {
              const now = Date.now();
              const last = lastRef.current;
              if (last.value !== code || now - last.at > 1500) {
                lastRef.current = { value: code, at: now };
                onDetected?.(code);
                onClose?.();
                return;
              }
            }
          }
        } catch (e) {
          void e;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [onClose, onDetected]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div
        className={[
          "flex w-full flex-col overflow-hidden border border-white/10 bg-slate-900 shadow-[0_32px_80px_-40px_rgba(2,6,23,0.7)]",
          isMobile ? "h-full rounded-none" : "max-w-[520px] rounded-3xl",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-4">
          <div className="text-sm font-extrabold tracking-tight text-slate-100">Scan Barcode</div>
          <button
            onClick={onClose}
            className="h-10 rounded-2xl border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/[0.10] active:scale-[0.99]"
          >
            Tutup
          </button>
        </div>

        <div className="relative bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            className={["w-full object-cover", isMobile ? "h-[72vh]" : "h-[420px]"].join(" ")}
          />

          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="h-[180px] w-[70%] max-w-[360px] rounded-3xl border-2 border-emerald-400/80 shadow-[inset_0_0_0_999px_rgba(0,0,0,0.18)]" />
          </div>

          {!ready && !error && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-100 backdrop-blur">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                Membuka kamera
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 grid place-items-center p-6">
              <div className="max-w-[420px] rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-center text-sm font-semibold text-rose-200">
                {error}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 text-xs font-medium text-slate-400">
          Arahkan kamera ke barcode sampai terdeteksi otomatis.
        </div>
      </div>
    </div>
  );
}

// ── CASHIER PAGE ───────────────────────────────────────────────────────────────
function CashierPage({ user, isMobile, isTablet }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [search, setSearch] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [mobileTab, setMobileTab] = useState("products");
  const [category, setCategory] = useState("All Items");
  const [receipt, setReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [orderNum] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const [paid, setPaid] = useState("");

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");

  const fetchProducts = async (searchValue) => {
    try {
      setProductsError("");
      setProductsLoading(true);
      const q = searchValue ? `?search=${encodeURIComponent(searchValue)}` : "";
      const response = await api.get("/produk" + q);
      setProducts(response.data);
    } catch {
      setProductsError("Gagal memuat produk. Coba lagi.");
    } finally {
      setProductsLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts(search);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setProductsError("");
        setProductsLoading(true);
        const q = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await api.get("/produk" + q);
        if (cancelled) return;
        setProducts(res.data);
      } catch {
        if (cancelled) return;
        setProductsError("Gagal memuat produk. Coba lagi.");
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [search]);

  const filtered = products.filter(p => {
    const matchCat = category === "All Items" || p.category === category;
    return matchCat;
  });

  const subtotal = cart.reduce((s, i) => s + i.harga * i.qty, 0);
  const paidNum = parseInt(paid.replace(/\D/g, "") || "0");
  const change = paidNum - subtotal;
  const validPayment = cart.length > 0 && paidNum >= subtotal;
  const quickAmounts = [subtotal, Math.ceil(subtotal / 10000) * 10000, Math.ceil(subtotal / 50000) * 50000, 100000].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

  const handleAdd = (p) => {
    if (p.stok === 0) return;
    dispatch({ type: "ADD", product: p });
    setToast(`${p.nama} ditambahkan`);
  };

  const handleBarcodeDetected = async (code) => {
    const cleaned = String(code || "").trim();
    if (!cleaned) return;

    setShowScanner(false);

    try {
      const res = await api.get(`/produk?search=${encodeURIComponent(cleaned)}`);
      const list = Array.isArray(res.data) ? res.data : [];
      const exact = list.find(p => p?.barcode === cleaned || p?.kode === cleaned);
      const chosen = exact || (list.length === 1 ? list[0] : null);
      if (chosen) {
        handleAdd(chosen);
        setSearch("");
        return;
      }
    } catch (e) {
      void e;
    }

    setSearch(cleaned);
  };

  const handleConfirmPayment = async (paid) => {
    try {
      const response = await api.post("/transaksi", {
        cart,
        total: subtotal,
        bayar: paid
      });
      setReceipt(response.data);
      refreshProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memproses transaksi.");
    }
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    dispatch({ type: "CLEAR" });
    setPaid("");
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-hidden bg-slate-50">
      {showScanner && (
        <BarcodeScannerModal
          onClose={() => setShowScanner(false)}
          onDetected={handleBarcodeDetected}
        />
      )}
      {isMobile && (
        <div className="flex gap-2 border-b border-slate-200/60 bg-white/70 px-4 py-3 backdrop-blur-md">
          <button
            onClick={() => setMobileTab("products")}
            className={[
              "h-11 flex-1 rounded-2xl border px-4 text-sm font-semibold transition active:scale-[0.99]",
              mobileTab === "products"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            Produk
          </button>
          <button
            onClick={() => setMobileTab("cart")}
            className={[
              "h-11 flex-1 rounded-2xl border px-4 text-sm font-semibold transition active:scale-[0.99]",
              mobileTab === "cart"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            Keranjang <span className="ml-1 text-slate-500">({cart.length})</span>
          </button>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {(!isMobile || mobileTab === "products") && (
          <section className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden px-4 py-4 sm:px-6 sm:py-6">
            <div className="rounded-3xl border border-slate-200/60 bg-white/70 p-4 shadow-[0_18px_40px_-30px_rgba(2,6,23,0.25)] backdrop-blur-md">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Cari Produk / Barcode</label>
              <div className="relative">
                <IconSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Ketik nama, kode, atau barcode..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-14 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                />
                <button
                  title="Scan barcode (butuh HTTPS + kamera)"
                  onClick={() => setShowScanner(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
                >
                  <IconCamera size={18} />
                </button>
              </div>

              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={[
                      "h-9 shrink-0 rounded-full border px-4 text-xs font-semibold transition active:scale-[0.99]",
                      category === c
                        ? "border-emerald-600 bg-emerald-600 text-white shadow-[0_14px_30px_-22px_rgba(16,185,129,0.7)]"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {productsError && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 shadow-[0_18px_40px_-34px_rgba(2,6,23,0.18)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-rose-700">{productsError}</div>
                  <button
                    onClick={() => fetchProducts(search)}
                    className="h-9 rounded-2xl border border-rose-200 bg-white px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 active:scale-[0.99]"
                  >
                    Coba lagi
                  </button>
                </div>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                {productsLoading ? (
                  Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="animate-pulse rounded-3xl border border-slate-200/60 bg-white p-4 shadow-[0_18px_40px_-34px_rgba(2,6,23,0.18)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-11 w-11 rounded-2xl bg-slate-100" />
                        <div className="h-6 w-16 rounded-full bg-slate-100" />
                      </div>
                      <div className="mt-4 h-4 w-4/5 rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-2/5 rounded bg-slate-100" />
                      <div className="mt-5 flex items-center justify-between">
                        <div className="h-4 w-24 rounded bg-slate-100" />
                        <div className="h-9 w-9 rounded-2xl bg-slate-100" />
                      </div>
                    </div>
                  ))
                ) : (
                  filtered.map(p => {
                    const disabled = p.stok === 0;
                    const badge = disabled ? "Habis" : `${p.stok} unit`;
                    const initials = String(p.nama || "P").trim().slice(0, 1).toUpperCase();

                    return (
                      <button
                        key={p.id}
                        onClick={() => handleAdd(p)}
                        disabled={disabled}
                        className={[
                          "group relative rounded-3xl border bg-white/80 p-4 text-left shadow-[0_18px_40px_-32px_rgba(2,6,23,0.25)] backdrop-blur transition",
                          disabled
                            ? "cursor-not-allowed border-slate-200/60 opacity-60"
                            : "border-slate-200/60 hover:-translate-y-[1px] hover:shadow-[0_18px_40px_-28px_rgba(2,6,23,0.35)] active:scale-[0.99]",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-base font-extrabold text-slate-700">
                            {initials}
                          </div>
                          <div
                            className={[
                              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                              disabled ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700",
                            ].join(" ")}
                          >
                            {badge}
                          </div>
                        </div>

                        <div className="mt-3 text-sm font-semibold tracking-tight text-slate-900">{p.nama}</div>
                        <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-slate-400">{p.kode}</div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm font-extrabold text-slate-900">{fmt(p.harga)}</div>
                          <div
                            className={[
                              "grid h-9 w-9 place-items-center rounded-2xl border text-slate-700 transition",
                              disabled ? "border-slate-200 bg-slate-50 text-slate-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100",
                            ].join(" ")}
                          >
                            <IconPlus size={18} />
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}

                {!productsLoading && filtered.length === 0 && (
                  <div className="col-span-full grid place-items-center py-16 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border border-slate-200 bg-white text-slate-400 shadow-[0_18px_40px_-32px_rgba(2,6,23,0.18)]">
                      <IconSearch size={20} />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-slate-700">Produk tidak ditemukan</div>
                    <div className="mt-1 text-xs text-slate-500">Coba kata kunci lain atau scan barcode.</div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {(!isMobile || mobileTab === "cart") && (
          <aside
            className={[
              "flex w-full flex-col overflow-hidden border-l border-slate-200/60 bg-white/70 backdrop-blur-md",
              isMobile ? "border-l-0 border-t border-slate-200/60" : isTablet ? "max-w-[380px]" : "max-w-[420px]",
            ].join(" ")}
          >
            <div className="border-b border-slate-200/60 px-4 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-extrabold tracking-tight text-slate-900">Nota #{orderNum}</div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                    {cart.length} item · {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <button
                  onClick={() => { dispatch({ type: "CLEAR" }); setPaid(""); }}
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 active:scale-[0.99]"
                  title="Bersihkan keranjang"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              {cart.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border border-slate-200 bg-white text-slate-400 shadow-[0_18px_40px_-32px_rgba(2,6,23,0.18)]">
                      <Icon size={20}><path d="M6 6h15l-1.5 9h-12Z" /><path d="M6 6l-2-2" /><path d="M9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /><path d="M18 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /></Icon>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-slate-700">Keranjang kosong</div>
                    <div className="mt-1 text-xs text-slate-500">Klik produk untuk menambahkan ke nota.</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="rounded-3xl border border-slate-200/60 bg-white p-3 shadow-[0_18px_40px_-34px_rgba(2,6,23,0.18)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">{item.nama}</div>
                          <div className="mt-1 text-xs font-medium text-slate-500">{fmt(item.harga)} / unit</div>
                        </div>
                        <div className="text-sm font-extrabold text-slate-900">{fmt(item.harga * item.qty)}</div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
                          <button
                            onClick={() => dispatch({ type: "DEC", id: item.id })}
                            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
                            title="Kurangi"
                          >
                            <IconMinus size={18} />
                          </button>
                          <div className="w-10 text-center text-sm font-extrabold text-slate-900">{item.qty}</div>
                          <button
                            onClick={() => dispatch({ type: "INC", id: item.id })}
                            className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 active:scale-[0.98]"
                            title="Tambah"
                          >
                            <IconPlus size={18} className="text-white" />
                          </button>
                        </div>

                        <button
                          onClick={() => dispatch({ type: "REMOVE", id: item.id })}
                          className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 active:scale-[0.99]"
                          title="Hapus item"
                        >
                          <IconX size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200/60 bg-white px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">{fmt(subtotal)}</span>
              </div>

              <div className="mt-3 flex items-end justify-between rounded-3xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total</div>
                <div className="text-2xl font-extrabold tracking-tight text-slate-900">{fmt(subtotal)}</div>
              </div>

              <div className="mt-4 grid gap-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Bayar</label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">Rp</span>
                    <input
                      inputMode="numeric"
                      value={paid}
                      onChange={e => setPaid(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
                      placeholder="0"
                      className={[
                        "h-12 w-full rounded-2xl border bg-white pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none transition",
                        validPayment ? "border-emerald-500 focus:ring-4 focus:ring-emerald-500/15" : "border-slate-200 focus:ring-4 focus:ring-slate-200/60",
                      ].join(" ")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && validPayment) handleConfirmPayment(paidNum);
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {quickAmounts.map(a => (
                    <button
                      key={a}
                      onClick={() => setPaid(a.toLocaleString("id-ID"))}
                      className={[
                        "h-9 flex-1 rounded-2xl border px-3 text-xs font-semibold transition active:scale-[0.99]",
                        paidNum === a ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {fmt(a)}
                    </button>
                  ))}
                </div>

                <div className={["flex items-center justify-between rounded-2xl border px-4 py-3", validPayment ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"].join(" ")}>
                  <div className={["text-sm font-semibold", validPayment ? "text-emerald-700" : "text-slate-500"].join(" ")}>Kembalian</div>
                  <div className={["text-sm font-extrabold", validPayment ? "text-emerald-700" : "text-slate-400"].join(" ")}>
                    {validPayment ? fmt(change) : "—"}
                  </div>
                </div>

                <div className="mt-1 flex gap-2">
                  <button
                    onClick={() => { dispatch({ type: "CLEAR" }); setPaid(""); }}
                    className="h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => validPayment && handleConfirmPayment(paidNum)}
                    disabled={!validPayment}
                    className={[
                      "h-12 flex-[2] rounded-2xl px-4 text-sm font-semibold text-white shadow-[0_18px_40px_-28px_rgba(16,185,129,0.55)] transition active:scale-[0.99]",
                      validPayment ? "bg-emerald-600 hover:bg-emerald-700" : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none",
                    ].join(" ")}
                  >
                    Pay & Print
                  </button>
                </div>
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


// ── ROOT APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isNarrow = isTablet;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState("cashier");

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "admin" ? "dashboard" : "cashier");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("cashier");
  };

  const drawerVisible = isNarrow && drawerOpen;


  if (!user) return <LoginPage onLogin={handleLogin} />;

  const navItems = user.role === "admin"
    ? [
      { id: "dashboard", icon: "📊", label: "Dashboard" },
      { id: "cashier", icon: "🏪", label: "Kasir" },
      { id: "transactions", icon: "🧾", label: "Transaksi" },
      { id: "inventory", icon: "📦", label: "Inventory" },
      { id: "employees", icon: "👥", label: "Pegawai" },
      { id: "reports", icon: "📈", label: "Laporan" },
    ]
    : [
      { id: "cashier", icon: "🏪", label: "Kasir" },
      { id: "transactions", icon: "🧾", label: "Riwayat Nota" },
    ];

  const pages = {
    cashier: <CashierPage user={user} isMobile={isMobile} isTablet={isTablet} />,
    dashboard: <DashboardPage isMobile={isMobile} isTablet={isTablet} />,
    transactions: <TransactionsPage />,
    inventory: <InventoryPage isMobile={isMobile} />,
    employees: <EmployeesPage />,
    reports: <ReportsPage isMobile={isMobile} />,
  };

  const pageLabels = { cashier: "🏪 Kasir", dashboard: "📊 Dashboard", transactions: "🧾 Transaksi", inventory: "📦 Inventory", employees: "👥 Pegawai", reports: "📈 Laporan" };

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", fontFamily: "Manrope,sans-serif", background: "#f8fafc", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {drawerVisible && (
        <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(2,6,23,0.55)", backdropFilter: "blur(6px)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 280, maxWidth: "86vw", height: "100%", background: "#0f172a", borderRight: "1px solid rgba(148,163,184,0.12)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, background: "#006c49", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff" }}>K</div>
                <div>
                  <div style={{ color: "#4ade80", fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 16 }}>KasirKu</div>
                  <div style={{ color: "#475569", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Menu</div>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", borderRadius: 12, padding: "8px 10px", cursor: "pointer", fontWeight: 800 }}>
                ✕
              </button>
            </div>

            <div style={{ margin: "0 12px 10px", padding: "7px 14px", background: user.role === "admin" ? "rgba(245,197,24,0.1)" : "rgba(74,222,128,0.08)", borderRadius: 10, border: "1px solid " + (user.role === "admin" ? "rgba(245,197,24,0.2)" : "rgba(74,222,128,0.12)"), display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14 }}>{user.role === "admin" ? "👑" : "🏪"}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: user.role === "admin" ? "#f5c518" : "#4ade80", textTransform: "uppercase", letterSpacing: "0.08em" }}>{user.role}</span>
            </div>

            <nav style={{ flex: 1, padding: "4px 12px", overflowY: "auto" }}>
              {navItems.map(n => (
                <button key={n.id} onClick={() => { setPage(n.id); setDrawerOpen(false); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 16, border: "1px solid rgba(148,163,184,0.12)", cursor: "pointer", marginBottom: 8, textAlign: "left", fontFamily: "Space Grotesk", fontSize: 14, fontWeight: 700, background: page === n.id ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.04)", color: page === n.id ? "#4ade80" : "#cbd5e1" }}>
                  <span style={{ fontSize: 18 }}>{n.icon}</span>{n.label}
                </button>
              ))}
            </nav>

            <div style={{ padding: "12px 14px 16px" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#006c49", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                  {user.nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.nama}</div>
                  <div style={{ color: "#475569", fontSize: 10, textTransform: "uppercase" }}>@{user.username}</div>
                </div>
                <button onClick={handleLogout} title="Logout"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 10, padding: "8px 10px", cursor: "pointer", fontSize: 15, color: "#ef4444", flexShrink: 0 }}>
                  ↩
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      {!isNarrow && (
      <aside style={{ width: 240, background: "#0f172a", height: "100vh", position: "fixed", left: 0, top: 0, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(148,163,184,0.08)", zIndex: 40 }}>
        <div style={{ padding: "24px 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, background: "#006c49", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff" }}>K</div>
            <div>
              <div style={{ color: "#4ade80", fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>KasirKu</div>
              <div style={{ color: "#475569", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Management Pro</div>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div style={{ margin: "0 12px 10px", padding: "7px 14px", background: user.role === "admin" ? "rgba(245,197,24,0.1)" : "rgba(74,222,128,0.08)", borderRadius: 10, border: "1px solid " + (user.role === "admin" ? "rgba(245,197,24,0.2)" : "rgba(74,222,128,0.12)"), display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{user.role === "admin" ? "👑" : "🏪"}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: user.role === "admin" ? "#f5c518" : "#4ade80", textTransform: "uppercase", letterSpacing: "0.08em" }}>{user.role}</span>
        </div>

        <nav style={{ flex: 1, padding: "4px 12px", overflowY: "auto" }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 50, border: "none", cursor: "pointer", marginBottom: 4, textAlign: "left", fontFamily: "Space Grotesk", fontSize: 14, fontWeight: 600, transition: "all 0.15s", background: page === n.id ? "rgba(74,222,128,0.1)" : "transparent", color: page === n.id ? "#4ade80" : "#64748b" }}>
              <span style={{ fontSize: 18 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        {/* User card + logout */}
        <div style={{ padding: "12px 14px 20px" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#006c49", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
              {user.nama.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.nama}</div>
              <div style={{ color: "#475569", fontSize: 10, textTransform: "uppercase" }}>@{user.username}</div>
            </div>
            <button onClick={handleLogout} title="Logout"
              style={{ background: "rgba(239,68,68,0.12)", border: "none", borderRadius: 8, padding: "7px 9px", cursor: "pointer", fontSize: 15, color: "#ef4444", flexShrink: 0 }}>↩</button>
          </div>
        </div>
      </aside>
      )}

      {/* ── Main ── */}
      <div style={{ marginLeft: isNarrow ? 0 : 240, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: 60, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 16px" : "0 32px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            {isNarrow && (
              <button onClick={() => setDrawerOpen(true)} style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#0f172a", borderRadius: 12, padding: "8px 10px", cursor: "pointer", fontSize: 16, fontWeight: 900 }}>
                ☰
              </button>
            )}
            <div style={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 16, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pageLabels[page]}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!isMobile && (
              <div style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "6px 14px", borderRadius: 50 }}>
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            )}
            {!isMobile && (
              <button onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else {
                  if (document.exitFullscreen) document.exitFullscreen();
                }
              }}
                style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: 10, padding: "7px 12px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                ⛶ Full
              </button>
            )}
            <button onClick={handleLogout}
              style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#ef4444", borderRadius: 12, padding: isMobile ? "10px 12px" : "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
              {isMobile ? "↩" : "↩ Logout"}
            </button>
          </div>
        </header>
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {pages[page] || pages.cashier}
        </div>
      </div>
    </div>
  );
}
