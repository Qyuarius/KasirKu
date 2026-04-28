import 'dotenv/config';
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString = process.env.DATABASE_URL;
const url = new URL(connectionString);

const database = url.pathname.substring(1);

const adapter = new PrismaMariaDb(
  {
    host: url.hostname || "localhost",
    port: parseInt(url.port || "3306"),
    user: url.username || "root",
    password: url.password || "",
    database,
    connectionLimit: 5,
  },
  { database }
);
const prisma = new PrismaClient({ adapter });

export default prisma;
