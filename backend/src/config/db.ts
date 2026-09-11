import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// 1. Baca konfigurasi dari file .env
dotenv.config();

// 2. Buat kolam koneksi (Connection Pool) ke MySQL Laragon
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'todo_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 3. Export agar bisa dipakai di tempat lain
export default pool;
