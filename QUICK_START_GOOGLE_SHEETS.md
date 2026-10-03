# 🚀 QUICK START - Google Sheets Integration

## ⏱️ Setup dalam 10 MENIT!

### ✅ STEP 1: Buat Google Spreadsheet (2 menit)

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"+ Blank"**
3. Rename: **"Crown Daily Indicators"**
4. Buat **5 tabs/sheets** dengan nama EXACT:
   - `branches`
   - `indicators`
   - `submissions`
   - `settings`
   - `users`

### ✅ STEP 2: Setup Headers (2 menit)

Copy-paste headers ini ke **row 1** setiap sheet:

**Sheet: branches**
```
id	nik	name	adminName	createdAt	logo
```

**Sheet: indicators**
```
branchId	id	name	type	targetValue	targetPhotos	weight	icon	createdAt
```

**Sheet: submissions**
```
id	branchId	userNik	userName	date	createdAt	totalScore	data	photos	notes
```

**Sheet: settings**
```
branchId	loginTitle	loginSubtitle	minScore	createdAt	updatedAt
```

**Sheet: users**
```
nik	nama	branchId	createdAt	lastLogin
```

### ✅ STEP 3: Populate Sample Data (1 menit)

**Sheet: branches** (row 2)
```
A336	A336	Toko A336	MGR AZKO	2026-05-09T10:00:00Z	
```

**Sheet: indicators** (row 2-5)
```
A336	sales	Sales	number	100000000		20	DollarSign	2026-05-09T10:00:00Z
A336	transaksi	Transaksi	number	1000		15	ShoppingCart	2026-05-09T10:00:00Z
A336	mgb	MGB	photo		3	15	Camera	2026-05-09T10:00:00Z
A336	customer	Customer Baru	number	50		10	Users	2026-05-09T10:00:00Z
```

**Sheet: settings** (row 2)
```
A336	CROWN DAILY INDICATORS	Silakan masuk dengan NIK Anda	80	2026-05-09T10:00:00Z	2026-05-09T10:00:00Z
```

### ✅ STEP 4: Share Spreadsheet (30 detik)

1. Klik **"Share"** (pojok kanan atas)
2. Klik **"Change to anyone with the link"**
3. Set: **"Editor"** (biar bisa write!)
4. Klik **"Done"**
5. **Copy URL spreadsheet**
   ```
   Example: https://docs.google.com/spreadsheets/d/1ABC123XYZ456/edit
   ```
6. **Extract Spreadsheet ID**:
   ```
   Spreadsheet ID: 1ABC123XYZ456
   ```
   (bagian setelah `/d/` dan sebelum `/edit`)

### ✅ STEP 5: Get Google API Key (3 menit)

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **"Select a project"** → **"New Project"**
3. Nama: **"Crown Indicators"**
4. Klik **"Create"**
5. Tunggu project created (~30 detik)
6. Menu (☰) → **"APIs & Services"** → **"Library"**
7. Search: **"Google Sheets API"**
8. Klik **"Enable"**
9. Menu → **"APIs & Services"** → **"Credentials"**
10. Klik **"+ Create Credentials"** → **"API Key"**
11. **COPY API Key** (contoh: `AIzaSyABC123...`)
12. Klik **"Close"**

### ✅ STEP 6: Setup di Aplikasi (1 menit)

1. Copy file `.env.example` jadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env`, paste API Key dan Spreadsheet ID:
   ```env
   VITE_GOOGLE_SHEETS_API_KEY=AIzaSyABC123def456...
   VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1ABC123XYZ456
   ```

3. Save file!

### ✅ STEP 7: Test! (1 menit)

1. **Restart dev server**:
   ```bash
   npm run dev
   ```

2. **Buka browser console** (F12)

3. **Lihat log**:
   ```
   ✅ Google Sheets API connected successfully!
   📊 Spreadsheet: https://docs.google.com/spreadsheets/d/...
   ```

4. **Test aplikasi**:
   - Pilih branch A336
   - Login dengan NIK: `191924`, Nama: `Test User`
   - **Indicators harus muncul!** (Sales, Transaksi, MGB, Customer)
   - Isi data & submit
   - **Cek Google Sheets tab "submissions"** - data harus muncul!

5. **Test multi-device**:
   - Buka di HP (atau incognito window)
   - Login dengan NIK sama
   - Data dari submit sebelumnya **HARUS MUNCUL!**

---

## 🎉 SELESAI!

Aplikasi sekarang:
- ✅ **100% GRATIS** (no cost!)
- ✅ **Multi-device sync** (submit di HP, lihat di laptop!)
- ✅ **Data tersimpan di Google Sheets** (aman & bisa export Excel!)
- ✅ **Semua fitur jalan** (indicators, photo upload, history!)

---

## 🐛 TROUBLESHOOTING

### Error: "API key not valid"
**Fix:**
- Cek API key benar di `.env`
- Pastikan Google Sheets API sudah **Enabled** di Google Cloud Console

### Error: "The caller does not have permission"
**Fix:**
- Pastikan spreadsheet sudah **Share → Anyone with link → Editor**
- Jangan set ke "Viewer", harus **"Editor"**!

### Indicators tidak muncul
**Fix:**
- Cek sheet "indicators" ada data untuk branchId `A336`
- Cek kolom `branchId` exact match (case-sensitive!)
- Hard refresh browser (Ctrl+Shift+R)

### Data tidak sync antar device
**Fix:**
- Clear browser cache kedua device
- Hard refresh (Ctrl+Shift+R)
- Cek di Google Sheets apakah data ada di tab "submissions"

### Foto tidak muncul
**Fix:**
- Foto di-compress otomatis ke 800px
- Base64 tersimpan di column "photos" (JSON array)
- Cek console browser untuk error

---

## 📊 CEK DATA DI GOOGLE SHEETS

Setelah submit, lihat di spreadsheet:

**Tab: submissions**
```
| id | branchId | userNik | userName | date | createdAt | totalScore | data | photos | notes |
```

Data harus muncul di row baru!

**Tab: indicators** (untuk branch lain)

Tambah row baru untuk branch A416:
```
A416	sales	Sales	number	100000000		20	DollarSign	2026-05-09T10:00:00Z
A416	transaksi	Transaksi	number	1000		15	ShoppingCart	2026-05-09T10:00:00Z
```

Sekarang user bisa login ke branch A416 dan lihat indicators!

---

**Next:** Lihat `GOOGLE_SHEETS_SETUP.md` untuk dokumentasi lengkap!

Updated: 2026-05-09
