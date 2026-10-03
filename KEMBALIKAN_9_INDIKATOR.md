# ✅ KEMBALIKAN 9 INDIKATOR LENGKAP

## 🔧 YANG SUDAH DIPERBAIKI DI CODE:

### **1. Icon Mapping Ditambahkan** ✅

**File:** `src/app/components/StaffDashboard.tsx`

**Added icons:**
- ✅ Users (Customer Baru)
- ✅ Package (Produk Baru)
- ✅ Tag (Promo Active)
- ✅ Image (Display Toko)
- ✅ Sparkles (Kebersihan)

**Sekarang semua 9 indikator punya icon!**

---

### **2. DOM Nesting Error Fixed** ✅

**File:** `src/app/components/StaffDashboard.tsx`

Fixed `<div>` inside `<p>` tag → No more warning!

---

## 📊 DATA 9 INDIKATOR UNTUK GOOGLE SHEETS:

### **CARA PASTE KE GOOGLE SHEETS:**

**Step 1: Buka Tab "indicators"**
1. Buka spreadsheet: https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit
2. Klik tab **"indicators"** (bottom)

**Step 2: Clear Data Lama**
1. **Select rows 2 ke bawah** (semua data lama)
2. **Right-click** → **Delete rows**
3. Atau: Select cells → **Delete**

**Step 3: Paste Data Baru**
1. **Klik cell A2**
2. **Copy data ini:**

```
A336	sales	Sales	number	100000000		20	DollarSign	2026-05-09T10:00:00Z
A336	transaksi	Transaksi	number	1000		15	ShoppingCart	2026-05-09T10:00:00Z
A336	mgb	MGB	photo		3	15	Camera	2026-05-09T10:00:00Z
A336	customer	Customer Baru	number	50		10	Users	2026-05-09T10:00:00Z
A336	produk	Produk Baru	number	20		10	Package	2026-05-09T10:00:00Z
A336	promo	Promo Active	number	5		10	Tag	2026-05-09T10:00:00Z
A336	display	Display Toko	photo		2	10	Image	2026-05-09T10:00:00Z
A336	kebersihan	Kebersihan	photo		1	10	Sparkles	2026-05-09T10:00:00Z
A336	basket	Basket Size	number	0		0	TrendingUp	2026-05-09T10:00:00Z
```

3. **Paste** (Ctrl+V atau Cmd+V)

**Step 4: Verify**
- Row 1: Header
- Row 2-10: 9 indikator untuk A336
- **Total: 10 rows**

---

## 📋 DETAIL 9 INDIKATOR:

### **Number Type (6 indikator):**

1. **💰 Sales** - Target: Rp 100,000,000 (Weight: 20%)
2. **🛒 Transaksi** - Target: 1,000 (Weight: 15%)
3. **👥 Customer Baru** - Target: 50 (Weight: 10%)
4. **📦 Produk Baru** - Target: 20 (Weight: 10%)
5. **🏷️ Promo Active** - Target: 5 (Weight: 10%)
6. **📈 Basket Size** - Auto: Sales ÷ Transaksi (Weight: 0%)

### **Photo Type (3 indikator):**

7. **📸 MGB** - Target: 3 foto (Weight: 15%)
   - 3 button upload terpisah
8. **🖼️ Display Toko** - Target: 2 foto (Weight: 10%)
   - 2 button upload terpisah
9. **✨ Kebersihan** - Target: 1 foto (Weight: 10%)
   - 1 button upload

**Total Weight:** 100%
**Total Foto per submission:** 6 foto (3+2+1)

---

## 🚀 CARA TEST:

### **Step 1: Paste Data ke Spreadsheet**
(Ikuti instruksi di atas)

### **Step 2: Hard Refresh Aplikasi**
1. Buka aplikasi di browser
2. **Ctrl+Shift+R** (Windows) atau **Cmd+Shift+R** (Mac)

### **Step 3: Cek Console**
1. Tekan **F12** → Tab "Console"
2. Lihat log:
   ```
   🧪 Testing Google Sheets API Connection...
   ✅ Connection successful!
   ✅ Indicators fetched: 9 rows
   ✅ A336 has 9 indicators
   ✅ All tests passed!
   ```

### **Step 4: Login & Test**
1. Pilih branch **A336**
2. Login - NIK: `191924`, Nama: `Test User`
3. **9 indikator HARUS MUNCUL:**
   - 💰 Sales
   - 🛒 Transaksi
   - 📸 MGB (3 foto)
   - 👥 Customer Baru
   - 📦 Produk Baru
   - 🏷️ Promo Active
   - 🖼️ Display Toko (2 foto)
   - ✨ Kebersihan (1 foto)
   - 📈 Basket Size (auto)

### **Step 5: Test Upload Foto**
1. **MGB:** Klik 3 button "Foto 1", "Foto 2", "Foto 3"
2. Upload 1 foto per button
3. Preview harus muncul
4. Progress: **3/3 foto ✓ Lengkap!**

5. **Display Toko:** Upload 2 foto
6. **Kebersihan:** Upload 1 foto

7. **Total 6 foto** harus terupload sebelum bisa submit!

### **Step 6: Test Submit**
1. Isi semua number fields
2. Upload semua foto (6 total)
3. Klik **"Submit"**
4. Data harus tersimpan ke Google Sheets tab "submissions"!

---

## 🐛 TROUBLESHOOTING:

### **❌ Indikator tidak muncul**

**Penyebab:**
- Data belum di-paste ke spreadsheet
- Spreadsheet belum di-share

**Fix:**
1. Paste data ke tab "indicators"
2. Share spreadsheet: Permission **"Editor"**
3. Hard refresh (Ctrl+Shift+R)

---

### **❌ Icon tidak muncul / error**

**Penyebab:**
- Icon tidak di-import di code

**Fix:**
- ✅ Sudah fixed! Semua icon sudah ditambahkan

---

### **❌ Basket Size tidak auto-calculate**

**Penyebab:**
- Belum isi Sales & Transaksi

**Fix:**
1. Isi Sales (contoh: 100000000)
2. Isi Transaksi (contoh: 1000)
3. Basket Size auto-update: 100000000 ÷ 1000 = 100,000

---

### **❌ Upload foto error**

**Penyebab:**
- File terlalu besar

**Fix:**
- App auto-compress ke 800px & 70% quality
- Max file size: ~1-2MB per foto
- Format support: JPG, PNG, GIF

---

## ✅ CHECKLIST FINAL:

Pastikan semua ini:

- [ ] ✅ Data 9 indikator di-paste ke tab "indicators"
- [ ] ✅ Tab "indicators" punya 10 rows (1 header + 9 data)
- [ ] ✅ Spreadsheet di-share dengan permission "Editor"
- [ ] ✅ Icon ditambahkan di code (Users, Package, Tag, Image, Sparkles)
- [ ] ✅ Hard refresh aplikasi (Ctrl+Shift+R)
- [ ] ✅ Console log: "A336 has 9 indicators"
- [ ] ✅ Login ke A336 → 9 indikator muncul
- [ ] ✅ Test upload 6 foto (3+2+1)
- [ ] ✅ Test submit data
- [ ] ✅ Data muncul di tab "submissions"

---

## 📸 SCREENSHOT YANG DIPERLUKAN (Jika Error):

1. **Screenshot tab "indicators"** di spreadsheet (full data, scroll sampai row 10)
2. **Screenshot console browser** (F12) setelah refresh
3. **Screenshot aplikasi** setelah login (lihat apakah 9 indikator muncul)

---

## 🎯 EXPECTED RESULT:

Setelah paste & refresh, aplikasi harus menampilkan:

```
╔═══════════════════════════════════════╗
║  CROWN DAILY INDICATORS               ║
║  Muhammad Ihsan (191924)              ║
╠═══════════════════════════════════════╣
║  💰 Sales                      20%    ║
║  Target: Rp 100,000,000              ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  🛒 Transaksi                  15%    ║
║  Target: 1,000                       ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  📸 MGB                        15%    ║
║  Target: 3 foto                      ║
║  📸 Foto 1 [Choose File]             ║
║  📸 Foto 2 [Choose File]             ║
║  📸 Foto 3 [Choose File]             ║
║  Progress: 0/3 foto                  ║
╠═══════════════════════════════════════╣
║  👥 Customer Baru              10%    ║
║  Target: 50                          ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  📦 Produk Baru                10%    ║
║  Target: 20                          ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  🏷️ Promo Active              10%    ║
║  Target: 5                           ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  🖼️ Display Toko              10%    ║
║  Target: 2 foto                      ║
║  📸 Foto 1 [Choose File]             ║
║  📸 Foto 2 [Choose File]             ║
║  Progress: 0/2 foto                  ║
╠═══════════════════════════════════════╣
║  ✨ Kebersihan                 10%    ║
║  Target: 1 foto                      ║
║  [Choose File]                       ║
╠═══════════════════════════════════════╣
║  📈 Basket Size (Auto)         0%    ║
║  ✨ Auto: Sales ÷ Transaksi          ║
║  Calculated: Rp 0                    ║
╠═══════════════════════════════════════╣
║  Total Score: 0%                     ║
║  [Submit Button - Disabled]          ║
╚═══════════════════════════════════════╝
```

---

**PASTE DATA SEKARANG, REFRESH, DAN TEST!**

Jika masih ada masalah, screenshot console (F12) dan kirim ke saya!

---

Updated: 2026-05-09
Status: ✅ Code Fixed - Ready for Data Paste!
