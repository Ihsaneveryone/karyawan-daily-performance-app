# ✅ SETUP FINAL - 9 INDIKATOR BARU

## 🎉 SEMUA SUDAH DIPERBAIKI DI CODE!

### **✅ Update 1: Auto-Calculate Basket Size**
- **Formula:** Sales ÷ Trx
- **Support ID:** 'basket', 'basketSize'
- **Display:** "✨ Otomatis: Sales ÷ Trx = [value]"
- **Field:** Disabled (read-only, auto-calculated)

### **✅ Update 2: Auto-Calculate No Baru Customer**
- **Formula:** Trx × 50%
- **Support ID:** 'no_baru', 'noBaru'
- **Display:** "✨ Otomatis: 50% dari Trx = [value]"
- **Field:** Disabled (read-only, auto-calculated)

### **✅ Update 3: Support ID 'trx' dan 'transaksi'**
- Code sekarang support kedua ID
- Backward compatible dengan data lama

### **✅ Update 4: Type "number+photo" Already Supported!**
- WA PERSONAL: 20 + 1 foto ✅
- MGB: 10 + 3 foto ✅

---

## 📊 PASTE DATA KE GOOGLE SHEETS:

### **Step 1: Buka Tab "indicators"**
https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit#gid=1

### **Step 2: Clear Data Lama**
- Select rows 2 ke bawah
- Right-click → Delete rows

### **Step 3: Paste Data Baru**
**Klik cell A2**, lalu paste ini:

```
A336	sales	Sales	number	6000000		30	DollarSign	2026-05-09T10:00:00Z
A336	trx	Trx	number	6		10	ShoppingCart	2026-05-09T10:00:00Z
A336	basket	Basket Size	number	0		10	TrendingUp	2026-05-09T10:00:00Z
A336	wa_personal	WA PERSONAL	number+photo	20	1	10	Phone	2026-05-09T10:00:00Z
A336	no_baru	No Baru Customer	number	0		10	UserPlus	2026-05-09T10:00:00Z
A336	after_sales	After Sales Service	photo		1	5	Shield	2026-05-09T10:00:00Z
A336	proteksi	Proteksi	number	1		10	ThumbsUp	2026-05-09T10:00:00Z
A336	google_review	Google Review	number	1		5	Target	2026-05-09T10:00:00Z
A336	mgb	MGB	number+photo	10	3	10	Camera	2026-05-09T10:00:00Z
```

### **Step 4: Verify**
- Tab "indicators" sekarang punya **10 rows** (1 header + 9 data)
- Semua 9 indikator ada untuk A336

---

## 📋 9 INDIKATOR LENGKAP:

| No | Nama | Type | Target | Bobot | Icon |
|----|------|------|--------|-------|------|
| 1 | 💰 Sales | number | 6,000,000 | 30% | DollarSign |
| 2 | 🛒 Trx | number | 6 | 10% | ShoppingCart |
| 3 | 📈 Basket Size | number (auto) | Sales ÷ Trx | 10% | TrendingUp |
| 4 | 📞 WA PERSONAL | number+photo | 20 + 1 foto | 10% | Phone |
| 5 | 👤 No Baru Customer | number (auto) | 50% dari Trx | 10% | UserPlus |
| 6 | 🛡️ After Sales Service | photo | 1 foto | 5% | Shield |
| 7 | 👍 Proteksi | number | 1 | 10% | ThumbsUp |
| 8 | 🎯 Google Review | number | 1 | 5% | Target |
| 9 | 📸 MGB | number+photo | 10 + 3 foto | 10% | Camera |

**Total Bobot:** 100% ✅
**Total Foto:** 5 (1+1+3) ✅
**Auto Fields:** 2 (Basket Size, No Baru Customer) ✅

---

## 🚀 TEST SEKARANG:

### **Step 1: Paste Data**
(Ikuti instruksi di atas)

### **Step 2: Hard Refresh**
- **Ctrl+Shift+R** (Windows) atau **Cmd+Shift+R** (Mac)

### **Step 3: Cek Console**
- **F12** → Tab "Console"
- Harus muncul: "✅ A336 has 9 indicators"

### **Step 4: Login**
- Branch: **A336**
- NIK: `191924`
- Nama: `Test User`

### **Step 5: Verify 9 Indikator Muncul**

Harus muncul semua indikator dengan detail:

**1. 💰 Sales (30%)**
```
Target: Rp 6,000,000
[Input field]
```

**2. 🛒 Trx (10%)**
```
Target: 6
[Input field]
```

**3. 📈 Basket Size (10%) - AUTO**
```
✨ Otomatis: Sales ÷ Trx = 0
[Input field DISABLED - auto-calculated]
```

**4. 📞 WA PERSONAL (10%)**
```
Target: 20 + 1 foto
[Input number field]
[Upload 1 foto]
```

**5. 👤 No Baru Customer (10%) - AUTO**
```
✨ Otomatis: 50% dari Trx = 0
[Input field DISABLED - auto-calculated]
```

**6. 🛡️ After Sales Service (5%)**
```
Target: 1 foto
[Upload foto]
```

**7. 👍 Proteksi (10%)**
```
Target: 1
[Input field]
```

**8. 🎯 Google Review (5%)**
```
Target: 1
[Input field]
```

**9. 📸 MGB (10%)**
```
Target: 10 + 3 foto
[Input number field]
📸 Foto 1 [Choose File]
📸 Foto 2 [Choose File]
📸 Foto 3 [Choose File]
Progress: 0/3 foto
```

---

## 🧪 TEST AUTO-CALCULATE:

### **Test 1: Basket Size**
1. **Isi Sales:** 6000000
2. **Isi Trx:** 6
3. **Basket Size auto-update:** 6000000 ÷ 6 = **1,000,000** ✅

### **Test 2: No Baru Customer**
1. **Isi Trx:** 6
2. **No Baru Customer auto-update:** 6 × 50% = **3** ✅

### **Test 3: Number+Photo (WA PERSONAL)**
1. **Isi Number:** 20
2. **Upload 1 foto**
3. **Both harus terisi untuk bisa submit** ✅

### **Test 4: Number+Photo (MGB)**
1. **Isi Number:** 10
2. **Upload 3 foto** (1-1 via 3 button terpisah)
3. **Progress: 3/3 foto ✓ Lengkap!** ✅

---

## 📸 TEST UPLOAD FOTO:

**Total 5 foto harus diupload:**

1. **WA PERSONAL:** 1 foto
2. **After Sales Service:** 1 foto
3. **MGB:** 3 foto (Foto 1, Foto 2, Foto 3)

**Upload cara:**
- Klik button "Choose File"
- Pilih foto dari galeri/file
- Preview muncul
- Bisa klik "Hapus" untuk re-upload

---

## ✅ TEST SUBMIT:

### **Contoh Data Lengkap:**
```
Sales: 6,000,000
Trx: 6
Basket Size: 1,000,000 (auto)
WA PERSONAL: 20 + 1 foto ✓
No Baru Customer: 3 (auto)
After Sales Service: 1 foto ✓
Proteksi: 1
Google Review: 1
MGB: 10 + 3 foto ✓
```

### **Total Score:**
- Sales: 100% × 30% = 30%
- Trx: 100% × 10% = 10%
- Basket Size: 100% × 10% = 10%
- WA PERSONAL: 100% × 10% = 10%
- No Baru Customer: 100% × 10% = 10%
- After Sales: 100% × 5% = 5%
- Proteksi: 100% × 10% = 10%
- Google Review: 100% × 5% = 5%
- MGB: 100% × 10% = 10%

**Total: 100%** ✅ Perfect Score!

---

## 🐛 TROUBLESHOOTING:

### **❌ Indikator tidak muncul**
- Paste data ke spreadsheet
- Share spreadsheet: Permission "Editor"
- Hard refresh (Ctrl+Shift+R)

### **❌ Auto-calculate tidak jalan**
- Clear cache browser
- Hard refresh
- Isi Sales & Trx dulu
- Basket Size & No Baru Customer harus auto-update

### **❌ Tidak bisa submit**
- Pastikan SEMUA indikator diisi
- Number+photo harus isi KEDUANYA (number DAN foto)
- Total 5 foto harus diupload

---

## 📸 SCREENSHOT YANG DIPERLUKAN (Jika Error):

1. **Screenshot tab "indicators"** - full data (10 rows)
2. **Screenshot console** (F12) setelah refresh
3. **Screenshot aplikasi** setelah login - lihat 9 indikator
4. **Screenshot saat isi Sales & Trx** - lihat auto-calculate

---

## ✅ CHECKLIST FINAL:

- [ ] Data di-paste ke tab "indicators" (9 rows + 1 header)
- [ ] Spreadsheet di-share (Permission: Editor)
- [ ] Hard refresh aplikasi (Ctrl+Shift+R)
- [ ] Console log: "✅ A336 has 9 indicators"
- [ ] Login ke A336 → 9 indikator muncul
- [ ] Test auto-calculate Basket Size (Sales ÷ Trx)
- [ ] Test auto-calculate No Baru (50% dari Trx)
- [ ] Test upload 5 foto total
- [ ] Test submit data lengkap
- [ ] Data muncul di tab "submissions" di Google Sheets

---

**PASTE DATA SEKARANG, REFRESH, DAN TEST!**

Semua code sudah fixed, tinggal paste data dan test!

---

Updated: 2026-05-09
Status: ✅ CODE READY - PASTE & TEST!
