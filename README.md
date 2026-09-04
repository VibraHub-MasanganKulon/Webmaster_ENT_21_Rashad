# HawhoopNews - Portal Berita Modern

HawhoopNews adalah platform portal berita modern yang dibangun menggunakan **Next.js 14+ (App Router)**. Project ini dirancang untuk performa tinggi, skalabilitas, dan pengalaman pengguna yang mulus, baik bagi pembaca maupun administrator konten.

Sistem ini dilengkapi dengan panel administrasi yang aman, manajemen media terintegrasi, serta optimasi SEO untuk distribusi konten berita.

## 🚀 Tech Stack

- **Framework:** Next.js 16.3.4 (Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Vercel Postgres)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (v5 / Auth.js)
- **Storage:** Vercel Blob (untuk gambar & media)
- **Caching & Session:** Redis (Upstash) & Vercel KV
- **Validation:** Zod

---

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), atau [pnpm](https://pnpm.io/)
- Akun [Vercel](https://vercel.com/) (untuk Blob, KV, dan Postgres)
- Akun [Upstash](https://upstash.com/) (untuk Redis)

---

## ⚙️ Tahapan Instalasi

Ikuti langkah-langkah berikut untuk menyiapkan lingkungan development:

### 1. Clone Repository
```bash
git clone https://github.com/username-kamu/hawhoop-news.git
cd hawhoop-news
```
### 2. Install Dependencies
```bash
npm install
yarn install
pnpm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root directory dan salin variabel berikut. Pastikan Anda sudah membuat layanan di dashboard Vercel/Upstash untuk mendapatkan nilai-nilai ini.

```bash
# --- Database (Vercel Postgres) ---
POSTGRES_URL="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."

# --- Authentication (NextAuth) ---
AUTH_SECRET="generate-random-string-min-32-chars" # Gunakan: npx auth secret
AUTH_TRUST_HOST=true

# --- Storage (Vercel Blob) ---
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# --- Caching & Session (Redis / Upstash) ---
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# --- App Config ---
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-super-secret-jwt-key-for-admin-session"
```
### 4. Setup Database & Generate Prisma Client
Jalankan perintah berikut untuk menyesuaikan skema database dan menghasilkan client Prisma:

```bash
npx prisma generate
npx prisma db push
```

(Opsional) Jika ingin mengisi data awal (seeder):

```bash
npx prisma db seed
```

## Tahapan Menjalankan
### Development Mode
Menjalankan server development dengan Turbopack (Hot Module Replacement aktif):

```bash
npm run dev
```

Akses aplikasi di browser: http://localhost:3000
Akses Admin Panel: http://localhost:3000/admin
### Production Build
Untuk membangun dan menjalankan versi produksi secara lokal:

```bash
npm run build
npm run start
```

### Struktur Folder Utama

```bash
├── app/
│   ├── (admin)/          # Route group khusus Admin Panel
│   │   ├── admin/        # Halaman dashboard, posts, settings
│   │   └── layout.tsx    # Layout admin (Sidebar + Header)
│   ├── (public)/         # Route group untuk Publik
│   │   ├── berita/[slug] # Halaman detail berita (Dynamic Route)
│   │   └── page.tsx      # Homepage
│   ├── api/              # API Routes (Auth, Posts, Upload)
│   └── layout.tsx        # Root Layout
── components/           # UI Components (Reusable)
├── lib/                  # Utilities (Prisma, Session, Auth)
├── services/             # Business Logic & DB Queries
├── prisma/               # Schema Database & Migrations
└── public/               # Static Assets
```

### Keamanan & Fitur Admin
- Role-Based Access Control (RBAC): Hanya user dengan role super_admin yang dapat mengakses /admin/*.
- Session Management: Menggunakan HTTP-Only Cookies + JWT via Redis/KV untuk keamanan maksimal.
- Media Handling: Upload gambar langsung ke Vercel Blob dengan validasi tipe file dan ukuran.
- Input Validation: Semua input form divalidasi menggunakan Zod sebelum diproses ke database.

### 🤝 Kontribusi
Jika ingin berkontribusi, silakan buat Pull Request atau buka Issue untuk melaporkan bug atau meminta fitur baru.

## License

Project ini dibawah lisensi dari MIT License - lihat [![License: MIT](https://shields.io)](LICENSE) file untuk mengetahui lebih alnjut.



