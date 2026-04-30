import prisma from "../utils/prisma.js";

// Helper: buat range tanggal dengan offset WIB (UTC+7)
function getWIBDayRange(daysAgo = 0) {
  const WIB_OFFSET = 7 * 60 * 60 * 1000; // 7 jam dalam ms

  // Ambil waktu sekarang dalam WIB
  const nowUTC = Date.now();
  const nowWIB = new Date(nowUTC + WIB_OFFSET);

  // Set ke midnight WIB untuk hari target
  const startWIB = new Date(nowWIB);
  startWIB.setUTCDate(startWIB.getUTCDate() - daysAgo);
  startWIB.setUTCHours(0, 0, 0, 0);

  const endWIB = new Date(startWIB);
  endWIB.setUTCDate(endWIB.getUTCDate() + 1);

  // Konversi kembali ke UTC untuk query database
  return {
    gte: new Date(startWIB.getTime() - WIB_OFFSET),
    lt: new Date(endWIB.getTime() - WIB_OFFSET),
    // label tanggal untuk chart
    label: startWIB.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
  };
}

export const getStats = async (req, res) => {
  try {
    const todayRange = getWIBDayRange(0);

    // 1. Total Penjualan Hari Ini
    const salesToday = await prisma.transaksi.aggregate({
      where: {
        created_at: { gte: todayRange.gte, lt: todayRange.lt }
      },
      _sum: { total: true },
      _count: { id: true }
    });

    // 2. Performa Kasir
    const cashierPerformance = await prisma.transaksi.groupBy({
      by: ["user_id"],
      _sum: { total: true },
      _count: { id: true },
      orderBy: { _sum: { total: "desc" } },
      take: 5
    });

    const performanceWithNames = await Promise.all(
      cashierPerformance.map(async (item) => {
        const user = await prisma.user.findUnique({
          where: { id: item.user_id },
          select: { nama: true }
        });
        return {
          nama: user?.nama || "Unknown",
          total: item._sum.total || 0,
          count: item._count.id
        };
      })
    );

    // 3. Grafik 7 Hari Terakhir (dengan WIB timezone)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const range = getWIBDayRange(i);

      const dailySum = await prisma.transaksi.aggregate({
        where: {
          created_at: { gte: range.gte, lt: range.lt }
        },
        _sum: { total: true }
      });

      last7Days.push({
        tanggal: range.label,
        total: dailySum._sum.total || 0
      });
    }

    res.json({
      summary: {
        totalSalesToday: salesToday._sum.total || 0,
        transactionCountToday: salesToday._count.id || 0
      },
      performance: performanceWithNames,
      chart: last7Days
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil data dashboard." });
  }
};