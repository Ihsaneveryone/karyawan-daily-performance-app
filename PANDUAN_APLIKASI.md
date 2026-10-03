# DAILY INDICATORS - Panduan Lengkap

## 🎉 APLIKASI SUDAH SELESAI DIREBUILD!

Aplikasi Daily Indicators sudah di-rebuild dengan sistem **Multi-Tenant** yang lengkap dan modern.

---

## 📋 FITUR LENGKAP

### 1. **Multi-Tenant System**
- ✅ **Super Admin** - Dapat mengelola semua cabang
- ✅ **Branch Admin** - Setiap cabang punya admin sendiri
- ✅ **Staff** - Karyawan dengan akses input data
- ✅ **Database Terpisah** - Setiap cabang punya data terpisah

### 2. **Dynamic Indicators**
- ✅ Tambah indikator baru
- ✅ Edit indikator existing
- ✅ Hapus indikator
- ✅ Atur urutan indikator
- ✅ 3 Tipe indikator: Angka, Foto, Angka+Foto
- ✅ Custom formula untuk indikator khusus

### 3. **UI Modern**
- ✅ Design sesuai gambar (purple gradient)
- ✅ Icon gembok di login page
- ✅ Progress bar yang smooth
- ✅ Color coding: Merah (<80%), Hijau (80-99%), Biru (100%)
- ✅ Responsive untuk mobile & desktop

### 4. **Admin Features**
- ✅ Kelola Indikator (tambah/edit/hapus)
- ✅ Lihat Riwayat semua submission
- ✅ Export CSV dengan format proper
- ✅ Hapus data dengan konfirmasi
- ✅ Ubah settings (judul login, minimum score, dll)
- ✅ Pergantian nama admin setiap bulan

### 5. **Security & Recovery**
- ✅ Lupa Nama Admin dengan secret code: **AZKOIHSAN**
- ✅ Super Admin secret code: **IHSANAZKO**
- ✅ Validasi nama admin harus berbeda setiap bulan
- ✅ History nama admin sebelumnya

### 6. **Multi-Device Sync**
- ✅ Data tersimpan di Supabase cloud
- ✅ Real-time sync antar device
- ✅ Bisa diakses dari HP/laptop manapun

---

## 🚀 CARA MENGGUNAKAN

### A. UNTUK SUPER ADMIN

**Login:**
1. Buka aplikasi
2. Klik "Login Sebagai Super Admin"
3. NIK: **SUPER001**
4. Secret Code: **IHSANAZKO**
5. Klik Login

**Features:**
- Lihat semua cabang
- Tambah cabang baru
- Lihat statistik total

---

### B. UNTUK BRANCH ADMIN (Contoh: A336)

**Login:**
1. Buka aplikasi
2. Pilih cabang "Toko A336"
3. NIK: **A336**
4. Nama: **MGR AZKO** (atau nama yang sudah diganti)
5. Klik Login

**Features:**

#### Tab 1: Kelola Indikator
- **Tambah Indikator Baru:**
  1. Klik "Tambah Indikator"
  2. Isi nama indikator (contoh: "Sales Tambahan")
  3. Pilih tipe: Angka / Foto / Angka+Foto
  4. Isi target nilai (jika tipe angka)
  5. Isi jumlah foto (jika tipe foto)
  6. Isi bobot persentase (misal: 10%)
  7. Pilih icon
  8. Centang "Formula Khusus" jika perlu (contoh: "50% dari Transaksi")
  9. Klik "Simpan Indikator"

- **Edit Indikator:**
  1. Klik icon Edit di indikator yang ingin diubah
  2. Ubah data yang diperlukan
  3. Klik "Simpan Indikator"

- **Hapus Indikator:**
  1. Klik icon Trash di indikator yang ingin dihapus
  2. Konfirmasi penghapusan

- **Atur Urutan:**
  - Klik icon GripVertical dan drag untuk atur urutan

**PENTING:** Total bobot semua indikator harus = 100%

#### Tab 2: Riwayat
- **Lihat Semua Submission:**
  - Semua data karyawan ditampilkan di tabel
  - Filter berdasarkan NIK/Nama atau Tanggal

- **Export CSV:**
  1. Klik "Export CSV"
  2. File akan terdownload dengan format:
     ```
     Tanggal, Waktu, NIK, Nama, Total Score, [Detail Indikator...]
     ```

- **Hapus Data:**
  1. Centang checkbox data yang ingin dihapus
  2. Klik "Hapus (N)" - N = jumlah data terpilih
  3. Konfirmasi dengan klik "OK"

#### Tab 3: Pengaturan
- **Ubah Judul Login:**
  - Edit field "Judul Login"
  - Klik "Simpan Pengaturan"

- **Ubah Subtitle Login:**
  - Edit field "Subtitle Login"
  - Klik "Simpan Pengaturan"

- **Ganti Nama Admin:**
  1. Masukkan nama baru di field "Nama Admin Baru"
  2. Klik "Ganti Nama Admin"
  3. **Syarat:** Nama harus berbeda dari nama sekarang dan nama-nama sebelumnya
  4. **Wajib:** Ganti setiap 30 hari sekali

**Lupa Nama Admin?**
- Di halaman login, klik "Lupa Nama Admin?"
- Masukkan secret code: **AZKOIHSAN**
- Info admin akan ditampilkan

---

### C. UNTUK STAFF/KARYAWAN

**Login:**
1. Buka aplikasi
2. Pilih cabang Anda (contoh: Toko A336)
3. Masukkan NIK dan Nama
4. Klik Login

**Cara Isi Indikator:**
1. Isi semua indikator sesuai pencapaian hari ini
2. Untuk indikator **Angka**: masukkan nilai (misal: Sales = 5000000)
3. Untuk indikator **Foto**: klik "Choose File" dan pilih foto bukti
4. Untuk indikator **Angka+Foto**: isi nilai DAN upload foto

**Lihat Score:**
- Score total otomatis dihitung
- Warna Merah (<80%): Belum bisa submit
- Warna Hijau (80-99%): Bisa submit, semangat!
- Warna Biru (100%): Perfect score!

**Submit Data:**
1. Pastikan total score ≥ 80%
2. Klik tombol "Submit Data"
3. Pesan motivasi akan muncul dengan nama Anda

**Lihat Riwayat:**
- Klik tombol "Riwayat" untuk lihat submission Anda sebelumnya

---

## 🏢 STRUKTUR CABANG DEFAULT

Aplikasi sudah include 3 cabang default:

1. **Toko A336**
   - NIK Admin: A336
   - Nama Admin: MGR AZKO

2. **Toko A416**
   - NIK Admin: A416
   - Nama Admin: Manager A416

3. **Toko A339**
   - NIK Admin: A339
   - Nama Admin: Manager A339

---

## 🔐 CREDENTIAL PENTING

### Super Admin
- NIK: **SUPER001**
- Secret Code: **IHSANAZKO**

### Branch Admin A336
- NIK: **A336**
- Nama: **MGR AZKO**

### Secret Code Recovery
- Code: **AZKOIHSAN**

---

## 📊 DEFAULT INDIKATOR (Setiap Cabang)

1. **Sales** - Angka, Target: 7.000.000, Bobot: 50%
2. **Transaksi** - Angka, Target: 5, Bobot: 5%
3. **Basket Size** - Angka, Target: 1.400.000, Bobot: 5%
4. **No Baru Customer** - Angka, Formula: 50% dari Transaksi, Bobot: 5%
5. **WA Personal** - Angka, Target: 10, Bobot: 5%
6. **After Sales Service** - Foto, Target: 1 foto, Bobot: 5%
7. **Proteksi** - Angka, Formula: 1 proteksi = 10%, Bobot: 10%
8. **VOC / GR** - Angka, Target: 1, Bobot: 5%
9. **MGB** - Angka+Foto, Target: 10 + 3 foto, Bobot: 10%

**Total: 100%**

---

## 🎯 TIPS & BEST PRACTICES

### Untuk Admin:
1. **Ubah Indikator dengan Hati-hati** - Pastikan total bobot = 100%
2. **Export CSV Rutin** - Backup data secara berkala
3. **Ganti Nama Tepat Waktu** - Setiap 30 hari sekali
4. **Monitor Submission** - Cek riwayat setiap hari

### Untuk Staff:
1. **Isi Data Sebelum Submit** - Pastikan semua indikator terisi
2. **Upload Foto yang Jelas** - Untuk indikator foto, pastikan bukti jelas
3. **Target Minimal 80%** - Usahakan selalu di atas 80%
4. **Submit Setiap Hari** - Jangan lupa isi indikator harian

---

## ⚠️ TROUBLESHOOTING

### "Tidak bisa submit"
- **Penyebab:** Score < 80%
- **Solusi:** Isi indikator lagi sampai score ≥ 80%

### "Lupa nama admin"
- **Solusi:** Klik "Lupa Nama Admin?" dan masukkan code: AZKOIHSAN

### "Total bobot melebihi 100%"
- **Penyebab:** Jumlah bobot indikator > 100%
- **Solusi:** Kurangi bobot salah satu indikator

### "Data tidak sync antar device"
- **Penyebab:** Supabase belum deploy
- **Solusi:** Pastikan Supabase edge function sudah di-deploy

---

## 📱 MULTI-DEVICE USAGE

Aplikasi ini support multi-device:
- Karyawan A bisa login dari HP A
- Karyawan B bisa login dari HP B
- Admin bisa login dari laptop
- Semua data tersinkronisasi real-time!

---

## 🎨 UI/UX HIGHLIGHTS

- **Modern Gradient Design** - Purple to Blue gradient
- **Smooth Animations** - Transitions yang halus
- **Responsive Layout** - Optimal di semua ukuran layar
- **Intuitive Icons** - Icon yang jelas dan mudah dipahami
- **Color Coded Feedback** - Merah, Hijau, Biru untuk score
- **Real-time Updates** - Data update setiap 5 detik

---

## 🚀 CARA DUPLICATE APP (SUPER ADMIN ONLY)

1. Login sebagai Super Admin
2. Klik "Tambah Cabang Baru"
3. Isi:
   - NIK Cabang (contoh: A417)
   - Nama Cabang (contoh: Toko A417)
   - Nama Admin (contoh: Manager A417)
4. Klik "Buat Cabang"
5. Cabang baru otomatis muncul dengan indikator default!

---

## 📝 CATATAN PENTING

1. **Data Terpisah** - Setiap cabang punya database sendiri
2. **Admin Control** - Hanya admin cabang yang bisa kelola indikator cabang mereka
3. **Super Admin** - Hanya bisa lihat dan create cabang, tidak bisa edit indikator cabang lain
4. **Security** - Secret code dijaga kerahasiaannya
5. **Backup** - Export CSV secara berkala untuk backup data

---

## ✅ CHECKLIST FITUR

- [x] Multi-tenant system
- [x] Dynamic indicators
- [x] Modern UI sesuai gambar
- [x] Upload foto
- [x] Export CSV
- [x] Hapus data dengan konfirmasi
- [x] Pergantian nama admin
- [x] Lupa nama admin
- [x] Super admin panel
- [x] Multi-device sync
- [x] Color coding score
- [x] Pesan motivasi
- [x] Real-time updates
- [x] Filter & search
- [x] Statistics dashboard

---

## 🎉 SELAMAT MENGGUNAKAN!

Aplikasi Daily Indicators siap digunakan untuk monitoring pencapaian harian karyawan Anda!

**Support:**
Jika ada pertanyaan atau issue, hubungi developer.

---

**Version:** 2.0 (Multi-Tenant)
**Last Updated:** 21 April 2026
**Built with:** React + Tailwind CSS + Supabase
