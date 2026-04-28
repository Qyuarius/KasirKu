import "dotenv/config";
import * as mariadb from "mariadb";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
const url = new URL(connectionString);

const pool = mariadb.createPool({
  host: url.hostname || "localhost",
  port: parseInt(url.port || "3306"),
  user: url.username || "root",
  password: url.password || "",
  database: url.pathname.substring(1),
  connectionLimit: 5,
});

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  await pool.query(
    "INSERT INTO user (id, nama, username, password, role, aktif) VALUES (UUID(), ?, ?, ?, ?, 1) " +
      "ON DUPLICATE KEY UPDATE nama = VALUES(nama), password = VALUES(password), role = VALUES(role), aktif = VALUES(aktif)",
    ["Admin", "admin", hashed, "admin"]
  );
}

main()
  .catch((e) => {
    console.error("Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
