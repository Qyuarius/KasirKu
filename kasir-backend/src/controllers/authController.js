import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    if (!user.aktif) {
      return res.status(403).json({ message: "Akun Anda tidak aktif." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Password salah." });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, nama: user.nama },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const register = async (req, res) => {
  const { nama, username, password, role } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(400).json({ message: "Username sudah digunakan." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nama,
        username,
        password: hashedPassword,
        role: role || "kasir",
      },
    });

    res.status(201).json({ message: "User berhasil dibuat.", user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan saat mendaftar." });
  }
};
