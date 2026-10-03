# 🔥 FALLBACK MODE ACTIVATED

## ⚠️ STATUS: Backend Unavailable (HTTP 402)

Backend Supabase mengembalikan **HTTP 402 (Payment Required)**. Ini berarti:
- Supabase project butuh payment
- Atau quota habis
- Atau billing issue

## ✅ SOLUSI: FALLBACK MODE

Aplikasi sekarang jalan dalam **FALLBACK MODE** - 100% localStorage, tanpa backend!

### **Apa Yang Berubah:**

#### **✅ YANG MASIH JALAN:**
- ✅ Login (localStorage based)
- ✅ View indicators
- ✅ Submit data (saved to localStorage)
- ✅ View history (from localStorage)
- ✅ Draft auto-save
- ✅ Offline mode
- ✅ Cache sistem

#### **❌ YANG TIDAK JALAN:**
- ❌ Real-time sync antar device
- ❌ Data persistence (hilang kalau clear browser data)
- ❌ Multi-user data sharing
- ❌ Admin dashboard (data global)
- ❌ Export ke server

## 🔧 CARA AKTIFKAN FALLBACK MODE

File: `src/app/utils/api.ts`

```typescript
// Line 14
const FALLBACK_MODE = true; // ← Set ke true
```

## 📊 DATA FLOW (FALLBACK MODE)

```
User Login
    ↓
getBranches() → localStorage → Return hardcoded branches
    ↓
getIndicators() → localStorage → Return empty (or cached)
    ↓
getSettings() → localStorage → Return default settings
    ↓
Submit Data → Save ke localStorage ONLY
    ↓
View History → Read dari localStorage
```

## 🎯 DEVELOPMENT MODE

Fallback mode sangat berguna untuk:
1. **Development tanpa backend**
2. **Testing UI/UX**
3. **Demo aplikasi**
4. **Prototype**

## 🚀 CARA PERBAIKI (Production)

### **Option 1: Fix Supabase Payment**
1. Login ke Supabase Dashboard
2. Check billing status
3. Add payment method
4. Activate project

### **Option 2: Deploy Backend Sendiri**
1. Deploy Edge Function ke Supabase
2. Update API_URL di `api.ts`
3. Test connectivity

### **Option 3: Switch ke Backend Lain**
1. Deploy ke Vercel/Netlify
2. Update API_URL
3. Update authentication

## 🔍 DEBUG LOGS

Saat FALLBACK_MODE aktif, console akan print:

```
⚠️ FALLBACK MODE: Backend unavailable, using hardcoded default branches
⚡ FALLBACK: Using localStorage indicators
⚠️ FALLBACK MODE: No indicators in localStorage, returning empty array
```

## ⚡ QUICK START (FALLBACK MODE)

### **1. Activate Fallback Mode**
Edit `src/app/utils/api.ts`:
```typescript
const FALLBACK_MODE = true;
```

### **2. Setup Default Data**
App akan auto-create:
- 3 default branches (A336, A416, A339)
- Empty indicators (perlu setup manual)
- Default settings

### **3. Add Indicators (Manual)**
Karena backend unavailable, perlu add indicators manual via localStorage:

**Open Browser Console:**
```javascript
// Add sample indicators
const indicators = [
  {
    id: 'sales',
    name: 'Sales',
    type: 'number',
    targetValue: 100000000,
    weight: 20,
    icon: 'DollarSign'
  },
  {
    id: 'transaksi',
    name: 'Transaksi',
    type: 'number',
    targetValue: 1000,
    weight: 15,
    icon: 'ShoppingCart'
  },
  {
    id: 'mgb',
    name: 'MGB',
    type: 'photo',
    targetPhotos: 3,
    weight: 15,
    icon: 'Camera'
  }
];

// Save to localStorage
localStorage.setItem('indicators_A336', JSON.stringify({
  data: indicators,
  timestamp: Date.now()
}));

console.log('✅ Indicators added! Refresh page.');
```

### **4. Test App**
1. Refresh browser
2. Login dengan NIK: `A336` atau `A416` atau `A339`
3. Submit data → Saved ke localStorage!
4. View history → Read dari localStorage!

## 📝 NOTES

- Data hanya tersimpan di browser (localStorage)
- Clear browser data = data hilang!
- Tidak ada sync antar device
- Perfect untuk development & testing!

## 🔄 CARA DISABLE FALLBACK MODE

Edit `src/app/utils/api.ts`:
```typescript
const FALLBACK_MODE = false; // ← Set ke false
```

Tapi pastikan backend sudah fix dulu!

---

Status: ✅ ACTIVE
Updated: 2026-05-09
