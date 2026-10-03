# ⚠️ PENTING - BACA INI SEBELUM MENGGUNAKAN APLIKASI!

## 🔴 WAJIB DEPLOY SUPABASE EDGE FUNCTION!

Sebelum aplikasi bisa digunakan dengan benar, Anda **HARUS** deploy Supabase Edge Function terlebih dahulu!

### Cara Deploy:

1. **Buka Make settings page** (klik icon ⚙️ di aplikasi Make)
2. **Scroll ke section "Supabase"**
3. **Klik tombol "Deploy Edge Function"** atau **"Sync to Supabase"**
4. **Tunggu sampai selesai** (~10-20 detik)
5. **Refresh aplikasi**

### Kenapa Harus Deploy?

Backend API sudah di-update dengan fitur-fitur baru:
- ✅ Endpoint DELETE untuk hapus cabang/toko
- ✅ Endpoint UPDATE untuk edit info cabang
- ✅ Endpoint Template untuk Super Admin
- ✅ Support tipe indikator baru (text, dropdown, checkbox)

Jika **TIDAK** deploy, maka:
- ❌ Fitur hapus toko TIDAK akan berfungsi
- ❌ Fitur edit info toko TIDAK akan berfungsi  
- ❌ Template indikator Super Admin TIDAK akan berfungsi
- ❌ Tipe indikator baru (text, dropdown, checkbox) TIDAK akan berfungsi

---

## 📋 MASALAH YANG SUDAH DIPERBAIKI:

### 1. ✅ Logo AZKO Tidak Muncul (FIXED)
**Masalah:** Path logo lokal `/src/imports/image-6.png` tidak bekerja saat publish

**Solusi:** Logo sekarang menggunakan URL external `https://i.ibb.co/r5ZYqKX/azko-logo.png`

**Cara Ganti Logo:**
Jika ingin pakai logo Anda sendiri:
1. Upload logo AZKO ke image hosting (contoh: imgur.com, imgbb.com)
2. Copy URL gambar
3. Edit file `src/app/components/BranchSelector.tsx`
4. Ganti URL di line:
   ```tsx
   <img src="URL_LOGO_ANDA_DISINI" alt="AZKO Logo" />
   ```

### 2. ✅ Fitur Hapus Toko (FIXED)
**Masalah:** Super Admin tidak bisa hapus cabang/toko

**Penyebab:** Backend endpoint DELETE belum di-deploy

**Solusi:**
- Backend endpoint sudah dibuat
- **DEPLOY SUPABASE EDGE FUNCTION** (lihat cara di atas)

**Cara Pakai:**
1. Login sebagai Super Admin (NIK: SUPER001, Code: IHSANAZKO)
2. Tab "Kelola Cabang"
3. Klik icon **Trash** di cabang yang ingin dihapus
4. Konfirmasi penghapusan
5. Cabang dan semua datanya akan terhapus permanent

### 3. ✅ Export Excel dengan Foto (FIXED & IMPLEMENTED!)
**Fitur Baru:** Export riwayat submission ke Excel dengan foto yang diinput karyawan embedded di file Excel!

**Library yang Diinstall:** `exceljs` v4.4.0

**Cara Pakai:**
1. Login sebagai Admin Cabang
2. Tab "Riwayat"
3. Klik tombol **"Export Excel + Foto"** (tombol hijau)
4. Tunggu proses export (beberapa detik, tergantung jumlah data & foto)
5. File Excel akan otomatis terdownload

**Format File Excel:**
- Header berwarna merah AZKO
- Kolom: No, Tanggal, Waktu, NIK, Nama, Total Score, [Indikator 1], [Indikator 2], dst...
- Foto karyawan otomatis embed di kolom indikator yang tipe-nya Photo/Angka+Photo
- Ukuran foto: 60x60 pixels
- Row height otomatis disesuaikan (80px)

**Catatan:**
- Hanya foto pertama yang di-embed untuk setiap indikator
- Jika ada masalah dengan foto, foto akan di-skip (tidak crash)
- Tetap ada tombol "Export CSV" untuk export tanpa foto (lebih cepat)

---

## 🆕 FITUR-FITUR YANG SUDAH DITAMBAHKAN:

### Super Admin:
✅ Tambah cabang baru
✅ Edit info cabang (nama display, nama lengkap, admin, logo)
✅ Hapus cabang (permanent delete semua data)
✅ Lihat detail average pencapaian per cabang
✅ Tab Ranking - Lihat ranking semua cabang
✅ Tab Template - Edit template indikator default untuk cabang baru

### Admin Panel:
✅ Kelola indikator: tambah/edit/hapus/reorder
✅ 6 tipe indikator: Angka, Foto, Angka+Foto, Text, Dropdown, Checkbox
✅ Ubah batasan persentase submit (default 80%)
✅ Export CSV (cepat, tanpa foto)
✅ **Export Excel dengan foto embedded** (NEW!)
✅ Hapus data submission dengan konfirmasi
✅ Filter riwayat by NIK/Nama/Tanggal

### Staff Dashboard:
✅ Form otomatis menyesuaikan tipe indikator
✅ Upload foto untuk indikator Photo/Angka+Photo
✅ Input text untuk indikator Text
✅ Dropdown untuk indikator Dropdown
✅ Checkbox untuk indikator Checkbox
✅ Perhitungan score otomatis semua tipe

### Design:
✅ Warna merah AZKO di semua halaman
✅ Logo AZKO di halaman pilih cabang
✅ Gradient merah-orange modern
✅ Progress bar smooth

---

## 🔐 CREDENTIAL:

### Super Admin:
- NIK: **SUPER001**
- Secret Code: **IHSANAZKO**

### Admin Cabang A336:
- NIK: **A336**
- Nama: **MGR AZKO**

### Lupa Nama Admin:
- Secret Code: **AZKOIHSAN**

---

## ⚠️ CHECKLIST SEBELUM PAKAI APLIKASI:

- [ ] Deploy Supabase Edge Function (WAJIB!)
- [ ] Test login sebagai Super Admin
- [ ] Test hapus cabang (buat dummy dulu)
- [ ] Test export Excel dengan foto
- [ ] Test semua tipe indikator (tambah indikator text/dropdown/checkbox)

---

## 🐛 JIKA ADA BUG/ERROR:

1. **Cek Console Browser** (F12 → Console) - lihat error message
2. **Deploy Supabase** - 90% masalah karena belum deploy
3. **Clear Cache Browser** - Ctrl+Shift+R (hard refresh)
4. **Cek Network Tab** - Pastikan API call ke Supabase berhasil (status 200)

---

## 📞 SUPPORT:

Jika masih ada masalah atau butuh fitur tambahan, hubungi developer!

---

**Last Updated:** 21 April 2026
**Version:** 3.0 (Multi-Tenant + Excel Export)
