# 📊 PASTE DATA 9 INDIKATOR - FINAL

## 🚀 LANGKAH CEPAT (5 MENIT):

### **Step 1: Buka Google Sheets**
https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit#gid=1

### **Step 2: Pilih tab "indicators"**

### **Step 3: DELETE data lama**
- Select rows 2 sampai row 10
- Right-click → Delete rows 2-10

### **Step 4: PASTE data baru**
- Klik cell **A2**
- Copy dan paste data di bawah ini:

```
A336	sales	Sales	number	6000000		30	DollarSign	2026-05-09T10:00:00Z
A336	trx	Trx	number	6		10	ShoppingCart	2026-05-09T10:00:00Z
A336	basket	Basket Size	number	0		10	TrendingUp	2026-05-09T10:00:00Z
A336	wa_personal	WA PERSONAL	number+photo	20	1	10	Phone	2026-05-09T10:00:00Z
A336	no_baru	No Baru Customer	number	3		10	UserPlus	2026-05-09T10:00:00Z
A336	after_sales	After Sales Service	photo		1	5	Shield	2026-05-09T10:00:00Z
A336	proteksi	Proteksi	number	1		10	ThumbsUp	2026-05-09T10:00:00Z
A336	google_review	Google Review	number	1		5	Target	2026-05-09T10:00:00Z
A336	mgb	MGB	number+photo	10	3	10	Camera	2026-05-09T10:00:00Z
```

### **Step 5: Verify Data**
Harus ada **10 rows total** (1 header + 9 data)

---

## 📋 DETAIL 9 INDIKATOR:

| No | Nama | Type | Target | Bobot | Icon | Keterangan |
|----|------|------|--------|-------|------|------------|
| 1 | 💰 Sales | number | 6,000,000 | 30% | DollarSign | Input manual |
| 2 | 🛒 Trx | number | 6 | 10% | ShoppingCart | Input manual |
| 3 | 📈 Basket Size | number (auto) | - | 10% | TrendingUp | **AUTO: Sales ÷ Trx** |
| 4 | 📞 WA PERSONAL | number+photo | 20 + 1 foto | 10% | Phone | Input manual |
| 5 | 👤 No Baru Customer | number | 3 | 10% | UserPlus | **Input manual** |
| 6 | 🛡️ After Sales Service | photo | 1 foto | 5% | Shield | Upload foto |
| 7 | 👍 Proteksi | number | 1 | 10% | ThumbsUp | Input manual |
| 8 | 🎯 Google Review | number | 1 | 5% | Target | Input manual |
| 9 | 📸 MGB | number+photo | 10 + 3 foto | 10% | Camera | Input manual |

**Total Bobot:** 100% ✅
**Total Foto:** 5 (1+1+3) ✅
**Auto Fields:** 1 (Basket Size) ✅
**Manual Fields:** 8 ✅

---

## ✅ PERUBAHAN DARI VERSI SEBELUMNYA:

### ✅ **No Baru Customer** → MANUAL INPUT
- **Sebelumnya:** Auto-calculate 50% dari Trx
- **Sekarang:** Input manual dengan target 3
- **Alasan:** User request untuk kontrol penuh

### ✅ **Basket Size** → TETAP AUTO
- **Formula:** Sales ÷ Trx
- **Display:** "✨ Otomatis: Sales ÷ Trx = [value]"
- **Field:** Disabled (read-only)

---

## 🧪 TEST SETELAH PASTE:

### **1. Hard Refresh Aplikasi**
- **Ctrl+Shift+R** (Windows) atau **Cmd+Shift+R** (Mac)

### **2. Check Console (F12)**
Harus muncul:
```
✅ A336 has 9 indicators
```

### **3. Login ke A336**
- Branch: A336
- NIK: 191924
- Nama: Test User

### **4. Verify 9 Indikator Muncul**

**✅ 1. Sales (30%)**
- Target: Rp 6,000,000
- Input: Manual

**✅ 2. Trx (10%)**
- Target: 6
- Input: Manual

**✅ 3. Basket Size (10%) - AUTO**
- Target: Auto-calculated
- Display: "✨ Otomatis: Sales ÷ Trx = 0"
- Input: DISABLED (auto-update saat Sales/Trx diisi)

**✅ 4. WA PERSONAL (10%)**
- Target: 20 + 1 foto
- Input: Number field + Upload 1 foto

**✅ 5. No Baru Customer (10%) - MANUAL**
- Target: 3
- Input: Manual (bukan auto!)

**✅ 6. After Sales Service (5%)**
- Target: 1 foto
- Input: Upload foto

**✅ 7. Proteksi (10%)**
- Target: 1
- Input: Manual

**✅ 8. Google Review (5%)**
- Target: 1
- Input: Manual

**✅ 9. MGB (10%)**
- Target: 10 + 3 foto
- Input: Number field + Upload 3 foto

---

## 🧪 TEST AUTO-CALCULATE BASKET SIZE:

1. **Isi Sales:** 6000000
2. **Isi Trx:** 6
3. **Basket Size auto-update:** 6000000 ÷ 6 = **1,000,000** ✅
4. **Field Basket Size:** DISABLED (tidak bisa diedit manual)

---

## 🧪 TEST SUBMISSION:

### **Contoh Data Lengkap:**
```
Sales: 6,000,000 ✓
Trx: 6 ✓
Basket Size: 1,000,000 (auto) ✓
WA PERSONAL: 20 + 1 foto ✓
No Baru Customer: 3 (manual) ✓
After Sales Service: 1 foto ✓
Proteksi: 1 ✓
Google Review: 1 ✓
MGB: 10 + 3 foto ✓
```

### **Score Calculation:**
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

## 📸 UPLOAD FOTO (Total 5):

1. **WA PERSONAL:** 1 foto
2. **After Sales Service:** 1 foto
3. **MGB:** 3 foto (Button terpisah: Foto 1, Foto 2, Foto 3)

---

## ✅ SUBMIT DATA:

1. **Isi semua indikator**
2. **Upload 5 foto total**
3. **Klik Submit**
4. **Check di Google Sheets tab "submissions"**
5. **Data harus muncul dengan:**
   - Semua nilai indikator ✓
   - Foto ter-encode base64 ✓
   - Score 100% ✓
   - Timestamp real submit time ✓

---

## 🔍 CEK SUBMISSION DI GOOGLE SHEETS:

### **Tab "submissions"**
Harus muncul row baru dengan:

| id | branchId | userNik | userName | date | createdAt | totalScore | data | photos | notes |
|----|----------|---------|----------|------|-----------|------------|------|--------|-------|
| A336_191924_... | A336 | 191924 | Test User | 2026-05-09 | 2026-05-09T14:30:00Z | 100 | {...} | {...} | - |

**data column:** JSON dengan semua nilai indikator
**photos column:** JSON dengan base64 encoded images
**totalScore:** 100 (jika semua target tercapai)

---

## 🐛 TROUBLESHOOTING:

### **❌ Indikator tidak muncul**
1. Paste data ke spreadsheet
2. Hard refresh (Ctrl+Shift+R)
3. Check console log
4. Pastikan spreadsheet di-share dengan "Editor" permission

### **❌ Basket Size tidak auto-update**
1. Clear cache browser
2. Hard refresh
3. Isi Sales dulu, lalu Trx
4. Harus auto-update langsung

### **❌ Tidak bisa submit**
1. Pastikan semua indikator diisi
2. Number+photo harus isi KEDUANYA
3. Total 5 foto harus diupload
4. Score minimal 80% (default)

---

## ✅ CHECKLIST FINAL:

- [ ] Data di-paste ke tab "indicators" (9 rows + 1 header)
- [ ] Spreadsheet di-share (Permission: Editor)
- [ ] Hard refresh aplikasi (Ctrl+Shift+R)
- [ ] Console log: "✅ A336 has 9 indicators"
- [ ] Login ke A336 → 9 indikator muncul
- [ ] Test auto-calculate Basket Size (Sales ÷ Trx)
- [ ] Test manual input No Baru Customer
- [ ] Test upload 5 foto total
- [ ] Test submit data lengkap
- [ ] Data muncul di tab "submissions" di Google Sheets

---

**PASTE SEKARANG DAN TEST!**

Updated: 2026-05-09
Status: ✅ READY - No Baru Customer = MANUAL INPUT
