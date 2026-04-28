import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        nama: true,
        username: true,
        role: true,
        aktif: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pegawai." });
  }
};

export const createUser = async (req, res) => {
  const { nama, username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        role: role || "kasir"
      }
    });
    res.status(201).json({ message: "Pegawai berhasil ditambahkan.", user: { id: user.id, username: user.username } });
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ message: "Username sudah digunakan." });
    res.status(500).json({ message: "Gagal menambahkan pegawai." });
  }
};

export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan." });
    
    const updated = await prisma.user.update({
      where: { id },
      data: { aktif: !user.aktif }
    });
    res.json({ message: `Status ${updated.nama} berhasil diubah.`, aktif: updated.aktif });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengubah status pegawai." });
  }
};

export const resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });
    res.json({ message: "Password berhasil direset." });
  } catch (error) {
    res.status(500).json({ message: "Gagal reset password." });
  }
};
