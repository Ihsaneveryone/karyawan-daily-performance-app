# 🚀 SETUP LENGKAP - MULAI DARI NOL SAMPAI JALAN!

## ⏱️ Total Waktu: 15 MENIT

Panduan ini akan setup aplikasi dari nol sampai jalan dengan multi-device sync!

---

## 📦 YANG ANDA PERLUKAN

✅ Google Account (gratis)
✅ Browser (Chrome/Firefox/Safari)
✅ 15 menit waktu luang

**TIDAK PERLU:**
❌ Credit card
❌ Bayar apa-apa
❌ Server setup
❌ Database knowledge

---

## 🎯 STEP-BY-STEP SETUP

### **PART 1: GOOGLE SHEETS SETUP (7 menit)**

#### **Step 1.1: Create Google Spreadsheet** (1 menit)

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"+ Blank"** (create new spreadsheet)
3. **Rename** spreadsheet (top left):
   - Klik "Untitled spreadsheet"
   - Ketik: **"Crown Daily Indicators"**
   - Tekan Enter

#### **Step 1.2: Import Template Data** (5 menit)

**Download CSV files dari folder:** `google-sheets-template/`

Ada 5 files:
- `branches.csv` (5 cabang)
- `indicators.csv` (24 indicators)
- `settings.csv` (settings)
- `submissions.csv` (kosong, akan terisi otomatis)
- `users.csv` (kosong, akan terisi otomatis)

**Import ke Google Sheets:**

**A. Import branches**
1. Di spreadsheet, klik tab **"Sheet1"** (bottom)
2. Right-click tab → **"Rename"** → ketik: `branches` → Enter
3. Menu **"File"** → **"Import"**
4. Tab **"Upload"** → **"Select a file from your device"**
5. Pilih: **`branches.csv`**
6. Settings:
   - Import location: **"Replace current sheet"**
   - Separator type: **"Comma"**
   - ✅ Convert text to numbers
7. Klik **"Import data"**
8. ✅ Sheet "branches" sekarang ada 6 rows (header + 5 data)!

**B. Import indicators**
1. Klik **"+"** icon (bottom left - add new sheet)
2. Rename sheet baru: `indicators`
3. Menu File → Import → Upload: **`indicators.csv`**
4. Replace current sheet → Import
5. ✅ Sheet "indicators" sekarang ada 25 rows (header + 24 data)!

**C. Import settings**
1. Add new sheet (+) → Rename: `settings`
2. File → Import → Upload: **`settings.csv`**
3. Replace current sheet → Import
4. ✅ Done!

**D. Import submissions**
1. Add new sheet (+) → Rename: `submissions`
2. File → Import → Upload: **`submissions.csv`**
3. Replace current sheet → Import
4. ✅ Done! (Hanya header, data akan muncul saat user submit)

**E. Import users**
1. Add new sheet (+) → Rename: `users`
2. File → Import → Upload: **`users.csv`**
3. Replace current sheet → Import
4. ✅ Done!

**VERIFY:** Spreadsheet sekarang punya 5 tabs (branches, indicators, settings, submissions, users)

#### **Step 1.3: Share Spreadsheet** (30 detik)

**PENTING!** Spreadsheet harus di-share agar API bisa akses!

1. Klik button **"Share"** (top right, warna biru)
2. Klik **"Change to anyone with the link"**
3. **Permission:** Pilih **"Editor"** (JANGAN "Viewer"!)
4. Klik **"Done"**

#### **Step 1.4: Copy Spreadsheet ID** (30 detik)

Lihat URL spreadsheet di browser:
```
https://docs.google.com/spreadsheets/d/1ABC123XYZ456-AbCdEfGh/edit#gid=0
```

**Spreadsheet ID** adalah bagian setelah `/d/` dan sebelum `/edit`:
```
1ABC123XYZ456-AbCdEfGh  ← INI SPREADSHEET ID NYA!
```

**COPY ID ini!** Simpan di notepad sementara.

---

### **PART 2: GOOGLE CLOUD API SETUP (5 menit)**

#### **Step 2.1: Create Google Cloud Project** (2 menit)

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Login dengan Google Account yang sama
3. Klik **"Select a project"** (top bar)
4. Klik **"NEW PROJECT"**
5. **Project name:** Ketik: `Crown Indicators`
6. **Location:** Organization: No organization (default OK)
7. Klik **"CREATE"**
8. Tunggu ~30 detik sampai notification "Project created"
9. Klik notification → **"SELECT PROJECT"**

#### **Step 2.2: Enable Google Sheets API** (1 menit)

1. Di Google Cloud Console, klik **☰** menu (top left)
2. Pilih **"APIs & Services"** → **"Library"**
3. Search box (top): Ketik: `Google Sheets API`
4. Klik **"Google Sheets API"** (first result)
5. Klik **"ENABLE"** (blue button)
6. Tunggu ~10 detik sampai enabled

#### **Step 2.3: Create API Key** (2 menit)

1. Menu ☰ → **"APIs & Services"** → **"Credentials"**
2. Klik **"+ CREATE CREDENTIALS"** (top)
3. Pilih **"API key"**
4. **API key created!** Popup muncul dengan API key:
   ```
   AIzaSyABC123def456GHI789...
   ```
5. **COPY API Key!** Klik tombol copy atau select all + Ctrl+C
6. Simpan di notepad (temporary)
7. Klik **"CLOSE"** (jangan klik "Restrict key" dulu - nanti saja)

**DONE!** API key sudah siap!

---

### **PART 3: APLIKASI SETUP (3 menit)**

#### **Step 3.1: Create .env File** (1 menit)

Di root folder project, copy file `.env.example` jadi `.env`:

**Windows:**
```bash
copy .env.example .env
```

**Mac/Linux:**
```bash
cp .env.example .env
```

Atau **create manual:** Buat file baru bernama `.env` di root folder.

#### **Step 3.2: Edit .env File** (1 menit)

Buka file `.env` dengan text editor (Notepad/VS Code/dll).

Isi dengan API key dan Spreadsheet ID yang tadi dicopy:

```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyABC123def456GHI789...
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1ABC123XYZ456-AbCdEfGh
```

**PENTING:**
- Ganti `AIzaSyABC123...` dengan API key ANDA
- Ganti `1ABC123...` dengan Spreadsheet ID ANDA
- NO SPACE sebelum/sesudah `=`
- NO QUOTES (`""`) di value

**Save file!** (Ctrl+S)

#### **Step 3.3: Install Dependencies** (1 menit - jika belum)

```bash
npm install
```

Tunggu sampai selesai (~1-2 menit first time).

---

### **PART 4: TEST & VERIFY! (2 menit)**

#### **Step 4.1: Start Dev Server**

```bash
npm run dev
```

Tunggu sampai muncul:
```
Local: http://localhost:5173/
```

#### **Step 4.2: Buka Aplikasi**

1. Buka browser
2. Go to: `http://localhost:5173`
3. **Buka Browser Console** (tekan F12)
4. Lihat console, harus ada log:
   ```
   ✅ Google Sheets API connected successfully!
   📊 Spreadsheet: https://docs.google.com/spreadsheets/d/...
   ```

**Jika ada error:** Cek troubleshooting di bawah!

#### **Step 4.3: Test Login & Indicators**

1. **Pilih Branch:** Klik **A336** (atau branch lain)
2. **Login:**
   - NIK: `191924` (atau NIK apa saja!)
   - Nama: `Test User` (atau nama anda)
   - Klik **"Login"**
3. **Cek Indicators:**
   - Harus muncul 8 indicators untuk A336:
     - Sales
     - Transaksi
     - MGB (3 Foto)
     - Customer Baru
     - Produk Baru
     - Promo Active
     - Display Toko (2 Foto)
     - Kebersihan (1 Foto)

**✅ SUKSES!** Jika indicators muncul, setup BERHASIL!

#### **Step 4.4: Test Submit Data**

1. **Isi indicators:**
   - Sales: `105000000`
   - Transaksi: `1050`
   - MGB: Upload 3 foto (click 3 button, upload 1-1)
   - Customer: `55`
   - dst...

2. **Klik "Submit"**

3. **Cek di Google Sheets:**
   - Buka spreadsheet di browser lain/tab baru
   - Klik tab **"submissions"**
   - **Harus ada row baru** dengan data yang baru disubmit!

**✅ MULTI-DEVICE SYNC JALAN!**

#### **Step 4.5: Test Multi-Device**

1. **Buka di device lain** (HP, atau incognito window di laptop)
2. Go to: `http://localhost:5173` (atau deploy URL jika sudah deploy)
3. Login dengan NIK SAMA: `191924`
4. Klik **"Riwayat"**
5. **Data submission dari sebelumnya harus MUNCUL!**

**🎉 SELESAI! MULTI-DEVICE SYNC BERHASIL!**

---

## 🐛 TROUBLESHOOTING

### **❌ Error: "API key not valid"**

**Penyebab:**
- API key salah
- Google Sheets API belum di-enable

**Fix:**
1. Cek `.env` file, pastikan API key benar (no space, no quotes)
2. Cek Google Cloud Console → APIs & Services → Library
3. Pastikan **Google Sheets API** status: **Enabled**

---

### **❌ Error: "The caller does not have permission"**

**Penyebab:**
- Spreadsheet belum di-share
- Permission bukan "Editor"

**Fix:**
1. Buka spreadsheet
2. Klik **"Share"**
3. Pastikan: **"Anyone with the link"** → **"Editor"**
4. Hard refresh aplikasi (Ctrl+Shift+R)

---

### **❌ Indicators tidak muncul**

**Penyebab:**
- Data belum di-import ke Google Sheets
- BranchId tidak match

**Fix:**
1. Buka spreadsheet → Tab "indicators"
2. Pastikan ada data untuk branchId `A336`
3. Cek kolom `branchId` exact: `A336` (case-sensitive!)
4. Hard refresh app (Ctrl+Shift+R)

---

### **❌ Submissions tidak tersimpan**

**Penyebab:**
- Spreadsheet permission "Viewer" (harus "Editor")
- API key restricted (belum support write)

**Fix:**
1. Spreadsheet → Share → Permission: **"Editor"**
2. Google Cloud → Credentials → Unrestrict API key (untuk testing)
3. Clear cache & retry submit

---

### **❌ Foto tidak muncul / error upload**

**Penyebab:**
- File terlalu besar
- Format tidak supported

**Fix:**
- App auto-compress foto ke 800px & quality 70%
- Jika tetap error, compress manual dulu sebelum upload
- Format supported: JPG, PNG, GIF

---

## 📊 DATA TEMPLATE YANG SUDAH ADA

### **5 Branches (Cabang):**
- **A336** - Toko A336 (Admin: MGR AZKO) - 8 indicators
- **A416** - Toko A416 (Admin: Manager A416) - 5 indicators
- **A339** - Toko A339 (Admin: Manager A339) - 5 indicators
- **A123** - Toko A123 (Admin: Manager A123) - 3 indicators
- **A456** - Toko A456 (Admin: Manager A456) - 3 indicators

### **Total: 24 Indicators Siap Pakai!**

Indicators include:
- Number type: Sales, Transaksi, Customer Baru, Produk Baru, Promo Active
- Photo type: MGB (3 foto), Display Toko (2 foto), Kebersihan (1 foto)

---

## 🎨 CUSTOMIZE

### **Tambah Branch Baru**

1. Buka Google Sheets
2. Tab **"branches"** → Add row baru:
   ```
   A789	A789	Toko A789	Manager A789	2026-05-09T10:00:00Z	
   ```
3. Tab **"indicators"** → Add indicators untuk A789
4. Tab **"settings"** → Add settings untuk A789
5. **Done!** Hard refresh app, branch A789 muncul!

### **Edit Target Indicators**

1. Tab **"indicators"**
2. Edit kolom `targetValue`:
   ```
   A336	sales	Sales	number	150000000  ← Ubah target
   ```
3. Save (auto-save by Google)
4. Hard refresh app → Target berubah!

---

## 🚀 NEXT STEPS

### **Deploy ke Production**

Aplikasi siap di-deploy ke:
- **Vercel** (gratis, recommended!)
- **Netlify** (gratis)
- **Firebase Hosting** (gratis)

**Setup .env di hosting:**
- Vercel: Settings → Environment Variables
- Netlify: Site settings → Build & deploy → Environment
- Firebase: Firebase console → Project settings

### **Backup Data**

Google Sheets auto-backup, tapi bisa manual:
- File → Make a copy (weekly backup)
- File → Download → Excel (for offline backup)

### **Analytics**

Di Google Sheets, bisa:
- Create charts untuk trend analysis
- Conditional formatting untuk highlight scores
- Filter & sort data
- Export to Excel untuk advanced analysis

---

## ✅ CHECKLIST FINAL

Setup berhasil jika:

- [ ] ✅ Spreadsheet punya 5 tabs (branches, indicators, settings, submissions, users)
- [ ] ✅ Data di-import (branches: 5 rows, indicators: 24 rows)
- [ ] ✅ Spreadsheet di-share (Anyone with link → Editor)
- [ ] ✅ API key created & copied
- [ ] ✅ `.env` file created dengan API key & Spreadsheet ID
- [ ] ✅ App jalan di localhost (console log: "Google Sheets API connected")
- [ ] ✅ Login berhasil, indicators muncul
- [ ] ✅ Submit data berhasil, data muncul di Google Sheets tab "submissions"
- [ ] ✅ Multi-device sync jalan (data sync antar device)

---

## 🎉 SELESAI!

**Aplikasi sekarang:**
- ✅ 100% GRATIS
- ✅ Multi-device sync
- ✅ Data aman di Google Sheets
- ✅ 5 cabang siap pakai
- ✅ 24 indicators aktif
- ✅ Photo upload support
- ✅ Export to Excel ready

**Siap production!**

---

**Need help?** Lihat dokumentasi lengkap:
- `QUICK_START_GOOGLE_SHEETS.md` - Quick setup guide
- `GOOGLE_SHEETS_SETUP.md` - Full documentation
- `google-sheets-template/README_IMPORT.md` - Import guide

Updated: 2026-05-09
Version: 1.0 - Production Ready!
