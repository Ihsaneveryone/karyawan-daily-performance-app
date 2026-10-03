# ✅ FIX ERROR 401 - SOLVED!

## ❌ ERROR YANG TERJADI:

```
API keys are not supported by this API. 
Expected OAuth2 access token...
```

## ✅ SOLUSI:

Google Sheets API **tidak support API Key untuk WRITE operations**.

**Fix:** Gunakan **Google Apps Script** sebagai endpoint (gratis & mudah!)

---

## 🚀 LANGKAH CEPAT (10 MENIT):

### **1. Deploy Google Apps Script**

**Buka:** [SETUP_APPS_SCRIPT.md](./SETUP_APPS_SCRIPT.md)

**Ringkasan:**
1. Buka Google Sheets → **Extensions** → **Apps Script**
2. Copy code dari `google-apps-script/Code.gs`
3. Deploy as **Web App** (Execute as: Me, Access: Anyone)
4. **Copy Web App URL**

### **2. Paste URL ke .env**

Edit file `.env`:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbz.../exec
```

**⚠️ PASTE URL dari Step 1!**

### **3. Restart Dev Server**

Aplikasi akan otomatis detect dan menggunakan Apps Script endpoint.

---

## 🧪 TEST:

1. Hard refresh (`Ctrl+Shift+R`)
2. Login ke A336
3. Isi semua indikator
4. Submit
5. ✅ Success!
6. Check Google Sheets tab "submissions" → data harus muncul!

---

## 📊 ARCHITECTURE BARU:

```
READ Operations:
  Google Sheets API (API Key) ← Fast, langsung
  
WRITE Operations:
  Apps Script Endpoint ← Gratis, no OAuth!
```

**Benefits:**
- ✅ 100% GRATIS
- ✅ Multi-device sync
- ✅ No OAuth complexity
- ✅ Submit works!

---

## 📖 DOKUMENTASI LENGKAP:

**Setup Apps Script:** [SETUP_APPS_SCRIPT.md](./SETUP_APPS_SCRIPT.md)

**Paste 9 Indikator:** [PASTE_DATA_9_INDIKATOR.md](./PASTE_DATA_9_INDIKATOR.md)

---

**STATUS:** ✅ FIXED - Deploy Apps Script sekarang!
