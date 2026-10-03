# 📊 INDIKATOR BARU - SPESIFIKASI FINAL

## 🎯 9 INDIKATOR LENGKAP DENGAN BOBOT BARU

### **PASTE DATA INI KE GOOGLE SHEETS TAB "indicators":**

**Step 1:** Delete semua data lama (row 2 ke bawah)
**Step 2:** Klik cell A2
**Step 3:** Copy-paste data ini:

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

---

## 📋 DETAIL SETIAP INDIKATOR:

### **1. 💰 Sales** (30%)
- **Type:** Number
- **Target:** 6,000,000 (6 juta)
- **Bobot:** 30%
- **Icon:** DollarSign (💰)

---

### **2. 🛒 Trx (Transaksi)** (10%)
- **Type:** Number
- **Target:** 6 transaksi
- **Bobot:** 10%
- **Icon:** ShoppingCart (🛒)

---

### **3. 📈 Basket Size** (10%) - AUTO
- **Type:** Number (Auto-calculate)
- **Formula:** **Sales ÷ Trx** (yang diisi user)
- **Target:** Auto (tidak ada target fix)
- **Bobot:** 10%
- **Icon:** TrendingUp (📈)
- **Contoh:**
  - Sales: 6,000,000
  - Trx: 6
  - **Basket Size = 6,000,000 ÷ 6 = 1,000,000**

---

### **4. 📞 WA PERSONAL** (10%) - Number + Photo
- **Type:** Number + Photo
- **Target Number:** 20
- **Target Photo:** 1 foto
- **Bobot:** 10%
- **Icon:** Phone (📞)
- **Input:**
  - Number field: Isi jumlah WA
  - Photo upload: 1 button untuk 1 foto

---

### **5. 👤 No Baru Customer** (10%) - AUTO
- **Type:** Number (Auto-calculate)
- **Formula:** **50% dari Trx** (yang diisi user)
- **Target:** Auto (50% dari Trx)
- **Bobot:** 10%
- **Icon:** UserPlus (👤)
- **Contoh:**
  - Trx: 6
  - **No Baru Customer = 6 × 50% = 3**

---

### **6. 🛡️ After Sales Service** (5%) - Photo Only
- **Type:** Photo
- **Target:** 1 foto
- **Bobot:** 5%
- **Icon:** Shield (🛡️)
- **Input:** 1 button untuk upload foto

---

### **7. 👍 Proteksi** (10%)
- **Type:** Number
- **Target:** 1
- **Bobot:** 10%
- **Icon:** ThumbsUp (👍)

---

### **8. 🎯 Google Review** (5%)
- **Type:** Number
- **Target:** 1
- **Bobot:** 5%
- **Icon:** Target (🎯)

---

### **9. 📸 MGB** (10%) - Number + Photo
- **Type:** Number + Photo
- **Target Number:** 10
- **Target Photo:** 3 foto
- **Bobot:** 10%
- **Icon:** Camera (📸)
- **Input:**
  - Number field: Isi jumlah MGB
  - Photo upload: 3 button terpisah (Foto 1, Foto 2, Foto 3)

---

## 📊 SUMMARY:

### **Total Bobot:**
30% + 10% + 10% + 10% + 10% + 5% + 10% + 5% + 10% = **100%** ✅

### **Total Foto:**
- WA PERSONAL: 1 foto
- After Sales Service: 1 foto
- MGB: 3 foto
**Total: 5 foto per submission**

### **Auto-Calculate Fields:**
1. **Basket Size** = Sales ÷ Trx
2. **No Baru Customer** = Trx × 50%

---

## 🔧 UPDATE CODE UNTUK AUTO-CALCULATE

Saya perlu update logic di `StaffDashboard.tsx` untuk handle:

1. **Basket Size auto-calculate** dari Sales ÷ Trx
2. **No Baru Customer auto-calculate** dari Trx × 50%
3. **Type "number+photo"** untuk WA PERSONAL dan MGB

---

## 🎨 TAMPILAN DI APLIKASI:

```
╔═══════════════════════════════════════╗
║  💰 Sales                      30%    ║
║  Target: Rp 6,000,000                ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  🛒 Trx                        10%    ║
║  Target: 6                           ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  📈 Basket Size (Auto)         10%    ║
║  ✨ Auto: Sales ÷ Trx                ║
║  Target: Auto-calculated             ║
║  Value: Rp 0                         ║
╠═══════════════════════════════════════╣
║  📞 WA PERSONAL                10%    ║
║  Target: 20 + 1 foto                 ║
║  [Input Number: __________]          ║
║  [Upload Foto]                       ║
╠═══════════════════════════════════════╣
║  👤 No Baru Customer (Auto)    10%    ║
║  ✨ Auto: 50% dari Trx               ║
║  Target: Auto (50% dari Trx)         ║
║  Value: 0                            ║
╠═══════════════════════════════════════╣
║  🛡️ After Sales Service        5%    ║
║  Target: 1 foto                      ║
║  [Upload Foto]                       ║
╠═══════════════════════════════════════╣
║  👍 Proteksi                   10%    ║
║  Target: 1                           ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  🎯 Google Review               5%    ║
║  Target: 1                           ║
║  [Input: _________________]          ║
╠═══════════════════════════════════════╣
║  📸 MGB                        10%    ║
║  Target: 10 + 3 foto                 ║
║  [Input Number: __________]          ║
║  📸 Foto 1 [Choose File]             ║
║  📸 Foto 2 [Choose File]             ║
║  📸 Foto 3 [Choose File]             ║
║  Progress: 0/3 foto                  ║
╠═══════════════════════════════════════╣
║  Total Score: 0%                     ║
║  [Submit Button]                     ║
╚═══════════════════════════════════════╝
```

---

## ✅ CHECKLIST SETUP:

- [ ] Paste data ke Google Sheets tab "indicators"
- [ ] Verify: 9 rows data + 1 header = 10 rows total
- [ ] Spreadsheet di-share dengan permission "Editor"
- [ ] Update code untuk auto-calculate (Basket Size & No Baru Customer)
- [ ] Update code untuk type "number+photo"
- [ ] Hard refresh aplikasi (Ctrl+Shift+R)
- [ ] Test login → 9 indikator muncul
- [ ] Test auto-calculate: Isi Sales & Trx → Basket Size auto-update
- [ ] Test auto-calculate: Isi Trx → No Baru Customer auto-update
- [ ] Test upload foto (5 total)
- [ ] Test submit

---

## 🔧 CODE UPDATE NEEDED:

Saya akan update code untuk:

1. **Auto-calculate Basket Size** dari Sales ÷ Trx
2. **Auto-calculate No Baru Customer** dari Trx × 50%
3. **Support type "number+photo"** untuk WA PERSONAL dan MGB

---

**STATUS:** 
- ✅ Data spreadsheet ready
- ⏳ Code update in progress...

Updated: 2026-05-09
