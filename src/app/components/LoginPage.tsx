import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Lock, ArrowLeft, HelpCircle, Crown, Users } from 'lucide-react';
import { Branch } from '../types';
import { api } from '../utils/api';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import azkoLogo from '../../imports/image-8.png';

interface LoginPageProps {
  branch: Branch;
  onLogin: (session: any) => void;
  onBack: (() => void) | null;
}

export default function LoginPage({ branch, onLogin, onBack }: LoginPageProps) {
  const [nik, setNik] = useState('');
  const [nama, setNama] = useState('');
  const [isLookingUpName, setIsLookingUpName] = useState(false);
  const [isValidatingUser, setIsValidatingUser] = useState(false);
  const [nameLookupError, setNameLookupError] = useState('');
  const isA321 = branch.id === 'A321';
  const isBranchAdminNik = nik.trim().toUpperCase() === branch.nik.toUpperCase();
  const isNameLookupLocked = isA321 && !isBranchAdminNik
    && (isLookingUpName || !!nik.trim());
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [showEmployeeRanking, setShowEmployeeRanking] = useState(false);
  const [employeeRanking, setEmployeeRanking] = useState<any[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);

  const getA321LoginErrorMessage = (error: unknown) => {
    const message = error instanceof Error ? error.message.toLowerCase() : '';
    if (message.includes('tidak ditemukan') || message.includes('not found') || message.includes('data nik')) {
      return 'NIK tidak terdaftar. Silakan hubungi admin toko.';
    }
    return 'NIK tidak dapat diperiksa. Periksa koneksi internet lalu coba lagi.';
  };

  // 🔄 Auto-load ranking when dialog opens
  useEffect(() => {
    if (showEmployeeRanking && employeeRanking.length === 0 && !loadingRanking) {
      console.log('🔄 Dialog opened - auto-loading employee ranking...');
      loadEmployeeRanking();
    }
  }, [showEmployeeRanking]);

  useEffect(() => {
    loadSettings();
  }, [branch.id]);

  useEffect(() => {
    const normalizedNik = nik.trim();
    if (!isA321 || !normalizedNik || normalizedNik.toUpperCase() === branch.nik.toUpperCase()) {
      setIsLookingUpName(false);
      setNameLookupError('');
      if (!normalizedNik || normalizedNik.toUpperCase() === branch.nik.toUpperCase()) setNama('');
      return;
    }

    let cancelled = false;
    setNama('');
    setNameLookupError('');
    setIsLookingUpName(true);

    const lookupTimer = window.setTimeout(() => {
      api.getA321UserByNik(normalizedNik)
        .then((userRecord) => {
          if (!cancelled) setNama(userRecord.name);
        })
        .catch((error) => {
          if (!cancelled) {
            setNameLookupError(getA321LoginErrorMessage(error));
          }
        })
        .finally(() => {
          if (!cancelled) setIsLookingUpName(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(lookupTimer);
    };
  }, [branch.id, branch.nik, isA321, nik]);

  const loadSettings = async () => {
    // ⚡ INSTANT: Load dari cache dulu untuk tampilan langsung!
    try {
      const cached = localStorage.getItem(`settings_${branch.id}_cache`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 30 * 60 * 1000) { // 30 menit
          console.log('⚡ Settings loaded from cache instantly');
          setSettings(parsed.data);
          return; // Skip network request - cache cukup!
        }
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }

    // Load dari server hanya jika cache tidak ada
    const data = await api.getSettings(branch.id);
    setSettings(data);

    // Save to cache
    try {
      localStorage.setItem(`settings_${branch.id}_cache`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error('Cache write error:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nik.trim()) {
      toast.error('NIK harus diisi!');
      return;
    }

    let loginName = nama.trim();
    if (isA321) {
      if (isValidatingUser) return;
      setIsValidatingUser(true);
      try {
        const userRecord = await api.getA321UserByNik(nik.trim());
        loginName = userRecord.name;
        setNama(userRecord.name);
        setNameLookupError('');
      } catch (error) {
        const message = getA321LoginErrorMessage(error);
        setNameLookupError(message);
        toast.error(message);
        return;
      } finally {
        setIsValidatingUser(false);
      }
    }

    if (!loginName) {
      toast.error('Nama harus diisi!');
      return;
    }

    // Check if this is branch admin
    const isBranchAdmin = nik === branch.nik && loginName.toUpperCase() === branch.adminName.toUpperCase();

    // Check if admin name needs to be changed (monthly check)
    if (isBranchAdmin) {
      const admin = await api.getBranchAdmin(branch.id);
      if (admin) {
        const lastChange = admin.lastNameChange ? new Date(admin.lastNameChange) : null;
        const now = new Date();
        const daysSinceChange = lastChange ? (now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24) : 999;

        if (daysSinceChange > 30) {
          toast.error('Waktu pergantian nama admin sudah tiba! Silakan ganti nama Anda di pengaturan.');
        }
      }
    }

    // ✨ AUTO CLEAR CACHE SEBELUM LOGIN - ALWAYS FRESH DATA!
    console.log('');
    console.log('✨✨✨ AUTO CLEAR CACHE ON LOGIN ✨✨✨');
    console.log('User:', nama.trim());
    console.log('Branch:', branch.id);
    console.log('Clearing ALL cache untuk dapat data terbaru...');

    // Show loading notification
    const loadingToast = toast.loading('🔄 Mengecek update data...', {
      duration: 10000
    });

    try {
      // Clear ALL cache (indicators, settings, submissions)
      api.clearAllCaches();
      console.log('✅ ALL cache cleared!');

      // Small delay untuk UX (show notification)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Show success notification
      toast.success('✅ Data terbaru dimuat!', {
        duration: 2000
      });

      console.log('🎉 Login dengan data fresh!');
      console.log('====================================');
      console.log('');

    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.dismiss(loadingToast);
      toast.warning('⚠️ Cache clear error, tapi login tetap lanjut');
    }

    // Proceed with login
    onLogin({
      branchId: branch.id,
      nik: nik.trim(),
      nama: loginName,
      isBranchAdmin,
      isSuperAdmin: false
    });

    toast.success(`Selamat datang, ${loginName}!`, {
      duration: 3000
    });
  };

  const handleForgotAdmin = () => {
    if (secretCode === 'AZKOIHSAN') {
      toast.success(`Nama Admin: ${branch.adminName}\nNIK Admin: ${branch.nik}`);
      setShowForgotDialog(false);
      setSecretCode('');
    } else {
      toast.error('Secret code salah!');
    }
  };

  const loadEmployeeRanking = async () => {
    setLoadingRanking(true);
    try {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      console.log('📊 Loading employee ranking for branch:', branch.id);

      // OPTIMASI: Load lebih banyak untuk ensure ada data
      const result = await api.getSubmissions(branch.id, 1, 500);
      const submissions = result.submissions || [];

      console.log('📊 Total submissions loaded:', submissions.length);

      if (submissions.length === 0) {
        console.log('⚠️ No submissions found for ranking');
        setEmployeeRanking([]);
        setLoadingRanking(false);
        return;
      }

      const monthSubmissions = submissions.filter((s: any) => {
        const subDate = new Date(s.date);
        return subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear;
      });

      console.log('📊 Month submissions (current month):', monthSubmissions.length);

      // Group by user
      const userMap = new Map<string, any>();
      monthSubmissions.forEach((submission: any) => {
        const key = submission.user?.nik || submission.nik || 'unknown';
        if (!userMap.has(key)) {
          userMap.set(key, {
            nik: submission.user?.nik || submission.nik,
            nama: submission.user?.nama || submission.nama || 'Unknown',
            scores: []
          });
        }
        userMap.get(key).scores.push(submission.totalScore || 0);
      });

      console.log('📊 Unique users:', userMap.size);

      // Calculate average and sort
      const ranking = Array.from(userMap.values()).map(user => ({
        ...user,
        avgScore: Math.round(user.scores.reduce((sum: number, s: number) => sum + s, 0) / user.scores.length),
        totalSubmissions: user.scores.length
      })).sort((a, b) => b.avgScore - a.avgScore);

      console.log('📊 Final ranking:', ranking.length, 'employees');

      setEmployeeRanking(ranking);
    } catch (error) {
      console.error('❌ Error loading ranking:', error);
      setEmployeeRanking([]);
    } finally {
      setLoadingRanking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button - Only show if onBack is provided (from main page) */}
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 md:mb-6 text-gray-600 hover:text-gray-900 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Pilih Cabang
          </Button>
        )}

        {/* Card - RESPONSIVE */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-red-100">
          {/* AZKO Logo with Crown - RESPONSIVE */}
          <div className="flex flex-col items-center mb-4 md:mb-6">
            {/* Crown decoration - RESPONSIVE SIZE */}
            <div className="mb-1">
              <Crown className="w-10 h-10 md:w-14 md:h-14 text-yellow-500 drop-shadow-xl" fill="currentColor" strokeWidth={1.5} />
            </div>

            {/* Logo container - RESPONSIVE */}
            <div className="relative -mt-4 md:-mt-6">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full blur-2xl opacity-30"></div>

              {/* Logo container */}
              <div className="relative bg-white rounded-full p-1.5 md:p-2 shadow-xl border-2 md:border-4 border-red-100">
                {/* AZKO Logo - RESPONSIVE */}
                <img
                  src={branch.logo || azkoLogo}
                  alt="Logo Toko"
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = azkoLogo;
                  }}
                />
              </div>
            </div>
          </div>

          {/* Title - RESPONSIVE */}
          <h1 className="text-2xl md:text-4xl font-bold text-center bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            {isA321 ? 'DAILY INDICATORS A321' : settings?.loginTitle || `DAILY INDICATORS ${branch.nik}`}
          </h1>
          <p className="text-center text-gray-600 text-sm md:text-base mb-6 md:mb-8 px-2">
            {isA321 ? 'Silahkan Login dengan NIK anda' : settings?.loginSubtitle || 'Silakan masuk dengan NIK dan Nama Anda'}
          </p>

          {/* Form - RESPONSIVE */}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">NIK</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Masukkan NIK"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="pl-4 h-11 md:h-12 text-base md:text-lg border-2 focus:border-red-500 rounded-xl"
                  required
                />
                {isA321 && isLookingUpName && (
                  <p className="text-xs text-blue-600 mt-1" role="status">Mencari nama berdasarkan NIK...</p>
                )}
                {isA321 && nameLookupError && (
                  <p className="text-xs text-red-600 mt-1" role="alert">{nameLookupError}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama</label>
              <div className="relative">
                <Input
                  type={nik === branch.nik ? "password" : "text"}
                  placeholder="Masukkan Nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  disabled={isNameLookupLocked}
                  className="pl-4 h-11 md:h-12 text-base md:text-lg border-2 focus:border-red-500 rounded-xl"
                  required
                />
                {nik === branch.nik && (
                  <p className="text-xs text-gray-500 mt-1">
                    Admin mode - Nama disembunyikan untuk keamanan
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isValidatingUser}
              className="w-full h-12 md:h-14 text-base md:text-lg font-semibold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-blue-700 rounded-xl shadow-lg"
            >
              {isValidatingUser ? 'Memeriksa NIK...' : 'Login'}
            </Button>
          </form>

          {branch.id !== 'A321' && <Button
            onClick={() => {
              setShowEmployeeRanking(true);
              loadEmployeeRanking();
            }}
            variant="outline"
            className="w-full mt-4 border-2 border-blue-400 text-blue-700 hover:bg-blue-50 h-11 md:h-12 text-sm md:text-base font-semibold"
          >
            <Users className="w-4 h-4 mr-2" />
            🌟 Ranking Karyawan {branch.displayName || branch.nik}
          </Button>}

          {/* Forgot Admin */}
          <button
            onClick={() => setShowForgotDialog(true)}
            className="w-full mt-6 text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4" />
            Lupa Nama Admin?
          </button>
        </div>
      </div>

      {/* Forgot Admin Dialog */}
      <Dialog open={showForgotDialog} onOpenChange={setShowForgotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lupa Nama Admin?</DialogTitle>
            <DialogDescription>
              Masukkan secret code untuk melihat informasi admin
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="secretCode" className="text-sm font-medium">Secret Code</label>
              <Input
                id="secretCode"
                type="password"
                placeholder="Masukkan secret code"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
              />
            </div>
            <Button onClick={handleForgotAdmin} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
              Tampilkan Info Admin
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {branch.id !== 'A321' && <Dialog open={showEmployeeRanking} onOpenChange={setShowEmployeeRanking}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="w-6 h-6 text-blue-600" />
              🌟 Ranking Karyawan {branch.displayName || branch.nik}
            </DialogTitle>
            <DialogDescription>
              Peringkat karyawan berdasarkan rata-rata score submission bulan {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loadingRanking ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4 text-sm">Loading ranking...</p>
              </div>
            ) : employeeRanking.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Belum ada data submission bulan ini</p>
                <p className="text-xs mt-2">Coba refresh untuk memuat ulang data</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('🔄 Reloading employee ranking...');
                    loadEmployeeRanking();
                  }}
                  className="mt-4"
                  size="sm"
                >
                  Refresh Ranking
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {employeeRanking.map((employee, index) => (
                  <div
                    key={employee.nik}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      index === 0
                        ? 'bg-yellow-50 border-yellow-400'
                        : index === 1
                        ? 'bg-gray-50 border-gray-300'
                        : index === 2
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className={`min-w-[2.5rem] text-center text-lg font-bold ${
                      index === 0 ? 'text-yellow-600' : index === 1 ? 'text-gray-600' : index === 2 ? 'text-orange-600' : 'text-gray-400'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {employee.nik} {employee.nama}
                      </div>
                      <div className="text-xs text-gray-500">
                        {employee.totalSubmissions} submission{employee.totalSubmissions > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className={`text-xl font-bold ${
                      employee.avgScore >= 100 ? 'text-green-600' : employee.avgScore >= 80 ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {employee.avgScore}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>}
    </div>
  );
}