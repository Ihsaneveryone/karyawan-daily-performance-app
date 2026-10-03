# 🔧 FIX: Blank Preview Error

## ✅ YANG SUDAH DIPERBAIKI:

### **1. DOM Nesting Error** ✅
**File:** `src/app/components/StaffDashboard.tsx` (line 1080)

**Problem:** `<div>` di dalam `<p>` tag (invalid HTML)

**Fix:** Ganti `<p>` jadi `<div>`

```tsx
// BEFORE (ERROR):
<p className="text-xs text-gray-500 flex items-center gap-1">
  <div className="w-3 h-3 ..."></div>  ← div inside p is invalid!
</p>

// AFTER (FIXED):
<div className="text-xs text-gray-500 flex items-center gap-1">
  <div className="w-3 h-3 ..."></div>  ← OK now!
</div>
```

---

### **2. Test Google Sheets Connection** ✅
**File:** `src/app/utils/testGoogleSheets.ts`

**Added:** Auto-test function yang run saat app load

**What it does:**
- Test API connection
- Fetch branches data
- Fetch indicators data
- Check A336 has indicators
- Log semua hasil ke console

**Console akan print:**
```
🧪 Testing Google Sheets API Connection...
✅ Connection successful!
✅ Branches fetched: 3 rows
✅ Indicators fetched: 12 rows
✅ A336 has 4 indicators
✅ All tests passed!
```

---

## ⚠️ YANG PERLU DICEK:

### **1. Data Spreadsheet Lengkap?**

Buka spreadsheet dan verify:

**Tab "branches":** HARUS ada 3 rows data
```
| id   | nik  | name       | adminName    | createdAt               |
|------|------|------------|--------------|-------------------------|
| A336 | A336 | Toko A336  | MGR AZKO     | 2026-05-09T10:00:00Z   |
| A416 | A416 | Toko A416  | Manager A416 | 2026-05-09T10:00:00Z   |
| A339 | A339 | Toko A339  | Manager A339 | 2026-05-09T10:00:00Z   |
```

**Tab "indicators":** HARUS ada 12 rows data (4 per branch)
```
| branchId | id        | name       | type   | targetValue | targetPhotos | weight | icon         |
|----------|-----------|------------|--------|-------------|--------------|--------|--------------|
| A336     | sales     | Sales      | number | 100000000   |              | 20     | DollarSign   |
| A336     | transaksi | Transaksi  | number | 1000        |              | 15     | ShoppingCart |
| A336     | mgb       | MGB        | photo  |             | 3            | 15     | Camera       |
| A336     | customer  | Customer   | number | 50          |              | 10     | Users        |
| A416     | sales     | Sales      | number | 80000000    |              | 20     | DollarSign   |
| A416     | transaksi | Transaksi  | number | 800         |              | 15     | ShoppingCart |
| A416     | mgb       | MGB        | photo  |             | 3            | 15     | Camera       |
| A416     | customer  | Customer   | number | 40          |              | 10     | Users        |
| A339     | sales     | Sales      | number | 120000000   |              | 20     | DollarSign   |
| A339     | transaksi | Transaksi  | number | 1200        |              | 15     | ShoppingCart |
| A339     | mgb       | MGB        | photo  |             | 3            | 15     | Camera       |
| A339     | customer  | Customer   | number | 60          |              | 10     | Users        |
```

**Tab "settings":** HARUS ada 3 rows data
```
| branchId | loginTitle             | loginSubtitle            | minScore |
|----------|------------------------|--------------------------|----------|
| A336     | CROWN DAILY INDICATORS | Silakan masuk dengan NIK | 80       |
| A416     | CROWN DAILY INDICATORS | Silakan masuk dengan NIK | 80       |
| A339     | CROWN DAILY INDICATORS | Silakan masuk dengan NIK | 80       |
```

---

### **2. Spreadsheet Di-Share?**

**PENTING:** Spreadsheet HARUS di-share dengan permission **"Editor"**

**Cara cek:**
1. Buka spreadsheet
2. Klik "Share" (top right)
3. Pastikan: **"Anyone with the link"** → **"Editor"**

Jika permission masih **"Viewer"** → Ganti ke **"Editor"**!

---

### **3. Header Rows Benar?**

Pastikan **ROW 1** di setiap tab punya header yang EXACT:

**Tab "branches" (Row 1):**
```
id	nik	name	adminName	createdAt	logo
```

**Tab "indicators" (Row 1):**
```
branchId	id	name	type	targetValue	targetPhotos	weight	icon	createdAt
```

**Tab "settings" (Row 1):**
```
branchId	loginTitle	loginSubtitle	minScore	createdAt	updatedAt
```

**IMPORTANT:** Header harus EXACT match (case-sensitive, no spaces)!

---

## 🧪 CARA TEST SEKARANG:

### **Step 1: Hard Refresh**
1. Buka aplikasi di browser
2. **Hard refresh:** Ctrl+Shift+R (Windows) atau Cmd+Shift+R (Mac)

### **Step 2: Cek Console**
1. Tekan **F12** → Tab "Console"
2. Lihat log auto-test:
   ```
   🧪 Testing Google Sheets API Connection...
   ✅ Connection successful!
   ✅ Branches fetched: 3 rows
   ✅ Indicators fetched: 12 rows
   ✅ A336 has 4 indicators
   ✅ All tests passed!
   ```

3. Jika ada **ERROR**:
   - Screenshot error message
   - Send ke saya

### **Step 3: Test Login**
1. Pilih branch **A336**
2. Login dengan NIK: `191924`, Nama: `Test User`
3. **Indicators HARUS muncul** (4 indicators)

### **Step 4: Jika Masih Blank**
Run manual test di console (F12):

```javascript
// Copy-paste ini ke console:
const API_KEY = 'AIzaSyB1cW57M1GVBOFGSzzw0wDkIr_d58L864c';
const SPREADSHEET_ID = '1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0';

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/indicators?key=${API_KEY}`)
  .then(r => r.json())
  .then(data => {
    console.log('📊 Indicators data:', data);
    const rows = data.values || [];
    const a336 = rows.filter(r => r[0] === 'A336');
    console.log('✅ A336 indicators:', a336.length - 1, 'rows');
    console.log('Data:', a336);
  })
  .catch(err => console.error('❌ Error:', err));
```

Harus print minimal **4 indicators** untuk A336!

---

## 📸 SCREENSHOT YANG SAYA PERLUKAN:

1. **Screenshot tab "indicators"** di spreadsheet - lihat SEMUA data (scroll ke bawah jika perlu)
2. **Screenshot tab "branches"** di spreadsheet
3. **Screenshot console browser** (F12) setelah hard refresh
4. **Screenshot aplikasi** - jika masih blank, atau jika sudah muncul indicators

---

## 🎯 KEMUNGKINAN PENYEBAB BLANK PREVIEW:

1. ❌ **Data belum lengkap** di spreadsheet (paling umum!)
2. ❌ **Spreadsheet belum di-share** atau permission "Viewer" (harus "Editor")
3. ❌ **Header rows salah** (typo atau case mismatch)
4. ❌ **API key invalid** (tapi seharusnya sudah OK)
5. ✅ **DOM nesting** (sudah fixed!)

---

## ✅ NEXT STEPS:

1. **Verify data lengkap** di spreadsheet
2. **Verify spreadsheet di-share** dengan permission "Editor"
3. **Hard refresh** aplikasi (Ctrl+Shift+R)
4. **Cek console** untuk lihat test results
5. **Screenshot semua** dan send ke saya jika masih error

---

Updated: 2026-05-09
Status: ✅ DOM Error Fixed, Waiting for Data Verification
