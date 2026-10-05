# Tugas Praktikum 7: Integrasi Frontend & Backend (PWF)

Dokumentasi Pengembangan Aplikasi Fullstack Todo List berbasis **Next.js 16 + shadcn/ui (Frontend)** dan **Express.js + TypeScript + MySQL (Backend RESTful API)** dengan integrasi penuh autentikasi JWT, proteksi rute, manajemen state, dan operasi CRUD tugas.

---

## 📌 Identitas Praktikan
- **Nama**: Diego Armando Ramadhan
- **NIM**: 253140701111062
- **Kelas**: T3D
- **Mata Kuliah**: Pemrograman Web Framework (PWF)
- **Repository GitHub**: [https://github.com/stanlevv/Tugas3_PWF](https://github.com/stanlevv/Tugas3_PWF)

---

## 🚀 Fitur Integrasi Frontend & Backend (Tugas Praktikum 7)

### 1. Autentikasi Terintegrasi (JWT Bearer Auth)
- **Register (`/register`)**: Form registrasi akun baru terhubung ke `POST /api/auth/register` dengan hashing password `bcrypt`.
- **Login (`/login`)**: Form login terhubung ke `POST /api/auth/login`, menerima JWT token dan menyimpannya di cookie / storage untuk autentikasi permintaan selanjutnya.
- **Auth Guard & Route Protection**: Proteksi rute frontend agar user yang belum login otomatis diarahkan ke halaman login, dan user yang sudah login diarahkan ke dashboard.

### 2. Manajemen Tugas (Full CRUD & Detail)
- **Daftar Tugas (Dashboard `/`)**: Menampilkan daftar tugas milik user yang sedang aktif via `GET /api/todos`.
- **Tambah Tugas**: Form input tugas baru terhubung ke `POST /api/todos`.
- **Ubah Status Selesai**: Toggle status tugas (`is_completed`) terhubung ke `PUT /api/todos/:id`.
- **Halaman Detail Tugas (`/task/[id]`)**: Menampilkan rincian informasi tugas (ID, judul tugas, status selesai, tanggal pembuatan) via `GET /api/todos/:id`.
- **Hapus Tugas**: Tombol hapus tugas terhubung ke `DELETE /api/todos/:id`.

### 3. Keamanan & Arsitektur Kode
- **Prepared Statements (`?`)**: Semua query MySQL menggunakan parameterized queries untuk mencegah SQL Injection.
- **UI Design System**: Menggunakan primitif komponen [shadcn/ui](https://ui.shadcn.com/) dengan Tailwind CSS dan gaya modern minimalis.
- **Konsistensi Format API**: Seluruh response Express mengembalikan format JSON standar `{ success, message, data, meta }`.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js (v5) & Node.js
- **Bahasa**: TypeScript (Node ESM)
- **Database**: MySQL (`todo_db`) via `mysql2/promise` (Laragon / XAMPP)
- **Keamanan**: `jsonwebtoken` (JWT), `bcryptjs`
- **Runner**: `tsx`

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI Library**: React 19, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/)
- **State & Client**: Fetch API dengan JWT Bearer Header Injection

---

## 📁 Struktur Direktori Proyek

```text
todo-app-062/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # Koneksi MySQL Pool
│   │   ├── controllers/
│   │   │   ├── authController.ts     # Handler Register & Login
│   │   │   └── todoController.ts     # Handler CRUD Todo
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.ts     # Verifikasi JWT Token
│   │   │   └── validator.ts          # Validasi Input Request
│   │   ├── models/
│   │   │   ├── todoModel.ts          # Query SQL Prepared Statements todos
│   │   │   └── userModel.ts          # Query SQL Prepared Statements users
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         # Router Autentikasi
│   │   │   ├── todoRoutes.ts         # Router CRUD Todo
│   │   │   └── index.ts              # Router Agregator
│   │   ├── app.ts                    # Inisialisasi Express & Middleware
│   │   └── server.ts                 # Server Entry Point (Port 5000)
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx        # Halaman Login
│   │   │   └── register/page.tsx     # Halaman Register
│   │   ├── task/
│   │   │   └── [id]/page.tsx         # Halaman Detail Tugas
│   │   ├── layout.tsx                # Layout Global
│   │   └── page.tsx                  # Dashboard Halaman Utama Todo List
│   ├── components/ui/                # Komponen Primitif shadcn/ui
│   ├── services/
│   │   ├── api.ts                    # HTTP Client Base Fetcher
│   │   ├── authService.ts            # Service API Auth
│   │   └── todoService.ts            # Service API Todo
│   ├── types/
│   │   ├── auth.ts                   # Type Defs Autentikasi
│   │   └── todo.ts                   # Type Defs Todo
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

---

## ⚡ Petunjuk Menjalankan Proyek Lokal

### 1. Database MySQL (Laragon / XAMPP)
Pastikan MySQL service aktif di port `3306` dan database `todo_db` telah tersedia:

```sql
CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2. Menjalankan Backend API
```bash
cd backend
npm install
npm run dev
```
Backend berjalan di: **`http://localhost:5000`**

### 3. Menjalankan Frontend Next.js
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan di: **`http://localhost:3000`**

---

## 🌐 Endpoint API Reference

| Endpoint | Method | Auth | Deskripsi |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | Publik | Mendaftarkan akun baru |
| `/api/auth/login` | `POST` | Publik | Otentikasi dan generate JWT token |
| `/api/todos` | `GET` | Bearer JWT | Mengambil daftar tugas milik user aktif |
| `/api/todos` | `POST` | Bearer JWT | Membuat tugas baru |
| `/api/todos/:id` | `GET` | Bearer JWT | Mengambil detail tugas berdasarkan ID |
| `/api/todos/:id` | `PUT` | Bearer JWT | Memperbarui task atau status `is_completed` |
| `/api/todos/:id` | `DELETE` | Bearer JWT | Menghapus tugas berdasarkan ID |
