# Tugas #4 & Tugas #3 Web Framework Developer Documentation (PWF)

Dokumentasi Pengembangan Aplikasi Fullstack Todo List berbasis **Next.js 16 (Frontend)** dan **Express.js + TypeScript + MySQL (Backend RESTful API)**.

---

## 📌 Laporan Tugas #4
📄 **Link Dokumen Laporan Tugas 4 (Google Docs):**  
👉 [Laporan Tugas #4 Web Framework](https://docs.google.com/document/d/10vOI4pT9X870nHsNrux2StE2MLrUYKvi33bmGfsmR-4/edit?usp=sharing)

---

## 🚀 Fitur Utama Tugas #4 Backend

### 1. RESTful API Architecture (MVC Pattern)
- Dibangun menggunakan **Express.js** dengan **TypeScript**.
- Struktur terpisah yang bersih: `config`, `controllers`, `middlewares`, `models`, dan `routes`.

### 2. Database Integration (MySQL)
- Terhubung langsung dengan database MySQL Laragon/XAMPP (`todo_db`) menggunakan `mysql2/promise`.
- Pengelolaan relasi data antara tabel `users` dan tabel `todos`.

### 3. Security & Authentication
- Enkripsi kata sandi pengguna menggunakan **Bcrypt** (10 salt rounds).
- Autentikasi berbasis token **JSON Web Token (JWT)** untuk mengamankan sesi dan rute yang terproteksi.

### 4. Middleware System
- **CORS Middleware:** Mengizinkan komunikasi lintas domain dengan frontend lokal.
- **Validator Middleware:** Memeriksa kelengkapan input payload (Register, Login, Todo) serta validasi format email sebelum diproses controller.
- **Auth Middleware:** Verifikasi header `Authorization: Bearer <token>` dan injeksi `userId` ke objek konteks `res.locals`.

---

## 🛠️ Tech Stack

### Backend (Tugas #4)
- **Framework**: Express.js (v5) & Node.js
- **Bahasa**: TypeScript (v7)
- **Database**: MySQL (`todo_db`) via `mysql2`
- **Keamanan**: `jsonwebtoken`, `bcrypt`
- **Development**: `tsx` (live reloading)

### Frontend (Tugas #3)
- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4

---

## 📁 Struktur Direktori Backend (`/backend`)

```text
Tugas3_PWF/
└── backend/
    ├── .env
    ├── .env.example
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── config/
        │   └── db.ts             # Connection Pool MySQL
        ├── controllers/
        │   ├── authController.ts # Logic Register (Bcrypt) & Login (JWT)
        │   └── todoController.ts # Logic GET & POST Todos
        ├── middlewares/
        │   ├── authMiddleware.ts # JWT Bearer Token Verification
        │   └── validator.ts      # Input Payload Validator
        ├── models/
        │   ├── todoModel.ts      # SQL Queries for 'todos' table
        │   └── userModel.ts      # SQL Queries for 'users' table
        ├── routes/
        │   └── api.ts            # Endpoint Routing (/api/...)
        ├── app.ts                # Express Setup & CORS
        └── server.ts             # Server Runner (Port 5000)
```

---

## ⚡ Cara Menjalankan Backend Lokal

### 1. Persiapan Database MySQL (Laragon / XAMPP)
Nyalakan MySQL di Laragon / XAMPP, lalu jalankan query SQL berikut di phpMyAdmin:

```sql
CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 2. Setup Environment (`.env`)
Buat file `.env` di dalam folder `backend`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=todo_db
PORT=5000
JWT_SECRET=pwf_2026
```

### 3. Install & Jalankan Server Backend
```bash
cd backend
npm install
npm run dev
```
Server backend akan berjalan di **`http://localhost:5000`**.

---

## 🌐 Daftar Endpoint REST API Backend

| Endpoint | Method | Middleware | Deskripsi | Status Respon |
| :--- | :---: | :--- | :--- | :---: |
| `/api/auth/register` | `POST` | `validateRegister` | Registrasi akun pengguna baru | `201 Created` |
| `/api/auth/login` | `POST` | `validateLogin` | Autentikasi login & generate JWT Token | `200 OK` |
| `/api/todos` | `POST` | `verifyToken`, `validateTodo` | Menambahkan Todo baru untuk user aktif | `201 Created` |
| `/api/todos` | `GET` | `verifyToken` | Mengambil seluruh daftar Todo milik user | `200 OK` |

---

## 👨‍💻 Pengembang
- **Nama**: Stanlevv
- **Mata Kuliah**: Pemrograman Web Framework (PWF)
