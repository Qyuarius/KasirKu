import prisma from "../utils/prisma.js";

export const createTransaction = async (req, res) => {
  const { cart, total, bayar } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ message: "Keranjang kosong." });
  }

  if (bayar < total) {
    return res.status(400).json({ message: "Uang bayar kurang." });
  }

  try {
    // Jalankan transaksi dalam Prisma Transaction untuk konsistensi
    const result = await prisma.$transaction(async (tx) => {
      // 1. Validasi stok untuk semua item di keranjang
      for (const item of cart) {
        const produk = await tx.produk.findUnique({
          where: { id: item.id }
        });

        if (!produk) {
          throw new Error(`Produk dengan ID ${item.id} tidak ditemukan.`);
        }

        if (produk.stok < item.qty) {
          throw new Error(`Stok produk "${produk.nama}" tidak mencukupi (Tersisa: ${produk.stok}).`);
        }
      }

      // 2. Simpan Transaksi
      const transaksi = await tx.transaksi.create({
        data: {
          nomor_nota: "TRX-" + Date.now(),
          user_id: req.user.id,
          total,
          bayar,
          kembalian: bayar - total,
          status: "lunas",
          detail: {
            create: cart.map(item => ({
              produk_id: item.id,
              nama_produk: item.nama, // Snapshot nama
              harga_satuan: item.harga, // Snapshot harga
              qty: item.qty,
              subtotal: item.harga * item.qty
            }))
          }
        },
        include: { 
          detail: true,
          user: { select: { nama: true } }
        }
      });

      // 3. Kurangi Stok Produk
      for (const item of cart) {
        await tx.produk.update({
          where: { id: item.id },
          data: {
            stok: { decrement: item.qty }
          }
        });
      }

      return transaksi;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || "Gagal memproses transaksi." });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaksi.findMany({
      include: {
        user: { select: { nama: true } },
        detail: true
      },
      orderBy: { created_at: 'desc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data transaksi." });
  }
};
