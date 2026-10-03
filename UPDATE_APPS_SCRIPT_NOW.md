# 🚀 UPDATE APPS SCRIPT - STEP BY STEP

## 📋 LANGKAH LENGKAP (5 MENIT):

### **Step 1: Buka Apps Script Editor**

1. **Buka Google Sheets:**
   https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit

2. **Klik menu:** Extensions → Apps Script

### **Step 2: Ganti Code**

1. **SELECT ALL** code yang ada (Ctrl+A)

2. **DELETE** semua (Delete/Backspace)

3. **PASTE code baru** dari bawah ini

---

## 📝 CODE BARU (COPY SEMUA):

```javascript
/**
 * Google Apps Script untuk WRITE operations ke Google Sheets
 * Deploy as Web App untuk dapat endpoint URL
 *
 * IMPORTANT DEPLOYMENT SETTINGS:
 * - Execute as: Me (your-email@gmail.com)
 * - Who has access: Anyone (Siapa saja)
 */

// IMPORTANT: Ganti dengan Spreadsheet ID kamu!
const SPREADSHEET_ID = '1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0';

/**
 * Handle GET requests (testing endpoint)
 */
function doGet(e) {
  const output = JSON.stringify({
    status: 'ok',
    message: 'Crown Daily Indicators API is running!',
    timestamp: new Date().toISOString(),
    method: 'GET'
  });

  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests untuk write operations
 */
function doPost(e) {
  try {
    // Log untuk debugging
    Logger.log('POST Request received');
    Logger.log('Content type: ' + e.contentLength);

    // Parse request body
    let params;
    try {
      params = JSON.parse(e.postData.contents);
      Logger.log('Parsed params: ' + JSON.stringify(params));
    } catch (parseError) {
      throw new Error('Invalid JSON in request body: ' + parseError.toString());
    }

    const action = params.action;

    if (!action) {
      throw new Error('Missing "action" field in request');
    }

    // Route ke function yang sesuai
    let result;
    switch(action) {
      case 'addSubmission':
        if (!params.data) {
          throw new Error('Missing "data" field for addSubmission');
        }
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
    const output = JSON.stringify({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });

    return ContentService
      .createTextOutput(output)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log error
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Error stack: ' + error.stack);

    // Return error response
    const errorOutput = JSON.stringify({
      success: false,
      error: error.toString(),
      timestamp: new Date().toISOString()
    });

    return ContentService
      .createTextOutput(errorOutput)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Add submission to Google Sheets
 */
function addSubmission(submission) {
  try {
    Logger.log('addSubmission called with ID: ' + submission.id);

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

    Logger.log('Row appended successfully');

    return {
      id: submission.id,
      success: true,
      message: 'Submission added successfully'
    };

  } catch (error) {
    Logger.log('Error in addSubmission: ' + error.toString());
    throw error;
  }
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

---

### **Step 3: Save**

**Klik:** File → Save (atau `Ctrl+S`)

### **Step 4: Deploy ULANG**

1. **Klik:** Deploy → **Manage deployments**

2. **Klik icon "Edit" (pensil)** di deployment "CROWN"

3. **PENTING - Update version:**
   - Di bagian atas dialog, ada dropdown **"Version"**
   - **Pilih:** **"New version"** ← PENTING!
   - Description: "Fixed CORS and error handling"

4. **Verify settings:**
   - Execute as: **Me** (email kamu)
   - Who has access: **Siapa saja**

5. **Klik "Deploy"**

6. **URL tetap sama** (tidak berubah)

---

### **Step 5: Test Endpoint**

**Buka di browser:**
```
https://script.google.com/macros/s/AKfycbzr2wl9IzQ8qURz5ZM3bcAP40PrjXgmxScCywdNIjL1-byx7PqEpv_qk_MNIEenoFCrPw/exec
```

**Harus muncul:**
```json
{
  "status": "ok",
  "message": "Crown Daily Indicators API is running!",
  "timestamp": "...",
  "method": "GET"
}
```

✅ **Ada "method": "GET"** = code baru sudah aktif!

---

### **Step 6: Test Submit di Aplikasi**

1. **Hard refresh:** `Ctrl+Shift+R`
2. **Login A336**
3. **Isi semua indikator**
4. **Open Console (F12)**
5. **Klik Submit**
6. **Check Console:**
   - `📦 Payload:` → data yang dikirim
   - `📥 Response status:` → harus 200
   - `✅ Added submission...` → SUCCESS!

---

## 🎯 CHECKLIST:

- [ ] Apps Script Editor dibuka
- [ ] Code lama di-delete
- [ ] Code baru di-paste
- [ ] Save (Ctrl+S)
- [ ] Deploy → Manage deployments → Edit
- [ ] Version: **New version**
- [ ] Execute as: Me
- [ ] Who has access: **Siapa saja**
- [ ] Deploy
- [ ] Test endpoint di browser (harus ada "method": "GET")
- [ ] Hard refresh aplikasi
- [ ] Test submit
- [ ] ✅ SUCCESS!

---

## 🐛 IF ERROR:

**Check Apps Script Execution Logs:**
1. Di Apps Script Editor
2. Klik icon **"Executions"** (ikon jam) di sidebar kiri
3. Lihat log error detail

**Screenshot yang dibutuhkan:**
1. Apps Script execution logs
2. Console error saat submit
3. Network tab (F12 → Network) saat submit

---

**MULAI DARI STEP 1 SEKARANG!**
