# 📊 GOOGLE SHEETS API SETUP - GRATIS & MULTI-DEVICE!

## 🎯 KENAPA GOOGLE SHEETS?

✅ **100% GRATIS selamanya** - Tidak ada quota limit!
✅ **Multi-device sync** - Submit di HP, lihat di laptop!
✅ **Data terlihat** - Bisa cek data langsung di spreadsheet
✅ **Backup otomatis** - Google backup semua data
✅ **Export mudah** - Download as Excel kapan saja
✅ **No server setup** - Cukup buat spreadsheet!

---

## 🚀 SETUP (15 MENIT)

### **Step 1: Buat Google Spreadsheet**

1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"+ Blank"** untuk buat spreadsheet baru
3. Rename jadi: **"CROWN Daily Indicators Data"**
4. **PENTING:** Copy URL spreadsheet (contoh: `https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit`)
5. Extract **Spreadsheet ID** dari URL:
   ```
   URL: https://docs.google.com/spreadsheets/d/1ABC123XYZ456/edit
   Spreadsheet ID: 1ABC123XYZ456  ← Copy ini!
   ```

### **Step 2: Setup Sheets Structure**

Buat **5 sheets/tabs** dengan nama:

1. **branches** - Data toko/cabang
2. **indicators** - Indicator settings per branch
3. **submissions** - Data submission dari user
4. **settings** - App settings per branch
5. **users** - User data (optional)

**Header untuk setiap sheet:**

**Sheet 1: branches**
```
| id | nik | name | adminName | createdAt | logo |
```

**Sheet 2: indicators**
```
| branchId | id | name | type | targetValue | targetPhotos | weight | icon | createdAt |
```

**Sheet 3: submissions**
```
| id | branchId | userNik | userName | date | createdAt | totalScore | data | photos | notes |
```

**Sheet 4: settings**
```
| branchId | loginTitle | loginSubtitle | minScore | createdAt | updatedAt |
```

**Sheet 5: users**
```
| nik | nama | branchId | createdAt | lastLogin |
```

### **Step 3: Share Spreadsheet (Public Access)**

**Option A: Public Access (Recommended for simplicity)**
1. Klik **"Share"** button (pojok kanan atas)
2. Klik **"Change to anyone with the link"**
3. Set permission: **"Viewer"** atau **"Editor"**
4. Klik **"Done"**

**Option B: Restricted Access (More secure)**
1. Share ke email tertentu
2. Perlu OAuth setup (lebih complex)

### **Step 4: Get API Key**

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Create New Project:
   - Klik **"Select a project"** → **"New Project"**
   - Nama: **"Crown Daily Indicators"**
   - Klik **"Create"**
3. Enable Google Sheets API:
   - Menu → **"APIs & Services"** → **"Library"**
   - Search: **"Google Sheets API"**
   - Klik **"Enable"**
4. Create API Key:
   - Menu → **"APIs & Services"** → **"Credentials"**
   - Klik **"+ Create Credentials"** → **"API Key"**
   - **Copy API Key** (contoh: `AIzaSyABC123...XYZ`)
5. (Optional) Restrict API Key:
   - Klik **"Edit API Key"**
   - **API restrictions** → Select **"Google Sheets API"**
   - **Application restrictions** → **"HTTP referrers"**
   - Add: `https://your-app-domain.com/*`
   - Klik **"Save"**

---

## 🔐 SETUP DI APLIKASI

### **Cara 1: Environment Variables (Recommended)**

Buat file `.env` di root project:

```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyABC123...XYZ
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1ABC123XYZ456
```

### **Cara 2: Hardcode di Code (Quick Testing)**

Edit `src/app/utils/googleSheets.ts`:

```typescript
const API_KEY = 'AIzaSyABC123...XYZ'; // Your API Key
const SPREADSHEET_ID = '1ABC123XYZ456'; // Your Spreadsheet ID
```

⚠️ **JANGAN commit API key ke GitHub!** Gunakan `.env` untuk production.

---

## 📊 POPULATE INITIAL DATA

Setelah setup, populate data awal di spreadsheet:

### **Sheet: branches**
```
| id   | nik  | name      | adminName  | createdAt               | logo |
|------|------|-----------|------------|-------------------------|------|
| A336 | A336 | Toko A336 | MGR AZKO   | 2026-05-09T10:00:00Z   |      |
| A416 | A416 | Toko A416 | Manager416 | 2026-05-09T10:00:00Z   |      |
| A339 | A339 | Toko A339 | Manager339 | 2026-05-09T10:00:00Z   |      |
```

### **Sheet: indicators (untuk A336)**
```
| branchId | id        | name       | type   | targetValue | targetPhotos | weight | icon         | createdAt               |
|----------|-----------|------------|--------|-------------|--------------|--------|--------------|-------------------------|
| A336     | sales     | Sales      | number | 100000000   |              | 20     | DollarSign   | 2026-05-09T10:00:00Z   |
| A336     | transaksi | Transaksi  | number | 1000        |              | 15     | ShoppingCart | 2026-05-09T10:00:00Z   |
| A336     | mgb       | MGB        | photo  |             | 3            | 15     | Camera       | 2026-05-09T10:00:00Z   |
| A336     | customer  | Customer   | number | 50          |              | 10     | Users        | 2026-05-09T10:00:00Z   |
```

Ulangi untuk branch A416 dan A339!

### **Sheet: settings (untuk A336)**
```
| branchId | loginTitle              | loginSubtitle                    | minScore | createdAt               | updatedAt               |
|----------|-------------------------|----------------------------------|----------|-------------------------|-------------------------|
| A336     | CROWN DAILY INDICATORS  | Silakan masuk dengan NIK Anda   | 80       | 2026-05-09T10:00:00Z   | 2026-05-09T10:00:00Z   |
```

---

## 🧪 TEST INTEGRATION

Setelah setup selesai:

1. **Restart dev server**
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12)
   - Lihat log: `✅ Google Sheets API connected!`
   - Jika error, cek API key & Spreadsheet ID

3. **Test flow:**
   - Buka app → Pilih branch A336
   - Login dengan NIK: `191924`
   - Indicators harus muncul (dari Google Sheets!)
   - Submit data → Cek di Google Sheets **submissions** tab
   - Buka di device lain → Data harus sync!

---

## 🔍 TROUBLESHOOTING

### **Error: "API key not valid"**
- Pastikan API key benar
- Pastikan Google Sheets API sudah di-enable di Google Cloud Console

### **Error: "The caller does not have permission"**
- Pastikan spreadsheet sudah di-share (public atau ke email tertentu)
- Cek permission: minimal "Viewer"

### **Error: "Quota exceeded"**
- Google Sheets API gratis limit: **500 requests/100 seconds per user**
- Aplikasi sudah optimized dengan caching, seharusnya tidak masalah
- Jika tetap error, tunggu 100 detik atau upgrade ke paid plan

### **Data tidak sync**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+Shift+R)
- Cek di Google Sheets apakah data ada

### **Foto tidak muncul**
- Foto di-encode sebagai base64 di Google Sheets
- Jika file terlalu besar (>1MB), Google Sheets bisa lambat
- Solusi: Compress foto sebelum upload (aplikasi sudah auto-compress)

---

## 📈 LIMITS & BEST PRACTICES

### **Google Sheets API Limits (Free)**
- ✅ **Read requests:** 500/100 seconds
- ✅ **Write requests:** 500/100 seconds
- ✅ **Cells:** 10 million cells per spreadsheet
- ✅ **File size:** 5 million cells max

### **Aplikasi Optimization**
- ✅ Caching di localStorage (reduce API calls)
- ✅ Batch operations (1 API call untuk multiple rows)
- ✅ Debouncing untuk auto-save

### **Best Practices**
- ✅ Backup spreadsheet regularly (File → Make a copy)
- ✅ Don't delete header rows!
- ✅ Keep spreadsheet ID & API key secret
- ✅ Use `.env` file (don't commit to Git)

---

## 🎉 SELESAI!

Aplikasi sekarang:
- ✅ 100% GRATIS
- ✅ Multi-device sync (submit di HP, lihat di laptop!)
- ✅ Data tersimpan di Google Sheets (aman!)
- ✅ Bisa export to Excel
- ✅ Indicators jalan semua
- ✅ Photo upload support

**Next Step:** Setup API key di aplikasi, lalu test!

---

Updated: 2026-05-09
Status: ✅ READY TO USE
