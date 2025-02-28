# Aplikasi OSS Data Wilayah Indonesia

## 📌Deskripsi
Aplikasi ini merupakan aplikasi berbasis web yang menampilkan data wilayah Indonesia dari database PostgreSQL. Aplikasi ini dibangun menggunakan Nuxt.js di frontend dan Node.js (Express.js) di backend dengan PostgreSQL sebagai database.

## Fitur Utama
1. Filter Data:
   - Filter provinsi di halaman utama.
   - Filter kabupaten/kota dan kecamatan di halaman kecamatan.
2. Paginasi:
   - Navigasi antar halaman dengan tombol **Prev** dan **Next**.
3. Export Data:
   - **Exposrt PDF** daftar kecamatan dalam suatu kabupaten/kota.
   - **Export CSV** daftar kecamatan dalam suatu kabupaten/kota.
4. Routing Halaman:
   - **Halaman Utama** menampilkan daftar provinsi, kabupaten/kota, dan kecamatan.
   - **Halaman Kecamatan** menampilkan daftar kecamatan berdasarkan kabupaten/kota yang dipilih.

## Teknologi yang Digunakan
### Frontend
- Framework: Nuxt.js
- Library Tambahan:
  - [jsPDF](https://www.npmjs.com/package/jspdf) untuk ekspor data ke PDF.
  - [PapaParse](https://www.papaparse.com/) untuk ekspor data ke CSV.
### Backend
- Framework: Node.js (Express.js)
- Database: PostgreSQL

## Cara Menjalankan Aplikasi
### 1. Menjalankan Backend
1. Instalasi Dependencies
```
cd backend
npm install
```
2. Konfigurasi database di `.env`:
```
DATABASE_URL=postgres://username:password@localhost:PORT/Your_DB
```
3. Jalankan server backend:
```
npm start
```
server akan berjalan di `http://localhost:5001/api/regions`

### 2. Menjalankan Frontend
1. Instalasi Dependencies
```
cd frontend
npm install
```
2. Jalankan server frontend
```
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`

## Cara Push ke Repository Git
1. Inisialisasi Git (jika belum ada)
```
git init
```
2. Tambahkan file ke staging area
```
git add .
```
3. Tambahkan remote repository (jika belum ada)
```
git remote add origin https://github.com/mhrnaelissa/web-oss
```
4. Push ke repository GitHub
```
git push -u origin main
```



