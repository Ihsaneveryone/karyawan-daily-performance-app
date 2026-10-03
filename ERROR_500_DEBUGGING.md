# Error 500 Debugging Guide - GET /branches

## Error yang Terjadi
```
Get branches failed with status: 500
```

## Penyebab Potensial

### 1. **Supabase Database Belum Dikonfigurasi**
Error 500 biasanya terjadi karena table `kv_store_011c131f` belum dibuat di Supabase.

**Solusi:**
1. Buka Supabase Dashboard
2. Pergi ke **Database** → **SQL Editor**
3. Jalankan query berikut:

```sql
CREATE TABLE IF NOT EXISTS kv_store_011c131f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_011c131f(key);
```

### 2. **Environment Variables Tidak Terset**
Edge function memerlukan environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

**Cek:**
```bash
# Di Supabase Dashboard -> Edge Functions -> Configuration
# Pastikan kedua environment variables sudah terset
```

### 3. **Permissions Issue**
Service role key mungkin tidak memiliki permission yang cukup.

**Solusi:**
Pastikan menggunakan **Service Role Key**, bukan **Anon Key** untuk backend.

## Testing & Debugging

### Test 1: Health Check Dasar
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-011c131f/health
```

Expected Response:
```json
{"status":"ok"}
```

### Test 2: Health Check dengan Database
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-011c131f/health/full
```

Expected Response:
```json
{
  "status":"ok",
  "database":"connected",
  "timestamp":"2026-05-02T...",
  "test":"passed"
}
```

Jika test ini gagal, artinya masalah ada di koneksi database.

### Test 3: GET Branches
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-011c131f/branches \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

Expected Response (jika belum ada data):
```json
{"success":true,"data":[]}
```

## Logs untuk Debugging

Check logs di Supabase Dashboard:
1. **Edge Functions** → **make-server-011c131f** → **Logs**
2. Cari error message seperti:
   - `❌ GET /branches - Error: ...`
   - `KV Get error: ...`
   - `Missing Supabase credentials`

## Error Handling yang Sudah Ditambahkan

### Backend (kv_store.tsx)
- ✅ Validasi environment variables
- ✅ Error logging untuk setiap operasi KV
- ✅ Try-catch wrapper di semua function

### Backend (index.tsx)
- ✅ Detailed error logging untuk GET /branches
- ✅ Stack trace capture
- ✅ Health check endpoint dengan database test

### Frontend
- ✅ Error handling di `loadBranches()` dengan toast notification
- ✅ User-friendly error messages
- ✅ Retry mechanism (bisa di-trigger manual dengan refresh)

## Langkah-langkah Fix

1. **Verifikasi Table Sudah Ada:**
   ```sql
   SELECT * FROM kv_store_011c131f;
   ```

2. **Test KV Store Manually:**
   ```sql
   -- Insert test data
   INSERT INTO kv_store_011c131f (key, value) 
   VALUES ('test', '{"test": true}');
   
   -- Read test data
   SELECT * FROM kv_store_011c131f WHERE key = 'test';
   
   -- Delete test data
   DELETE FROM kv_store_011c131f WHERE key = 'test';
   ```

3. **Initialize Default Branches:**
   Jika table sudah ada tapi kosong, branches akan otomatis ter-create saat pertama kali `getBranches()` dipanggil (lihat logic di `api.ts` line 78-112).

4. **Manual Insert Branches (jika perlu):**
   ```sql
   INSERT INTO kv_store_011c131f (key, value)
   VALUES ('branches', '[
     {
       "id": "A336",
       "nik": "A336",
       "name": "Toko A336",
       "adminName": "MGR AZKO",
       "createdAt": "2026-05-02T00:00:00.000Z"
     }
   ]');
   ```

## Quick Fix Script

Jalankan di SQL Editor:

```sql
-- 1. Create table
CREATE TABLE IF NOT EXISTS kv_store_011c131f (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- 2. Create index
CREATE INDEX IF NOT EXISTS idx_kv_store_key ON kv_store_011c131f(key);

-- 3. Initialize with default branch
INSERT INTO kv_store_011c131f (key, value)
VALUES ('branches', '[
  {
    "id": "A336",
    "nik": "A336",
    "name": "Toko A336",
    "displayName": "Toko A336",
    "adminName": "MGR AZKO",
    "createdAt": "2026-05-02T10:00:00.000Z"
  },
  {
    "id": "A416",
    "nik": "A416",
    "name": "Toko A416",
    "displayName": "Toko A416",
    "adminName": "Manager A416",
    "createdAt": "2026-05-02T10:00:00.000Z"
  },
  {
    "id": "A339",
    "nik": "A339",
    "name": "Toko A339",
    "displayName": "Toko A339",
    "adminName": "Manager A339",
    "createdAt": "2026-05-02T10:00:00.000Z"
  }
]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 4. Verify
SELECT * FROM kv_store_011c131f WHERE key = 'branches';
```

## Monitoring

Setelah fix, monitor:
1. Browser Console - seharusnya tidak ada error "Get branches failed"
2. Network Tab - status 200 untuk GET /branches
3. Supabase Logs - tidak ada error message

## Support

Jika masih error setelah semua langkah di atas:
1. Check Supabase Edge Function logs untuk error detail
2. Verify environment variables di Edge Function settings
3. Check table permissions & RLS policies (jika ada)
