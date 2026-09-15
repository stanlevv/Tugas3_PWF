# Tugas #5 Web Framework Developer Documentation (PWF)

Dokumentasi Pengembangan Aplikasi Fullstack Todo List berbasis **Next.js 16 (Frontend)** dan **Express.js + TypeScript + MySQL (Backend RESTful API)** dengan implementasi lengkap arsitektur MVC, Modular Routing, JWT Authentication, dan Validasi Input.

---

## 📌 Laporan Praktikum
📄 **Dokumen Laporan Tugas:**  
👉 [Laporan Tugas Praktikum Web Framework](https://docs.google.com/document/d/10vOI4pT9X870nHsNrux2StE2MLrUYKvi33bmGfsmR-4/edit?usp=sharing)

---

## 🚀 Fitur Utama Backend (Tugas #5)

### 1. Arsitektur MVC & Modular Routing
- **Routes Layer**: Pemisahan rute modular (`authRoutes.ts`, `todoRoutes.ts`, `projectRoutes.ts`) yang dihubungkan melalui `routes/index.ts`.
- **Controllers Layer**: Logika bisnis CRUD (`authController.ts`, `todoController.ts`, `projectController.ts`).
- **Models Layer**: Abstraksi database MySQL dengan *Prepared Statements* (`?`) untuk mencegah SQL Injection (`todoModel.ts`, `userModel.ts`, `projectModel.ts`).

### 2. Full CRUD RESTful API Todos
- **Create**: Menambahkan task baru (`POST /api/todos`).
- **Read**: Mengambil semua task (`GET /api/todos`) dan detail task berdasarkan ID (`GET /api/todos/:id`).
- **Update**: Memperbarui status selesai (`is_completed`) dan isi teks task (`PUT /api/todos/:id`).
- **Delete**: Menghapus task dari database (`DELETE /api/todos/:id`).

### 3. Keamanan & Middleware Terpadu
- **JWT Authentication Guard**: `verifyToken` memeriksa token Bearer pada header `Authorization` sebelum mengizinkan akses ke rute terproteksi.
- **Input Validator**: 
  - `validateRegister` & `validateLogin`: Memvalidasi kelengkapan username, email, dan password.
  - `validateTodo`: Memastikan task tidak kosong.
  - `validateUpdateTodo`: Memvalidasi tipe data `task` (string) dan `is_completed` (boolean).
- **404 Route Handler**: Menangani rute yang tidak terdaftar dengan respon JSON `{ success: false, message: "Route ... tidak ditemukan!" }`.
- **Global Error Handler**: Menangani exception server tanpa membuat aplikasi crash (`500 Internal Server Error`).

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js (v5) & Node.js
- **Bahasa**: TypeScript
- **Database**: MySQL (`todo_db`) via `mysql2/promise`
- **Keamanan**: `jsonwebtoken`, `bcrypt`
- **Runner / Watcher**: `tsx`

### Frontend
- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide/Heroicons SVG
- **Animasi**: Framer Motion

---

## 📁 Struktur Direktori Backend (`/backend`)

```text
backend/
├── node_modules/
├── src/
│   ├── config/
│   │   └── db.ts                 # MySQL Connection Pool
│   ├── controllers/
│   │   ├── authController.ts     # Register & Login Handlers
│   │   ├── projectController.ts  # Team Collaboration Handlers
│   │   └── todoController.ts     # CRUD Todo Handlers (Get, Post, Put, Delete)
│   ├── middlewares/
│   │   ├── authMiddleware.ts     # JWT Bearer Token Verification
│   │   └── validator.ts          # Input Validation Middleware
│   ├── models/
│   │   ├── projectModel.ts       # SQL Queries untuk tabel projects
│   │   ├── todoModel.ts          # SQL Queries untuk tabel todos
│   │   └── userModel.ts          # SQL Queries untuk tabel users
│   ├── routes/
│   │   ├── api.ts                # Legacy Router Bridge
│   │   ├── authRoutes.ts         # Auth Routes (/register, /login)
│   │   ├── index.ts              # Route Aggregator & Middleware Attachment
│   │   ├── projectRoutes.ts      # Team Project Routes
│   │   └── todoRoutes.ts         # Todo CRUD Routes
│   ├── app.ts                    # Express Setup, CORS, 404 & Error Handler
│   └── server.ts                 # Server Listener (Port 5000)
├── .env
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── tsconfig.json
```

---

## ⚡ Cara Menjalankan Aplikasi Lokal

### 1. Persiapan Database MySQL (Laragon / XAMPP)
Jalankan Laragon / XAMPP, lalu buat database `todo_db` di MySQL:
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

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    join_code VARCHAR(20) UNIQUE NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NULL,
    task VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);
```

### 2. Setup Environment Backend (`.env`)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=todo_db
PORT=5000
JWT_SECRET=pwf_2026_secret_key
```

### 3. Menjalankan Backend
```bash
cd backend
npm install
npm run dev
```
Backend berjalan pada **`http://localhost:5000`**.

### 4. Menjalankan Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan pada **`http://localhost:3000`**.

---

## 🌐 Daftar Endpoint REST API Backend

| Endpoint | Method | Middleware | Deskripsi | Status Respon |
| :--- | :---: | :--- | :--- | :---: |
| `/api/auth/register` | `POST` | `validateRegister` | Registrasi akun baru | `201 Created` |
| `/api/auth/login` | `POST` | `validateLogin` | Login pengguna & generate token JWT | `200 OK` |
| `/api/todos` | `GET` | `verifyToken` | Mengambil semua tugas user | `200 OK` |
| `/api/todos/:id` | `GET` | `verifyToken` | Mengambil 1 tugas berdasarkan ID | `200 OK` / `404` |
| `/api/todos` | `POST` | `verifyToken`, `validateTodo` | Menambahkan tugas baru | `201 Created` |
| `/api/todos/:id` | `PUT` | `verifyToken`, `validateUpdateTodo` | Memperbarui teks / status selesai task | `200 OK` / `404` |
| `/api/todos/:id` | `DELETE` | `verifyToken` | Menghapus tugas berdasarkan ID | `200 OK` / `404` |
| `/api/sembarang` | `ANY` | - | Penanganan rute tidak terdaftar | `404 Not Found` |

---

## 👨‍💻 Pengembang
- **Nama**: Stanlevv
- **Mata Kuliah**: Pemrograman Web Framework (PWF)

