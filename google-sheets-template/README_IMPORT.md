# 📊 GOOGLE SHEETS TEMPLATE - IMPORT GUIDE

## 🎯 FILES IN THIS FOLDER

✅ **branches.csv** - 5 cabang siap pakai (A336, A416, A339, A123, A456)
✅ **indicators.csv** - 24 indicators lengkap untuk semua cabang!
✅ **settings.csv** - Settings untuk semua cabang
✅ **submissions.csv** - Empty (akan terisi saat user submit)
✅ **users.csv** - Empty (akan terisi saat user login)

---

## 🚀 CARA IMPORT (5 MENIT!)

### **Option 1: Import via Google Sheets UI** (Recommended - Paling Mudah!)

#### **Step 1: Create Blank Spreadsheet**
1. Buka [Google Sheets](https://sheets.google.com)
2. Klik **"+ Blank"**
3. Rename: **"Crown Daily Indicators"**

#### **Step 2: Import CSV Files**

**Import File 1: branches**
1. Klik tab **"Sheet1"** (bottom left)
2. Right-click → **"Rename"** → ketik: `branches`
3. File menu → **"Import"**
4. Tab **"Upload"** → **"Select a file from your device"**
5. Pilih file: **`branches.csv`**
6. **Import location:** "Replace current sheet"
7. **Separator type:** "Comma"
8. **Convert text to numbers:** ✅ CHECKED
9. Klik **"Import data"**
10. ✅ Done! Sheet "branches" sekarang punya 5 cabang!

**Import File 2: indicators**
1. Klik **"+"** (add sheet) di bottom left
2. Rename sheet baru jadi: `indicators`
3. File menu → **"Import"**
4. Upload: **`indicators.csv`**
5. **Import location:** "Replace current sheet"
6. Klik **"Import data"**
7. ✅ Done! Sheet "indicators" sekarang punya 24 indicators!

**Import File 3: settings**
1. Klik **"+"** → Rename: `settings`
2. File → Import → Upload: **`settings.csv`**
3. Replace current sheet
4. ✅ Done!

**Import File 4: submissions**
1. Klik **"+"** → Rename: `submissions`
2. File → Import → Upload: **`submissions.csv`**
3. Replace current sheet
4. ✅ Done! (Hanya header, data akan terisi dari app)

**Import File 5: users**
1. Klik **"+"** → Rename: `users`
2. File → Import → Upload: **`users.csv`**
3. Replace current sheet
4. ✅ Done!

#### **Step 3: Verify Data**

Cek setiap sheet punya data:
- ✅ **branches**: 5 rows + header (6 rows total)
- ✅ **indicators**: 24 rows + header (25 rows total)
- ✅ **settings**: 5 rows + header (6 rows total)
- ✅ **submissions**: Header only (1 row)
- ✅ **users**: Header only (1 row)

---

### **Option 2: Import via Google Apps Script** (Advanced - Auto!)

Jika mau auto-import semua CSV sekaligus:

1. Di spreadsheet → **Extensions** → **Apps Script**
2. Paste script ini:

```javascript
function importAllCSV() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Note: You need to upload CSV files to Google Drive first
  // Then get their File IDs
  
  const files = [
    { name: 'branches', fileId: 'YOUR_BRANCHES_CSV_FILE_ID' },
    { name: 'indicators', fileId: 'YOUR_INDICATORS_CSV_FILE_ID' },
    { name: 'settings', fileId: 'YOUR_SETTINGS_CSV_FILE_ID' },
    { name: 'submissions', fileId: 'YOUR_SUBMISSIONS_CSV_FILE_ID' },
    { name: 'users', fileId: 'YOUR_USERS_CSV_FILE_ID' }
  ];
  
  files.forEach(({ name, fileId }) => {
    const file = DriveApp.getFileById(fileId);
    const csvData = file.getBlob().getDataAsString();
    const rows = Utilities.parseCsv(csvData);
    
    // Create or get sheet
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    } else {
      sheet.clear();
    }
    
    // Write data
    if (rows.length > 0) {
      sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
    }
  });
  
  Logger.log('✅ All CSV files imported!');
}
```

3. Klik **Run** → Authorize → Done!

---

## 📋 DATA YANG SUDAH ADA

### **5 Branches:**
- A336 - Toko A336 (Admin: MGR AZKO)
- A416 - Toko A416 (Admin: Manager A416)
- A339 - Toko A339 (Admin: Manager A339)
- A123 - Toko A123 (Admin: Manager A123)
- A456 - Toko A456 (Admin: Manager A456)

### **Indicators per Branch:**

**Branch A336:** 8 indicators
- Sales (target: 100M)
- Transaksi (target: 1000)
- MGB - 3 Foto
- Customer Baru (target: 50)
- Produk Baru (target: 20)
- Promo Active (target: 5)
- Display Toko - 2 Foto
- Kebersihan - 1 Foto

**Branch A416:** 5 indicators
- Sales (target: 80M)
- Transaksi (target: 800)
- MGB - 3 Foto
- Customer Baru (target: 40)
- Display Toko - 2 Foto

**Branch A339:** 5 indicators
- Sales (target: 120M)
- Transaksi (target: 1200)
- MGB - 3 Foto
- Customer Baru (target: 60)
- Promo Active (target: 8)

**Branch A123:** 3 indicators
- Sales (target: 90M)
- Transaksi (target: 900)
- MGB - 3 Foto

**Branch A456:** 3 indicators
- Sales (target: 110M)
- Transaksi (target: 1100)
- MGB - 3 Foto

---

## ✅ AFTER IMPORT

### **Step 1: Share Spreadsheet**
1. Klik **"Share"** (top right)
2. **"Change to anyone with the link"**
3. Permission: **"Editor"** (penting!)
4. Klik **"Done"**

### **Step 2: Get Spreadsheet ID**
URL: `https://docs.google.com/spreadsheets/d/1ABC123XYZ456/edit`

Spreadsheet ID: `1ABC123XYZ456` (copy ini!)

### **Step 3: Setup .env**

Create `.env` file:
```env
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1ABC123XYZ456
```

### **Step 4: Test!**
```bash
npm run dev
```

Login dengan:
- **Branch:** A336 (atau A416, A339, A123, A456)
- **NIK:** Apa saja (contoh: 191924)
- **Nama:** Nama anda

**Indicators harus muncul!** 🎉

---

## 🎨 CUSTOMIZE DATA

### **Tambah Branch Baru**

Di sheet **"branches"**, tambah row:
```
A789	A789	Toko A789	Manager A789	2026-05-09T10:00:00Z	
```

Di sheet **"indicators"**, tambah indicators untuk branch A789:
```
A789	sales	Sales	number	100000000		20	DollarSign	2026-05-09T10:00:00Z
A789	transaksi	Transaksi	number	1000		15	ShoppingCart	2026-05-09T10:00:00Z
```

Di sheet **"settings"**, tambah settings:
```
A789	CROWN DAILY INDICATORS	Silakan masuk	80	2026-05-09T10:00:00Z	2026-05-09T10:00:00Z
```

**Done!** Branch A789 sekarang bisa dipakai!

### **Edit Target Indicators**

Di sheet **"indicators"**, edit kolom **"targetValue"**:
```
A336	sales	Sales	number	150000000  ← Ganti target sales jadi 150M
```

### **Tambah/Hapus Indicator**

**Tambah:**
Di sheet "indicators", tambah row baru:
```
A336	stok	Stok Barang	number	500		10	Package	2026-05-09T10:00:00Z
```

**Hapus:**
Delete row yang tidak diperlukan

**PENTING:** Setelah edit, user perlu **refresh browser** atau **clear cache** untuk lihat perubahan!

---

## 🔍 MONITORING DATA

### **Lihat Submissions**

Setelah user submit data, cek sheet **"submissions"**:
```
| id | branchId | userNik | userName | date | createdAt | totalScore | data | photos | notes |
```

Data submission akan muncul di sini secara real-time!

### **Lihat Users**

Sheet **"users"** akan auto-populate saat user login (optional feature).

### **Export to Excel**

File → Download → Microsoft Excel (.xlsx)

**Done!** Data bisa dibuka di Excel untuk analisis lebih lanjut!

---

## 📊 TIPS & TRICKS

### **Freeze Header Row**
1. Klik row 1
2. View → Freeze → 1 row
3. Header tetap visible saat scroll!

### **Filter Data**
1. Klik header row
2. Data → Create a filter
3. Dropdown muncul di setiap kolom!

### **Conditional Formatting (Highlight High Scores)**
1. Select column "totalScore" di sheet "submissions"
2. Format → Conditional formatting
3. Format cells if: Greater than → 90
4. Formatting style: Green background
5. **Done!** Scores > 90 jadi hijau!

### **Charts for Analytics**
1. Select data di sheet "submissions"
2. Insert → Chart
3. Chart type: Line chart (untuk trend overtime)
4. **Done!** Visual analytics!

---

## 🆘 TROUBLESHOOTING

### **Import failed**
- Pastikan CSV encoding: UTF-8
- Pastikan separator: Comma (,)
- Coba Option 1 (manual import)

### **Data tidak muncul di app**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Cek API key & Spreadsheet ID di `.env`
- Cek spreadsheet permission: **Editor** (bukan Viewer!)

### **Indicators tidak sesuai branch**
- Cek kolom `branchId` di sheet "indicators"
- Pastikan exact match (case-sensitive!)
- Contoh: "A336" ≠ "a336"

---

## 🎉 SELESAI!

Template lengkap dengan:
- ✅ 5 branches siap pakai
- ✅ 24 indicators (number & photo types)
- ✅ Settings untuk semua branches
- ✅ Structure ready untuk submissions & users

**Next:** Setup API key, test aplikasi, dan mulai submit data!

---

Updated: 2026-05-09
