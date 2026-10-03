# 📊 DATA INDIKATOR LENGKAP - 9 INDIKATOR UTAMA

## 🎯 INDIKATOR UNTUK BRANCH A336

**Copy-paste data ini ke Google Sheets tab "indicators" (mulai dari row 2):**

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

---

## 📋 DETAIL SETIAP INDIKATOR:

### **1. Sales** 💰
- **Type:** Number
- **Target:** 100,000,000 (100 juta)
- **Weight:** 20%
- **Icon:** DollarSign

### **2. Transaksi** 🛒
- **Type:** Number
- **Target:** 1,000 transaksi
- **Weight:** 15%
- **Icon:** ShoppingCart

### **3. MGB (Merchandise Good & Brand)** 📸
- **Type:** Photo
- **Target:** 3 foto
- **Weight:** 15%
- **Icon:** Camera
- **Upload:** 3 button terpisah (1 button per foto)

### **4. Customer Baru** 👥
- **Type:** Number
- **Target:** 50 customer
- **Weight:** 10%
- **Icon:** Users

### **5. Produk Baru** 📦
- **Type:** Number
- **Target:** 20 produk
- **Weight:** 10%
- **Icon:** Package

### **6. Promo Active** 🏷️
- **Type:** Number
- **Target:** 5 promo
- **Weight:** 10%
- **Icon:** Tag

### **7. Display Toko** 🖼️
- **Type:** Photo
- **Target:** 2 foto
- **Weight:** 10%
- **Icon:** Image
- **Upload:** 2 button terpisah

### **8. Kebersihan** ✨
- **Type:** Photo
- **Target:** 1 foto
- **Weight:** 10%
- **Icon:** Sparkles
- **Upload:** 1 button saja

### **9. Basket Size** 📈
- **Type:** Number (Auto-calculate)
- **Formula:** Sales ÷ Transaksi
- **Weight:** 0% (auto, tidak pakai target)
- **Icon:** TrendingUp

**Total Weight:** 100%

---

## 📸 TOTAL FOTO YANG PERLU DIUPLOAD:

- MGB: 3 foto
- Display Toko: 2 foto
- Kebersihan: 1 foto

**Total: 6 foto per submission**

---

## 🔧 CARA PASTE KE GOOGLE SHEETS:

### **Step 1: Clear Data Lama**
1. Buka spreadsheet → Tab **"indicators"**
2. **Select rows 2 sampai bawah** (semua data lama)
3. **Right-click** → **Delete rows**
4. Atau: Select cells A2 sampai seterusnya → **Delete**

### **Step 2: Paste Data Baru**
1. **Klik cell A2** (row 2, column A)
2. **Copy data di atas** (9 rows untuk A336)
3. **Paste** (Ctrl+V)

### **Step 3: Verify**
- Row 1: Header (branchId, id, name, type, targetValue, targetPhotos, weight, icon, createdAt)
- Row 2-10: Data untuk A336 (9 indicators)
- **Total: 10 rows** (1 header + 9 data)

---

## ✅ SETELAH PASTE:

1. **Save spreadsheet** (auto-save)
2. **Refresh aplikasi** (Ctrl+Shift+R)
3. **Login ke A336**
4. **9 indikator harus muncul!**

---

## 🎨 TAMPILAN DI APLIKASI:

Setelah login, user akan lihat:

```
┌─────────────────────────────────────┐
│ 💰 Sales                     20%    │
│ Target: Rp 100,000,000             │
│ [Input field]                      │
├─────────────────────────────────────┤
│ 🛒 Transaksi                 15%    │
│ Target: 1,000                      │
│ [Input field]                      │
├─────────────────────────────────────┤
│ 📸 MGB                       15%    │
│ Target: 3 foto                     │
│ 📸 Foto 1 [Choose File]            │
│ 📸 Foto 2 [Choose File]            │
│ 📸 Foto 3 [Choose File]            │
│ Progress: 0/3 foto                 │
├─────────────────────────────────────┤
│ 👥 Customer Baru             10%    │
│ Target: 50                         │
│ [Input field]                      │
├─────────────────────────────────────┤
│ 📦 Produk Baru               10%    │
│ Target: 20                         │
│ [Input field]                      │
├─────────────────────────────────────┤
│ 🏷️ Promo Active             10%    │
│ Target: 5                          │
│ [Input field]                      │
├─────────────────────────────────────┤
│ 🖼️ Display Toko             10%    │
│ Target: 2 foto                     │
│ 📸 Foto 1 [Choose File]            │
│ 📸 Foto 2 [Choose File]            │
│ Progress: 0/2 foto                 │
├─────────────────────────────────────┤
│ ✨ Kebersihan                10%    │
│ Target: 1 foto                     │
│ [Choose File]                      │
├─────────────────────────────────────┤
│ 📈 Basket Size (Auto)        0%    │
│ ✨ Auto: Sales ÷ Transaksi         │
│ Calculated: Rp 0                   │
└─────────────────────────────────────┘

Total Score: 0%
[Submit Button]
```

---

## 🔄 UNTUK BRANCH LAIN (OPTIONAL):

Jika mau setup untuk A416 dan A339, tambahkan juga:

**A416 (5 indikator):**
```
A416	sales	Sales	number	80000000		20	DollarSign	2026-05-09T10:00:00Z
A416	transaksi	Transaksi	number	800		15	ShoppingCart	2026-05-09T10:00:00Z
A416	mgb	MGB	photo		3	15	Camera	2026-05-09T10:00:00Z
A416	customer	Customer Baru	number	40		10	Users	2026-05-09T10:00:00Z
A416	basket	Basket Size	number	0		0	TrendingUp	2026-05-09T10:00:00Z
```

**A339 (5 indikator):**
```
A339	sales	Sales	number	120000000		20	DollarSign	2026-05-09T10:00:00Z
A339	transaksi	Transaksi	number	1200		15	ShoppingCart	2026-05-09T10:00:00Z
A339	mgb	MGB	photo		3	15	Camera	2026-05-09T10:00:00Z
A339	customer	Customer Baru	number	60		10	Users	2026-05-09T10:00:00Z
A339	basket	Basket Size	number	0		0	TrendingUp	2026-05-09T10:00:00Z
```

**Total semua branch:** 19 rows data (9 + 5 + 5)

---

## 📊 ICON MAPPING:

Icons yang digunakan (dari Lucide React):

- 💰 DollarSign → Sales
- 🛒 ShoppingCart → Transaksi
- 📸 Camera → MGB
- 👥 Users → Customer Baru
- 📦 Package → Produk Baru
- 🏷️ Tag → Promo Active
- 🖼️ Image → Display Toko
- ✨ Sparkles → Kebersihan
- 📈 TrendingUp → Basket Size

---

## ✅ CHECKLIST:

Setelah paste data:

- [ ] Tab "indicators" punya 10 rows (1 header + 9 data A336)
- [ ] Header row benar (branchId, id, name, type, ...)
- [ ] Semua 9 indikator ada untuk A336
- [ ] Spreadsheet di-share dengan permission "Editor"
- [ ] Refresh aplikasi (Ctrl+Shift+R)
- [ ] Login ke A336 → 9 indikator muncul!

---

**PASTE DATA SEKARANG, LALU TEST!**

Updated: 2026-05-09
Status: ✅ READY - 9 Indikator Lengkap!
