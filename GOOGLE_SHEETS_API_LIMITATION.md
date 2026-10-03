# ⚠️ Google Sheets API Limitation - API Key Cannot WRITE

## 🔴 ERROR YANG TERJADI:

```
❌ Google Sheets API error: {
  "error": {
    "code": 401,
    "message": "API keys are not supported by this API. 
                Expected OAuth2 access token or other authentication credentials..."
  }
}
```

---

## 🔍 ROOT CAUSE:

**Google Sheets API key HANYA untuk READ operations!**

**BISA (dengan API key):**
- ✅ Read data (`getValues`)
- ✅ Fetch indicators
- ✅ Fetch settings
- ✅ Fetch submissions

**TIDAK BISA (dengan API key):**
- ❌ Write data (`appendValues`, `updateValues`)
- ❌ Update indicators via code
- ❌ Update settings via code
- ❌ Update rows via code

**Untuk WRITE harus pakai:**
- Apps Script Web App (sudah dipakai untuk submissions!)
- OAuth2 authentication (kompleks, butuh login Google)

---

## ✅ SUDAH DIPERBAIKI:

**Functions yang di-DISABLE:**
1. `api.updateIndicators()` - DISABLED ❌
2. `api.updateSettings()` - DISABLED ❌

**Sekarang return false dan log warning message.**

---

## 📝 CARA UPDATE INDICATORS/SETTINGS:

### **Update Target Indicators (Sales, Trx, dll):**

**Step 1: Edit Google Sheets**
1. Buka: https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit
2. Tab: **indicators**
3. Find row untuk indicator yang mau diubah (contoh: Sales)
4. **Edit kolom E (targetValue)** → ganti value (contoh: 6000000 → 7000000)
5. **Tekan Enter**
6. **Save (Ctrl+S)**
7. **Tunggu "All changes saved in Drive"**

**Step 2: Clear Cache di Aplikasi**

**Option A: Button "Clear Cache" (INSTANT)**
1. User buka aplikasi
2. Klik "Riwayat Saya" (History)
3. Klik button "Clear Cache" (🗑️)
4. Target updated! ✅

**Option B: Automatic (5 MENIT)**
1. User continue pakai aplikasi
2. Tunggu 5 menit
3. Cache expired
4. Target auto-updated! ✅

---

### **Update Settings (Min Score, Title, dll):**

**Step 1: Edit Google Sheets**
1. Buka: https://docs.google.com/spreadsheets/d/1pPxEAmBzR4vq3AiXyEQ4JqMe3pT4KyenLLiosuF-aU0/edit
2. Tab: **settings**
3. Find row untuk branch (contoh: A336)
4. **Edit columns:**
   - loginTitle
   - loginSubtitle
   - minScore
5. **Save (Ctrl+S)**

**Step 2: Clear Cache di Aplikasi**
- Same as indicators (klik "Clear Cache" atau tunggu 5 menit)

---

## 🎯 WORKFLOW UNTUK ADMIN:

### **Scenario: Update Target Sales 6M → 7M**

**Admin (di Google Sheets):**
1. Buka Sheets → tab indicators
2. Find row Sales (A336)
3. Edit kolom E: 6000000 → 7000000
4. Save (Ctrl+S)

**Broadcast ke users:**
```
📢 TARGET SALES UPDATED: 6 juta → 7 juta!

Cara update di device kamu:
1. Buka aplikasi
2. Klik "Riwayat Saya"
3. Klik button "Clear Cache" (🗑️)
4. Target sekarang 7 juta! ✅

Atau tunggu 5 menit untuk auto-update.
```

---

## 🔧 TECHNICAL DETAILS:

### **Why API Key Cannot Write:**

Google Sheets API has 2 authentication methods:
1. **API Key** - Read-only, simple, no login required ✅
2. **OAuth2** - Read+Write, complex, requires user login ❌

**Architecture sekarang:**
- READ: Google Sheets API v4 with API key ✅
- WRITE (submissions): Apps Script Web App ✅
- WRITE (indicators/settings): **Manual edit di Google Sheets** ✅

**Why not use Apps Script for indicators/settings?**
- Apps Script sudah dipakai untuk submissions (works!)
- Tapi untuk indicators/settings, **manual edit lebih simple**
- Jarang diupdate (beda dengan submissions yang sering)
- Admin punya akses ke Google Sheets anyway

---

## 💡 ALTERNATIVE SOLUTIONS (FUTURE):

### **Option 1: Apps Script Endpoint (30 min coding)**

**Add endpoints:**
- `updateIndicators` via Apps Script
- `updateSettings` via Apps Script

**Kelebihan:**
- ✅ Update via code/UI
- ✅ No need manual edit Sheets

**Kekurangan:**
- ❌ Perlu implementation
- ❌ Lebih kompleks
- ❌ Overkill untuk update jarang

---

### **Option 2: OAuth2 Implementation (2-3 hours coding)**

**Implement OAuth2 login:**
- User login dengan Google account
- Get OAuth2 token
- Use token untuk write operations

**Kelebihan:**
- ✅ Full access (read + write)
- ✅ No Apps Script needed

**Kekurangan:**
- ❌ Kompleks implementation
- ❌ User harus login Google
- ❌ Perlu handle token refresh
- ❌ Overkill untuk use case ini

---

## ✅ RECOMMENDATION:

**KEEP CURRENT APPROACH:**
1. Admin edit indicators/settings **directly di Google Sheets** (simple!)
2. Users click "Clear Cache" untuk get updated data (instant!)
3. Or wait 5 minutes for auto-update (automatic!)

**Why:**
- ✅ Simple untuk admin (familiar dengan Sheets UI)
- ✅ Fast untuk users (5 min or instant)
- ✅ No complex implementation needed
- ✅ Indicators/settings jarang diupdate anyway

---

## 📋 CHECKLIST FOR ADMIN:

**When updating target/settings:**
- [ ] Buka Google Sheets
- [ ] Tab: indicators atau settings
- [ ] Edit value yang mau diubah
- [ ] Save (Ctrl+S)
- [ ] Tunggu "All changes saved in Drive"
- [ ] Broadcast ke users: "Klik Clear Cache untuk update!"

**Users will:**
- [ ] Klik "Clear Cache" button → instant update ✅
- [ ] OR tunggu 5 menit → auto-update ✅

---

## 🐛 TROUBLESHOOTING:

### **Error 401 masih muncul:**
→ Code masih mencoba write via Sheets API
→ Check: `updateIndicators()` dan `updateSettings()` harus DISABLED

### **Update di Sheets tidak terlihat di app:**
→ Cache belum di-clear
→ Solusi: Klik "Clear Cache" atau tunggu 5 menit

### **"Clear Cache" button tidak works:**
→ Browser cache belum di-refresh (masih code lama)
→ Solusi: Hard refresh browser (Ctrl+Shift+R)

---

## ✅ STATUS:

**Fixed:**
- ✅ `updateIndicators()` - DISABLED, log warning
- ✅ `updateSettings()` - DISABLED, log warning
- ✅ Error 401 will NOT occur anymore

**Workflow:**
- ✅ Admin edit Google Sheets directly (simple!)
- ✅ Users clear cache or wait 5 min (fast!)
- ✅ No error, no problem! 🎉

---

Updated: 2026-05-09
Status: ✅ FIXED - Manual edit via Google Sheets is the way!
