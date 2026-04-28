import prisma from "../utils/prisma.js";

export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    const products = await prisma.produk.findMany({
      where: search ? {
        OR: [
          { nama: { contains: search } },
          { kode: { contains: search } },
          { barcode: { contains: search } }
        ]
      } : {}
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data produk." });
  }
};

export const createProduct = async (req, res) => {
  const { kode, barcode, nama, harga, stok } = req.body;
  try {
    const generatedKode = kode || "PRD-" + Math.floor(100000 + Math.random() * 900000);
    const product = await prisma.produk.create({
      data: {
        kode: generatedKode,
        barcode,
        nama,
        harga: parseFloat(harga),
        stok: parseInt(stok)
      }
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Kode produk sudah ada." });
    }
    res.status(500).json({ message: "Gagal membuat produk." });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { barcode, nama, harga, stok } = req.body;
  try {
    const product = await prisma.produk.update({
      where: { id: parseInt(id) },
      data: {
        barcode,
        nama,
        harga: harga ? parseFloat(harga) : undefined,
        stok: stok !== undefined ? parseInt(stok) : undefined
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui produk." });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.produk.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Produk berhasil dihapus." });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus produk." });
  }
};
