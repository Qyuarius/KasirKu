import { useState, useReducer, useRef, useEffect } from "react";

// ── MOCK USERS ─────────────────────────────────────────────────────────────────
const USERS = [
  { id: 1, username: "admin", password: "admin123", nama: "Admin Utama", role: "admin" },
  { id: 2, username: "budi", password: "budi123", nama: "Budi Santoso", role: "kasir" },
  { id: 3, username: "sari", password: "sari123", nama: "Sari Dewi", role: "kasir" },
];

// ── LOGIN PAGE ─────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const handleSubmit = () => {
    if (!username || !password) { setError("Username dan password wajib diisi."); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) { onLogin(user); }
      else { setError("Username atau password salah."); setLoading(false); }
    }, 900);
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
const PRODUCTS = [
  { id: 1, name: "Fresh Milk 1L", sku: "FM-0012", barcode: "8991234000012", price: 18500, stock: 80, category: "Beverages", emoji: "🥛" },
  { id: 2, name: "Sparkling Soda", sku: "SS-0842", barcode: "8991234000842", price: 7500, stock: 15, category: "Beverages", emoji: "🥤" },
  { id: 3, name: "Potato Chips", sku: "PC-0099", barcode: "8991234000099", price: 12000, stock: 0, category: "Snacks", emoji: "🍟" },
  { id: 4, name: "Red Apple (kg)", sku: "FR-1122", barcode: "8991234001122", price: 35000, stock: 42, category: "Fresh", emoji: "🍎" },
  { id: 5, name: "Toothpaste 150g", sku: "PC-2231", barcode: "8991234002231", price: 14200, stock: 120, category: "Health", emoji: "🪥" },
  { id: 6, name: "Instant Noodles", sku: "SN-0301", barcode: "8991234000301", price: 3500, stock: 200, category: "Snacks", emoji: "🍜" },
  { id: 7, name: "Mineral Water 1.5L", sku: "BV-0055", barcode: "8991234000055", price: 5000, stock: 60, category: "Beverages", emoji: "💧" },
  { id: 8, name: "Shampoo 170ml", sku: "HC-0880", barcode: "8991234000880", price: 22000, stock: 35, category: "Health", emoji: "🧴" },
  { id: 9, name: "White Rice 5kg", sku: "ST-0010", barcode: "8991234000010", price: 68000, stock: 25, category: "Daily Needs", emoji: "🍚" },
];

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
const txId = () => "TRX-" + Date.now().toString().slice(-6);

// ── TOAST ──────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 9999, background: "#0f172a", color: "#fff", padding: "12px 24px", borderRadius: 14, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
      {msg}
    </div>
  );
}

// ── RECEIPT MODAL ──────────────────────────────────────────────────────────────
function ReceiptModal({ tx, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 24, width: 360, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ background: "#006c49", color: "#fff", padding: "28px 28px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "Space Grotesk" }}>Pembayaran Berhasil!</div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 4 }}>#{tx.id}</div>
        </div>
        <div style={{ padding: "20px 28px", fontFamily: "monospace", fontSize: 13, color: "#1e293b" }}>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>KasirKu Store</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Jl. Contoh No. 1, Jakarta</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>{new Date(tx.time).toLocaleString("id-ID")}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Kasir: Budi Santoso</div>
          </div>
          <div style={{ borderTop: "1px dashed #e2e8f0", margin: "10px 0" }} />
          {tx.items.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ flex: 1 }}>{i.name} x{i.qty}</span>
              <span style={{ fontWeight: 600 }}>{fmt(i.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px dashed #e2e8f0", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total</span><b>{fmt(tx.total)}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Bayar</span><b>{fmt(tx.paid)}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#006c49", fontWeight: 800 }}><span>Kembalian</span><b>{fmt(tx.change)}</b></div>
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
  const [paid, setPaid] = useState("");
  const paidNum = parseInt(paid.replace(/\D/g, "") || "0");
  const change = paidNum - total;
  const valid = paidNum >= total;

  const quickAmounts = [total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000, 100000].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 28, width: 420, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}>
        <div style={{ background: "#0f172a", color: "#fff", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "Space Grotesk" }}>Proses Pembayaran</div>
            <div style={{ opacity: 0.5, fontSize: 12 }}>Masukkan nominal uang bayar</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: 10, padding: "6px 12px", cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px", space: 16 }}>
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
function Sidebar({ page, setPage }) {
  const nav = [
    { id: "cashier", icon: "🏪", label: "Kasir" },
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "transactions", icon: "🧾", label: "Transaksi" },
    { id: "inventory", icon: "📦", label: "Inventory" },
    { id: "employees", icon: "👥", label: "Pegawai" },
    { id: "reports", icon: "📈", label: "Laporan" },
  ];
  return (
    <aside style={{ width: 240, background: "#0f172a", height: "100vh", position: "fixed", left: 0, top: 0, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(148,163,184,0.1)", zIndex: 40 }}>
      <div style={{ padding: "24px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "#006c49", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff" }}>K</div>
          <div>
            <div style={{ color: "#4ade80", fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>KasirKu</div>
            <div style={{ color: "#475569", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>Management Pro</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "8px 12px" }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 50, border: "none", cursor: "pointer", marginBottom: 4, textAlign: "left", fontFamily: "Space Grotesk", fontSize: 14, fontWeight: 600, transition: "all 0.15s", background: page === n.id ? "rgba(74,222,128,0.1)" : "transparent", color: page === n.id ? "#4ade80" : "#64748b" }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#006c49", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>BS</div>
          <div>
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>Budi Santoso</div>
            <div style={{ color: "#475569", fontSize: 10, textTransform: "uppercase" }}>Kasir</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── PLACEHOLDER PAGES ──────────────────────────────────────────────────────────
function PlaceholderPage({ icon, title, desc }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "#94a3b8" }}>
      <div style={{ fontSize: 64 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Space Grotesk", color: "#1e293b" }}>{title}</div>
      <div style={{ fontSize: 14, color: "#94a3b8", textAlign: "center", maxWidth: 320 }}>{desc}</div>
      <div style={{ marginTop: 8, padding: "8px 20px", background: "#f0fdf4", color: "#006c49", borderRadius: 50, fontSize: 13, fontWeight: 600, border: "1px solid #bbf7d0" }}>🚧 Halaman ini belum dibuat — hubungkan ke backend</div>
    </div>
  );
}

// ── CASHIER PAGE ───────────────────────────────────────────────────────────────
function CashierPage() {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Items");
  const [showPayment, setShowPayment] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [orderNum] = useState(() => Math.floor(Math.random() * 9000) + 1000);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = category === "All Items" || p.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.barcode.includes(q);
    return matchCat && matchSearch;
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleAdd = (p) => {
    if (p.stock === 0) return;
    dispatch({ type: "ADD", product: p });
    setToast(`${p.emoji} ${p.name} ditambahkan`);
  };

  const handleConfirmPayment = (paid, change) => {
    const tx = { id: txId(), time: Date.now(), items: cart, total: subtotal, paid, change };
    setShowPayment(false);
    setReceipt(tx);
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    dispatch({ type: "CLEAR" });
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>
      {/* LEFT: Products */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "28px 32px", gap: 20, background: "#f8fafc" }}>
        {/* Search */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: "#94a3b8" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, kode, atau barcode..."
              style={{ width: "100%", paddingLeft: 48, paddingRight: 52, paddingTop: 14, paddingBottom: 14, border: "none", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", outline: "none", fontFamily: "Manrope", fontSize: 14, boxSizing: "border-box", background: "#fff" }} />
            <button title="Scan Barcode (butuh HTTPS + kamera)"
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
        <div style={{ flex: 1, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, alignContent: "start", paddingRight: 4 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => handleAdd(p)}
              style={{ background: "#fff", borderRadius: 20, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1.5px solid " + (p.stock === 0 ? "#f1f5f9" : "transparent"), cursor: p.stock === 0 ? "not-allowed" : "pointer", opacity: p.stock === 0 ? 0.55 : 1, transition: "all 0.18s", position: "relative" }}>
              <div style={{ aspectRatio: "1", background: "#f8fafc", borderRadius: 14, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative" }}>
                {p.emoji}
                {p.stock === 0 && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ background: "#fff", color: "#0f172a", fontSize: 10, fontWeight: 900, padding: "3px 10px", borderRadius: 50 }}>HABIS</span>
                  </div>
                )}
              </div>
              {p.stock > 0 && (
                <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,108,73,0.1)", color: "#006c49", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 8 }}>{p.stock} unit</div>
              )}
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 2, fontFamily: "Space Grotesk" }}>{p.name}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, fontFamily: "Space Grotesk" }}>{p.sku}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>{fmt(p.price)}</span>
                <div style={{ width: 30, height: 30, background: p.stock === 0 ? "#f1f5f9" : "#f0fdf4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: p.stock === 0 ? "#cbd5e1" : "#006c49" }}>＋</div>
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

      {/* RIGHT: Cart */}
      <section style={{ width: 420, background: "#fff", borderLeft: "1px solid #e2e8f0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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
              <div style={{ fontSize: 28, width: 44, height: 44, background: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>{fmt(item.price)} / unit</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#e2e8f0", borderRadius: 50, padding: "4px 6px" }}>
                <button onClick={() => dispatch({ type: "DEC", id: item.id })} style={{ width: 26, height: 26, background: "#fff", border: "none", borderRadius: "50%", cursor: "pointer", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>−</button>
                <span style={{ minWidth: 20, textAlign: "center", fontWeight: 800, fontSize: 14, fontFamily: "Space Grotesk" }}>{item.qty}</span>
                <button onClick={() => dispatch({ type: "INC", id: item.id })} style={{ width: 26, height: 26, background: "#006c49", border: "none", borderRadius: "50%", cursor: "pointer", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>+</button>
              </div>
              <div style={{ minWidth: 70, textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "#0f172a" }}>{fmt(item.price * item.qty)}</div>
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

      {showPayment && <PaymentModal total={subtotal} onConfirm={handleConfirmPayment} onClose={() => setShowPayment(false)} />}
      {receipt && <ReceiptModal tx={receipt} onClose={handleCloseReceipt} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}


// ── ROOT APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("cashier");

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "admin" ? "dashboard" : "cashier");
  };
  const handleLogout = () => { setUser(null); setPage("cashier"); };

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
    cashier: <CashierPage user={user} />,
    dashboard: <PlaceholderPage icon="📊" title="Dashboard Admin" desc="Ringkasan penjualan harian, grafik omzet, dan transaksi terbaru." />,
    transactions: <PlaceholderPage icon="🧾" title="Riwayat Transaksi" desc="Semua nota yang sudah dibayar, bisa filter per tanggal & kasir." />,
    inventory: <PlaceholderPage icon="📦" title="Kelola Barang" desc="Tambah, edit, hapus produk. Lengkap dengan scan barcode." />,
    employees: <PlaceholderPage icon="👥" title="Kelola Pegawai" desc="Manajemen akun kasir, reset password, aktif/nonaktif." />,
    reports: <PlaceholderPage icon="📈" title="Laporan Penjualan" desc="Export CSV/PDF, grafik per periode, performa per kasir." />,
  };

  const pageLabels = { cashier: "🏪 Kasir", dashboard: "📊 Dashboard", transactions: "🧾 Transaksi", inventory: "📦 Inventory", employees: "👥 Pegawai", reports: "📈 Laporan" };

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", fontFamily: "Manrope,sans-serif", background: "#f8fafc", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Sidebar ── */}
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

      {/* ── Main ── */}
      <div style={{ marginLeft: 240, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: 60, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", flexShrink: 0 }}>
          <div style={{ fontFamily: "Space Grotesk", fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{pageLabels[page]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12, color: "#94a3b8", background: "#f1f5f9", padding: "6px 14px", borderRadius: 50 }}>
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
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
            <button onClick={handleLogout}
              style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#ef4444", borderRadius: 10, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              ↩ Logout
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