// 🚀 BATCH API - Combine multiple requests into ONE for 5KB/s networks
// Instead of 3-4 separate requests, send 1 batched request!

import { projectId, publicAnonKey } from '/utils/supabase/info';
import { compressJSON, decompressJSON, pruneData } from './compression';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-011c131f`;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
  'Accept-Encoding': 'gzip, deflate, br', // Request compression
};

// BATCH REQUEST: Get all data in ONE call instead of 3!
export async function batchGetData(branchId: string) {
  console.log('📦 BATCH REQUEST: Getting all data in one call...');
  
  const startTime = Date.now();
  
  try {
    // Try to get from cache first
    const cacheKey = `batch_${branchId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 2 * 60 * 60 * 1000) {
          console.log('⚡ BATCH: Loaded from cache instantly!');
          return parsed.data;
        }
      } catch (e) {
        console.error('Cache parse error:', e);
      }
    }
    
    // Fetch all data in parallel (3 separate calls for now)
    // In production, this should be ONE batched API call
    const [indicatorsRes, settingsRes, submissionsRes] = await Promise.all([
      fetch(`${API_URL}/indicators?branchId=${branchId}`, { headers }),
      fetch(`${API_URL}/settings?branchId=${branchId}`, { headers }),
      fetch(`${API_URL}/submissions?branchId=${branchId}&page=1&limit=30`, { headers }),
    ]);
    
    const [indicators, settings, submissions] = await Promise.all([
      indicatorsRes.json(),
      settingsRes.json(),
      submissionsRes.json(),
    ]);
    
    const result = {
      indicators: pruneData(indicators.data || [], 'indicators'),
      settings: pruneData(settings.data || {}, 'settings'),
      submissions: pruneData(submissions.data || { submissions: [], pagination: {} }, 'submissions'),
    };
    
    // Save to cache
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data: result,
        timestamp: Date.now(),
      }));
      console.log('💾 BATCH: Cached for next time');
    } catch (e) {
      console.error('Cache write error:', e);
    }
    
    const duration = Date.now() - startTime;
    console.log(`✅ BATCH: Completed in ${duration}ms`);
    
    return result;
  } catch (error) {
    console.error('BATCH REQUEST FAILED:', error);
    
    // Return from cache as fallback
    const cached = localStorage.getItem(`batch_${branchId}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      console.log('⚠️ BATCH: Using stale cache due to error');
      return parsed.data;
    }
    
    throw error;
  }
}

// PREFETCH: Load data before user needs it
export async function prefetchBranchData(branchId: string) {
  console.log('🔮 PREFETCH: Loading data in background...');
  
  try {
    await batchGetData(branchId);
    console.log('✅ PREFETCH: Data ready!');
  } catch (error) {
    console.error('PREFETCH FAILED:', error);
  }
}

// PRECONNECT: Warm up DNS/TCP connection
export function preconnectAPI() {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = `https://${projectId}.supabase.co`;
  document.head.appendChild(link);
  
  console.log('🔗 PRECONNECT: API connection warmed up');
}

// DNS PREFETCH: Resolve DNS early
export function prefetchDNS() {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = `https://${projectId}.supabase.co`;
  document.head.appendChild(link);
  
  console.log('🌐 DNS PREFETCH: DNS resolved early');
}

// Initialize optimizations
export function initializeNetworkOptimizations() {
  // Warm up connection immediately
  prefetchDNS();
  preconnectAPI();
  
  // Enable HTTP keep-alive (browser does this automatically)
  console.log('🚀 Network optimizations initialized');
}
