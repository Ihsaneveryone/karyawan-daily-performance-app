# 🚀 MULAI SEKARANG - 3 LANGKAH!

## ✅ CODE SUDAH SIAP!

**Yang sudah diperbaiki:**
1. ✅ No Baru Customer → Manual input (bukan auto)
2. ✅ Basket Size → Auto-calculate (Sales ÷ Trx)
3. ✅ Submit menggunakan Apps Script endpoint
4. ✅ 9 indikator sesuai spesifikasi

---

## 📋 LANGKAH SETUP (15 MENIT TOTAL):

### **LANGKAH 1: Paste Data Indikator (2 menit)**

**Buka Google Sheets:**
https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit#gid=1

**Tab "indicators":**
1. Delete rows 2-10
2. Klik cell A2
3. Paste data ini:

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

---

### **LANGKAH 2: Deploy Apps Script (10 menit)**

**Kenapa butuh ini?**
Google Sheets API tidak support API Key untuk submit data.
Apps Script = gratis & mudah (no OAuth!)

**Caranya:**

1. **Buka Google Sheets** (yang sama)

2. **Klik menu:** Extensions → Apps Script

3. **Hapus semua code**, paste code dari file:
   `google-apps-script/Code.gs`
   
   Atau copy dari sini: [Code.gs](./google-apps-script/Code.gs)

4. **Save:** File → Save (Ctrl+S)

5. **Deploy:**
   - Klik **Deploy** → **New deployment**
   - Klik icon **gear** (⚙️)
   - Pilih **"Web app"**
   - **Execute as:** Me
   - **Who has access:** **Anyone** ⚠️ PENTING!
   - Klik **Deploy**

6. **Authorize:**
   - Klik **"Authorize access"**
   - Pilih Google account kamu
   - Klik **"Advanced"**
   - Klik **"Go to [project] (unsafe)"**
   - Klik **"Allow"**

7. **COPY WEB APP URL:**
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```

---

### **LANGKAH 3: Paste URL ke .env (1 menit)**

**Edit file `.env`** di root project:

```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyB1cW57M1GVBOFGSzzw0wDkIr_d58L864c
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz.../exec
```

**⚠️ Ganti URL di line terakhir dengan URL dari Langkah 2!**

---

### **LANGKAH 4: Test (2 menit)**

1. **Hard refresh:** `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)

2. **Check console (F12):**
   Harus muncul: `✅ A336 has 9 indicators`

3. **Login:**
   - Branch: A336
   - NIK: 191924
   - Nama: Test User

4. **Verify 9 indikator muncul:**
   - Sales (30%)
   - Trx (10%)
   - Basket Size (10%) - AUTO
   - WA PERSONAL (10%)
   - No Baru Customer (10%) - MANUAL
   - After Sales Service (5%)
   - Proteksi (10%)
   - Google Review (5%)
   - MGB (10%)

5. **Test submit:**
   - Isi Sales: 6000000
   - Isi Trx: 6
   - Basket Size auto-update: 1,000,000 ✓
   - Isi semua indikator lain
   - Upload 5 foto total (WA: 1, After Sales: 1, MGB: 3)
   - Klik Submit
   - ✅ Success!

6. **Check Google Sheets:**
   - Tab "submissions" → harus ada row baru!

---

## 🐛 TROUBLESHOOTING:

### **Indikator tidak muncul**
- Paste data ke tab "indicators"
- Hard refresh (Ctrl+Shift+R)
- Check console (F12)

### **Submit error 401**
- Deploy Apps Script (Langkah 2)
- Paste URL ke .env (Langkah 3)
- Hard refresh

### **Basket Size tidak auto**
- Isi Sales dulu
- Lalu isi Trx
- Harus auto-update langsung

---

## 📚 DOKUMENTASI LENGKAP:

- **Setup Apps Script:** [SETUP_APPS_SCRIPT.md](./SETUP_APPS_SCRIPT.md)
- **Fix Error 401:** [FIX_ERROR_401.md](./FIX_ERROR_401.md)
- **Paste 9 Indikator:** [PASTE_DATA_9_INDIKATOR.md](./PASTE_DATA_9_INDIKATOR.md)

---

## ✅ CHECKLIST:

- [ ] Paste 9 indikator ke Google Sheets
- [ ] Deploy Apps Script
- [ ] Copy Web App URL
- [ ] Paste URL ke .env
- [ ] Hard refresh aplikasi
- [ ] Login → 9 indikator muncul
- [ ] Test auto-calculate Basket Size
- [ ] Test manual input No Baru Customer
- [ ] Test submit dengan 5 foto
- [ ] Data muncul di Google Sheets

---

## 🎉 SELESAI!

Aplikasi siap digunakan dengan:
- ✅ 9 indikator lengkap
- ✅ Auto-calculate Basket Size
- ✅ Manual input No Baru Customer
- ✅ Multi-device sync
- ✅ 100% GRATIS

**MULAI DARI LANGKAH 1!**

---

Updated: 2026-05-09
Status: ✅ READY TO GO!
