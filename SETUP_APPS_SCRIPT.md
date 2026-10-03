# 🚀 SETUP GOOGLE APPS SCRIPT - 10 MENIT!

## 🎯 KENAPA BUTUH APPS SCRIPT?

Google Sheets API **tidak support API Key untuk WRITE** (submit data).

**Solusi:** Google Apps Script sebagai endpoint (gratis, mudah, no OAuth!)

---

## 📋 LANGKAH SETUP (10 MENIT):

### **Step 1: Buka Google Sheets**
https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit

### **Step 2: Buka Apps Script Editor**
1. Di Google Sheets, klik menu **Extensions** → **Apps Script**
2. Window baru akan terbuka dengan Apps Script editor

### **Step 3: Copy-Paste Code**

**HAPUS semua code yang ada**, lalu paste code ini:

```javascript
/**
 * Google Apps Script untuk WRITE operations ke Google Sheets
 * Deploy as Web App untuk dapat endpoint URL
 */

// IMPORTANT: Ganti dengan Spreadsheet ID kamu!
const SPREADSHEET_ID = '1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0';

/**
 * Handle GET requests (optional - for testing)
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Crown Daily Indicators API is running!',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests untuk write operations
 */
function doPost(e) {
  try {
    // Parse request
    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    // Route ke function yang sesuai
    let result;
    switch(action) {
      case 'addSubmission':
        result = addSubmission(params.data);
        break;
      case 'updateSettings':
        result = updateSettings(params.data);
        break;
      case 'deleteSubmission':
        result = deleteSubmission(params.data);
        break;
      default:
        throw new Error('Invalid action: ' + action);
    }

    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Add submission to Google Sheets
 */
function addSubmission(submission) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('submissions');

  if (!sheet) {
    throw new Error('Sheet "submissions" not found!');
  }

  // Prepare row data
  const rowData = [
    submission.id || '',
    submission.branchId || '',
    submission.user?.nik || '',
    submission.user?.nama || '',
    submission.date || '',
    submission.createdAt || new Date().toISOString(),
    submission.totalScore || 0,
    JSON.stringify(submission.data || {}),
    JSON.stringify(submission.photos || {}),
    submission.notes ? JSON.stringify(submission.notes) : ''
  ];

  // Append to sheet
  sheet.appendRow(rowData);

  return {
    id: submission.id,
    success: true
  };
}

/**
 * Update settings
 */
function updateSettings(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('settings');

  if (!sheet) {
    throw new Error('Sheet "settings" not found!');
  }

  // Find row by branchId
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.branchId) {
      // Update row
      sheet.getRange(i + 1, 1, 1, 6).setValues([[
        data.branchId,
        data.loginTitle || '',
        data.loginSubtitle || '',
        data.minScore || 80,
        values[i][4], // keep createdAt
        new Date().toISOString() // updatedAt
      ]]);
      return { success: true };
    }
  }

  // If not found, append new row
  sheet.appendRow([
    data.branchId,
    data.loginTitle || '',
    data.loginSubtitle || '',
    data.minScore || 80,
    new Date().toISOString(),
    new Date().toISOString()
  ]);

  return { success: true };
}

/**
 * Delete submission by ID
 */
function deleteSubmission(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('submissions');

  if (!sheet) {
    throw new Error('Sheet "submissions" not found!');
  }

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.id) {
      sheet.deleteRow(i + 1);
      return { success: true, deleted: data.id };
    }
  }

  throw new Error('Submission not found: ' + data.id);
}
```

### **Step 4: Save Project**
1. Klik **File** → **Save** (atau `Ctrl+S`)
2. Nama project: **"Crown API"** (atau nama lain)

### **Step 5: Deploy as Web App**

1. Klik **Deploy** → **New deployment**

2. **⚙️ Settings deployment:**
   - Klik icon **"gear" (⚙️)** di samping "Select type"
   - Pilih **"Web app"**

3. **Configuration:**
   - **Description:** Crown Daily Indicators API
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone** ⚠️ PENTING!

4. Klik **Deploy**

5. **Authorization required:**
   - Klik **"Authorize access"**
   - Pilih Google account kamu
   - Klik **"Advanced"** (di bawah)
   - Klik **"Go to Crown API (unsafe)"**
   - Klik **"Allow"**

6. **COPY WEB APP URL:**
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```
   ⚠️ **SIMPAN URL ini!**

### **Step 6: Paste URL ke .env**

Edit file `.env` di root project:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz.../exec
```

⚠️ **Paste URL yang kamu copy dari Step 5!**

### **Step 7: Restart Dev Server**

```bash
# Stop server (Ctrl+C)
# Start lagi
pnpm run dev
```

---

## 🧪 TEST ENDPOINT:

### **Test 1: Via Browser**
Buka URL Apps Script di browser:
```
https://script.google.com/macros/s/AKfycbz.../exec
```

Harus muncul:
```json
{
  "status": "ok",
  "message": "Crown Daily Indicators API is running!",
  "timestamp": "2026-05-09T..."
}
```

✅ **Berhasil!** Endpoint sudah jalan!

### **Test 2: Via Aplikasi**
1. Hard refresh aplikasi (`Ctrl+Shift+R`)
2. Login ke A336
3. Isi semua indikator
4. Klik Submit
5. Harus muncul success message!
6. Check Google Sheets tab "submissions" → harus ada row baru!

---

## 🐛 TROUBLESHOOTING:

### **❌ Error: "Script function not found: doPost"**
- Pastikan code sudah di-save (Ctrl+S)
- Deploy ulang: **Deploy** → **Manage deployments** → **Edit** → **Deploy**

### **❌ Error: "Authorization required"**
- Klik **"Authorize access"**
- Follow authorization flow lagi

### **❌ Error: "Sheet 'submissions' not found"**
- Pastikan tab "submissions" ada di Google Sheets
- Pastikan SPREADSHEET_ID benar di code Apps Script

### **❌ Submit masih error 401**
- Pastikan VITE_APPS_SCRIPT_URL sudah diisi di .env
- Restart dev server
- Hard refresh browser

### **❌ Data tidak muncul di Google Sheets**
- Check console log (F12) untuk error
- Test endpoint via browser (Test 1)
- Pastikan "Who has access" = **Anyone**

---

## 📊 ARCHITECTURE:

```
User Submit Data
      ↓
React App
      ↓
api.ts (addSubmission)
      ↓
POST → Apps Script Web App
      ↓
Apps Script (doPost)
      ↓
appendRow() → Google Sheets
      ↓
✅ Data tersimpan!
```

**READ:** Google Sheets API (API Key) ← Fast, langsung
**WRITE:** Apps Script Endpoint ← Gratis, no OAuth!

---

## ✅ CHECKLIST:

- [ ] Apps Script code di-copy & paste
- [ ] Project di-save
- [ ] Deploy as Web App (Execute as: Me, Access: Anyone)
- [ ] Authorization completed
- [ ] Web App URL di-copy
- [ ] URL di-paste ke .env (VITE_APPS_SCRIPT_URL)
- [ ] Dev server di-restart
- [ ] Test endpoint via browser (harus return JSON "ok")
- [ ] Test submit di aplikasi
- [ ] Data muncul di Google Sheets tab "submissions"

---

## 🎉 SELESAI!

Aplikasi sekarang support:
- ✅ READ via Google Sheets API (fast!)
- ✅ WRITE via Apps Script (gratis, no OAuth!)
- ✅ Multi-device sync
- ✅ 100% FREE forever
- ✅ Submit data works!

---

**UPDATE CODE:** 2026-05-09
**STATUS:** ✅ READY TO DEPLOY
