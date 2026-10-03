# 🎯 SETUP EXPANDED COLUMNS FORMAT

## ✅ FORMAT BARU: Setiap Indikator = Kolom Terpisah!

**Tampilan baru di Google Sheets:**

```
| Tanggal | Waktu | NIK | Nama | Total Score | Sales | Trx | Basket Size | WA Personal | WA Personal Foto | No Baru | After Sales Foto | Proteksi | Google Review | MGB | MGB Foto 1 | MGB Foto 2 | MGB Foto 3 | Reason | Approval | Admin NIK | Admin Nama |
|---------|-------|-----|------|-------------|-------|-----|-------------|-------------|------------------|---------|------------------|----------|---------------|-----|------------|------------|------------|--------|----------|-----------|------------|
| 9/5/26  | 07:00 | 191 | Muh  | 100         | 6M    | 6   | 1M          | 20          | ✓ Foto           | 3       | ✓ Foto           | 1        | 1             | 10  | ✓ Foto     | ✓ Foto     | ✓ Foto     | ...    | ...      | ...       | ...        |
```

**Kelebihan:**
- ✅ Setiap indikator punya kolom sendiri - mudah dibaca!
- ✅ Foto ada marker "✓ Foto" - tahu mana yang ada foto
- ✅ Mudah di-sort, filter, analyze di Google Sheets
- ✅ Export to Excel langsung cantik!
- ✅ Bisa langsung buat pivot table/chart

---

## 📋 SETUP LANGKAH (10 MENIT):

### **Step 1: Setup Header di Google Sheets** (PENTING!)

1. **Buka Google Sheets:**
   https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit

2. **Klik tab "submissions"**

3. **Buka Apps Script:**
   Extensions → Apps Script

4. **Paste code baru** (dari `google-apps-script/Code-WithColumns.gs`)

5. **Save** (Ctrl+S)

6. **RUN FUNCTION setupSheetHeaders:**
   - Di toolbar atas, ada dropdown function selector
   - **Pilih:** `setupSheetHeaders`
   - **Klik Run** (▶️ icon)
   - **Authorize** jika diminta
   - **Tunggu selesai** (lihat execution log)

7. **Check tab "submissions":**
   - Harus ada header berwarna biru
   - 22 kolom dari Tanggal sampai Admin Nama

### **Step 2: Deploy Code Baru**

1. **Klik:** Deploy → Manage deployments

2. **Edit deployment** (icon pensil)

3. **Version:** **New version**
   - Description: "Expanded columns format"

4. **Settings:**
   - Execute as: **Me**
   - Who has access: **Siapa saja**

5. **Deploy**

6. **URL tetap sama**

### **Step 3: Test Submit**

1. **Hard refresh aplikasi** (`Ctrl+Shift+R`)

2. **Login A336**

3. **Isi semua 9 indikator**

4. **Upload 5 foto**

5. **Submit**

6. **Check Google Sheets tab "submissions":**
   - Harus ada row baru
   - Semua kolom terisi
   - Kolom foto ada "✓ Foto" marker

---

## 📊 STRUKTUR KOLOM LENGKAP:

| Column | Header | Isi | Note |
|--------|--------|-----|------|
| A | Tanggal | 9/5/2026 | Format: dd/MM/yyyy |
| B | Waktu | 07:00 | Format: HH:mm |
| C | NIK | 191924 | User NIK |
| D | Nama | Muhammad Ihsa | User name |
| E | Total Score | 100 | Percentage |
| F | Sales | 6000000 | Number value |
| G | Trx | 6 | Number value |
| H | Basket Size | 1000000 | Auto-calculated |
| I | WA Personal | 20 | Number value |
| J | WA Personal Foto | ✓ Foto | Photo marker |
| K | No Baru Customer | 3 | Manual input |
| L | After Sales Foto | ✓ Foto | Photo marker |
| M | Proteksi | 1 | Number value |
| N | Google Review | 1 | Number value |
| O | MGB | 10 | Number value |
| P | MGB Foto 1 | ✓ Foto | Photo marker |
| Q | MGB Foto 2 | ✓ Foto | Photo marker |
| R | MGB Foto 3 | ✓ Foto | Photo marker |
| S | Reason | ... | Notes reason (if any) |
| T | Approval | ... | Notes approval (if any) |
| U | Admin NIK | ... | Admin NIK (if any) |
| V | Admin Nama | ... | Admin name (if any) |

---

## 📸 TENTANG FOTO:

**Kenapa "✓ Foto" bukan preview image?**

1. **File size:** Base64 image sangat besar (1 foto ~100KB text)
2. **Performance:** Google Sheets jadi lambat kalau banyak base64
3. **Practical:** Marker "✓ Foto" cukup untuk tahu ada foto atau tidak

**Foto asli tetap tersimpan!** Hanya tidak di-display langsung di cell.

**Opsi lain (jika mau foto terlihat):**
- Upload foto ke Google Drive
- Insert link Drive di cell
- User bisa klik link untuk lihat foto

*(Butuh implementasi lebih complex - bisa dilakukan nanti jika perlu)*

---

## 🎨 TIPS PENGGUNAAN:

### **Filter Data**
1. Select header row
2. Data → Create a filter
3. Klik dropdown di kolom manapun untuk filter

### **Sort Data**
1. Klik kolom yang mau di-sort
2. Data → Sort sheet by column X

### **Pivot Table**
1. Select all data
2. Insert → Pivot table
3. Bisa analyze per user, per tanggal, dll

### **Export to Excel**
1. File → Download → Microsoft Excel (.xlsx)
2. File sudah siap dengan format yang sama!

---

## 🔧 TROUBLESHOOTING:

### **Error saat run setupSheetHeaders**
- Pastikan sudah authorize
- Check execution log untuk detail error

### **Header tidak muncul**
- Coba run setupSheetHeaders lagi
- Pastikan tab "submissions" exists

### **Submit tidak muncul di sheet**
- Check Apps Script execution logs
- Pastikan deploy sudah dengan "New version"
- Hard refresh aplikasi

---

## ✅ CHECKLIST:

- [ ] Apps Script dibuka
- [ ] Code baru di-paste (Code-WithColumns.gs)
- [ ] Save
- [ ] Run setupSheetHeaders
- [ ] Header muncul di tab "submissions" (22 kolom)
- [ ] Deploy dengan "New version"
- [ ] Hard refresh aplikasi
- [ ] Test submit
- [ ] Data muncul dengan format baru (kolom terpisah)
- [ ] Foto ada marker "✓ Foto"

---

## 🎉 SELESAI!

Sekarang data submission akan muncul dengan format yang **mudah dibaca**:
- ✅ Setiap indikator = kolom terpisah
- ✅ Foto ada marker
- ✅ Mudah filter & sort
- ✅ Mudah export to Excel
- ✅ Bisa buat chart & analytics

**MULAI DARI STEP 1 SEKARANG!**

---

Updated: 2026-05-09
Status: ✅ READY TO IMPLEMENT
