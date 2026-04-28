import { useState, useReducer, useRef, useEffect } from "react";
import api from "./api";

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
  const [focused, setFocused] = useState("");

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
    { label: "Admin", user: "admin", pass: "admin123", icon: "👑" },
    { label: "Kasir", user: "budi", pass: "budi123", icon: "🏪" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Manrope, sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,108,73,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,108,73,0.06) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      {/* Glow blobs */}
      <div style={{ position: "absolute", top: "15%", left: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(0,108,73,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 320, height: 320, background: "radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: "linear-gradient(135deg, #006c49, #4ade80)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, color: "#fff", margin: "0 auto 16px", boxShadow: "0 8px 32px rgba(0,108,73,0.4)" }}>K</div>
          <h1 style={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 32, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>KasirKu</h1>
          <p style={{ color: "#475569", fontSize: 13, marginTop: 6, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Management Pro</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "36px 32px", backdropFilter: "blur(12px)" }}>
          <h2 style={{ fontFamily: "Space Grotesk", fontWeight: 700, fontSize: 20, color: "#f1f5f9", margin: "0 0 6px" }}>Selamat datang 👋</h2>
          <p style={{ color: "#475569", fontSize: 13, margin: "0 0 28px" }}>Masuk dengan akun yang diberikan admin</p>

          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Username</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>👤</span>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                onFocus={() => setFocused("user")}
                onBlur={() => setFocused("")}
                placeholder="contoh: budi"
                style={{ width: "100%", paddingLeft: 44, paddingRight: 16, paddingTop: 14, paddingBottom: 14, background: "rgba(255,255,255,0.05)", border: "1.5px solid " + (focused === "user" ? "#006c49" : "rgba(255,255,255,0.08)"), borderRadius: 14, color: "#f1f5f9", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Manrope", transition: "border-color 0.2s" }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔒</span>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                onFocus={() => setFocused("pass")}
                onBlur={() => setFocused("")}
                placeholder="••••••••"
                style={{ width: "100%", paddingLeft: 44, paddingRight: 48, paddingTop: 14, paddingBottom: 14, background: "rgba(255,255,255,0.05)", border: "1.5px solid " + (focused === "pass" ? "#006c49" : "rgba(255,255,255,0.08)"), borderRadius: 14, color: "#f1f5f9", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "Manrope", transition: "border-color 0.2s" }}
              />
              <button onClick={() => setShowPass(v => !v)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18, padding: 2 }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#fca5a5", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", marginTop: 20, padding: "16px 0", background: loading ? "rgba(0,108,73,0.5)" : "linear-gradient(135deg, #006c49, #059669)", color: "#fff", border: "none", borderRadius: 16, fontWeight: 800, fontSize: 16, fontFamily: "Space Grotesk", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "-0.01em", boxShadow: loading ? "none" : "0 8px 24px rgba(0,108,73,0.35)", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {loading ? (
              <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span> Memverifikasi...</>
            ) : "Masuk →"}
          </button>

          <p style={{ textAlign: "center", color: "#334155", fontSize: 12, marginTop: 20, marginBottom: 0 }}>
            Lupa password? Hubungi Admin Utama
          </p>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: 20, background: "rgba(0,108,73,0.08)", border: "1px solid rgba(0,108,73,0.15)", borderRadius: 16, padding: "14px 18px" }}>
          <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>🧪 Demo — klik untuk isi otomatis</div>
          <div style={{ display: "flex", gap: 8 }}>
            {hints.map(h => (
              <button key={h.user} onClick={() => { setUsername(h.user); setPassword(h.pass); setError(""); }}
                style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#94a3b8", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                {h.icon} {h.label} <span style={{ color: "#475569", fontFamily: "monospace" }}>({h.user})</span>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", color: "#1e293b", fontSize: 11, marginTop: 24 }}>KasirKu v1.0 · © 2025</p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#0f172a", color: "#fff", padding: "12px 24px", borderRadius: 14, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
      {msg}
    </div>
  );
}

// ── RECEIPT MODAL ──────────────────────────────────────────────────────────────
function ReceiptModal({ tx, user, onClose }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const cashierName = tx.user?.nama || user.nama;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: isMobile ? "stretch" : "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: isMobile ? 0 : 24, width: isMobile ? "100%" : 360, height: isMobile ? "100%" : "auto", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#006c49", color: "#fff", padding: "28px 28px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "Space Grotesk" }}>Pembayaran Berhasil!</div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>{tx.nomor_nota}</div>
        </div>
        <div style={{ padding: "20px 28px", fontFamily: "monospace", fontSize: 13, color: "#1e293b", overflowY: "auto", flex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>KasirKu Store</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Jl. Contoh No. 1, Jakarta</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>{new Date(tx.created_at).toLocaleString("id-ID")}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Kasir: {cashierName}</div>
          </div>
          <div style={{ borderTop: "1px dashed #e2e8f0", margin: "10px 0" }} />
          {tx.detail.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ flex: 1 }}>{i.nama_produk} x{i.qty}</span>
              <span style={{ fontWeight: 600 }}>{fmt(i.harga_satuan * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px dashed #e2e8f0", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total</span><b>{fmt(tx.total)}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Bayar</span><b>{fmt(tx.bayar)}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#006c49", fontWeight: 800 }}><span>Kembalian</span><b>{fmt(tx.kembalian)}</b></div>
          <div style={{ borderTop: "1px dashed #e2e8f0", margin: "10px 0" }} />
          <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 11, fontStyle: "italic" }}>Terima kasih telah berbelanja!</div>
        </div>
        <div style={{ padding: "0 28px 24px", display: "flex", gap: 10 }}>
          <button onClick={() => window.print()} style={{ flex: 1, padding: "12px 0", background: "#006c49", color: "#fff", border: "none", borderRadius: 14, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            🖨️ Cetak
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 14, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Nota Baru
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAYMENT MODAL ──────────────────────────────────────────────────────────────
function PaymentModal({ total, onConfirm, onClose }) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [paid, setPaid] = useState("");
  const paidNum = parseInt(paid.replace(/\D/g, "") || "0");
  const change = paidNum - total;
  const valid = paidNum >= total;

  const quickAmounts = [total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000, 100000].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: isMobile ? "stretch" : "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: isMobile ? 0 : 28, width: isMobile ? "100%" : 420, height: isMobile ? "100%" : "auto", overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#0f172a", color: "#fff", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "Space Grotesk" }}>Proses Pembayaran</div>
            <div style={{ opacity: 0.5, fontSize: 12 }}>Masukkan nominal uang bayar</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px", overflowY: "auto", flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, color: "#64748b" }}>
              <span>Total Tagihan</span>
              <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 18 }}>{fmt(total)}</span>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Uang Bayar</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "#94a3b8", fontSize: 14 }}>Rp</span>
              <input
                autoFocus
                type="text"
                value={paid}
                onChange={e => setPaid(e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "."))}
                placeholder="0"
                style={{ width: "100%", paddingLeft: 48, paddingRight: 16, paddingTop: 16, paddingBottom: 16, border: "2px solid " + (valid ? "#006c49" : "#e2e8f0"), borderRadius: 16, fontSize: 24, fontWeight: 800, outline: "none", boxSizing: "border-box", fontFamily: "Space Grotesk", color: "#0f172a" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {quickAmounts.map(a => (
              <button key={a} onClick={() => setPaid(a.toLocaleString("id-ID"))}
                style={{ flex: "1 1 auto", padding: "8px 4px", background: paidNum === a ? "#006c49" : "#f1f5f9", color: paidNum === a ? "#fff" : "#475569", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                {fmt(a)}
              </button>
            ))}
          </div>

          <div style={{ background: valid ? "#f0fdf4" : "#f8fafc", border: "1px solid " + (valid ? "#bbf7d0" : "#e2e8f0"), borderRadius: 16, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontWeight: 700, color: valid ? "#15803d" : "#94a3b8", fontSize: 13 }}>Kembalian</span>
            <span style={{ fontWeight: 800, fontSize: 22, color: valid ? "#16a34a" : "#cbd5e1", fontFamily: "Space Grotesk" }}>{valid ? fmt(change) : "—"}</span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "14px 0", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 16, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              Kembali
            </button>
            <button onClick={() => valid && onConfirm(paidNum, change)} disabled={!valid}
              style={{ flex: 2, padding: "14px 0", background: valid ? "#006c49" : "#e2e8f0", color: valid ? "#fff" : "#94a3b8", border: "none", borderRadius: 16, fontWeight: 800, cursor: valid ? "pointer" : "not-allowed", fontSize: 15, fontFamily: "Space Grotesk", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              💳 Konfirmasi & Bayar
            </button>
          </div>
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
      <div style={{ width: isMobile ? "100%" : "min(92vw, 520px)", height: isMobile ? "100%" : "auto", background: "#0b1220", borderRadius: isMobile ? 0 : 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 12px 36px rgba(0,0,0,0.4)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#f1f5f9", fontWeight: 800, fontFamily: "Space Grotesk" }}>Scan Barcode</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9", borderRadius: 12, padding: "8px 12px", cursor: "pointer", fontWeight: 700 }}>
            Tutup
          </button>
        </div>

        <div style={{ position: "relative", background: "#000" }}>
          <video ref={videoRef} playsInline muted style={{ width: "100%", height: isMobile ? "72vh" : 420, objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ width: "70%", maxWidth: 360, height: 180, border: "2px solid rgba(74,222,128,0.85)", borderRadius: 18, boxShadow: "0 0 0 999px rgba(0,0,0,0.18) inset" }} />
          </div>
          {!ready && !error && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#e2e8f0", fontWeight: 700 }}>
              Membuka kamera...
            </div>
          )}
          {error && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fecaca", padding: 14, borderRadius: 14, fontSize: 13, fontWeight: 600, textAlign: "center" }}>
                {error}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: 16, color: "#94a3b8", fontSize: 12, lineHeight: 1.4 }}>
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
  const [showPayment, setShowPayment] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [orderNum] = useState(() => Math.floor(Math.random() * 9000) + 1000);

  const [products, setProducts] = useState([]);

  const refreshProducts = async () => {
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const response = await api.get("/produk" + q);
      setProducts(response.data);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const q = search ? `?search=${encodeURIComponent(search)}` : "";

    api.get("/produk" + q).then(res => {
      if (cancelled) return;
      setProducts(res.data);
    }).catch(err => {
      if (cancelled) return;
      console.error("Gagal ambil produk:", err);
    });

    return () => { cancelled = true; };
  }, [search]);

  const filtered = products.filter(p => {
    const matchCat = category === "All Items" || p.category === category;
    return matchCat;
  });

  const subtotal = cart.reduce((s, i) => s + i.harga * i.qty, 0);

  const handleAdd = (p) => {
    if (p.stok === 0) return;
    dispatch({ type: "ADD", product: p });
    setToast(`📦 ${p.nama} ditambahkan`);
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
      setShowPayment(false);
      setReceipt(response.data);
      refreshProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memproses transaksi.");
    }
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    dispatch({ type: "CLEAR" });
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%", flexDirection: isMobile ? "column" : "row" }}>
      {showScanner && (
        <BarcodeScannerModal
          onClose={() => setShowScanner(false)}
          onDetected={handleBarcodeDetected}
        />
      )}
      {isMobile && (
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
          <button onClick={() => setMobileTab("products")} style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: "1px solid " + (mobileTab === "products" ? "#006c49" : "#e2e8f0"), background: mobileTab === "products" ? "#f0fdf4" : "#fff", color: mobileTab === "products" ? "#006c49" : "#475569", fontWeight: 900, cursor: "pointer" }}>
            Produk
          </button>
          <button onClick={() => setMobileTab("cart")} style={{ flex: 1, padding: "10px 12px", borderRadius: 12, border: "1px solid " + (mobileTab === "cart" ? "#006c49" : "#e2e8f0"), background: mobileTab === "cart" ? "#f0fdf4" : "#fff", color: mobileTab === "cart" ? "#006c49" : "#475569", fontWeight: 900, cursor: "pointer" }}>
            Keranjang ({cart.length})
          </button>
        </div>
      )}
      {/* LEFT: Products */}
      {(!isMobile || mobileTab === "products") && (
      <section style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: isMobile ? "16px" : "28px 32px", gap: 16, background: "#f8fafc" }}>
        {/* Search */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#94a3b8" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, kode, atau barcode..."
              style={{ width: "100%", paddingLeft: 48, paddingRight: 52, paddingTop: 14, paddingBottom: 14, border: "none", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", outline: "none", fontFamily: "Manrope", fontSize: 14, boxSizing: "border-box", background: "#fff" }} />
            <button title="Scan Barcode (butuh HTTPS + kamera)"
              onClick={() => setShowScanner(true)}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>📷</button>
          </div>
          <button style={{ padding: "0 18px", background: "#fff", border: "none", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", cursor: "pointer", fontSize: 20 }}>⚙️</button>
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              style={{ padding: "8px 20px", borderRadius: 50, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", fontFamily: "Space Grotesk", transition: "all 0.15s", background: category === c ? "#006c49" : "#fff", color: category === c ? "#fff" : "#64748b", boxShadow: category === c ? "0 4px 12px rgba(0,108,73,0.3)" : "0 1px 4px rgba(0,0,0,0.06)" }}>
              {c}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, alignContent: "start", paddingRight: 4 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => handleAdd(p)}
              style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1.5px solid " + (p.stok === 0 ? "#f1f5f9" : "transparent"), cursor: p.stok === 0 ? "not-allowed" : "pointer", opacity: p.stok === 0 ? 0.55 : 1, transition: "all 0.18s", position: "relative" }}>
              <div style={{ aspectRatio: "1", background: "#f8fafc", borderRadius: 14, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative" }}>
                📦
                {p.stok === 0 && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ background: "#fff", color: "#0f172a", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50 }}>HABIS</span>
                  </div>
                )}
              </div>
              {p.stok > 0 && (
                <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,108,73,0.1)", color: "#006c49", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8 }}>{p.stok} unit</div>
              )}
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 2, fontFamily: "Space Grotesk" }}>{p.nama}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, fontFamily: "Space Grotesk" }}>{p.kode}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>{fmt(p.harga)}</span>
                <div style={{ width: 30, height: 30, background: p.stok === 0 ? "#f1f5f9" : "#f0fdf4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: p.stok === 0 ? "#cbd5e1" : "#006c49" }}>＋</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 600 }}>Produk tidak ditemukan</div>
            </div>
          )}
        </div>
      </section>
      )}

      {/* RIGHT: Cart */}
      {(!isMobile || mobileTab === "cart") && (
      <section style={{ width: isMobile ? "100%" : (isTablet ? 380 : 420), background: "#fff", borderLeft: isMobile ? "none" : "1px solid #e2e8f0", borderTop: isMobile ? "1px solid #e2e8f0" : "none", display: "flex", flexDirection: "column", overflow: "hidden", flex: isMobile ? 1 : "unset" }}>
        {/* Cart Header */}
        <div style={{ padding: "24px 28px 20px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 18, color: "#0f172a" }}>Nota #{orderNum}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>
                {cart.length} item{cart.length !== 1 ? "s" : ""} · {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <button onClick={() => dispatch({ type: "CLEAR" })}
              style={{ background: "#fff5f5", border: "none", color: "#ef4444", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 18 }}>🗑️</button>
          </div>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          {cart.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#cbd5e1", gap: 12 }}>
              <div style={{ fontSize: 52 }}>🛒</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Keranjang kosong</div>
              <div style={{ fontSize: 12, textAlign: "center" }}>Klik produk di sebelah kiri untuk menambahkan</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ background: "#f8fafc", borderRadius: 16, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center", border: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 28, width: 44, height: 44, background: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📦</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.nama}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{fmt(item.harga)} / unit</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#e2e8f0", borderRadius: 50, padding: "4px 6px" }}>
                <button onClick={() => dispatch({ type: "DEC", id: item.id })} style={{ width: 26, height: 26, background: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>−</button>
                <span style={{ minWidth: 20, textAlign: "center", fontWeight: 800, fontSize: 14, fontFamily: "Space Grotesk" }}>{item.qty}</span>
                <button onClick={() => dispatch({ type: "INC", id: item.id })} style={{ width: 26, height: 26, background: "#006c49", border: "none", borderRadius: "50%", cursor: "pointer", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>+</button>
              </div>
              <div style={{ minWidth: 70, textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>{fmt(item.harga * item.qty)}</div>
              </div>
              <button onClick={() => dispatch({ type: "REMOVE", id: item.id })} style={{ background: "none", border: "none", color: "#cbd5e1", cursor: "pointer", fontSize: 16, padding: 2 }}>✕</button>
            </div>
          ))}
        </div>

        {/* Cart Footer */}
        <div style={{ background: "#fff", borderTop: "1px solid #f1f5f9", padding: "20px 28px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#64748b", marginBottom: 6 }}>
            <span>Subtotal ({cart.length} item)</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
            <span style={{ fontSize: 13, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>Total</span>
            <span style={{ fontFamily: "Space Grotesk", fontWeight: 900, fontSize: 26, color: "#0f172a" }}>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={() => dispatch({ type: "CLEAR" })}
              style={{ flex: 1, padding: "14px 0", background: "#f8fafc", color: "#94a3b8", border: "none", borderRadius: 16, fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "Space Grotesk" }}>
              Batal Nota
            </button>
            <button onClick={() => cart.length > 0 && setShowPayment(true)} disabled={cart.length === 0}
              style={{ flex: 2, padding: "14px 0", background: cart.length > 0 ? "#006c49" : "#e2e8f0", color: cart.length > 0 ? "#fff" : "#94a3b8", border: "none", borderRadius: 16, fontWeight: 800, cursor: cart.length > 0 ? "pointer" : "not-allowed", fontSize: 15, fontFamily: "Space Grotesk", boxShadow: cart.length > 0 ? "0 8px 20px rgba(0,108,73,0.25)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              💳 BAYAR SEKARANG
            </button>
          </div>
        </div>
      </section>
      )}

      {showPayment && <PaymentModal total={subtotal} onConfirm={handleConfirmPayment} onClose={() => setShowPayment(false)} />}
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
                <button onClick={() => { setPage(n.id); setDrawerOpen(false); }}
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
