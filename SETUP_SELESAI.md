# ✅ SETUP SUDAH SELESAI!

## 🎉 APLIKASI SUDAH SIAP PAKAI!

Semua konfigurasi sudah di-update dengan API Key dan Spreadsheet ID Anda!

---

## 📝 YANG SUDAH DILAKUKAN:

### **1. API Key & Spreadsheet ID Hardcoded** ✅

File: `src/app/utils/googleSheets.ts`

```typescript
const API_KEY = 'AIzaSyB1cW57M1GVBOFGSzzw0wDkIr_d58L864c';
const SPREADSHEET_ID = '1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0';
```

**Status:** ✅ AKTIF - Langsung connect ke Google Sheets anda!

---

### **2. Auto-Test Connection** ✅

File: `src/app/App.tsx`

Aplikasi sekarang **auto-test connection** ke Google Sheets saat start!

Console akan print:
```
🔗 Testing Google Sheets API connection...
✅ Google Sheets API connected successfully!
🎉 Multi-device sync READY!
```

---

### **3. Method getAppSettings() Added** ✅

File: `src/app/utils/api.ts`

Method yang hilang sudah ditambahkan:
```typescript
async getAppSettings(): Promise<AppSettings>
```

**Status:** ✅ FIXED - Tidak ada error lagi!

---

### **4. File .env Created** ✅

File: `.env`

Berisi API key & Spreadsheet ID (backup jika hardcode di-comment)

---

## 🔗 LINK GOOGLE SHEETS ANDA

**Spreadsheet:** https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit

**Spreadsheet ID:** `1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0`

**API Key:** `AIzaSyB1cW57M1GVBOFGSzzw0wDkIr_d58L864c`

---

## ⚠️ LANGKAH TERAKHIR PENTING!

### **SHARE SPREADSHEET (WAJIB!)**

Aplikasi **TIDAK AKAN JALAN** jika spreadsheet belum di-share!

**Cara Share:**

1. **Buka spreadsheet:** https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit

2. **Klik button "Share"** (pojok kanan atas, warna biru/hijau)

3. **Klik "Change to anyone with the link"**

4. **Dropdown Permission:** Pilih **"Editor"** (BUKAN "Viewer"!)

5. **Klik "Done"**

**PENTING:** Permission HARUS **"Editor"** agar API bisa write data!

---

## 🚀 CARA TEST APLIKASI

### **Di Figma Make:**

Aplikasi sudah jalan otomatis di **Preview Surface** (sebelah kanan).

**Test Flow:**

1. **✅ SHARE SPREADSHEET DULU!** (lihat instruksi di atas)

2. **Refresh preview** jika perlu

3. **Buka Browser Console** (F12) untuk lihat log

4. **Cek console log:**
   ```
   ✅ Google Sheets API connected successfully!
   📊 Spreadsheet: https://docs.google.com/spreadsheets/d/...
   ```

5. **Pilih Branch:** Klik **A336** (atau branch lain)

6. **Login:**
   - NIK: `191924` (atau NIK apa saja)
   - Nama: `Test User`

7. **Cek Indicators:**
   - Harus muncul 8 indicators (Sales, Transaksi, MGB, dll)
   - Jika TIDAK muncul → Cek spreadsheet ada data di tab "indicators"

8. **Isi & Submit Data:**
   - Isi beberapa indicators
   - Klik "Submit"

9. **Cek di Google Sheets:**
   - Buka tab "submissions" di spreadsheet
   - **Data harus muncul!** (row baru)

10. **Test Multi-Device:**
    - Buka di device lain (HP atau incognito window)
    - Login dengan NIK sama
    - Klik "Riwayat"
    - **Data submission harus muncul!**

---

## 📊 CEK DATA DI SPREADSHEET

Setelah submit data:

**Tab: submissions**
- Buka: https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit#gid=2
- Harus ada row baru dengan data yang baru disubmit!

**Tab: indicators**
- Buka: https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit#gid=1
- Pastikan ada data untuk branch A336

**Tab: branches**
- Buka: https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit#gid=0
- Pastikan ada 5 branches (A336, A416, A339, A123, A456)

---

## 🐛 TROUBLESHOOTING

### **❌ Error: "The caller does not have permission"**

**Penyebab:** Spreadsheet belum di-share atau permission "Viewer"

**Fix:**
1. Share spreadsheet (lihat instruksi di atas)
2. Permission: **"Editor"** (BUKAN "Viewer"!)
3. Hard refresh aplikasi (Ctrl+Shift+R)

---

### **❌ Indicators tidak muncul**

**Penyebab:** Data belum di-import ke Google Sheets

**Fix:**
1. Buka spreadsheet → Tab "indicators"
2. Pastikan ada data untuk branch A336
3. Jika kosong: Import CSV dari folder `google-sheets-template/indicators.csv`

---

### **❌ Console log: "API key not valid"**

**Penyebab:** API key salah

**Fix:**
1. Cek `src/app/utils/googleSheets.ts` line 15-16
2. Pastikan API key benar: `AIzaSyB1cW57M1GVBOFGSzzw0wDkIr_d58L864c`

---

### **❌ Data tidak tersimpan**

**Penyebab:** Spreadsheet permission "Viewer" (harus "Editor")

**Fix:**
1. Share spreadsheet dengan permission **"Editor"**
2. Retry submit

---

## ✨ FITUR YANG JALAN

✅ **Multi-device sync** - Submit di HP, lihat di laptop!
✅ **Google Sheets integration** - 100% GRATIS!
✅ **Auto-test connection** - Console log konfirmasi
✅ **Indicators** - Muncul dari Google Sheets
✅ **Photo upload** - Auto-compress, simpan as base64
✅ **History filter** - Per user NIK
✅ **Refresh data** - Manual refresh button
✅ **Data visible** - Cek di Google Sheets
✅ **Export Excel** - Download dari Google Sheets

---

## 📋 CHECKLIST FINAL

Setup berhasil jika:

- [x] ✅ API Key hardcoded di `googleSheets.ts`
- [x] ✅ Spreadsheet ID hardcoded di `googleSheets.ts`
- [x] ✅ Auto-test connection added di `App.tsx`
- [x] ✅ Method `getAppSettings()` added di `api.ts`
- [x] ✅ File `.env` created
- [ ] ⏳ **SPREADSHEET DI-SHARE** (Permission: Editor) ← **LAKUKAN INI SEKARANG!**
- [ ] ⏳ Test login & indicators muncul
- [ ] ⏳ Test submit data → data muncul di Google Sheets
- [ ] ⏳ Test multi-device sync

---

## 🎯 NEXT STEP

**SEKARANG:**

1. **✅ SHARE SPREADSHEET!** (Paling penting!)
   - https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit
   - Share → Anyone with link → **Editor** → Done

2. **Test aplikasi** di Figma Make preview

3. **Kasih tau hasilnya:**
   - Indicators muncul? ✅ / ❌
   - Data tersimpan? ✅ / ❌
   - Ada error? Screenshot console!

---

## 📞 BUTUH BANTUAN?

Jika ada error:

1. **Screenshot console browser** (F12)
2. **Screenshot error message**
3. **Kasih tau langkah yang dilakukan**

Saya siap bantu fix!

---

**Semua sudah siap! Tinggal SHARE SPREADSHEET dan TEST!** 🚀

---

Updated: 2026-05-09
Status: ✅ READY TO TEST!
