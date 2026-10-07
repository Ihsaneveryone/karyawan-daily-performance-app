import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { LogOut, ArrowLeft, TrendingUp, ShoppingCart, DollarSign, Phone, UserPlus, Shield, ThumbsUp, Target, Camera, History, Crown, AlertCircle, CheckCircle, CheckCircle2, Users, Package, Tag, Image, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Branch, Indicator, IndicatorData, Submission } from '../types';
import { api } from '../utils/api';
import { formatNumber, parseFormattedNumber, formatNumberInput } from '../utils/format';
import { draftManager } from '../utils/draft';
import { isOnline, debounce } from '../utils/retry';
import { compressImage } from '../utils/imageCompression';
import SubmitLoadingScreen from './SubmitLoadingScreen';
import { useIndicators } from '../hooks/useIndicators';
import { useSettings } from '../hooks/useSettings';
import { useSubmissions } from '../hooks/useSubmissions';
import { preSeedCache } from '../utils/preSeedCache';
import { queryClient } from '../lib/queryClient';

async function prepareSubmissionData(
  data: Record<string, IndicatorData>,
  options: { maxWidth: number; maxHeight: number; quality: number }
): Promise<IndicatorData[]> {
  const indicators = Object.values(data);
  const submissionData = new Array<IndicatorData>(indicators.length);
  let nextIndex = 0;

  const processIndicators = async () => {
    while (nextIndex < indicators.length) {
      const index = nextIndex++;
      const indicatorData = indicators[index];
      if (!indicatorData.photos?.length) {
        submissionData[index] = indicatorData;
        continue;
      }

      const photos: string[] = [];
      for (const photo of indicatorData.photos) {
        if (typeof photo === 'string') {
          photos.push(photo);
        } else if (photo instanceof File || photo instanceof Blob) {
          photos.push(await compressImage(photo, options));
        } else {
          throw new Error('Format foto tidak dikenali. Hapus lalu unggah ulang foto tersebut.');
        }
      }
      submissionData[index] = { ...indicatorData, photos };
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(2, indicators.length) }, () => processIndicators())
  );
  return submissionData;
}

function PhotoPreview({ photo, alt, className }: {
  photo: File | Blob | string;
  alt: string;
  className: string;
}) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (typeof photo === 'string') {
      setSrc(photo);
      return;
    }
    if (!(photo instanceof Blob)) {
      setSrc('');
      return;
    }

    const objectUrl = URL.createObjectURL(photo);
    setSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  if (!src) {
    return <p className="text-xs text-amber-700">Foto perlu diunggah ulang.</p>;
  }

  return <img src={src} alt={alt} className={className} />;
}

interface StaffDashboardProps {
  user: any;
  branch: Branch;
  onLogout: () => void;
  onBack: () => void;
}

const iconMap: Record<string, any> = {
  TrendingUp, ShoppingCart, DollarSign, Phone, UserPlus, Shield, ThumbsUp, Target, Camera,
  Users, Package, Tag, Image, Sparkles, AlertCircle, CheckCircle
};

type A321MetricKey = 'sales' | 'trx' | 'proteksi' | 'instantUpgrade';
type A321DailyMetrics = {
  sales: number;
  trx: number;
  proteksi: number;
  instantUpgrade: number;
  targetSales: number;
  jobTitle: string;
};

const A321_TARGET_TRX = 10;
const A321_ROLE_TRX_TARGETS: Record<string, number> = {
  advisor: 10,
  supervisor: 10,
  customerService: 5,
  cashier: 20,
  online: 30
};
const A321_ROLE_GOOGLE_REVIEW_TARGETS: Record<string, number> = {
  advisor: 3,
  supervisor: 3,
  cashier: 5,
  customerService: 2
};
const A321_ROLE_NEW_MEMBER_TARGETS: Record<string, number> = {
  advisor: 2,
  supervisor: 2,
  cashier: 3
};

type A321IndicatorSpec = {
  key: string;
  name: string;
  type: Indicator['type'];
  aliases: string[];
  icon: string;
  metric?: A321MetricKey;
  targetValue?: number;
  targetPhotos?: number;
};

const A321_INDICATOR_SPECS: Record<string, A321IndicatorSpec> = {
  sales: { key: 'sales', name: 'Sales', type: 'number', aliases: ['sales'], icon: 'DollarSign', metric: 'sales' },
  trx: { key: 'trx', name: 'TRX', type: 'number', aliases: ['trx', 'transaksi', 'transaction'], icon: 'ShoppingCart', targetValue: A321_TARGET_TRX, metric: 'trx' },
  basket: { key: 'basket', name: 'Basket Size', type: 'number', aliases: ['basket', 'basketsize'], icon: 'TrendingUp' },
  proteksi: { key: 'proteksi', name: 'Proteksi', type: 'number', aliases: ['proteksi'], icon: 'Shield', targetValue: 2, metric: 'proteksi' },
  instantUpgrade: { key: 'instant_upgrade', name: 'Instant Upgrade', type: 'number', aliases: ['instantupgrade'], icon: 'TrendingUp', targetValue: 1, metric: 'instantUpgrade' },
  newMember: { key: 'new_member', name: 'New Member', type: 'number', aliases: ['newmember'], icon: 'UserPlus' },
  wa: { key: 'wa', name: 'WA PERSONAL', type: 'number+photo', aliases: ['wa', 'wapersonal', 'whatsappersonal'], icon: 'Phone', targetValue: 7, targetPhotos: 2 },
  noBaru: { key: 'nobaru', name: 'No Baru Customer', type: 'number', aliases: ['nobaru', 'nobarucustomer'], icon: 'UserPlus' },
  googleReview: { key: 'google_review', name: 'Google Review', type: 'number', aliases: ['googlereview', 'google_review'], icon: 'Target' },
  voc: { key: 'voc', name: 'VOC', type: 'number', aliases: ['voc'], icon: 'Target', targetValue: 1 },
  mgb: { key: 'mgb', name: 'MGB', type: 'photo', aliases: ['mgb'], icon: 'Camera', targetPhotos: 3 },
  kendala: { key: 'kendala_hari_ini', name: 'Kendala Hari Ini', type: 'text', aliases: ['kendala', 'kendalahariini'], icon: 'AlertCircle' },
  komitmen: { key: 'komitmen_besok', name: 'Komitmen untuk Besok', type: 'text', aliases: ['komitmen', 'komitmenbesok'], icon: 'CheckCircle' }
};

function normalizeIndicatorKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function formatRupiah(value: number | undefined | null) {
  return `Rp ${formatNumber(Math.floor(value || 0))}`;
}

function getA321ProgressColor(progress: number) {
  if (progress >= 100) return 'bg-emerald-500';
  if (progress >= 85) return 'bg-lime-500';
  if (progress >= 60) return 'bg-amber-400';
  if (progress >= 30) return 'bg-orange-500';
  return 'bg-red-500';
}

function getA321Role(jobTitle: string) {
  const role = normalizeIndicatorKey(jobTitle || 'Advisor');
  if (role.includes('cashier') || role.includes('kasir')) return 'cashier';
  if (role.includes('customerservice') || role === 'cs') return 'customerService';
  if (role.includes('online')) return 'online';
  if (role.includes('supervisor')) return 'supervisor';
  return 'advisor';
}

function getA321TrxTarget(jobTitle: string) {
  return A321_ROLE_TRX_TARGETS[getA321Role(jobTitle)] || A321_TARGET_TRX;
}

function getA321IndicatorSpecs(jobTitle: string) {
  const advisor = ['sales', 'trx', 'basket', 'proteksi', 'newMember', 'wa', 'noBaru', 'googleReview', 'voc', 'mgb', 'kendala', 'komitmen'];
  const role = getA321Role(jobTitle);
  if (role === 'cashier') return ['sales', 'trx', 'basket', 'proteksi', 'instantUpgrade', 'newMember', 'googleReview'];
  if (role === 'customerService') return ['sales', 'trx', 'basket', 'googleReview'];
  if (role === 'online') return ['sales', 'trx', 'basket', 'kendala', 'komitmen'];
  return advisor;
}

function buildA321Indicators(configuredIndicators: Indicator[], metrics: A321DailyMetrics | null, jobTitle: string): Indicator[] {
  const role = getA321Role(jobTitle);
  const targetTrx = getA321TrxTarget(jobTitle);
  return getA321IndicatorSpecs(jobTitle).map((specKey, index) => {
    const spec = A321_INDICATOR_SPECS[specKey];
    const aliases = new Set([normalizeIndicatorKey(spec.key), ...spec.aliases.map(normalizeIndicatorKey)]);
    const configured = configuredIndicators.find(indicator =>
      aliases.has(normalizeIndicatorKey(indicator.id)) || aliases.has(normalizeIndicatorKey(indicator.name))
    );
    const targetValue = spec.metric === 'sales'
      ? metrics?.targetSales
      : spec.metric === 'trx'
        ? targetTrx
        : specKey === 'wa'
          ? 7
        : specKey === 'voc'
          ? 1
        : specKey === 'googleReview'
          ? A321_ROLE_GOOGLE_REVIEW_TARGETS[role]
          : specKey === 'newMember'
            ? A321_ROLE_NEW_MEMBER_TARGETS[role]
        : specKey === 'basket' && metrics?.targetSales != null
          ? metrics.targetSales / targetTrx
          : spec.metric
            ? spec.targetValue
            : configured?.targetValue ?? spec.targetValue;

    return {
      ...(configured || {} as Indicator),
      id: configured?.id || spec.key,
      name: spec.name,
      type: spec.type,
      targetValue,
      targetPhotos: spec.targetPhotos ?? configured?.targetPhotos,
      weight: 0,
      icon: spec.icon || configured?.icon || 'Target',
      order: index + 1
    };
  });
}

function getA321MetricKey(indicator: Pick<Indicator, 'id' | 'name'>): A321MetricKey | null {
  const id = normalizeIndicatorKey(indicator.id);
  const name = normalizeIndicatorKey(indicator.name);
  if (id === 'sales' || name === 'sales') return 'sales';
  if (['trx', 'transaksi', 'transaction'].includes(id) || ['trx', 'transaksi', 'transaction'].includes(name)) return 'trx';
  if (id === 'proteksi' || name === 'proteksi') return 'proteksi';
  if (id === 'instantupgrade' || name === 'instantupgrade') return 'instantUpgrade';
  return null;
}

function getJakartaDate() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const part = (type: string) => parts.find(item => item.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export default function StaffDashboard({ user, branch, onLogout, onBack }: StaffDashboardProps) {
  // State declarations FIRST!
  const [data, setData] = useState<Record<string, IndicatorData>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(10); // 🔥 Limit awal: 10 data untuk ringan!
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const isA321 = branch.id === 'A321';
  const [a321Metrics, setA321Metrics] = useState<A321DailyMetrics | null>(null);
  const [a321MetricsLoading, setA321MetricsLoading] = useState(false);
  const [a321MetricsError, setA321MetricsError] = useState('');

  // REACT QUERY: INSTANT loading dengan cache! No waiting!
  const {
    indicators: configuredIndicators,
    isFetching: indicatorsFetching,
    refetch: refetchIndicators
  } = useIndicators(branch.id);
  const indicators = useMemo(() => {
    if (!isA321) return configuredIndicators;

    return buildA321Indicators(configuredIndicators, a321Metrics, a321Metrics?.jobTitle || 'Advisor');
  }, [configuredIndicators, isA321, a321Metrics]);
  const { settings, refetch: refetchSettings } = useSettings(branch.id);

  // 🔍 Check if user is admin (admin NIK = branch NIK)
  const isAdmin = user?.nik === branch.nik;

  // ⚡ SUPER OPTIMIZED: Hanya fetch saat history dialog dibuka!
  // 🔒 ADMIN: Fetch ALL data (no NIK filter)
  // 👤 USER: Fetch SEMUA data mereka (with NIK filter, NO DATE LIMIT!)
  const {
    submissions,
    isLoading: submissionsLoading,
    isFetching: submissionsFetching,
    isError: submissionsError,
    refetch: refetchSubmissions
  } = useSubmissions(
    branch.id,
    1,
    999999, // ← PENTING: Limit besar untuk ambil SEMUA data user (bukan cuma 100!)
    isAdmin ? undefined : user?.nik, // ← Admin: no filter, User: filter by NIK
    showHistory // ← Hanya fetch saat history dibuka!
  );

  // 🔥 LISTEN TO DELETE EVENTS dari Admin! (Multi-channel untuk ensure delivery!)
  useEffect(() => {
    const handleDeleteEvent = (deleteEvent: any) => {
      if (!deleteEvent || deleteEvent.branchId !== branch.id) return;

      console.log('');
      console.log('🔥🔥🔥 DELETE EVENT RECEIVED! 🔥🔥🔥');
      console.log('Admin deleted data from branch:', deleteEvent.branchId);
      console.log('Deleted IDs count:', deleteEvent.deletedIds?.length || 0);
      console.log('');

      console.log('✅ Event untuk branch ini! Force clear & refetch...');

      // Clear React Query cache
      queryClient.invalidateQueries({ queryKey: ['submissions', branch.id] });
      queryClient.removeQueries({ queryKey: ['submissions', branch.id] });

      // Clear localStorage cache
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.includes(`submissions_${branch.id}`)) {
          localStorage.removeItem(key);
          console.log(`  🗑️ Cleared: ${key}`);
        }
      }

      // Force refetch jika history sedang dibuka
      if (showHistory) {
        refetchSubmissions();
        console.log('✅ Submissions refetched! Data updated!');
      }

      toast.info('📢 Admin menghapus data. Tampilan diperbarui!', {
        duration: 3000
      });
    };

    // Method 1: localStorage event (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'delete_event' && e.newValue) {
        try {
          const deleteEvent = JSON.parse(e.newValue);
          handleDeleteEvent(deleteEvent);
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };

    // Method 2: Custom Event (same-tab)
    const handleCustomEvent = (e: any) => {
      handleDeleteEvent(e.detail);
    };

    // Method 3: BroadcastChannel (modern browsers, cross-tab)
    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('submissions-channel');
      channel.onmessage = (e) => {
        handleDeleteEvent(e.data);
      };
    }

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('submissions-deleted', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('submissions-deleted', handleCustomEvent as EventListener);
      if (channel) channel.close();
    };
  }, [branch.id, showHistory, refetchSubmissions]);

  // 🔍 DEBUG: Log saat showHistory berubah
  useEffect(() => {
    if (showHistory) {
      // Reset display limit saat buka history (10 untuk ringan!)
      setDisplayLimit(10);

      console.log('');
      console.log('🔥🔥🔥 ===== RIWAYAT DIBUKA ===== 🔥🔥🔥');
      console.log('👤 User Role:', isAdmin ? '🔑 ADMIN' : '👤 USER');
      console.log('📊 Branch ID:', branch.id);
      console.log('👤 User NIK:', user?.nik);
      console.log('👤 User Nama:', user?.nama);
      console.log('🔍 Filter Mode:', isAdmin ? 'ALL DATA (no filter)' : `FILTERED by NIK: ${user?.nik}`);
      console.log('');
      console.log('📊 DATA RECEIVED:');
      console.log('   Total submissions:', submissions?.length || 0);
      console.log('   Loading:', submissionsLoading);
      console.log('   Fetching:', submissionsFetching);
      console.log('   Error:', submissionsError);
      console.log('');

      // 🔥 DEBUG: Log semua submission IDs dan NIKs
      if (submissions && submissions.length > 0) {
        console.log('📋 ALL SUBMISSIONS RECEIVED:');
        submissions.forEach((sub: any, idx: number) => {
          console.log(`   [${idx + 1}] ID: ${sub.id}`);
          console.log(`       NIK: ${sub?.user?.nik || sub?.nik}`);
          console.log(`       Nama: ${sub?.user?.nama || sub?.nama}`);
          console.log(`       Date: ${sub.date}`);
          console.log(`       CreatedAt: ${sub.createdAt}`);
          console.log(`       Score: ${sub.totalScore}`);
          console.log('');
        });
      } else {
        console.log('❌ NO SUBMISSIONS RECEIVED FROM SERVER!');
        console.log('   Possible reasons:');
        console.log('   1. Backend not returning data');
        console.log('   2. API timeout');
        console.log('   3. Wrong branch ID');
        console.log('   4. User has no submissions yet');
      }

      console.log('============================');
      console.log('');

      // 🔔 NOTIFIKASI: Beri tahu user saat loading
      if (submissionsLoading) {
        toast.loading('Memuat riwayat submission... Tunggu 5-15 detik', {
          id: 'loading-history',
          duration: 15000
        });
      }
    }
  }, [showHistory, submissions, user?.nik, branch.id, submissionsLoading, submissionsFetching, isAdmin]);

  // 🔔 NOTIFIKASI: Update status loading
  useEffect(() => {
    if (showHistory && !submissionsLoading && !submissionsFetching) {
      toast.dismiss('loading-history');

      if (submissionsError) {
        // Error already handled in error UI
      } else if (submissions && submissions.length > 0) {
        // Update last refresh time
        setLastRefreshTime(new Date());

        toast.success(`✅ Loaded ${submissions.length} submission`, {
          duration: 2000
        });
      }
    }
  }, [showHistory, submissionsLoading, submissionsFetching, submissions, submissionsError]);

  // Show loading ONLY if absolutely no data (first time ever)
  const isFirstTimeLoading = !indicators || !settings || !submissions;

  // Submit dengan catatan state
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [notesReason, setNotesReason] = useState('');
  const [notesApproval, setNotesApproval] = useState('');
  const [notesAdminNik, setNotesAdminNik] = useState('');
  const [notesAdminNama, setNotesAdminNama] = useState('');

  // Offline state
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionCompletedAt, setSubmissionCompletedAt] = useState<Date | null>(null);

  // Submission date - default hari ini, bisa diedit
  const [submissionDate, setSubmissionDate] = useState<string>(() =>
    isA321 ? getJakartaDate() : new Date().toISOString().split('T')[0]
  );

  // 📊 FILTER DATA + Load More
  const { allSubmissions, displayedSubmissions, hasMore, totalCount } = useMemo(() => {
    // ⚡ Skip processing jika history tidak dibuka
    if (!showHistory) {
      return { allSubmissions: [], displayedSubmissions: [], hasMore: false, totalCount: 0 };
    }

    if (!submissions || submissions.length === 0) {
      console.log('📊 No submissions data available');
      return { allSubmissions: [], displayedSubmissions: [], hasMore: false, totalCount: 0 };
    }

    console.log('');
    console.log('🔍 ===== RIWAYAT DISPLAY =====');
    console.log('👤 User Role:', isAdmin ? 'ADMIN 🔑' : 'USER 👤');
    console.log('📊 Total submissions from server:', submissions.length);

    // 🔒 PRIVACY CHECK untuk user biasa
    if (!isAdmin) {
      const allNiks = submissions.map((s: any) => s?.user?.nik || s?.nik);
      const uniqueNiks = [...new Set(allNiks)];

      if (uniqueNiks.length > 1) {
        console.log('🛡️ Frontend filter active - filtering out other users data');
        console.log('📊 Server sent:', submissions.length, 'submissions');
        console.log('🔒 Showing only NIK:', user?.nik);
      } else {
        console.log('✅ Backend filter working - received only user data');
      }
    }

    // 🛡️ FRONTEND FILTER: Hanya data user yang login (untuk user biasa)
    let filteredData = submissions;

    if (!isAdmin && user?.nik) {
      const userNik = String(user.nik).trim().toUpperCase();
      console.log('🛡️ ===== FRONTEND FILTER (PRIVACY PROTECTION) =====');
      console.log('👤 User NIK:', userNik);
      console.log('📊 Total submissions from server:', submissions.length);

      // Filter by NIK
      filteredData = submissions.filter((s: any) => {
        const subNik = String(s?.user?.nik || s?.nik || '').trim().toUpperCase();
        return subNik === userNik;
      });

      console.log('✅ After NIK filter:', filteredData.length);
      console.log('🗑️ Filtered out:', submissions.length - filteredData.length, 'submissions dari user lain');

      // 🔥 IMPORTANT: NO DATE FILTER! Show ALL user data regardless of date
      console.log('');
      console.log('📅 DATE FILTER: TIDAK AKTIF');
      console.log('✅ User akan melihat SEMUA data mereka (tidak ada batasan 5 hari!)');
      console.log('');

      // Show date range for debugging
      if (filteredData.length > 0) {
        const dates = filteredData.map((s: any) => new Date(s.date || s.createdAt));
        const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
        const newestDate = new Date(Math.max(...dates.map(d => d.getTime())));
        console.log('📅 Data range:');
        console.log('   Oldest:', oldestDate.toLocaleDateString('id-ID'));
        console.log('   Newest:', newestDate.toLocaleDateString('id-ID'));
        console.log('   Total days:', Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24)));
      }
      console.log('====================================================');
      console.log('');
    }

    // Sort by date DESC (terbaru dulu)
    const sorted = [...filteredData].sort((a, b) =>
      new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
    );

    // 🔑 ADMIN: Limit untuk performa
    if (isAdmin) {
      console.log('🔑 ADMIN MODE: Limit', displayLimit, 'untuk performa');
      const limited = sorted.slice(0, displayLimit);
      console.log('✅ Showing:', limited.length, 'of', sorted.length);
      console.log('===================================');
      console.log('');
      return {
        allSubmissions: sorted,
        displayedSubmissions: limited,
        hasMore: sorted.length > displayLimit,
        totalCount: sorted.length
      };
    }

    // 👤 USER: Load More Pattern
    const displayed = sorted.slice(0, displayLimit);
    const hasMoreData = sorted.length > displayLimit;

    console.log('👤 USER MODE: Load More Pattern (Initial: 10, Increment: +10)');
    console.log('📦 Total data user ini (after filter):', sorted.length);
    console.log('📋 Currently displaying:', displayed.length);
    console.log('➕ Has more data:', hasMoreData);
    console.log('===================================');
    console.log('');

    return {
      allSubmissions: sorted,
      displayedSubmissions: displayed,
      hasMore: hasMoreData,
      totalCount: sorted.length
    };
  }, [submissions, showHistory, isAdmin, displayLimit, user?.nik]);

  // Alias untuk backward compatibility
  const mySubmissions = displayedSubmissions;

  // Initialize data when indicators loaded
  useEffect(() => {
    if (indicators.length > 0 && Object.keys(data).length === 0) {
      const draft = draftManager.loadDraft(branch.id, user?.nik || '');
      if (draft) {
        setData(draft);
        return;
      }

      // Initialize fresh data
      const initialData: Record<string, IndicatorData> = {};
      indicators.forEach(ind => {
        initialData[ind.id] = {
          id: ind.id,
          value: undefined,
          photos: []
        };
      });
      setData(initialData);
    }
  }, [indicators, branch.id, user.nik]);

  useEffect(() => {
    if (!isA321 || !user?.nik || !submissionDate || configuredIndicators.length === 0) return;

    let cancelled = false;
    const indicatorsToClear = buildA321Indicators(configuredIndicators, a321Metrics, a321Metrics?.jobTitle || 'Advisor');
    setA321Metrics(null);
    setA321MetricsError('');
    setA321MetricsLoading(true);
    setData(current => {
      const updated = { ...current };
      indicatorsToClear.forEach(indicator => {
        if (getA321MetricKey(indicator)) {
          updated[indicator.id] = {
            ...(updated[indicator.id] || { id: indicator.id, photos: [] }),
            value: undefined
          };
        }
      });
      return updated;
    });

    api.getA321DailyMetrics(user.nik, submissionDate)
      .then(metrics => {
        if (cancelled) return;

        setA321Metrics(metrics);
        const roleIndicators = buildA321Indicators(configuredIndicators, metrics, metrics.jobTitle || 'Advisor');
        setData(current => {
          const updated = { ...current };
          roleIndicators.forEach(indicator => {
            const metricKey = getA321MetricKey(indicator);
            const normalized = normalizeIndicatorKey(indicator.id) + normalizeIndicatorKey(indicator.name);
            if (metricKey) {
              updated[indicator.id] = {
                ...(updated[indicator.id] || { id: indicator.id, photos: [] }),
                value: metrics[metricKey] ?? 0
              };
            } else if (normalized.includes('basket') || normalized.includes('basketsize')) {
              updated[indicator.id] = {
                ...(updated[indicator.id] || { id: indicator.id, photos: [] }),
                value: metrics.trx > 0 ? Math.round(metrics.sales / metrics.trx) : 0
              };
            }
          });
          return updated;
        });
      })
      .catch(error => {
        if (cancelled) return;
        console.error('Failed to load A321 sales metrics:', error);
        setA321MetricsError(error instanceof Error ? error.message : 'Gagal memuat data spreadsheet');
      })
      .finally(() => {
        if (!cancelled) setA321MetricsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isA321, user?.nik, submissionDate, configuredIndicators]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Koneksi kembali! Memproses data yang tertunda...');
      api.processOfflineQueue().then((count) => {
        if (count > 0) {
          toast.success(`${count} data berhasil dikirim!`);
          // Refetch all data
          refetchIndicators();
          refetchSettings();
          refetchSubmissions();
        }
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.error('Koneksi terputus! Data akan disimpan secara lokal.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save draft
  useEffect(() => {
    if (user?.nik) {
      draftManager.startAutoSave(branch.id, user.nik, () => data);

      return () => {
        draftManager.stopAutoSave();
      };
    }
  }, [branch.id, user.nik, data]);

  // ⚡ OPTIMIZED: useMemo untuk calculateScore - tidak re-calculate setiap render!
  const scoreResult = useMemo(() => {
    let totalScore = 0;
    const scoreDetails: any[] = [];

    indicators.forEach(indicator => {
      const inputData = data[indicator.id];
      let score = 0;
      let percentage = 0;

      if (indicator.type === 'number' || indicator.type === 'number+photo') {
        const value = inputData?.value || 0;

        if (indicator.isSpecial) {
          // Handle special formulas
          if (indicator.id === 'proteksi') {
            score = Math.min(value * 10, indicator.weight);
            percentage = (score / indicator.weight) * 100;
          }
        } else if (indicator.targetValue) {
          percentage = Math.min((value / indicator.targetValue) * 100, 100);
        }

        if (!indicator.isSpecial || indicator.id !== 'proteksi') {
          score = (percentage / 100) * indicator.weight;
        }
      }

      if (indicator.type === 'photo' || indicator.type === 'number+photo') {
        const photos = inputData?.photos || [];
        const requiredPhotos = indicator.targetPhotos || 1;

        if (indicator.type === 'photo') {
          const photoPercentage = Math.min((photos.length / requiredPhotos) * 100, 100);
          score = (photoPercentage / 100) * indicator.weight;
          percentage = photoPercentage;
        } else if (indicator.type === 'number+photo') {
          // For number+photo, calculate combined score
          const photoPercentage = Math.min((photos.length / requiredPhotos) * 100, 100);
          // Average of number percentage and photo percentage
          const combinedPercentage = (percentage + photoPercentage) / 2;
          score = (combinedPercentage / 100) * indicator.weight;
          percentage = combinedPercentage;
        }
      }

      // Handle text type - full score if filled
      if (indicator.type === 'text') {
        const textValue = inputData?.textValue || '';
        if (textValue.trim().length > 0) {
          score = indicator.weight;
          percentage = 100;
        }
      }

      // Handle dropdown type - full score if selected
      if (indicator.type === 'dropdown') {
        const dropdownValue = inputData?.dropdownValue || '';
        if (dropdownValue) {
          score = indicator.weight;
          percentage = 100;
        }
      }

      // Handle checkbox type - full score if checked
      if (indicator.type === 'checkbox') {
        const checkboxValue = inputData?.checkboxValue || false;
        if (checkboxValue) {
          score = indicator.weight;
          percentage = 100;
        }
      }

      scoreDetails.push({
        indicatorId: indicator.id,
        score: Math.round(score * 10) / 10,
        percentage: Math.round(percentage * 10) / 10
      });

      totalScore += score;
    });

    return {
      total: Math.round(totalScore * 10) / 10,
      details: scoreDetails
    };
  }, [data, indicators]); // Re-calculate hanya saat data atau indicators berubah

  const totalScore = scoreResult.total;
  const minSubmitScore = settings?.minSubmitScore || 80;
  const missingIndicators = indicators.filter((indicator) => {
    const inputData = data[indicator.id];
    const a321MetricKey = isA321 ? getA321MetricKey(indicator) : null;
    const normalized = normalizeIndicatorKey(indicator.id) + normalizeIndicatorKey(indicator.name);
    const isA321Basket = isA321 && (normalized.includes('basket') || normalized.includes('basketsize'));
    const isA321Mgb = isA321 && normalizeIndicatorKey(indicator.id) === 'mgb';
    if (isA321Mgb && !inputData?.textValue?.trim()) return true;
    if (indicator.type === 'number' || indicator.type === 'number+photo') {
      if (!inputData || inputData.value === undefined || inputData.value === null) return true;
      if (isA321 && (a321MetricKey || isA321Basket) && !a321Metrics) return true;
    }
    if ((indicator.type === 'photo' || indicator.type === 'number+photo')
      && (inputData?.photos?.length || 0) < (indicator.targetPhotos || 1)) return true;
    const isOptionalKendala = isA321 && normalizeIndicatorKey(indicator.id + indicator.name).includes('kendala');
    if (indicator.type === 'text' && !isOptionalKendala && !inputData?.textValue?.trim()) return true;
    if (indicator.type === 'dropdown' && !inputData?.dropdownValue) return true;
    if (indicator.type === 'checkbox' && !inputData?.checkboxValue) return true;
    return false;
  });
  const canSubmit = isA321
    ? !!a321Metrics && indicators.length > 0 && missingIndicators.length === 0
    : totalScore >= minSubmitScore;

  // ⚡ OPTIMIZED: useMemo untuk helper functions
  const scoreColor = useMemo(() => {
    if (totalScore < minSubmitScore) return 'border-red-300 bg-red-50';
    if (totalScore >= 100) return 'border-blue-400 bg-blue-50';
    return 'border-green-300 bg-green-50';
  }, [totalScore, minSubmitScore]);

  const scoreBadge = useMemo(() => {
    if (totalScore < minSubmitScore) return 'bg-red-500';
    if (totalScore >= 100) return 'bg-blue-600';
    return 'bg-green-500';
  }, [totalScore, minSubmitScore]);

  const motivationMessage = useMemo(() => {
    if (totalScore < minSubmitScore) return `Minimal ${minSubmitScore}%`;
    if (totalScore >= 100) return `${user.nama} (${user.nik}), Kamu Luar Biasa, Pertahankan ya! 🎉`;
    return `${user.nama} (${user.nik}), Ayo Semangat kejar lagi ke Indikator 100%! 💪`;
  }, [totalScore, minSubmitScore, user.nama, user.nik]);

  const handleSubmitWithNotes = async () => {
    if (isA321 && missingIndicators.length > 0) {
      toast.error(`Lengkapi semua indikator terlebih dahulu: ${missingIndicators.map((indicator) => indicator.name).join(', ')}`);
      return;
    }

    // Validate notes form
    if (!notesReason.trim()) {
      toast.error('Reason harus diisi!');
      return;
    }
    if (!notesApproval.trim()) {
      toast.error('Approval harus diisi!');
      return;
    }
    if (!notesAdminNik.trim()) {
      toast.error('NIK Admin harus diisi!');
      return;
    }
    if (!notesAdminNama.trim()) {
      toast.error('Nama Admin harus diisi!');
      return;
    }

    // Verify admin credentials
    if (notesAdminNik !== branch.nik || notesAdminNama.toUpperCase() !== branch.adminName.toUpperCase()) {
      toast.error('NIK atau Nama Admin tidak sesuai!');
      return;
    }

    // Save notes values
    const savedNotes = {
      reason: notesReason.trim(),
      approval: notesApproval.trim(),
      adminNik: notesAdminNik.trim(),
      adminNama: notesAdminNama.trim()
    };

    // 🔍 DEBUG: Log notes yang akan dikirim
    console.log('🔍 DEBUG - savedNotes:', savedNotes);
    console.log('🔍 DEBUG - notes fields:', {
      reason: savedNotes.reason,
      approval: savedNotes.approval,
      adminNik: savedNotes.adminNik,
      adminNama: savedNotes.adminNama
    });

    // CLOSE DIALOG FIRST so loading screen is visible
    setShowNotesDialog(false);

    // ✅ START SUBMIT (NO OPTIMISTIC UPDATE - wait for server response)
    setIsSubmitting(true);

    try {
      const submissionData = await prepareSubmissionData(data, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.6
      });

      // 🕐 FIX: Use actual current time WITH TIMEZONE!
      const now = new Date(); // Current local time
      const selectedDate = new Date(submissionDate);

      // Set waktu ke waktu sekarang (jam submit yang sebenarnya!)
      selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

      // 🔥 IMPORTANT: Send CURRENT timestamp untuk backend validation
      const submittedAt = now.toISOString(); // Waktu SUBMIT yang sebenarnya (bukan pilihan tanggal)

      console.log('');
      console.log('🕐 ===== TIMESTAMP DEBUG =====');
      console.log('📅 Selected Date:', submissionDate); // YYYY-MM-DD
      console.log('🕐 Submit Time (NOW):', submittedAt); // Full timestamp
      console.log('🕐 Display Time:', now.toLocaleTimeString('id-ID'));
      console.log('============================');
      console.log('');

      const submission: Submission = {
        id: `${branch.id}_${user.nik}_${Date.now()}`,
        branchId: branch.id,
        user: {
          nik: user.nik,
          nama: user.nama
        },
        data: submissionData as any,
        totalScore: isA321 ? 0 : totalScore,
        scoreDetails: isA321 ? [] : scoreResult.details,
        date: submissionDate, // YYYY-MM-DD only (untuk filter by date)
        createdAt: submittedAt, // 🔥 REAL submit time - jangan overwrite di backend!
        displayDate: selectedDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        notes: savedNotes
      };

      const success = await api.addSubmission(branch.id, submission);

      if (success) {
        // ✅ SUCCESS - Show message and reset form
        setSubmissionCompletedAt(new Date());
        setNotesReason('');
        setNotesApproval('');
        setNotesAdminNik('');
        setNotesAdminNama('');

        // Reset form to fresh state
        const freshData: Record<string, IndicatorData> = {};
        indicators.forEach(ind => {
          freshData[ind.id] = {
            id: ind.id,
            value: undefined,
            photos: [],
            textValue: '',
            dropdownValue: '',
            checkboxValue: false
          };
        });
        setData(freshData);

        // Reset tanggal ke hari ini
        setSubmissionDate(isA321 ? getJakartaDate() : new Date().toISOString().split('T')[0]);

        // Clear draft
        draftManager.clearDraft(branch.id, user?.nik || '');

        // ⚡ INVALIDATE CACHE - Force refetch for instant update
        queryClient.invalidateQueries({ queryKey: ['submissions', branch.id] });

        // Refetch untuk update UI
        refetchSubmissions();
      } else {
        toast.error('Gagal submit!');
      }
    } catch (error: any) {
      console.error('Error submitting with notes:', error);
      setShowNotesDialog(true);

      const errorMessage = error instanceof Error ? error.message : 'Penyebab tidak diketahui.';
      if (!navigator.onLine) {
        toast.error('Tidak ada koneksi internet. Submit belum terkirim; data tetap di formulir. Periksa koneksi lalu coba lagi.', { duration: 8000 });
      } else if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        toast.error('Server belum merespons. Submit belum dapat dipastikan; data tetap di formulir. Tunggu sebentar sebelum mencoba lagi.', { duration: 8000 });
      } else {
        toast.error(`Submit gagal: ${errorMessage}`, { duration: 10000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (isA321 && missingIndicators.length > 0) {
      toast.error(`Lengkapi semua indikator terlebih dahulu: ${missingIndicators.map((indicator) => indicator.name).join(', ')}`);
      return;
    }

    // VALIDASI 1: Check minimal score for other branches
    if (!isA321 && !canSubmit) {
      toast.error(`Score minimal ${minSubmitScore}% untuk submit!`);
      return;
    }

    // VALIDASI 2: Check number+photo indicators - WAJIB diisi KEDUANYA!
    const missingNumberPhoto: string[] = [];
    if (!isA321) indicators.forEach(indicator => {
      if (indicator.type === 'number+photo') {
        const inputData = data[indicator.id];
        const value = inputData?.value || 0;
        const photos = inputData?.photos || [];
        const requiredPhotos = indicator.targetPhotos || 1;

        // WAJIB: value harus > 0 DAN foto harus lengkap
        if (value <= 0 || photos.length < requiredPhotos) {
          missingNumberPhoto.push(indicator.name);
        }
      }
    });

    if (missingNumberPhoto.length > 0) {
      toast.error(
        `Indikator berikut WAJIB diisi lengkap (angka + foto):\n${missingNumberPhoto.join(', ')}`,
        { duration: 5000 }
      );
      return;
    }

    // 🔄 SHOW LOADING - Like before!
    setIsSubmitting(true);

    try {
      const submissionData = await prepareSubmissionData(data, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.6
      });

      // 🕐 FIX: Use actual current time WITH TIMEZONE!
      const now = new Date(); // Current local time
      const selectedDate = new Date(submissionDate);

      // Set waktu ke waktu sekarang (jam submit yang sebenarnya!)
      selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

      // 🔥 IMPORTANT: Send CURRENT timestamp untuk backend validation
      const submittedAt = now.toISOString(); // Waktu SUBMIT yang sebenarnya (bukan pilihan tanggal)

      console.log('');
      console.log('🕐 ===== TIMESTAMP DEBUG =====');
      console.log('📅 Selected Date:', submissionDate); // YYYY-MM-DD
      console.log('🕐 Submit Time (NOW):', submittedAt); // Full timestamp
      console.log('🕐 Display Time:', now.toLocaleTimeString('id-ID'));
      console.log('============================');
      console.log('');

      const submission: Submission = {
        id: `${branch.id}_${user.nik}_${Date.now()}`,
        branchId: branch.id,
        user: {
          nik: user.nik,
          nama: user.nama
        },
        data: submissionData as any,
        totalScore: isA321 ? 0 : totalScore,
        scoreDetails: isA321 ? [] : scoreResult.details,
        date: submissionDate, // YYYY-MM-DD only (untuk filter by date)
        createdAt: submittedAt, // 🔥 REAL submit time - jangan overwrite di backend!
        displayDate: selectedDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      };

      // Upload to server
      const success = await api.addSubmission(branch.id, submission);

      if (success) {
        // ✅ SUCCESS - Show message and reset form
        setSubmissionCompletedAt(new Date());

        // Reset form to fresh state
        const freshData: Record<string, IndicatorData> = {};
        indicators.forEach(ind => {
          freshData[ind.id] = {
            id: ind.id,
            value: undefined,
            photos: [],
            textValue: '',
            dropdownValue: '',
            checkboxValue: false
          };
        });
        setData(freshData);

        // Reset tanggal ke hari ini
        setSubmissionDate(isA321 ? getJakartaDate() : new Date().toISOString().split('T')[0]);

        // Clear draft
        draftManager.clearDraft(branch.id, user?.nik || '');

        // ⚡ INVALIDATE CACHE - Force refetch for instant update
        queryClient.invalidateQueries({ queryKey: ['submissions', branch.id] });

        // Refetch untuk update UI
        refetchSubmissions();
      } else {
        throw new Error('Submit failed');
      }
    } catch (error: any) {
      console.error('Submit error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Penyebab tidak diketahui.';
      if (!navigator.onLine) {
        toast.error('Tidak ada koneksi internet. Submit belum terkirim; data tetap di formulir. Periksa koneksi lalu coba lagi.', { duration: 8000 });
      } else if (error.name === 'AbortError' || error.name === 'TimeoutError') {
        toast.error('Server belum merespons. Submit belum dapat dipastikan; data tetap di formulir. Tunggu sebentar sebelum mencoba lagi.', { duration: 8000 });
      } else {
        toast.error(`Submit gagal: ${errorMessage}`, { duration: 10000 });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (indicatorId: string, value: number | undefined) => {
    // ⚡ OPTIMISTIC UPDATE: Update UI immediately (no waiting!)
    const newData = {
      ...data,
      [indicatorId]: {
        ...data[indicatorId],
        value
      }
    };

    // 🔄 AUTO-CALCULATE BASKET SIZE when Sales or Trx changes
    if (indicatorId === 'sales' || indicatorId === 'trx' || indicatorId === 'transaksi') {
      const salesValue = indicatorId === 'sales' ? (value || 0) : (data['sales']?.value || 0);
      const trxValue = indicatorId === 'trx'
        ? (value || 0)
        : indicatorId === 'transaksi'
          ? (value || 0)
          : (data['trx']?.value || data['transaksi']?.value || 0);

      // Calculate Basket Size = Sales / Trx
      const basketSize = trxValue > 0 ? Math.round(salesValue / trxValue) : 0;

      // Auto-update basket size
      newData['basket'] = {
        ...newData['basket'],
        value: basketSize
      };
      newData['basketSize'] = {
        ...newData['basketSize'],
        value: basketSize
      };
    }

    // ⚡ INSTANT UI UPDATE
    setData(newData);

    // 💾 DEBOUNCED SAVE: Save to draft after user stops typing (2 seconds)
    draftManager.saveDraftDebounced(branch.id, user?.nik || '', newData);
  };

  const handleFileChange = (indicatorId: string, files: FileList | null, photoIndex?: number) => {
    if (files && files.length > 0) {
      const file = files[0]; // Always take first file
      const currentPhotos = data[indicatorId]?.photos || [];

      let newPhotos;
      if (photoIndex !== undefined) {
        // Replace specific index
        newPhotos = [...currentPhotos];
        newPhotos[photoIndex] = file;
      } else {
        // Legacy: replace all (for backward compatibility)
        newPhotos = Array.from(files);
      }

      const multiPhotoIndicator = isA321
        ? indicators.find(indicator => indicator.id === indicatorId && (indicator.targetPhotos || 0) > 1)
        : undefined;
      if (multiPhotoIndicator && newPhotos.length > (multiPhotoIndicator.targetPhotos || 0)) {
        newPhotos = newPhotos.slice(0, multiPhotoIndicator.targetPhotos);
        toast.info(`Maksimal ${multiPhotoIndicator.targetPhotos} foto untuk ${multiPhotoIndicator.name}.`);
      }

      const newData = {
        ...data,
        [indicatorId]: {
          ...data[indicatorId],
          photos: newPhotos
        }
      };

      // ⚡ INSTANT UI UPDATE
      setData(newData);

      // 💾 DEBOUNCED SAVE
      draftManager.saveDraftDebounced(branch.id, user?.nik || '', newData);
    }
  };

  const handleRemovePhoto = (indicatorId: string, photoIndex: number) => {
    const currentPhotos = data[indicatorId]?.photos || [];
    const newPhotos = currentPhotos.filter((_, idx) => idx !== photoIndex);

    const newData = {
      ...data,
      [indicatorId]: {
        ...data[indicatorId],
        photos: newPhotos
      }
    };

    // ⚡ INSTANT UI UPDATE
    setData(newData);

    // 💾 DEBOUNCED SAVE
    draftManager.saveDraftDebounced(branch.id, user?.nik || '', newData);
  };

  const handleTextChange = (indicatorId: string, textValue: string) => {
    const newData = {
      ...data,
      [indicatorId]: {
        ...data[indicatorId],
        textValue
      }
    };

    // ⚡ INSTANT UI UPDATE
    setData(newData);

    // 💾 DEBOUNCED SAVE
    draftManager.saveDraftDebounced(branch.id, user?.nik || '', newData);
  };

  const handleDropdownChange = (indicatorId: string, dropdownValue: string) => {
    const newData = {
      ...data,
      [indicatorId]: {
        ...data[indicatorId],
        dropdownValue
      }
    };

    // ⚡ INSTANT UI UPDATE
    setData(newData);

    // 💾 DEBOUNCED SAVE
    draftManager.saveDraftDebounced(branch.id, user?.nik || '', newData);
  };

  const handleCheckboxChange = (indicatorId: string, checkboxValue: boolean) => {
    const newData = {
      ...data,
      [indicatorId]: {
        ...data[indicatorId],
        checkboxValue
      }
    };

    // ⚡ INSTANT UI UPDATE
    setData(newData);

    // 💾 DEBOUNCED SAVE
    draftManager.saveDraftDebounced(branch.id, user?.nik || '', newData);
  };

  const getIndicatorScore = (indicatorId: string) => {
    const detail = scoreResult.details.find(d => d.indicatorId === indicatorId);
    return detail || { score: 0, percentage: 0 };
  };

  const isA321MenuLoading = isA321 && !showHistory && (
    (indicators.length === 0 && indicatorsFetching)
    || (indicators.length > 0 && !a321Metrics && !a321MetricsError)
  );

  if (submissionCompletedAt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xl">
          <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-500" />
          <div className="px-6 py-10 text-center sm:px-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" strokeWidth={1.8} />
            </div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Data berhasil disimpan
            </p>
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              Shift Kerja Anda Hari Ini Sudah Selesai
            </h1>
            <p className="mt-4 text-gray-600">
              Terima kasih atas kerja keras Anda hari ini, {user.nama}.
            </p>
            <p className="mt-2 text-gray-600">
              Semoga perjalanan pulang lancar. Hati-hati di jalan!
            </p>
            <p className="mt-6 text-sm text-gray-400">
              Tersimpan pada {submissionCompletedAt.toLocaleString('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                onClick={() => setSubmissionCompletedAt(null)}
                className="h-11 bg-emerald-600 px-6 hover:bg-emerald-700"
              >
                Kembali ke halaman utama
              </Button>
              <Button variant="outline" onClick={onLogout} className="h-11 px-6">
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isA321MenuLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-sm rounded-xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Memuat Indikator A321</h2>
          <p className="mt-2 text-sm text-gray-600">Mengambil target dan aktual berdasarkan NIK serta tanggal.</p>
        </div>
      </div>
    );
  }

  if (showHistory) {
    // ⚡ INSTANT STATS - Calculate on the fly (hanya untuk 10 data)
    const totalSubmissions = mySubmissions.length;
    const avgScore = totalSubmissions > 0
      ? Math.round(mySubmissions.reduce((sum, s) => sum + s.totalScore, 0) / totalSubmissions)
      : 0;
    const maxScore = totalSubmissions > 0
      ? Math.max(...mySubmissions.map(s => s.totalScore))
      : 0;
    const perfectScores = mySubmissions.filter(s => s.totalScore >= 100).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-2 md:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header - RESPONSIVE */}
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-3 md:p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                <div>
                  <h2 className="text-lg md:text-2xl font-bold">
                    {isAdmin ? 'Riwayat Semua Staff' : 'Riwayat Saya'}
                  </h2>
                  {!isAdmin && totalCount > 0 && (
                    <p className="text-xs text-gray-500">
                      📊 Total: {totalCount} submission
                    </p>
                  )}
                </div>
                {submissionsFetching && !submissionsLoading && (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <Button variant="outline" onClick={() => setShowHistory(false)} className="h-8 md:h-10">
                <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="text-xs md:text-sm">Kembali</span>
              </Button>
            </div>

            {/* Refresh Button Bar - Always visible */}
            <div className="flex gap-2 items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex flex-col gap-0.5">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  {submissionsFetching ? (
                    <>
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-600 font-medium">Memperbarui data...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-green-600">✓</span>
                      <span>Data terbaru</span>
                    </>
                  )}
                </div>
                {lastRefreshTime && !submissionsFetching && (
                  <p className="text-[10px] text-gray-400">
                    Diperbarui: {lastRefreshTime.toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('');
                    console.log('🔄🔄🔄 MANUAL REFRESH 🔄🔄🔄');
                    console.log('User:', user?.nama, '(', user?.nik, ')');
                    console.log('Fetching latest submissions...');
                    console.log('');

                    // Invalidate cache untuk force fetch fresh data
                    queryClient.invalidateQueries({ queryKey: ['submissions', branch.id] });

                    // Refetch
                    refetchSubmissions();

                    toast.info('🔄 Memuat data terbaru...', { duration: 2000 });
                  }}
                  disabled={submissionsFetching}
                  className="h-7 md:h-8 text-xs"
                >
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">↻</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.log('');
                    console.log('🗑️🗑️🗑️ CLEAR ALL CACHE (FULL) 🗑️🗑️🗑️');
                    console.log('Branch:', branch.id);
                    console.log('Clearing: indicators, settings, submissions, ALL caches');
                    console.log('');

                    // ✅ Clear ALL caches (indicators, settings, submissions, dll)
                    api.clearAllCaches();

                    // Clear React Query cache untuk force refetch SEMUA
                    queryClient.invalidateQueries({ queryKey: ['indicators', branch.id] });
                    queryClient.invalidateQueries({ queryKey: ['settings', branch.id] });
                    queryClient.invalidateQueries({ queryKey: ['submissions', branch.id] });
                    queryClient.removeQueries({ queryKey: ['submissions', branch.id] });

                    console.log('✅ All cache cleared!');
                    console.log('🔄 Refetching ALL data (indicators, settings, submissions)...');
                    console.log('');

                    // Refetch ALL data untuk dapat data terbaru
                    refetchIndicators();
                    refetchSettings();
                    refetchSubmissions();

                    toast.success('🗑️ All cache cleared! Getting latest data...', { duration: 3000 });
                  }}
                  disabled={submissionsFetching}
                  className="h-7 md:h-8 text-xs border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <svg className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden sm:inline">Clear Cache</span>
                  <span className="sm:hidden">🗑️</span>
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-2 text-xs md:text-sm text-gray-600 flex items-center gap-2">
              {isAdmin && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full font-medium">
                  🔑 ADMIN
                </span>
              )}
              <span>{user.nama} ({user.nik})</span>
            </div>
          </div>

          {/* Stats Cards - INSTANT! */}
          {totalSubmissions > 0 && (
            <div className={`grid grid-cols-2 ${isA321 ? 'md:grid-cols-1' : 'md:grid-cols-4'} gap-2 md:gap-3 mb-4`}>
              <Card className="border-blue-200">
                <CardContent className="p-3 md:p-4">
                  <p className="text-xs text-gray-600 mb-1">Total Submit</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600">{totalSubmissions}</p>
                </CardContent>
              </Card>
              {!isA321 && <Card className="border-green-200">
                <CardContent className="p-3 md:p-4">
                  <p className="text-xs text-gray-600 mb-1">Rata-rata</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">{avgScore}%</p>
                </CardContent>
              </Card>}
              {!isA321 && <Card className="border-purple-200">
                <CardContent className="p-3 md:p-4">
                  <p className="text-xs text-gray-600 mb-1">Tertinggi</p>
                  <p className="text-xl md:text-2xl font-bold text-purple-600">{maxScore}%</p>
                </CardContent>
              </Card>}
              {!isA321 && <Card className="border-yellow-200">
                <CardContent className="p-3 md:p-4">
                  <p className="text-xs text-gray-600 mb-1">Perfect 💯</p>
                  <p className="text-xl md:text-2xl font-bold text-yellow-600">{perfectScores}x</p>
                </CardContent>
              </Card>}
            </div>
          )}

          {/* Submissions List - INSTANT RENDER! */}
          <div className="space-y-2 md:space-y-3">
            {submissionsError ? (
              // Error state
              <Card className="border-red-300 bg-red-50">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <p className="text-red-700 font-medium mb-2">Gagal Memuat Data</p>
                  <p className="text-sm text-red-600 mb-4">
                    Server timeout atau tidak dapat diakses. Ini bisa terjadi karena:
                  </p>
                  <ul className="text-xs text-left text-red-600 max-w-md mx-auto mb-4 space-y-1">
                    <li>• Server Supabase sedang cold start (butuh 5-10 detik)</li>
                    <li>• Koneksi internet lambat</li>
                    <li>• Backend belum selesai deploy</li>
                  </ul>
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={() => {
                        console.log('🔄 Retry fetch submissions...');
                        refetchSubmissions();
                      }}
                      className="mt-2"
                    >
                      🔄 Coba Lagi
                    </Button>
                    <Button
                      onClick={() => {
                        console.log('🗑️ Clearing cache and refetching...');
                        // Clear all cache for this branch
                        for (let i = localStorage.length - 1; i >= 0; i--) {
                          const key = localStorage.key(i);
                          if (key && key.includes(`submissions_${branch.id}`)) {
                            localStorage.removeItem(key);
                            console.log('Cleared:', key);
                          }
                        }
                        // Clear React Query cache
                        queryClient.invalidateQueries({ queryKey: ['submissions', branch.id] });
                        queryClient.removeQueries({ queryKey: ['submissions', branch.id] });
                        // Refetch
                        refetchSubmissions();
                        toast.success('Cache cleared! Fetching fresh data...');
                      }}
                      variant="outline"
                      className="mt-2"
                    >
                      🗑️ Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : submissionsLoading ? (
              // Loading state dengan prominent notification
              <div className="space-y-3">
                <Card className="border-blue-300 bg-blue-50 animate-pulse">
                  <CardContent className="py-12 text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-blue-700 font-bold text-lg mb-2">⏳ Memuat Data Riwayat...</p>
                    <p className="text-blue-600 text-sm mb-4">Server sedang memproses request</p>
                    <div className="max-w-md mx-auto bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-3">
                      <p className="text-xs text-yellow-800 font-medium mb-1">💡 First Load bisa 5-15 detik</p>
                      <p className="text-xs text-yellow-700">Supabase Edge Function membutuhkan waktu cold start</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : mySubmissions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Belum ada submission</p>
                  <p className="text-xs text-gray-400 mt-1">Submit data pertama Anda sekarang!</p>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg max-w-sm mx-auto">
                    <p className="text-xs text-blue-700 font-medium mb-2">
                      🔒 Privacy Terjaga
                    </p>
                    <p className="text-xs text-blue-600">
                      Riwayat ini hanya menampilkan <strong>data Anda sendiri</strong>. Data user lain tidak akan pernah muncul di sini.
                    </p>
                  </div>

                  <div className="flex gap-2 justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        console.log('🔄 Refresh submissions...');
                        refetchSubmissions();
                      }}
                      size="sm"
                    >
                      🔄 Refresh Data
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        console.log('');
                        console.log('🗑️🗑️🗑️ MANUAL CACHE CLEAR 🗑️🗑️🗑️');
                        console.log('Clearing all submission caches for branch:', branch.id);

                        let clearedCount = 0;
                        // Clear all cache for this branch
                        for (let i = localStorage.length - 1; i >= 0; i--) {
                          const key = localStorage.key(i);
                          if (key && key.includes(`submissions_${branch.id}`)) {
                            console.log('  Clearing:', key);
                            localStorage.removeItem(key);
                            clearedCount++;
                          }
                        }

                        console.log(`✅ Cleared ${clearedCount} localStorage entries`);

                        // Clear React Query cache
                        queryClient.invalidateQueries({ queryKey: ['submissions', branch.id] });
                        queryClient.removeQueries({ queryKey: ['submissions', branch.id] });
                        console.log('✅ Cleared React Query cache');

                        console.log('🔄 Fetching fresh data from server...');
                        console.log('');

                        // Refetch
                        refetchSubmissions();
                        toast.success('Cache cleared! Fetching fresh data...', { duration: 3000 });
                      }}
                      size="sm"
                    >
                      🗑️ Clear Cache
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              mySubmissions.map((sub, idx) => (
                <Card
                  key={sub.id || idx}
                  className={`transition-all hover:shadow-md ${
                    sub.status === 'pending'
                      ? 'border-blue-300 bg-blue-50'
                      : sub.status === 'failed'
                      ? 'border-red-300 bg-red-50'
                      : !isA321 && sub.totalScore >= 100
                      ? 'border-blue-200 bg-blue-50'
                      : ''
                  }`}
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* User Info (Admin Only) */}
                        {isAdmin && (
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-xs font-semibold text-purple-700">
                              👤 {sub.user?.nama || 'Unknown'} ({sub.user?.nik || 'N/A'})
                            </span>
                          </div>
                        )}

                        {/* Date and Status */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-xs md:text-sm font-medium text-gray-700">
                            {sub.displayDate}
                          </p>
                          {sub.status === 'pending' && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full animate-pulse inline-flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                              Mengirim...
                            </span>
                          )}
                          {sub.status === 'failed' && (
                            <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                              Gagal
                            </span>
                          )}
                          {!isA321 && sub.totalScore >= 100 && !sub.status && (
                            <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full font-medium">
                              🏆 Perfect!
                            </span>
                          )}
                        </div>
                        
                        {/* Date & Time - Format: Hari (DD/MM/YYYY | HH:MM) */}
                        <p className="text-xs text-gray-500">
                          📅 {(() => {
                            // Gunakan createdAt (timestamp lengkap) bukan date (date-only)
                            const timestamp = sub.createdAt || sub.date;
                            const dateObj = new Date(timestamp);

                            // Cek apakah valid date
                            if (isNaN(dateObj.getTime())) {
                              console.error('❌ Invalid timestamp:', { timestamp, sub });
                              return 'Waktu tidak valid';
                            }

                            // Nama hari dalam bahasa Indonesia
                            const dayName = dateObj.toLocaleDateString('id-ID', {
                              weekday: 'long'
                            });

                            // Tanggal: DD/MM/YYYY
                            const dateStr = dateObj.toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            });

                            // Waktu: HH:MM (tanpa detik)
                            const timeStr = dateObj.toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit'
                            });

                            // Format: Hari (DD/MM/YYYY | HH:MM)
                            return `${dayName} (${dateStr} | ${timeStr})`;
                          })()}
                        </p>

                        {/* Notes if available */}
                        {sub.notes && sub.notes.reason && sub.notes.reason !== '-' && (
                          <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs space-y-1">
                            <p className="font-semibold text-orange-800 mb-1">📝 Submit dengan Catatan</p>
                            <div className="space-y-0.5">
                              <p className="text-orange-700"><strong>Reason:</strong> {sub.notes.reason}</p>
                              {sub.notes.approval && sub.notes.approval !== '-' && (
                                <p className="text-orange-700"><strong>Approval:</strong> {sub.notes.approval}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {!isA321 && <div className={`
                        px-3 md:px-4 py-2 rounded-full text-white font-bold flex-shrink-0 text-sm md:text-base
                        ${sub.totalScore >= 100 ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 
                          sub.totalScore >= 80 ? 'bg-green-500' : 
                          'bg-red-500'}
                      `}>
                        {sub.totalScore}%
                      </div>}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Load More Button */}
          {!isAdmin && hasMore && totalSubmissions > 0 && (
            <div className="mt-4 space-y-3">
              <div className="text-center text-sm text-gray-600">
                Menampilkan <strong>{mySubmissions.length}</strong> dari <strong>{totalCount}</strong> submission
              </div>
              <Button
                onClick={() => {
                  console.log('🔽 Load more submissions...');
                  console.log('Current limit:', displayLimit);
                  console.log('New limit:', displayLimit + 10);
                  setDisplayLimit(prev => prev + 10);
                }}
                variant="outline"
                className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                📥 Muat 10 Data Lagi
              </Button>
            </div>
          )}

          {/* Info: Semua data sudah ditampilkan */}
          {!isAdmin && !hasMore && totalSubmissions > 0 && totalSubmissions > 10 && (
            <div className="mt-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg text-center">
              <p className="text-lg mb-2">✅</p>
              <p className="text-sm text-green-700 font-medium mb-1">
                Semua <strong>{totalCount}</strong> data Anda sudah ditampilkan
              </p>
              <p className="text-xs text-green-600">
                Tidak ada lagi data untuk dimuat
              </p>
            </div>
          )}

          {/* Info footer */}
          {totalSubmissions > 0 && (
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-blue-700 text-center flex items-center justify-center gap-2">
                  {submissionsFetching && !submissionsLoading && (
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {submissionsFetching && !submissionsLoading ? (
                    <>Memperbarui data...</>
                  ) : (
                    <>⚡ Data dimuat instant dari cache lokal</>
                  )}
                </div>
              </div>

              {/* Tips Box */}
              <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                <p className="text-xs font-semibold text-purple-900 mb-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  💡 Tips: Cek Update Data
                </p>
                <ul className="text-[11px] text-purple-700 space-y-1">
                  <li>• Klik <strong>"Refresh"</strong> untuk cek apakah ada submission baru</li>
                  <li>• Klik <strong>"Clear Cache"</strong> jika data tidak muncul lengkap</li>
                  <li>• Data auto-refresh saat buka riwayat atau kembali dari tab lain</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-2 md:p-4">
      {/* ���� SUBMIT LOADING SCREEN - RESTORED! */}
      {isSubmitting && <SubmitLoadingScreen />}

      <div className="max-w-4xl mx-auto">
        {/* Header - RESPONSIVE */}
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg">
                <Crown className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  CROWN DAILY INDICATORS
                </h1>
                <p className="text-xs md:text-sm text-gray-600">{user.nama} ({user.nik})</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              <Button variant="outline" onClick={() => setShowHistory(true)} className="text-xs md:text-sm h-8 md:h-10 px-2 md:px-4">
                <History className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Riwayat</span>
                <span className="sm:hidden">History</span>
              </Button>
              {/* Only show Back button if it's different from Logout (accessed from main page) */}
              {onBack !== onLogout && (
                <Button variant="outline" onClick={onBack} className="text-xs md:text-sm h-8 md:h-10 px-2 md:px-4">
                  <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden md:inline">Kembali</span>
                </Button>
              )}
              <Button variant="outline" onClick={onLogout} className="text-xs md:text-sm h-8 md:h-10 px-2 md:px-4">
                <LogOut className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Offline Indicator */}
        {isOffline && (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">Offline Mode</p>
              <p className="text-xs text-red-700">Data akan disimpan lokal dan dikirim otomatis saat online</p>
            </div>
          </div>
        )}

        {/* Score Card - RESPONSIVE */}
        <Card className={`mb-4 md:mb-6 border-2 ${isA321 ? 'border-gray-200 bg-white' : scoreColor}`}>
          <CardContent className="pt-4 md:pt-6 px-4 md:px-6">
            <div className="space-y-1">
              {!isA321 && <p className="text-xs md:text-sm text-gray-600">Total Pencapaian</p>}
              <label className="text-xs font-medium text-gray-700">Tanggal Submit:</label>
              <Input
                type="date"
                value={submissionDate}
                  onChange={(e) => {
                    setA321Metrics(null);
                    setA321MetricsError('');
                    setSubmissionDate(e.target.value);
                  }}
                  max={isA321 ? getJakartaDate() : new Date().toISOString().split('T')[0]}
                className="w-full md:w-auto text-xs md:text-sm h-8 md:h-9"
              />
                {isA321 && a321MetricsLoading && <p className="text-xs text-blue-600">Memuat data otomatis...</p>}
                {isA321 && a321MetricsError && <p className="text-xs text-red-600" role="alert">Gagal memuat data: {a321MetricsError}</p>}
            </div>
            {!isA321 && (
              <>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(submissionDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <div className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${totalScore < minSubmitScore ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'} w-fit h-fit mt-2`}>
                  {totalScore < minSubmitScore ? `Minimal ${minSubmitScore}%` : 'Siap Submit'}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{totalScore}%</div>
                <div className={`h-3 md:h-4 rounded-full overflow-hidden ${scoreBadge}`}>
                  <div className="h-full bg-white/30" style={{ width: `${100 - totalScore}%`, marginLeft: `${totalScore}%` }}></div>
                </div>
                {totalScore >= minSubmitScore && (
                  <p className={`text-xs md:text-sm font-medium mt-2 ${totalScore >= 100 ? 'text-red-700' : 'text-green-700'}`}>
                    {motivationMessage}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Indicators - RESPONSIVE - NO LOADING! INSTANT! */}
        <div className="space-y-3 md:space-y-4">
          {indicators.map((indicator) => {
            const Icon = iconMap[indicator.icon || 'Target'];
            const inputData = data[indicator.id] || { value: undefined, photos: [] };
            const score = getIndicatorScore(indicator.id);
            const a321MetricKey = isA321 ? getA321MetricKey(indicator) : null;
            const isA321Basket = isA321 && ['basket', 'basketsize'].some(key =>
              key === normalizeIndicatorKey(indicator.id) || key === normalizeIndicatorKey(indicator.name)
            );
            const isA321Rupiah = isA321 && (a321MetricKey === 'sales' || isA321Basket);
            const isA321AutoInput = isA321 && a321MetricKey !== null;
            const isA321Mgb = isA321 && normalizeIndicatorKey(indicator.id) === 'mgb';
            const a321Target = indicator.type === 'photo' ? indicator.targetPhotos : indicator.targetValue;
            const a321Actual = indicator.type === 'photo'
              ? inputData.photos?.length || 0
              : inputData.value || 0;
            const a321NumberProgress = a321Target && a321Target > 0
              ? Math.min((a321Actual / a321Target) * 100, 100)
              : 0;
            const a321PhotoProgress = indicator.targetPhotos && indicator.targetPhotos > 0
              ? Math.min(((inputData.photos?.length || 0) / indicator.targetPhotos) * 100, 100)
              : 100;
            const isA321Kendala = isA321 && normalizeIndicatorKey(indicator.id + indicator.name).includes('kendala');
            const a321TextFilled = !!inputData.textValue?.trim();
            const a321Progress = indicator.type === 'text'
              ? a321TextFilled ? 100 : 0
              : indicator.type === 'number+photo'
                ? Math.min(a321NumberProgress, a321PhotoProgress)
              : a321Target && a321Target > 0
                ? Math.min((a321Actual / a321Target) * 100, 100)
                : 0;

            return (
              <Card key={indicator.id}>
                <CardHeader className="pb-2 md:pb-3 px-4 md:px-6">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-red-50 rounded-lg">
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{indicator.name}</CardTitle>
                      <p className="text-xs text-gray-600">
                        {indicator.type === 'photo' && `Target: ${indicator.targetPhotos} foto`}
                        {indicator.type === 'number' && indicator.targetValue && `Target: ${isA321Rupiah ? formatRupiah(indicator.targetValue) : indicator.targetValue.toLocaleString('id-ID')}`}
                        {indicator.type === 'number+photo' && `Target: ${indicator.targetValue} + ${indicator.targetPhotos} foto`}
                        {indicator.type === 'text' && (isA321Kendala ? 'Opsional' : 'Wajib diisi')}
                        {indicator.type === 'dropdown' && 'Target: Pilih opsi'}
                        {indicator.type === 'checkbox' && 'Target: Centang checkbox'}
                        {indicator.isSpecial && indicator.specialFormula && ` | ${indicator.specialFormula}`}
                        {!isA321 && indicator.weight && ` | Bobot: ${indicator.weight}% (Maksimal)`}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isA321Mgb && (
                    <div className="space-y-2">
                      <label htmlFor={`mgb-description-${indicator.id}`} className="text-sm font-medium">
                        Keterangan <span className="text-red-600">*</span>
                      </label>
                      <Input
                        id={`mgb-description-${indicator.id}`}
                        type="text"
                        placeholder="Contoh: Area Section Chemical Cleaning"
                        value={inputData.textValue || ''}
                        onChange={(e) => handleTextChange(indicator.id, e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">Wajib diisi sebelum mengirim foto MGB.</p>
                    </div>
                  )}
                  {(indicator.type === 'number' || indicator.type === 'number+photo') && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Pencapaian {indicator.name}{isA321 && !isA321AutoInput ? ' *' : ''}
                      </label>
                      <Input
                        type="text"
                        placeholder={indicator.placeholder || `Masukkan nilai ${indicator.name.toLowerCase()}`}
                        value={inputData.value !== undefined && inputData.value !== null
                          ? isA321Rupiah ? formatRupiah(inputData.value) : formatNumber(inputData.value)
                          : ''}
                        onChange={(e) => {
                          const formatted = formatNumberInput(e.target.value);
                          const numValue = formatted ? parseFormattedNumber(formatted) : undefined;
                          handleInputChange(indicator.id, numValue);
                        }}
                        disabled={isA321AutoInput || indicator.id === 'basket' || indicator.id === 'basketSize'}
                        className={(isA321AutoInput || indicator.id === 'basket' || indicator.id === 'basketSize') ? 'bg-gray-100 cursor-not-allowed' : ''}
                      />
                      {(indicator.id === 'basket' || indicator.id === 'basketSize') && (
                        <p className="text-xs text-blue-600">
                          ✨ Otomatis: Sales ÷ Trx = {isA321Rupiah ? formatRupiah(inputData.value) : inputData.value ? formatNumber(inputData.value) : '0'}
                        </p>
                      )}
                      {indicator.targetValue && !(indicator.id === 'basket' || indicator.id === 'basketSize') && (
                        <p className="text-xs text-gray-500">Target: {isA321Rupiah ? formatRupiah(indicator.targetValue) : formatNumber(indicator.targetValue)}</p>
                      )}
                    </div>
                  )}

                  {(indicator.type === 'photo' || indicator.type === 'number+photo') && (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">{indicator.placeholder || 'Upload Foto Bukti'}</label>

                      {isA321 && (indicator.targetPhotos || 0) > 1 ? (
                        <div className="space-y-3">
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileChange(indicator.id, e.target.files)}
                          />
                          <p className="text-xs text-gray-500">
                            {inputData.photos?.length || 0}/{indicator.targetPhotos} foto dipilih
                          </p>
                          {inputData.photos && inputData.photos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {inputData.photos.map((photo, photoIndex) => (
                                <div key={`${indicator.id}-${photoIndex}`} className="space-y-1">
                                  {photo && (
                                    <PhotoPreview
                                      photo={photo}
                                      alt={`Preview MGB ${photoIndex + 1}`}
                                      className="aspect-square w-full rounded border border-gray-300 object-cover"
                                    />
                                  )}
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs"
                                    onClick={() => handleRemovePhoto(indicator.id, photoIndex)}
                                  >
                                    Hapus foto {photoIndex + 1}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          {/* Multiple photo inputs for non-MGB indicators */}
                          {indicator.targetPhotos && indicator.targetPhotos > 1 ? (
                        // Multiple photos: Render individual buttons
                        <div className="space-y-2">
                          {Array.from({ length: indicator.targetPhotos }).map((_, photoIndex) => {
                            const photo = inputData.photos?.[photoIndex];
                            const hasPhoto = !!photo;

                            return (
                              <div key={photoIndex} className="space-y-1">
                                {/* Photo Button Label */}
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-medium text-gray-700">
                                    📸 Foto {photoIndex + 1}
                                    {hasPhoto && <span className="text-green-600 ml-1">✓</span>}
                                  </span>
                                  {hasPhoto && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePhoto(indicator.id, photoIndex)}
                                      className="text-xs text-red-600 hover:text-red-800 underline"
                                    >
                                      Hapus
                                    </button>
                                  )}
                                </div>

                                {/* Photo Input */}
                                <div className="flex gap-2 items-center">
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(indicator.id, e.target.files, photoIndex)}
                                    className="flex-1"
                                  />
                                  {hasPhoto && (
                                    <span className="text-xs text-green-600 whitespace-nowrap">
                                      ✓ Uploaded
                                    </span>
                                  )}
                                </div>

                                {/* Photo Preview */}
                                {hasPhoto && photo && (
                                  <div className="mt-1">
                                    <PhotoPreview
                                      photo={photo}
                                      alt={`Foto ${photoIndex + 1}`}
                                      className="w-20 h-20 object-cover rounded border border-gray-300"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Summary */}
                          <div className="pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-600">
                              Progress: <strong className={inputData.photos?.length === indicator.targetPhotos ? 'text-green-600' : 'text-orange-600'}>
                                {inputData.photos?.length || 0}/{indicator.targetPhotos}
                              </strong> foto
                              {inputData.photos?.length === indicator.targetPhotos && (
                                <span className="text-green-600 ml-1">✓ Lengkap!</span>
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        // Single photo: Original simple input
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(indicator.id, e.target.files, 0)}
                          />
                          {inputData.photos && inputData.photos.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs text-green-600">
                                ✓ 1 foto dipilih
                              </p>
                              {/* Preview for single photo */}
                              {inputData.photos[0] && (
                                <>
                                  <PhotoPreview
                                    photo={inputData.photos[0]}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded border border-gray-300"
                                  />
                                </>
                              )}
                            </div>
                          )}
                        </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {indicator.type === 'text' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{indicator.name}{isA321Kendala ? ' (Opsional)' : ' *'}</label>
                      <Input
                        type="text"
                        placeholder={indicator.placeholder || indicator.targetText || `Masukkan ${indicator.name.toLowerCase()}`}
                        value={inputData.textValue || ''}
                        onChange={(e) => handleTextChange(indicator.id, e.target.value)}
                      />
                    </div>
                  )}

                  {indicator.type === 'dropdown' && indicator.dropdownOptions && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{indicator.name}</label>
                      <select
                        value={inputData.dropdownValue || ''}
                        onChange={(e) => handleDropdownChange(indicator.id, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">{indicator.placeholder || `Pilih ${indicator.name}`}</option>
                        {indicator.dropdownOptions.map((option, idx) => (
                          <option key={idx} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {indicator.type === 'checkbox' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`checkbox-${indicator.id}`}
                          checked={inputData.checkboxValue || false}
                          onChange={(e) => handleCheckboxChange(indicator.id, e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`checkbox-${indicator.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{indicator.name}</label>
                      </div>
                    </div>
                  )}

                  {isA321 && (
                    <div className="space-y-2 border-t border-gray-100 pt-3">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Aktual</p>
                          <p className="font-semibold text-gray-900">
                            {indicator.type === 'photo'
                              ? `${a321Actual} foto`
                              : indicator.type === 'number+photo'
                                ? `${formatNumber(a321Actual)} + ${inputData.photos?.length || 0}/${indicator.targetPhotos} foto`
                              : indicator.type === 'text'
                                ? a321TextFilled ? 'Terisi' : 'Belum diisi'
                                : isA321Rupiah ? formatRupiah(a321Actual) : formatNumber(a321Actual)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Target</p>
                          <p className="font-semibold text-gray-900">
                            {indicator.type === 'number+photo'
                              ? `${formatNumber(indicator.targetValue || 0)} + ${indicator.targetPhotos} foto`
                              : indicator.type === 'text'
                              ? isA321Kendala ? 'Opsional' : 'Wajib'
                              : a321Target && a321Target > 0
                                ? indicator.type === 'photo'
                                  ? `${a321Target} foto`
                                  : isA321Rupiah ? formatRupiah(a321Target) : formatNumber(a321Target)
                                : 'Belum diatur'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500">Tercapai</p>
                          <p className="font-semibold text-red-600">
                            {indicator.type === 'text' || (a321Target && a321Target > 0) ? `${Math.round(a321Progress)}%` : '-'}
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={a321Progress}
                        className="h-2"
                        indicatorClassName={getA321ProgressColor(a321Progress)}
                      />
                    </div>
                  )}

                  {!isA321 && <div className="flex items-center justify-between text-sm">
                    <span>Pencapaian: {score.percentage.toFixed(1)}%</span>
                    <span className="font-medium text-red-600">
                      Point: {score.score}% dari {indicator.weight}%
                    </span>
                  </div>}
                  {!isA321 && <Progress value={score.percentage} className="h-2" />}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Submit Buttons - RESPONSIVE */}
        <div className="mt-4 md:mt-6 mb-6 md:mb-8 space-y-2 md:space-y-3">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full text-sm md:text-base h-11 md:h-12"
          >
            {isA321
              ? a321MetricsLoading ? 'Memuat Data Spreadsheet...'
                : a321MetricsError ? 'Data Spreadsheet Tidak Tersedia'
                  : canSubmit ? 'Submit' : 'Lengkapi Semua Indikator'
              : canSubmit ? `Submit Data (Score: ${totalScore}%)` : `Submit Tidak Tersedia (Minimal ${minSubmitScore}%, Sekarang: ${totalScore}%)`}
          </Button>

          {/* Submit Dengan Catatan - hanya muncul jika score < minSubmitScore */}
          {!isA321 && totalScore < minSubmitScore && (
            <Button
              onClick={() => setShowNotesDialog(true)}
              variant="outline"
              className="w-full border-2 border-orange-400 text-orange-700 hover:bg-orange-50 text-sm md:text-base h-11 md:h-12"
            >
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Submit Dengan Catatan (Score: {totalScore}%)
            </Button>
          )}
        </div>

        {/* NO LOADING SCREEN - Submit is INSTANT like Google Form! */}
      </div>

      {/* Dialog Submit Dengan Catatan - RESPONSIVE */}
      {!isA321 && <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
              Submit Dengan Catatan
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Score Anda saat ini <strong>{totalScore}%</strong>. Silakan isi form berikut untuk submit dengan persetujuan admin.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 md:space-y-4 py-3 md:py-4">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">Reason (Alasan)</label>
              <Textarea
                id="reason"
                placeholder="Contoh: Stok barang sedang kosong, pengiriman terlambat, dll"
                value={notesReason}
                onChange={(e) => setNotesReason(e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="approval" className="text-sm font-medium">Approval (Persetujuan)</label>
              <Textarea
                id="approval"
                placeholder="Contoh: Disetujui oleh Manager, Approved by Supervisor, dll"
                value={notesApproval}
                onChange={(e) => setNotesApproval(e.target.value)}
                className="min-h-20"
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Verifikasi Admin</p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="adminNik" className="text-sm font-medium">NIK Admin</label>
                  <Input
                    id="adminNik"
                    placeholder="Masukkan NIK Admin"
                    value={notesAdminNik}
                    onChange={(e) => setNotesAdminNik(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="adminNama" className="text-sm font-medium">Nama Admin</label>
                  <Input
                    id="adminNama"
                    type="password"
                    placeholder="Masukkan Nama Admin"
                    value={notesAdminNama}
                    onChange={(e) => setNotesAdminNama(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmitWithNotes}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              size="lg"
            >
              Submit Dengan Catatan
            </Button>
          </div>
        </DialogContent>
      </Dialog>}
    </div>
  );
}