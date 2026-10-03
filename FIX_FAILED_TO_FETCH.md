# ❌ FIX ERROR: Failed to fetch

## 🔍 ERROR YANG TERJADI:

```
❌ Error adding submission: TypeError: Failed to fetch
```

## 🎯 ROOT CAUSE:

Apps Script deployment **tidak di-set dengan benar** atau **CORS issue**.

---

## ✅ SOLUSI 1: REDEPLOY APPS SCRIPT (PALING PENTING!)

### **Step 1: Buka Apps Script Editor**

1. **Buka Google Sheets:**
   https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit

2. **Klik:** Extensions → Apps Script

### **Step 2: Verify Code**

Pastikan code yang ada adalah code dari `google-apps-script/Code.gs`.

**IMPORTANT:** Pastikan baris pertama adalah:
```javascript
const SPREADSHEET_ID = '1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0';
```

### **Step 3: Redeploy dengan Setting yang BENAR**

1. **Klik:** Deploy → **Manage deployments**

2. **Klik icon "Edit"** (pensil) di deployment yang ada

3. **PENTING - Verify Settings:**
   - **Configuration:**
     - Description: Crown Daily Indicators API
   - **Execute as:** **Me** (your email@gmail.com)
   - **Who has access:** **Anyone** ⚠️ **MUST BE "ANYONE"!**

4. **Klik "Deploy"**

5. **Jika muncul "New version":**
   - Klik **"Deploy"** lagi
   - Authorize jika diminta

6. **Copy URL yang BARU** (mungkin sama atau beda):
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```

### **Step 4: Update URL di Code (jika beda)**

Jika URL berubah, kasih tau saya URL yang baru!

---

## ✅ SOLUSI 2: TEST ENDPOINT VIA BROWSER

**Test apakah Apps Script jalan:**

Buka URL ini di browser:
```
https://script.google.com/macros/s/AKfycbzr2wl9IzQ8qURz5ZM3bcAP40PrjXgmxScCywdNIjL1-byx7PqEpv_qk_MNIEenoFCrPw/exec
```

**Harus muncul:**
```json
{
  "status": "ok",
  "message": "Crown Daily Indicators API is running!",
  "timestamp": "2026-05-09T..."
}
```

### **❌ Jika ERROR atau BLANK:**
- Apps Script tidak di-deploy dengan benar
- Redeploy lagi (Solusi 1)
- Pastikan "Who has access" = **Anyone**

### **❌ Jika muncul "Authorization required":**
- Deployment setting "Execute as" salah
- Harus "Execute as: **Me**"

---

## ✅ SOLUSI 3: CHECK COMMON ISSUES

### **Issue 1: "Who has access" bukan "Anyone"**

**Harus:**
- Execute as: **Me**
- Who has access: **Anyone** ← PENTING!

**Jangan:**
- Who has access: "Only myself"
- Who has access: "Anyone within [organization]"

### **Issue 2: Authorization belum selesai**

Saat deploy pertama kali, harus:
1. Klik "Authorize access"
2. Pilih Google account
3. Klik "Advanced"
4. Klik "Go to [project name] (unsafe)"
5. Klik "Allow"

### **Issue 3: Code salah atau tidak lengkap**

Pastikan code di Apps Script **SAMA PERSIS** dengan `google-apps-script/Code.gs`.

---

## 🧪 AFTER FIX - TEST LAGI:

### **1. Test Endpoint (Browser)**
```
https://script.google.com/macros/s/AKfycbzr2wl9IzQ8qURz5ZM3bcAP40PrjXgmxScCywdNIjL1-byx7PqEpv_qk_MNIEenoFCrPw/exec
```

✅ Harus return JSON "status: ok"

### **2. Hard Refresh Aplikasi**
`Ctrl+Shift+R` atau `Cmd+Shift+R`

### **3. Test Submit**
1. Login ke A336
2. Isi semua indikator
3. Upload 5 foto
4. **Check Console (F12):**
   - Harus muncul: `🔧 Using Apps Script endpoint for write...`
   - Harus muncul: `📤 Sending to: https://...`
   - Harus muncul: `📥 Response status: 200`
   - Harus muncul: `✅ Added submission...`
5. Klik Submit
6. ✅ **SUCCESS!**

### **4. Verify di Google Sheets**
Tab "submissions" → harus ada row baru!

---

## 📊 DETAILED ERROR LOGS:

Sekarang code sudah update dengan **detailed logging**.

**Check Console (F12) untuk lihat:**
- `📤 Sending to:` → URL endpoint
- `📥 Response status:` → HTTP status code
- `📊 Response data:` → Response dari Apps Script
- `❌ Fetch error:` → Error detail (jika gagal)

---

## 🐛 STILL ERROR?

**Screenshot yang dibutuhkan:**

1. **Apps Script deployment settings** (bagian "Who has access")
2. **Browser console** (F12) setelah klik Submit
3. **Test endpoint di browser** (buka URL Apps Script)
4. **Apps Script execution logs:**
   - Di Apps Script editor: Executions → View logs

---

## ✅ CHECKLIST:

- [ ] Apps Script code lengkap dan benar
- [ ] Deploy → Execute as: **Me**
- [ ] Deploy → Who has access: **Anyone**
- [ ] Authorization completed
- [ ] Test endpoint via browser (return JSON "ok")
- [ ] Hard refresh aplikasi
- [ ] Console log: "Using Apps Script endpoint"
- [ ] Test submit
- [ ] Data muncul di Google Sheets

---

**REDEPLOY APPS SCRIPT SEKARANG!**

Updated: 2026-05-09
