# 🎯 MULAI DISINI!

## 📦 APA YANG SUDAH SIAP

Aplikasi Crown Daily Indicators sekarang menggunakan **Google Sheets API** untuk multi-device sync yang **100% GRATIS!**

Semua file sudah disiapkan, tinggal ikuti langkah setup!

---

## 🚀 LANGKAH SETUP (15 MENIT)

### **📖 BACA FILE INI:**

📄 **`SETUP_LENGKAP.md`** ← **MULAI DI SINI!**

File ini berisi panduan lengkap step-by-step dari NOL sampai aplikasi JALAN!

---

## 📁 FILE-FILE PENTING

### **1. Template Google Sheets** 📊
Folder: `google-sheets-template/`

Berisi 5 CSV files siap import:
- ✅ `branches.csv` - 5 cabang (A336, A416, A339, A123, A456)
- ✅ `indicators.csv` - 24 indicators lengkap!
- ✅ `settings.csv` - Settings untuk semua cabang
- ✅ `submissions.csv` - Empty (akan terisi otomatis)
- ✅ `users.csv` - Empty (akan terisi otomatis)

**Cara pakai:** Lihat `google-sheets-template/README_IMPORT.md`

---

### **2. Dokumentasi** 📚

**Main Guides:**
- 📄 `SETUP_LENGKAP.md` ← **BACA INI DULU!** (Setup lengkap 15 menit)
- 📄 `QUICK_START_GOOGLE_SHEETS.md` - Quick start (10 menit)
- 📄 `GOOGLE_SHEETS_SETUP.md` - Full documentation

**Import Guide:**
- 📄 `google-sheets-template/README_IMPORT.md` - Cara import CSV

**Old Docs (Reference):**
- 📄 `FALLBACK_MODE_ENABLED.md` - localStorage mode (deprecated)
- 📄 `FITUR_UPLOAD_FOTO_INDIVIDUAL.md` - Photo upload features
- 📄 `FITUR_REFRESH_RIWAYAT.md` - Refresh features
- 📄 `FIX_WAKTU_DAN_HISTORY.md` - Timestamp & history fixes

---

### **3. Files Setup** ⚙️

**Environment:**
- `.env.example` - Template untuk API key
- `.env` - **YOU CREATE THIS!** Copy dari `.env.example`

**Code:**
- `src/app/utils/googleSheets.ts` - Google Sheets utility functions
- `src/app/utils/api.ts` - Updated API layer (Google Sheets integration)
- `src/app/utils/api_backup.ts` - Backup (old Supabase version)

---

## ✅ QUICK CHECKLIST

Setup berhasil jika sudah:

### **Part 1: Google Sheets**
- [ ] Create Google Spreadsheet
- [ ] Import 5 CSV files dari folder `google-sheets-template/`
- [ ] Verify data (branches: 5 rows, indicators: 24 rows)
- [ ] Share spreadsheet (Anyone with link → Editor)
- [ ] Copy Spreadsheet ID

### **Part 2: Google Cloud**
- [ ] Create Google Cloud Project
- [ ] Enable Google Sheets API
- [ ] Create API Key
- [ ] Copy API Key

### **Part 3: Aplikasi**
- [ ] Create `.env` file (copy from `.env.example`)
- [ ] Paste API Key & Spreadsheet ID ke `.env`
- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`

### **Part 4: Test**
- [ ] Buka `http://localhost:5173`
- [ ] Console log: "Google Sheets API connected" ✅
- [ ] Login ke branch A336
- [ ] Indicators muncul (8 indicators)
- [ ] Submit data
- [ ] Data muncul di Google Sheets tab "submissions"
- [ ] Test di device lain - data sync! 🎉

---

## 🎯 LANGKAH CEPAT (TL;DR)

**Jika mau cepat:**

1. **Buka:** `SETUP_LENGKAP.md`
2. **Ikuti:** Step 1-4 (15 menit)
3. **Done!** Aplikasi jalan dengan multi-device sync!

---

## 💡 FITUR YANG JALAN

✅ **Multi-device sync** - Submit di HP, lihat di laptop!
✅ **5 cabang siap pakai** - A336, A416, A339, A123, A456
✅ **24 indicators** - Number & photo types
✅ **Photo upload** - Individual buttons (1 button = 1 foto)
✅ **Auto-compress** - Foto auto-compress sebelum upload
✅ **History filter** - Per user NIK
✅ **Refresh data** - Manual refresh button
✅ **100% GRATIS** - No quota, no payment!
✅ **Data visible** - Cek langsung di Google Sheets
✅ **Export Excel** - Download dari Google Sheets

---

## 🆘 BUTUH BANTUAN?

### **Error saat setup?**
Lihat section **TROUBLESHOOTING** di `SETUP_LENGKAP.md`

### **Cara import CSV?**
Lihat `google-sheets-template/README_IMPORT.md`

### **Cara customize indicators?**
Edit langsung di Google Sheets tab "indicators"

### **Cara tambah branch baru?**
Tambah row di Google Sheets tabs: branches, indicators, settings

---

## 📊 DATA TEMPLATE

**5 Branches:**
- A336 (8 indicators) - Toko A336
- A416 (5 indicators) - Toko A416
- A339 (5 indicators) - Toko A339
- A123 (3 indicators) - Toko A123
- A456 (3 indicators) - Toko A456

**Indicators:**
- Sales, Transaksi, Customer Baru (number type)
- MGB (3 foto), Display Toko (2 foto), Kebersihan (1 foto) (photo type)
- Produk Baru, Promo Active (number type)

**Total: 24 indicators siap pakai!**

---

## 🚀 NEXT STEPS

Setelah setup lokal berhasil:

1. **Deploy ke production:**
   - Vercel (recommended, gratis!)
   - Netlify (gratis)
   - Firebase Hosting (gratis)

2. **Setup environment variables di hosting:**
   - Add VITE_GOOGLE_SHEETS_API_KEY
   - Add VITE_GOOGLE_SHEETS_SPREADSHEET_ID

3. **Test di production:**
   - Akses dari HP & laptop
   - Submit data
   - Verify multi-device sync!

4. **Customize:**
   - Edit indicators di Google Sheets
   - Tambah branches
   - Edit settings

---

## ⚡ KEUNTUNGAN GOOGLE SHEETS

Dibanding localStorage (old version):

| Feature | localStorage | Google Sheets |
|---------|-------------|---------------|
| **Multi-device** | ❌ No | ✅ Yes |
| **Data persistence** | ❌ Clear browser = data hilang | ✅ Aman di cloud |
| **Sync real-time** | ❌ No | ✅ Yes |
| **Data visible** | ❌ Hidden | ✅ Lihat di spreadsheet |
| **Export Excel** | ❌ No | ✅ Yes |
| **Backup** | ❌ Manual | ✅ Auto by Google |
| **Cost** | ✅ Free | ✅ Free |
| **Quota** | ❌ Limited | ✅ Unlimited* |

*Unlimited untuk practical use (10M cells, 500 req/100s)

---

## 🎉 READY!

**Semua sudah siap, tinggal:**

1. Buka `SETUP_LENGKAP.md`
2. Follow step 1-4
3. Aplikasi jalan!

**Good luck! 🚀**

---

Updated: 2026-05-09
Version: 1.0 - Production Ready with Google Sheets!
