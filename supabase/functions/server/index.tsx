/**
 * CROWN DAILY INDICATORS - Edge Function Server
 *
 * DATABASE ARCHITECTURE: ISOLATED PER BRANCH
 * ==========================================
 * Each branch has COMPLETELY SEPARATE storage:
 *
 * Cabang A336:
 *   - submission_A336_* (individual submission keys)
 *   - submissions_index_A336 (lightweight index)
 *   - branch_A336_indicators
 *   - branch_A336_settings
 *
 * Cabang A339:
 *   - submission_A339_* (individual submission keys)
 *   - submissions_index_A339 (lightweight index)
 *   - branch_A339_indicators
 *   - branch_A339_settings
 *
 * Benefits:
 * - NO cross-branch data loading
 * - Each branch speed is INDEPENDENT
 * - 1000 submissions in A336 does NOT slow down A339
 * - Auto-cleanup keeps each branch lightweight (30 days retention)
 */

import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// ⚡ PERFORMANCE: Conditional logging (only errors in production)
const isDev = Deno.env.get("DENO_DEPLOYMENT_ID") === undefined;
if (isDev) {
  app.use('*', logger(console.log));
}

// ⚡ ULTRA FAST CORS with aggressive caching
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Cache-Hit"],
    maxAge: 86400, // ⚡ Cache CORS preflight for 24 hours!
    credentials: false, // Faster without credentials
  }),
);

// Health check endpoint
app.get("/make-server-011c131f/health", (c) => {
  return c.json({ status: "ok" });
});

// Health check with database connectivity
app.get("/make-server-011c131f/health/full", async (c) => {
  try {
    // Test KV store connectivity
    const testKey = "_health_check_test";
    await kv.set(testKey, { timestamp: Date.now() });
    const testResult = await kv.get(testKey);
    await kv.del(testKey);

    return c.json({ 
      status: "ok", 
      database: "connected",
      timestamp: new Date().toISOString(),
      test: testResult ? "passed" : "failed"
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Health check failed:", errorMessage);
    return c.json({ 
      status: "error", 
      database: "disconnected",
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// ============= IN-MEMORY CACHE FOR ULTRA SPEED =============
const memoryCache = new Map<string, { data: any; expires: number }>();
const CACHE_TTL = 60000; // 60 seconds in-memory cache

// ============= CONCURRENT WRITE PROTECTION =============
const submissionLocks = new Map<string, Promise<any>>();

async function withSubmissionLock<T>(
  submissionId: string,
  fn: () => Promise<T>
): Promise<T> {
  // If lock exists, wait for it
  if (submissionLocks.has(submissionId)) {
    console.log(`🔒 Waiting for lock on ${submissionId}...`);
    await submissionLocks.get(submissionId);
  }

  // Create new lock
  const lock = fn();
  submissionLocks.set(submissionId, lock);

  try {
    const result = await lock;
    return result;
  } finally {
    // Release lock after 5 seconds
    setTimeout(() => {
      submissionLocks.delete(submissionId);
    }, 5000);
  }
}

function getCached(key: string): any | null {
  const cached = memoryCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  if (cached) memoryCache.delete(key);
  return null;
}

function setCache(key: string, data: any, ttl = CACHE_TTL) {
  memoryCache.set(key, { data, expires: Date.now() + ttl });
}

function clearCache(pattern: string) {
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) memoryCache.delete(key);
  }
}

// ============= BRANCHES =============
// ⚡ ULTRA FAST: In-memory cached branches
app.get("/make-server-011c131f/branches", async (c) => {
  try {
    // ⚡ Check in-memory cache FIRST
    const cached = getCached("branches");
    if (cached) {
      c.header("X-Cache-Hit", "true");
      return c.json({ success: true, data: cached });
    }

    const branches = await kv.get("branches") || [];

    // ⚡ Cache for 60s
    setCache("branches", branches);

    c.header("X-Cache-Hit", "false");
    c.header("Cache-Control", "public, max-age=60"); // Browser cache
    return c.json({ success: true, data: branches });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ GET /branches - Error:", errorMessage);
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// Create new branch
app.post("/make-server-011c131f/branches", async (c) => {
  try {
    const body = await c.req.json();
    const branches = await kv.get("branches") || [];
    branches.push(body);

    // ⚡ PARALLEL: Set branches and clear cache simultaneously
    await Promise.all([
      kv.set("branches", branches),
      Promise.resolve(clearCache("branches")) // Clear in-memory cache
    ]);

    // Get template or use default indicators
    let defaultIndicators = await kv.get("template_indicators");
    if (!defaultIndicators || defaultIndicators.length === 0) {
      defaultIndicators = [
        { id: "sales", name: "Sales", type: "number", targetValue: 7000000, weight: 50, order: 1, icon: "TrendingUp", placeholder: "Masukkan total penjualan hari ini" },
        { id: "transaksi", name: "Transaksi", type: "number", targetValue: 5, weight: 5, order: 2, icon: "ShoppingCart", placeholder: "Masukkan jumlah transaksi" },
        { id: "basketSize", name: "Basket Size", type: "number", targetValue: 1400000, weight: 5, order: 3, icon: "DollarSign", placeholder: "Masukkan rata-rata nilai transaksi" },
        { id: "noBaru", name: "No Baru Customer", type: "number", weight: 5, order: 4, icon: "UserPlus", isSpecial: true, specialFormula: "50% dari Transaksi", placeholder: "Masukkan jumlah customer baru" },
        { id: "waPersonal", name: "WA Personal", type: "number", targetValue: 10, weight: 5, order: 5, icon: "Phone", placeholder: "Masukkan jumlah WA customer" },
        { id: "afterSales", name: "After Sales Service", type: "photo", targetPhotos: 1, weight: 5, order: 6, icon: "Camera", placeholder: "Upload foto bukti after sales" },
        { id: "proteksi", name: "Proteksi", type: "number", weight: 10, order: 7, icon: "Shield", isSpecial: true, specialFormula: "1 proteksi = 10%", placeholder: "Masukkan jumlah proteksi terjual" },
        { id: "vocGr", name: "VOC / GR", type: "number", targetValue: 1, weight: 5, order: 8, icon: "ThumbsUp", placeholder: "Masukkan jumlah VOC/GR" },
        { id: "mgb", name: "MGB", type: "number+photo", targetValue: 10, targetPhotos: 3, weight: 10, order: 9, icon: "Target", placeholder: "Masukkan jumlah MGB" }
      ];
    }
    await kv.set(`branch_${body.id}_indicators`, defaultIndicators);

    // Initialize settings
    await kv.set(`branch_${body.id}_settings`, {
      loginTitle: `DAILY INDICATORS ${body.nik}`,
      loginSubtitle: "Silakan masuk dengan NIK dan Nama Anda",
      minSubmitScore: 80
    });

    return c.json({ success: true, data: body });
  } catch (error) {
    console.log("Error creating branch:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Update branch
app.put("/make-server-011c131f/branches/:branchId", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const body = await c.req.json();

    // ⚡ Clear cache
    clearCache("branches");

    const branches = await kv.get("branches") || [];
    const updated = branches.map((b: any) => b.id === branchId ? body : b);
    await kv.set("branches", updated);
    return c.json({ success: true, data: body });
  } catch (error) {
    console.log("Error updating branch:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Delete branch
app.delete("/make-server-011c131f/branches/:branchId", async (c) => {
  try {
    const branchId = c.req.param('branchId');

    // ⚡ Clear ALL caches for this branch
    clearCache("branches");
    clearCache(`indicators_${branchId}`);
    clearCache(`settings_${branchId}`);
    clearCache(`submissions_${branchId}`);

    const branches = await kv.get("branches") || [];
    const filtered = branches.filter((b: any) => b.id !== branchId);

    // ⚡ PARALLEL delete operations
    await Promise.all([
      kv.set("branches", filtered),
      kv.del(`branch_${branchId}_indicators`),
      kv.del(`branch_${branchId}_submissions`),
      kv.del(`branch_${branchId}_settings`),
      kv.del(`branch_${branchId}_admin`)
    ]);

    return c.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error deleting branch:", errorMessage);
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// ============= INDICATORS =============
// ⚡ ULTRA FAST: Cached indicators
app.get("/make-server-011c131f/branches/:branchId/indicators", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const cacheKey = `indicators_${branchId}`;

    // ⚡ Check cache
    const cached = getCached(cacheKey);
    if (cached) {
      c.header("X-Cache-Hit", "true");
      return c.json({ success: true, data: cached });
    }

    const indicators = await kv.get(`branch_${branchId}_indicators`) || [];

    // ⚡ Cache for 5 minutes (indicators change rarely)
    setCache(cacheKey, indicators, 300000);

    c.header("X-Cache-Hit", "false");
    c.header("Cache-Control", "public, max-age=300");
    return c.json({ success: true, data: indicators });
  } catch (error) {
    console.log("Error getting indicators:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Update indicators for a branch
app.post("/make-server-011c131f/branches/:branchId/indicators", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const body = await c.req.json();

    // ⚡ Clear cache immediately
    clearCache(`indicators_${branchId}`);

    await kv.set(`branch_${branchId}_indicators`, body);
    return c.json({ success: true, data: body });
  } catch (error) {
    console.log("Error updating indicators:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// ============= SUBMISSIONS =============
// Get submissions for a branch - ISOLATED PER BRANCH, ONLY LOADS 1 BRANCH DATA
// Cabang A336 request: ONLY loads submission_A336_* keys
// Cabang A339 request: ONLY loads submission_A339_* keys
// NO cross-branch data = Fast and isolated
// PAGINATION SUPPORT: Load data bertahap untuk prevent timeout
app.get("/make-server-011c131f/branches/:branchId/submissions", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '30');
    const filterNik = c.req.query('nik'); // 🔒 NIK filter untuk user biasa
    const sortField = c.req.query('sortField') || 'date'; // 🔽 Sort field: date, nik, nama, score
    const sortDirection = c.req.query('sortDirection') || 'desc'; // 🔽 Sort direction: asc, desc
    const offset = (page - 1) * limit;

    // ⚡ ULTRA FAST: Check cache first for this exact page (include NIK + SORT in cache key)
    const cacheKey = filterNik
      ? `submissions_${branchId}_p${page}_l${limit}_nik${filterNik}_${sortField}_${sortDirection}`
      : `submissions_${branchId}_p${page}_l${limit}_${sortField}_${sortDirection}`;
    const cachedResult = getCached(cacheKey);
    if (cachedResult) {
      c.header("X-Cache-Hit", "true");
      return c.json(cachedResult);
    }

    // ISOLATED: Get branch-specific index only
    const indexKey = `submissions_index_${branchId}`;
    let index = await kv.get(indexKey);

    if (index && index.length > 0) {
      // 🔒 FILTER BY NIK if requested (for user privacy)
      if (filterNik) {
        console.log(`🔒 Filtering submissions for NIK: ${filterNik}`);
        index = index.filter((item: any) => {
          const itemNik = String(item.userNik || '').trim();
          const filterNikTrimmed = String(filterNik).trim();
          return itemNik === filterNikTrimmed;
        });
        console.log(`✅ Filtered: ${index.length} submissions for NIK ${filterNik}`);
      }

      // 🔽 SORT INDEX EFFICIENTLY (no need to load all data!)
      console.log(`🔽 Sorting by: ${sortField} (${sortDirection})`);

      // Sort based on field availability in index
      if (sortField === 'date') {
        // Date is in index as 'timestamp'
        index.sort((a: any, b: any) => {
          const comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      } else if (sortField === 'nik') {
        // NIK is in index as 'userNik'
        index.sort((a: any, b: any) => {
          const comparison = String(a.userNik || '').localeCompare(String(b.userNik || ''));
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      } else if (sortField === 'score') {
        // Score is in index as 'score'
        index.sort((a: any, b: any) => {
          const comparison = (a.score || 0) - (b.score || 0);
          return sortDirection === 'asc' ? comparison : -comparison;
        });
      } else if (sortField === 'nama') {
        // Check if userName exists in index
        const hasUserName = index.some((item: any) => item.userName !== undefined);

        if (hasUserName) {
          // ⚡ FAST PATH: userName in index, sort directly!
          console.log('⚡ Fast nama sort: userName already in index');
          index.sort((a: any, b: any) => {
            const comparison = String(a.userName || '').localeCompare(String(b.userName || ''));
            return sortDirection === 'asc' ? comparison : -comparison;
          });
        } else {
          // ⚠️ SLOW PATH: Nama not in index - fallback to NIK
          console.log('⚠️ userName not in index, using NIK sort as fallback');
          console.log('💡 New submissions will have userName for fast sorting');

          index.sort((a: any, b: any) => {
            const comparison = String(a.userNik || '').localeCompare(String(b.userNik || ''));
            return sortDirection === 'asc' ? comparison : -comparison;
          });
        }
      }

      console.log(`✅ Sorted ${index.length} items by ${sortField} (${sortDirection})`);

      const total = index.length;
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;

      // PAGINATION: Load only requested page (after sorting!)
      const paginatedIndex = index.slice(offset, offset + limit);

      // ⚡ ULTRA PARALLEL: Batch load with Promise.allSettled for resilience
      const results = await Promise.allSettled(
        paginatedIndex.map((item: any) =>
          kv.get(`submission_${branchId}_${item.id}`)
        )
      );

      const validSubmissions = results
        .filter(r => r.status === 'fulfilled' && r.value != null)
        .map(r => (r as { status: 'fulfilled'; value: any }).value);

      const response = {
        success: true,
        data: validSubmissions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore
        }
      };

      // ⚡ Cache this page for 30 seconds
      setCache(cacheKey, response, 30000);

      c.header("X-Cache-Hit", "false");
      c.header("Cache-Control", "public, max-age=30");
      return c.json(response);
    }

    // Fallback: Try old format (for backward compatibility)
    let oldSubmissions = await kv.get(`branch_${branchId}_submissions`) || [];

    // 🔒 FILTER BY NIK for old format too
    if (filterNik) {
      console.log(`🔒 Filtering old format submissions for NIK: ${filterNik}`);
      oldSubmissions = oldSubmissions.filter((s: any) => {
        const subNik = String(s?.user?.nik || s?.nik || '').trim();
        const filterNikTrimmed = String(filterNik).trim();
        return subNik === filterNikTrimmed;
      });
      console.log(`✅ Filtered: ${oldSubmissions.length} old format submissions`);
    }

    // Apply pagination to old format too
    const total = oldSubmissions.length;
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;
    const paginatedOld = oldSubmissions.slice(offset, offset + limit);

    return c.json({
      success: true,
      data: paginatedOld,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    });
  } catch (error) {
    console.log("❌ Error getting submissions:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Add submission for a branch - ISOLATED PER BRANCH, SUPER FAST
// Each branch has COMPLETELY SEPARATE storage:
// - Cabang A336: submission_A336_*, submissions_index_A336
// - Cabang A339: submission_A339_*, submissions_index_A339
// - NO CROSS-BRANCH DATA LOADING = Always fast regardless of other branches
// 🔥 CONCURRENT WRITE PROTECTION with deduplication
app.post("/make-server-011c131f/branches/:branchId/submissions", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const body = await c.req.json();

    const submissionKey = `submission_${branchId}_${body.id}`;

    // 🔒 CONCURRENT WRITE PROTECTION: Use lock to prevent race conditions
    const result = await withSubmissionLock(submissionKey, async () => {
      // 🔥 DEDUPLICATION: Check if submission already exists
      const existing = await kv.get(submissionKey);
      if (existing) {
        console.log(`⚠️ Duplicate submission detected: ${body.id}, returning success`);
        return { success: true, message: 'Duplicate submission (already saved)', duplicate: true };
      }

      // ISOLATED: Branch-specific index (lightweight, only metadata)
      const indexKey = `submissions_index_${branchId}`;

      // ⚡ PARALLEL: Load index while saving submission
      const [index] = await Promise.all([
        kv.get(indexKey).then(idx => idx || []),
        kv.set(submissionKey, body)
      ]);

      // Add to index (with nama for efficient sorting!)
      index.unshift({
        id: body.id,
        timestamp: body.date,
        userNik: body.user.nik,
        userName: body.user.nama, // ⚡ Add nama to index for fast sorting!
        score: body.totalScore
      });

      // AUTO-CLEANUP: Keep only 30 days of data (configurable)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const cleanIndex = index.filter((item: any) => {
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime > thirtyDaysAgo;
      });

      // Also limit to 500 submissions max per branch
      if (cleanIndex.length > 500) {
        cleanIndex.splice(500);
      }

      // Save index to KV store
      await kv.set(indexKey, cleanIndex);

      // ⚡ Clear cache AFTER data is saved (prevent race condition)
      clearCache(`submissions_${branchId}`);

      // SUPER FAST: Return immediately without loading other branch data
      return { success: true };
    });

    // If it was a duplicate, still return success to client
    if (result.duplicate) {
      console.log(`✅ Duplicate handled gracefully for ${body.id}`);
    } else {
      console.log(`✅ New submission saved: ${body.id}`);
    }

    return c.json(result);
  } catch (error) {
    console.log("Error adding submission:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Delete submissions for a branch - ULTRA OPTIMIZED
app.post("/make-server-011c131f/branches/:branchId/submissions/delete", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const { ids } = await c.req.json();

    const indexKey = `submissions_index_${branchId}`;

    // ⚡ PARALLEL: Delete all submissions first
    await Promise.all(
      ids.map((id: string) => kv.del(`submission_${branchId}_${id}`))
    );

    // ⚡ PARALLEL: Load index and old format
    const [index, oldSubmissions] = await Promise.all([
      kv.get(indexKey).then(idx => idx || []),
      kv.get(`branch_${branchId}_submissions`)
    ]);

    // Update index
    const filtered = index.filter((item: any) => !ids.includes(item.id));

    // Update old format if exists
    const updates = [kv.set(indexKey, filtered)];
    if (oldSubmissions && oldSubmissions.length > 0) {
      const filteredOld = oldSubmissions.filter((s: any) => !ids.includes(s.id));
      updates.push(kv.set(`branch_${branchId}_submissions`, filteredOld));
    }

    await Promise.all(updates);

    // ⚡ Clear cache AFTER data is updated (prevent race condition)
    clearCache(`submissions_${branchId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting submissions:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// ============= SETTINGS =============
// ⚡ ULTRA FAST: Cached settings
app.get("/make-server-011c131f/branches/:branchId/settings", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const cacheKey = `settings_${branchId}`;

    // ⚡ Check cache
    const cached = getCached(cacheKey);
    if (cached) {
      c.header("X-Cache-Hit", "true");
      return c.json({ success: true, data: cached });
    }

    const settings = await kv.get(`branch_${branchId}_settings`) || {
      loginTitle: `DAILY INDICATORS ${branchId}`,
      loginSubtitle: "Silakan masuk dengan NIK dan Nama Anda",
      minSubmitScore: 80
    };

    // ⚡ Cache for 5 minutes
    setCache(cacheKey, settings, 300000);

    c.header("X-Cache-Hit", "false");
    c.header("Cache-Control", "public, max-age=300");
    return c.json({ success: true, data: settings });
  } catch (error) {
    console.log("Error getting settings:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Update settings for a branch
app.post("/make-server-011c131f/branches/:branchId/settings", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const body = await c.req.json();

    // ⚡ Clear cache immediately
    clearCache(`settings_${branchId}`);

    await kv.set(`branch_${branchId}_settings`, body);
    return c.json({ success: true, data: body });
  } catch (error) {
    console.log("Error updating settings:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// ============= BRANCH ADMIN =============
// Get branch admin info
app.get("/make-server-011c131f/branches/:branchId/admin", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const admin = await kv.get(`branch_${branchId}_admin`) || null;
    return c.json({ success: true, data: admin });
  } catch (error) {
    console.log("Error getting admin:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Update branch admin (for name changes)
app.post("/make-server-011c131f/branches/:branchId/admin", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const body = await c.req.json();
    await kv.set(`branch_${branchId}_admin`, body);

    // Also update in branches list
    const branches = await kv.get("branches") || [];
    const updated = branches.map((b: any) =>
      b.id === branchId ? { ...b, adminName: body.name, lastNameChange: body.lastNameChange } : b
    );
    await kv.set("branches", updated);

    return c.json({ success: true, data: body });
  } catch (error) {
    console.log("Error updating admin:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// ============= TEMPLATE =============
// Get default template
app.get("/make-server-011c131f/template", async (c) => {
  try {
    const template = await kv.get("template_indicators") || [];
    return c.json({ success: true, data: template });
  } catch (error) {
    console.log("Error getting template:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Update default template
app.post("/make-server-011c131f/template", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("template_indicators", body);
    return c.json({ success: true, data: body });
  } catch (error) {
    console.log("Error updating template:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// ============= MAINTENANCE & STATS =============
// Cleanup old submissions for a branch (manual trigger)
app.post("/make-server-011c131f/branches/:branchId/submissions/cleanup", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    const { days = 30 } = await c.req.json().catch(() => ({ days: 30 }));

    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);

    // Get index
    const indexKey = `submissions_index_${branchId}`;
    const index = await kv.get(indexKey) || [];

    // Find old submissions to delete
    const toDelete = index.filter((item: any) => {
      const itemTime = new Date(item.timestamp).getTime();
      return itemTime < cutoffTime;
    });

    // Delete old submission keys
    if (toDelete.length > 0) {
      await Promise.all(
        toDelete.map(async (item: any) => {
          const submissionKey = `submission_${branchId}_${item.id}`;
          await kv.del(submissionKey);
        })
      );

      // Update index
      const cleanIndex = index.filter((item: any) => {
        const itemTime = new Date(item.timestamp).getTime();
        return itemTime >= cutoffTime;
      });
      await kv.set(indexKey, cleanIndex);
    }

    return c.json({
      success: true,
      deleted: toDelete.length,
      remaining: index.length - toDelete.length
    });
  } catch (error) {
    console.log("Error cleaning up submissions:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// Get branch statistics (submissions count, storage size estimate)
app.get("/make-server-011c131f/branches/:branchId/stats", async (c) => {
  try {
    const branchId = c.req.param('branchId');

    const indexKey = `submissions_index_${branchId}`;
    const index = await kv.get(indexKey) || [];

    const oldSubmissions = await kv.get(`branch_${branchId}_submissions`) || [];

    return c.json({
      success: true,
      data: {
        submissionsCount: index.length,
        oldFormatCount: oldSubmissions.length,
        storageType: index.length > 0 ? 'optimized' : 'legacy'
      }
    });
  } catch (error) {
    console.log("Error getting stats:", error);
    return c.json({ success: false, error: (error instanceof Error ? error.message : String(error)) }, 500);
  }
});

// ============= APP SETTINGS =============
// ⚡ ULTRA FAST: Cached app settings
app.get("/make-server-011c131f/app-settings", async (c) => {
  try {
    // ⚡ Check cache
    const cached = getCached("app_settings");
    if (cached) {
      c.header("X-Cache-Hit", "true");
      return c.json({ success: true, data: cached });
    }

    const settings = await kv.get("app_settings") || {
      mainTitle: 'CROWN | DAILY INDICATORS STAFF',
      mainSubtitle: 'Your Home Life Improvement Partner',
      secondarySubtitle: 'Pilih Toko Anda'
    };

    // ⚡ Cache for 10 minutes (rarely changes)
    setCache("app_settings", settings, 600000);

    c.header("X-Cache-Hit", "false");
    c.header("Cache-Control", "public, max-age=600");
    return c.json({ success: true, data: settings });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error getting app settings:", errorMessage);
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

// Update app settings
app.post("/make-server-011c131f/app-settings", async (c) => {
  try {
    const body = await c.req.json();

    // ⚡ Clear cache immediately
    clearCache("app_settings");

    await kv.set("app_settings", body);
    return c.json({ success: true, data: body });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error updating app settings:", errorMessage);
    return c.json({ success: false, error: errorMessage }, 500);
  }
});

Deno.serve(app.fetch);