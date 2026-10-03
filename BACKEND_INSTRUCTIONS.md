# Backend Optimization Instructions

## URGENT: Add NIK Filter to Submissions Endpoint

### Problem
Frontend sedang fetch SEMUA data submissions, lalu filter di client-side. Ini SANGAT LAMBAT untuk user dengan banyak data.

### Solution
Tambahkan filter NIK di Supabase Edge Function `/branches/{id}/submissions`

---

## 📝 Update Required di Supabase Edge Function

**File:** `supabase/functions/make-server-011c131f/index.ts`

### 1. Add NIK Query Parameter

```typescript
// Get submissions for a branch
if (url.pathname.match(/^\/branches\/[^\/]+\/submissions$/)) {
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '30');
  const nik = url.searchParams.get('nik'); // ⚡ NEW: Filter by NIK

  let query = supabase
    .from('submissions')
    .select('*, user:users(*)', { count: 'exact' })
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });

  // ⚡ IMPORTANT: Filter by NIK if provided
  if (nik) {
    query = query.eq('user_nik', nik); // atau field yang sesuai
  }

  const { data, error, count } = await query
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    data: data || [],
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: (page * limit) < (count || 0)
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 2. Add Database Indexes (CRITICAL for Performance)

Run these SQL queries in Supabase SQL Editor:

```sql
-- Index untuk filter by NIK (SANGAT PENTING!)
CREATE INDEX IF NOT EXISTS idx_submissions_user_nik 
ON submissions(user_nik);

-- Index untuk filter by branch + created_at
CREATE INDEX IF NOT EXISTS idx_submissions_branch_created 
ON submissions(branch_id, created_at DESC);

-- Index untuk kombinasi branch + NIK (OPTIMAL!)
CREATE INDEX IF NOT EXISTS idx_submissions_branch_user 
ON submissions(branch_id, user_nik, created_at DESC);

-- Check index usage
EXPLAIN ANALYZE 
SELECT * FROM submissions 
WHERE branch_id = 'A336' AND user_nik = '191924' 
ORDER BY created_at DESC 
LIMIT 10;
```

### 3. Enable Supabase Caching (Optional tapi Recommended)

```typescript
// Add cache headers di Edge Function response
return new Response(JSON.stringify(result), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=60', // Cache 60 detik
    'CDN-Cache-Control': 'public, max-age=300' // Cache 5 menit di CDN
  }
});
```

---

## 🚀 Performance Expected After Fix

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Query Time | 500-2000ms | 10-50ms | **20-100x faster** |
| Data Transferred | 100-500 KB | 5-20 KB | **90% reduction** |
| Frontend Processing | 200-500ms | 5-10ms | **40x faster** |
| **Total Load Time** | **2-3s** | **<100ms** | **20-30x faster** |

---

## 🔍 Testing

### Test API dengan cURL:

```bash
# Test without NIK filter (all data)
curl "https://[PROJECT_ID].supabase.co/functions/v1/make-server-011c131f/branches/A336/submissions?page=1&limit=10" \
  -H "Authorization: Bearer [ANON_KEY]"

# Test WITH NIK filter (hanya data user)
curl "https://[PROJECT_ID].supabase.co/functions/v1/make-server-011c131f/branches/A336/submissions?page=1&limit=10&nik=191924" \
  -H "Authorization: Bearer [ANON_KEY]"
```

### Verify Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "user_nik": "191924",  // ⚡ Semua harus match NIK!
      "branch_id": "A336",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,  // ⚡ Hanya count data user ini!
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

## 📋 Checklist

- [ ] Update Edge Function dengan NIK filter
- [ ] Run SQL untuk create indexes
- [ ] Test API dengan cURL (dengan & tanpa NIK)
- [ ] Verify response hanya return data user yang diminta
- [ ] Deploy Edge Function
- [ ] Test di frontend - riwayat harus load <200ms

---

## ⚠️ Important Notes

1. **Field Name:** Pastikan field name di database match (`user_nik` atau `nik` atau yang lain)
2. **Case Sensitivity:** NIK comparison mungkin perlu `.ilike()` jika ada perbedaan case
3. **Index:** WAJIB create index sebelum deploy, atau query tetap lambat!
4. **Cache:** Jika pakai cache, set durasi sesuai kebutuhan (5-30 menit recommended)

---

## 🆘 Troubleshooting

### Jika masih lambat setelah update:

1. **Check index digunakan:**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM submissions 
   WHERE branch_id = 'A336' AND user_nik = '191924';
   ```
   Output harus show "Index Scan using idx_submissions_branch_user"

2. **Check Supabase logs:**
   - Buka Supabase Dashboard → Logs → Edge Functions
   - Cek response time & errors

3. **Upgrade Supabase Plan:**
   - Free tier: Max 500 concurrent connections
   - Pro tier: Faster database, dedicated resources
   - Jika banyak user, consider upgrade!

---

**Status:** ⏳ WAITING FOR BACKEND UPDATE

Frontend sudah ready! Tinggal backend yang perlu update untuk performa maksimal.
