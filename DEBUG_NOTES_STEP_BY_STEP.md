# 🔍 DEBUG NOTES - STEP BY STEP (5 MENIT!)

## ❌ MASALAH: Notes jadi "-" semua

Saya sudah tambahkan DEBUG LOGS untuk cek PERSIS di mana masalahnya!

---

## 🚀 IKUTI LANGKAH INI SATU-SATU:

### **STEP 1: UPDATE APPS SCRIPT (2 menit)**

1. **Buka Google Sheets:**
   https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit

2. **Extensions → Apps Script**

3. **SELECT ALL code (Ctrl+A)**

4. **DELETE (Delete key)**

5. **Buka file:** `google-apps-script/Code-WithColumns.gs`

6. **Copy SEMUA isi file** (Ctrl+A lalu Ctrl+C di file itu)

7. **Paste ke Apps Script editor** (Ctrl+V)

8. **SAVE** (Ctrl+S)

9. **TUNGGU sampai "All changes saved in Drive" muncul**

---

### **STEP 2: RUN setupSheetHeaders (1 menit)**

1. **Di Apps Script editor:**
   - Dropdown function (atas) → **Pilih:** `setupSheetHeaders`
   - **Klik RUN** (▶️ icon)

2. **Kalau muncul "Authorization required":**
   - Klik **Review Permissions**
   - Pilih akun Google kamu
   - Klik **Advanced** → **Go to ... (unsafe)**
   - Klik **Allow**

3. **Tunggu sampai selesai**

4. **Check Google Sheets tab "submissions":**
   - Harus ada **28 columns** dengan header biru
   - Dari: id, branchId, userNik, ... sampai Admin Nama

---

### **STEP 3: DEPLOY NEW VERSION (1 menit)**

1. **Klik:** Deploy → Manage deployments

2. **Klik icon EDIT** (pensil) di deployment yang aktif

3. **IMPORTANT - Version:**
   - **Pilih:** New version
   - **Description:** "Debug notes fix v2"

4. **Pastikan settings:**
   - Execute as: **Me**
   - Who has access: **Siapa saja / Anyone**

5. **Klik DEPLOY**

6. **Tunggu sampai "Deployment successful"**

7. **CLOSE deployment dialog**

---

### **STEP 4: HARD REFRESH APLIKASI (30 detik)**

1. **CLOSE tab aplikasi** (X di tab)

2. **CLEAR CACHE:**
   - Tekan: Ctrl+Shift+Delete
   - Pilih: "Cached images and files"
   - Time range: "Last hour"
   - Klik: Clear data

3. **OPEN NEW TAB**

4. **Load aplikasi**

5. **HARD REFRESH:**
   - Windows: **Ctrl + Shift + R**
   - Mac: **Cmd + Shift + R**

---

### **STEP 5: TEST SUBMIT DENGAN CATATAN (1 menit)**

1. **Login A336**

2. **Isi minimal indikator** (yang wajib aja)

3. **Upload minimal foto** (yang wajib aja)

4. **Klik:** Submit dengan Catatan

5. **ISI SEMUA FIELD NOTES:**
   - **Reason:** "Test debug v2"
   - **Approval:** "Approved for testing"
   - **Admin NIK:** [isi dengan NIK admin yang VALID - harus ada di data admin!]
   - **Admin Nama:** [isi dengan nama admin yang VALID - harus match dengan NIK!]

6. **Klik SUBMIT**

---

### **STEP 6: CHECK BROWSER CONSOLE (1 menit)**

1. **Tekan F12** (buka Developer Tools)

2. **Klik tab "Console"**

3. **Cari logs dengan emoji 🔍:**

   **Harus ada:**
   ```
   🔍 DEBUG - savedNotes: {reason: "Test debug v2", approval: "Approved for testing", ...}
   🔍 API DEBUG - submission.notes: {reason: "Test debug v2", approval: "Approved for testing", ...}
   🔍 API DEBUG - notes type: object
   🔍 API DEBUG - payload.data.notes: {reason: "Test debug v2", approval: "Approved for testing", ...}
   ```

4. **SCREENSHOT console** dan kirim ke saya!

---

### **STEP 7: CHECK APPS SCRIPT LOGS (1 menit)**

1. **Buka Apps Script editor**

2. **Klik icon "Executions"** di sidebar kiri (atau View → Executions)

3. **Klik execution paling atas** (yang paling baru)

4. **Lihat logs - harus ada:**
   ```
   🔍 DEBUG - submission.notes: {"reason":"Test debug v2","approval":"Approved for testing",...}
   🔍 DEBUG - notes object: {"reason":"Test debug v2","approval":"Approved for testing",...}
   🔍 DEBUG - notes.reason: Test debug v2
   🔍 DEBUG - notes.approval: Approved for testing
   🔍 DEBUG - notes.adminNik: [NIK]
   🔍 DEBUG - notes.adminNama: [Nama]
   ```

5. **SCREENSHOT execution logs** dan kirim ke saya!

---

### **STEP 8: CHECK GOOGLE SHEETS (30 detik)**

1. **Buka tab "submissions"**

2. **Lihat row paling bawah** (submission yang baru)

3. **Scroll ke kanan sampai kolom Y, Z, AA, AB**

4. **Check isi columns:**
   - **Y (Reason):** Harus ada "Test debug v2" (BUKAN "-")
   - **Z (Approval):** Harus ada "Approved for testing" (BUKAN "-")
   - **AA (Admin NIK):** Harus ada NIK yang kamu isi (BUKAN "-")
   - **AB (Admin Nama):** Harus ada nama yang kamu isi (BUKAN "-")

5. **SCREENSHOT Google Sheets** (termasuk columns Y, Z, AA, AB)

---

## 📸 KIRIM 3 SCREENSHOT INI:

1. **Browser Console** (step 6) - logs dengan emoji 🔍
2. **Apps Script Execution Logs** (step 7) - logs dengan emoji 🔍
3. **Google Sheets** (step 8) - columns Y, Z, AA, AB

---

## 🎯 KALAU MASIH JADI "-" SEMUA:

Dari 3 screenshot itu, saya bisa tahu PERSIS masalahnya:

**Scenario 1: Browser console tidak ada logs 🔍**
→ Aplikasi belum hard refresh dengan benar
→ Solusi: Clear cache lagi, close browser completely, reopen

**Scenario 2: Browser console ada logs, tapi notes kosong: `{reason: "", approval: "", ...}`**
→ Frontend tidak ambil values dari form dengan benar
→ Solusi: Saya akan fix frontend code

**Scenario 3: Browser console ada logs dengan values, tapi Apps Script logs tidak ada atau notes kosong**
→ Backend tidak terima notes dengan benar
→ Solusi: Saya akan fix API payload atau Apps Script code

**Scenario 4: Apps Script logs ada values, tapi Google Sheets tetap "-"**
→ Apps Script tidak simpan dengan benar
→ Solusi: Saya akan fix Apps Script row data logic

---

## ✅ KALAU SUKSES:

Google Sheets harus menunjukkan:
- Y: Test debug v2
- Z: Approved for testing
- AA: [NIK kamu]
- AB: [Nama kamu]

**BUKAN:** semua kolom jadi "-"

---

## 🔥 IMPORTANT:

- **JANGAN SKIP STEP!** Ikuti satu-satu dari Step 1 sampai 8
- **PASTIKAN deploy "New version"** di Step 3 (bukan "Latest code")
- **PASTIKAN hard refresh** di Step 4 (Ctrl+Shift+R)
- **PASTIKAN isi SEMUA field notes** di Step 5

---

**MULAI DARI STEP 1 SEKARANG!**

Kalau masih jadi "-" setelah Step 8, **kirim 3 screenshot** dan saya akan tahu PERSIS masalahnya! 🔍
