import prisma from "../utils/prisma.js";

export const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Total Penjualan Hari Ini
    const salesToday = await prisma.transaksi.aggregate({
      where: {
        created_at: {
          gte: today,
          lt: tomorrow
        }
      },
      _sum: {
        total: true
      },
      _count: {
        id: true
      }
    });

    // 2. Performa Kasir (Top 5 berdasarkan total penjualan)
    const cashierPerformance = await prisma.transaksi.groupBy({
      by: ['user_id'],
      _sum: {
        total: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          total: 'desc'
        }
      },
      take: 5
    });

    // Ambil detail nama kasir
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

    // 3. Grafik Penjualan 7 Hari Terakhir
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dailySum = await prisma.transaksi.aggregate({
        where: {
          created_at: {
            gte: date,
            lt: nextDay
          }
        },
        _sum: {
          total: true
        }
      });

      last7Days.push({
        tanggal: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
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
