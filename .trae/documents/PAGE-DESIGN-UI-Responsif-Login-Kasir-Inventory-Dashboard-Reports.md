# Spesifikasi Desain Halaman (Desktop-first, Responsif Tablet & Smartphone)

## Global Styles (Design Tokens)
- Breakpoints (disarankan):
  - Mobile: < 640px
  - Tablet: 640–1024px
  - Desktop: > 1024px
- Grid & spacing:
  - Container max-width desktop: 1200–1440px (dengan padding kiri/kanan 24px)
  - Gutter: 16px (mobile), 20px (tablet), 24px (desktop)
  - Spacing scale: 4/8/12/16/24/32
- Warna:
  - Background: netral terang (mis. #F8FAFC)
  - Surface/card: putih (mis. #FFFFFF)
  - Primary: warna brand
  - Danger: merah (error)
  - Border: abu tipis
- Tipografi:
  - Base: 14–16px (mobile), 16px (tablet/desktop)
  - Heading: 20/24/28/32 sesuai kebutuhan
- Interaksi:
  - Tombol tinggi minimum: 44px (touch target)
  - Hover (desktop): lighten/darken 5–8%
  - Focus ring jelas untuk aksesibilitas

## Komponen Global (dipakai lintas halaman)
### Navigasi
- Desktop: Sidebar kiri (collapsible) + Topbar (judul halaman, aksi utama, profil).
- Tablet: Sidebar bisa collapse menjadi ikon; Topbar tetap.
- Mobile: Topbar dengan tombol hamburger + (opsional) bottom navigation untuk halaman utama.
- Pola konsistensi: label menu selalu sama, ikon + teks pada desktop; ikon saja boleh pada mode collapse.

### Tabel Responsif (standar perilaku)
- Desktop: tabel penuh (multi kolom) + sticky header.
- Tablet: prioritas kolom (kolom penting tetap tampil), kolom sekunder bisa:
  - dipendekkan (truncate),
  - dipindah ke baris kedua (row details), atau
  - disembunyikan melalui “Column chooser”.
- Mobile: pilih salah satu pola (konsisten di Inventory & Reports):
  1) **Horizontal scroll** dengan indikator scroll + sticky kolom pertama, atau
  2) **List/Card view** (tiap row jadi kartu) + tombol “Detail” membuka drawer.
- Kontrol tabel: Search, Filter, Sort, Pagination selalu bisa diakses; pada mobile ditempatkan dalam drawer/accordion.

### Modal / Dialog
- Desktop: modal terpusat (max-width 560–720px), overlay, dapat ditutup ESC.
- Tablet: modal lebih besar (max-width 80vw) bila form panjang.
- Mobile: full-screen modal / bottom-sheet:
  - Header sticky (judul + tombol tutup)
  - Footer sticky (tombol aksi utama)
  - Konten bisa scroll

---

## Halaman: Login
### Layout
- Desktop-first: card login terpusat (max-width 420–480px), di tengah halaman.
- Tablet: card membesar sedikit; padding diperlebar.
- Mobile: card menjadi full-width dengan margin kecil; hindari elemen dekoratif besar.

### Meta Information
- Title: “Login - KasirKu”
- Description: “Masuk untuk mengakses dashboard, kasir, inventory, dan laporan.”
- Open Graph: title/description konsisten; og:type = website.

### Page Structure
1. Background / brand area (ringan)
2. Card Login
3. Bantuan singkat (mis. link “Lupa password” jika memang ada di sistem; jika tidak ada, hilangkan)

### Sections & Components
- Form fields: email/username, password
- Primary button: “Masuk” (full-width di mobile)
- States:
  - Loading: tombol disabled + spinner
  - Error: alert ringkas di atas form + highlight field terkait
- Mobile keyboard:
  - Gunakan spacing cukup agar tombol tidak tertutup keyboard
  - “Submit on Enter” pada field password

---

## Halaman: Dashboard
### Layout
- Desktop: layout 2 area: Sidebar (kiri) + Content (kanan).
- Content memakai CSS Grid cards (3–4 kolom di desktop, 2 kolom di tablet, 1 kolom di mobile).

### Meta Information
- Title: “Dashboard - KasirKu”
- Description: “Ringkasan performa dan akses cepat modul.”

### Page Structure
1. Topbar (judul + quick actions)
2. Summary cards grid
3. Area ringkasan tabel/list (jika ada)

### Sections & Components
- Topbar:
  - Judul halaman
  - Aksi utama (maks 1 tombol utama) + overflow menu untuk aksi lain di mobile
- Cards:
  - Angka utama + label
  - Placeholder skeleton saat loading
- Navigasi responsif:
  - Desktop: sidebar visible
  - Mobile: hamburger opens drawer; (opsional) bottom nav untuk 4–5 menu utama

---

## Halaman: Kasir
### Layout
- Desktop: dua panel (CSS Grid):
  - Kiri: pencarian/daftar produk
  - Kanan: keranjang + ringkasan
- Tablet: tetap 2 panel tapi proporsi lebih seimbang; elemen kontrol diringkas.
- Mobile: bertingkat (stack):
  - Segment control/tab: “Produk” | “Keranjang”
  - Floating action untuk aksi penting jika diperlukan

### Meta Information
- Title: “Kasir - KasirKu”
- Description: “Transaksi cepat dengan layout adaptif.”

### Page Structure
1. Topbar (judul + akses cepat)
2. Area Produk (search + hasil)
3. Area Keranjang (tabel item)
4. Modal/Drawer untuk pencarian/konfirmasi

### Sections & Components
- Produk:
  - Search bar sticky di atas list
  - List/grid produk: 4–6 kolom desktop, 2–3 tablet, 1–2 mobile
- Keranjang (tabel):
  - Kolom prioritas: Nama, Qty, Harga, Subtotal
  - Kontrol qty: tombol +/- dengan touch target besar
  - Sticky footer ringkasan (total + tombol aksi utama) terutama di mobile
- Modal/Drawer:
  - Konfirmasi aksi (mis. hapus item) tampil sebagai bottom-sheet di mobile

---

## Halaman: Inventory
### Layout
- Desktop: topbar + toolbar tabel + tabel penuh.
- Tablet: toolbar bisa 2 baris.
- Mobile: toolbar menjadi accordion/drawer untuk filter; tabel mengikuti standar (scroll horizontal atau card view).

### Meta Information
- Title: “Inventory - KasirKu”
- Description: “Kelola item dan stok dengan tabel responsif.”

### Page Structure
1. Topbar (judul + tombol tambah)
2. Table toolbar (search, filter)
3. Data table
4. Modal tambah/ubah

### Sections & Components
- Toolbar:
  - Search selalu terlihat
  - Filter masuk ke drawer pada mobile
  - Tombol “Tambah”:
    - Desktop: tombol utama di kanan
    - Mobile: tombol utama sticky/floating (opsional) atau di header
- Tabel:
  - Sticky header
  - Empty state dengan CTA “Tambah item”
  - Pagination: desktop di bawah kanan; mobile: ringkas (Prev/Next + page)
- Modal tambah/ubah:
  - Desktop: modal centered
  - Mobile: full-screen modal + tombol “Simpan” sticky di footer

---

## Halaman: Reports
### Layout
- Desktop: filter bar horizontal + tabel laporan.
- Tablet: filter wrap ke 2 baris.
- Mobile: filter jadi accordion/drawer + tabel sesuai standar.

### Meta Information
- Title: “Reports - KasirKu”
- Description: “Laporan dengan filter ringkas dan detail mudah dibaca.”

### Page Structure
1. Topbar
2. Filter bar
3. Tabel laporan
4. Modal/drawer detail laporan

### Sections & Components
- Filter bar:
  - Kontrol tanggal/rentang ditampilkan jelas
  - Tombol “Terapkan” full-width di mobile dalam drawer
- Tabel laporan:
  - Kolom prioritas: Tanggal, Jenis, Total/Status
  - Klik row membuka detail
- Detail (modal/drawer):
  - Desktop: modal
  - Mobile: drawer/full-screen dengan section terstruktur (ringkasan, rincian)
