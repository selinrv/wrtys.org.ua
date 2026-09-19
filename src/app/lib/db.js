import "server-only";
import mysql from "mysql2/promise";

// Reuse across HMR reloads in dev so you don't leak pools.
const globalForDb = globalThis;
export const db =
    globalForDb._pool ??
    (globalForDb._pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10,
    }));