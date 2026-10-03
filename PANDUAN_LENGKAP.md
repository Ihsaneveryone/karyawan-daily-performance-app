# 📚 PANDUAN LENGKAP APLIKASI CROWN DAILY INDICATORS

## 🎯 Tentang Aplikasi

**CROWN Daily Indicators** adalah aplikasi manajemen indikator kinerja harian untuk toko retail AZKO. Aplikasi ini memiliki 3 level akses:
- **Super Admin**: Mengelola semua cabang
- **Admin Cabang**: Mengelola indikator & riwayat cabangnya
- **Staff**: Mengisi indikator harian

---

## 🛠️ Teknologi yang Digunakan

### Frontend
1. **React 18.3.1** - Library UI JavaScript
2. **TypeScript** - JavaScript dengan type safety
3. **Tailwind CSS v4** - CSS framework untuk styling
4. **Vite** - Build tool & development server

### Backend
1. **Supabase Edge Functions** - Serverless functions
2. **Deno** - Runtime untuk edge functions
3. **Hono** - Web framework untuk API
4. **KV Store** - Database key-value

### Libraries Tambahan
1. **Lucide React** - Icon library
2. **Radix UI** - Headless UI components
3. **Sonner** - Toast notifications
4. **ExcelJS** - Export Excel dengan foto

---

## 📁 Struktur Folder

```
/workspaces/default/code/
├── src/
│   ├── app/
│   │   ├── components/          # Semua komponen React
│   │   │   ├── ui/             # Komponen UI dasar (Button, Card, dll)
│   │   │   ├── admin/          # Komponen khusus Admin
│   │   │   ├── superadmin/     # Komponen khusus Super Admin
│   │   │   ├── BranchSelector.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── StaffDashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── SuperAdminDashboard.tsx
│   │   │   └── LoadingScreen.tsx
│   │   ├── utils/              # Utility functions
│   │   │   └── api.ts          # API calls ke backend
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── App.tsx             # Root component
│   ├── imports/                # Assets (images, logos)
│   └── styles/                 # CSS files
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx       # API endpoints
│           └── kv_store.tsx    # Database operations
└── package.json                # Dependencies
```

---

## 🔄 Alur Aplikasi (User Flow)

### 1. Halaman Pertama: Branch Selector
```
┌─────────────────────────────────────┐
│   CROWN Logo dengan Mahkota         │
│   CROWN | DAILY INDICATORS STAFF    │
├─────────────────────────────────────┤
│  [Toko A336]  [Toko A339]  [+Baru]  │
│                                     │
│  [Login Sebagai Super Admin]        │
└─────────────────────────────────────┘
```

**Flow:**
1. User melihat daftar cabang
2. Pilih cabang → Loading Screen → Login Page
3. Atau klik "Login Sebagai Super Admin" → Input NIK & Code

---

### 2. Halaman Kedua: Login Page
```
┌─────────────────────────────────────┐
│      Crown + Logo AZKO              │
│   DAILY INDICATORS A336             │
├─────────────────────────────────────┤
│   NIK: [____________]               │
│   Nama: [____________] (password)   │
│   [Login]                           │
│   Lupa Nama Admin?                  │
└─────────────────────────────────────┘
```

**Flow:**
1. Input NIK & Nama
2. System cek: NIK = branch.nik? → Admin, else → Staff
3. Loading Screen → Dashboard

---

### 3. Halaman Ketiga: Dashboard

#### Staff Dashboard
```
┌─────────────────────────────────────┐
│  CROWN DAILY INDICATORS - NIK XXX   │
├─────────────────────────────────────┤
│  Total Score: 85% ✓ Siap Submit     │
├─────────────────────────────────────┤
│  □ Sales: [_______] Target: 7jt    │
│  □ Transaksi: [___] Target: 5      │
│  □ MGB: [___] + [📷][📷][📷]       │
│  [SUBMIT DATA]                      │
└─────────────────────────────────────┘
```

#### Admin Dashboard
```
┌─────────────────────────────────────┐
│  CROWN Admin Panel - Toko A336      │
├─────────────────────────────────────┤
│  [Kelola Indikator][Riwayat][⚙️]   │
├─────────────────────────────────────┤
│  • Edit indikator                   │
│  • Lihat riwayat semua staff        │
│  • Export Excel dengan foto         │
│  • Ubah setting (min score, dll)    │
└─────────────────────────────────────┘
```

#### Super Admin Dashboard
```
┌─────────────────────────────────────┐
│  👑 Super Admin Dashboard           │
├─────────────────────────────────────┤
│  [Kelola Cabang][Ranking][Template] │
│  [Pengaturan Aplikasi]              │
├─────────────────────────────────────┤
│  • Tambah/Edit/Hapus Cabang         │
│  • Lihat ranking semua cabang       │
│  • Edit template indikator default  │
│  • Edit judul aplikasi              │
└─────────────────────────────────────┘
```

---

## 📝 Penjelasan File-File Penting

### 1. `/src/app/types.ts` - Type Definitions

**Fungsi:** Mendefinisikan struktur data (TypeScript interfaces)

```typescript
// Interface untuk Cabang/Toko
export interface Branch {
  id: string;              // ID unik cabang (contoh: "A336")
  nik: string;             // NIK cabang untuk login admin
  name: string;            // Nama lengkap toko
  displayName?: string;    // Nama tampilan (optional)
  logo?: string;           // URL logo toko (optional)
  adminName: string;       // Nama admin cabang
  createdAt: string;       // Timestamp dibuat
  lastNameChange?: string; // Timestamp terakhir ganti nama admin
}

// Interface untuk Indikator
export interface Indicator {
  id: string;                  // ID indikator (contoh: "sales")
  name: string;                // Nama tampilan (contoh: "Sales")
  type: 'number' | 'photo' | 'number+photo' | 'text' | 'dropdown' | 'checkbox';
  targetValue?: number;        // Target angka (untuk type number)
  targetPhotos?: number;       // Target jumlah foto
  targetText?: string;         // Placeholder text
  dropdownOptions?: string[];  // Opsi dropdown
  weight: number;              // Bobot (total harus 100)
  icon?: string;               // Nama icon (dari Lucide)
  order: number;               // Urutan tampilan
  isSpecial?: boolean;         // Rumus khusus?
  specialFormula?: string;     // Formula khusus
}

// Interface untuk Data Submission
export interface IndicatorData {
  id: string;
  value?: number;                    // Nilai angka
  photos?: (File | string)[];        // File objects atau data URLs
  textValue?: string;                // Text input
  dropdownValue?: string;            // Dropdown selection
  checkboxValue?: boolean;           // Checkbox checked?
}

// Interface untuk Submission Lengkap
export interface Submission {
  id: string;
  branchId: string;
  user: {
    nik: string;
    nama: string;
  };
  data: IndicatorData[];
  totalScore: number;
  scoreDetails: {
    indicatorId: string;
    score: number;
    percentage: number;
  }[];
  date: string;
  displayDate: string;
}
```

**Kenapa penting?**
- TypeScript memberikan autocomplete & type checking
- Menghindari typo dan bug
- Dokumentasi built-in

---

### 2. `/src/app/utils/api.ts` - API Functions

**Fungsi:** Semua fungsi untuk komunikasi dengan backend (Supabase)

#### Struktur API Object
```typescript
export const api = {
  // ============= BRANCHES =============
  async getBranches(): Promise<Branch[]>
  async createBranch(branch: Branch): Promise<boolean>
  async updateBranch(branch: Branch): Promise<boolean>
  async deleteBranch(branchId: string): Promise<boolean>

  // ============= INDICATORS =============
  async getIndicators(branchId: string): Promise<Indicator[]>
  async updateIndicators(branchId: string, indicators: Indicator[]): Promise<boolean>

  // ============= SUBMISSIONS =============
  async getSubmissions(branchId: string): Promise<Submission[]>
  async addSubmission(branchId: string, submission: Submission): Promise<boolean>
  async deleteSubmissions(branchId: string, ids: string[]): Promise<boolean>

  // ============= SETTINGS =============
  async getSettings(branchId: string): Promise<BranchSettings>
  async updateSettings(branchId: string, settings: BranchSettings): Promise<boolean>

  // ============= ADMIN =============
  async getBranchAdmin(branchId: string): Promise<BranchAdmin | null>
  async updateBranchAdmin(branchId: string, admin: BranchAdmin): Promise<boolean>

  // ============= TEMPLATE =============
  async getDefaultTemplate(): Promise<Indicator[]>
  async updateDefaultTemplate(template: Indicator[]): Promise<boolean>

  // ============= APP SETTINGS =============
  async getAppSettings(): Promise<AppSettings>
  async updateAppSettings(settings: AppSettings): Promise<boolean>
}
```

#### Contoh Implementasi: getBranches()
```typescript
async getBranches(): Promise<Branch[]> {
  try {
    // 1. Fetch data dari API
    const response = await fetch(`${API_URL}/branches`, { headers });
    const result = await response.json();

    // 2. Cek apakah ada data
    if (result.success && result.data && result.data.length > 0) {
      return result.data;
    }

    // 3. Jika belum ada cabang, buat default
    const hasInitialized = localStorage.getItem('branches_initialized');
    if (!hasInitialized) {
      const defaultBranches: Branch[] = [
        {
          id: 'A336',
          nik: 'A336',
          name: 'Toko A336',
          adminName: 'MGR AZKO',
          createdAt: new Date().toISOString()
        },
        // ... cabang lainnya
      ];

      // 4. Create default branches
      for (const branch of defaultBranches) {
        await this.createBranch(branch);
      }

      localStorage.setItem('branches_initialized', 'true');
      return defaultBranches;
    }

    return [];
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
}
```

**Cara Kerja:**
1. Fetch data dari Supabase API
2. Parse JSON response
3. Return data atau empty array jika error
4. Error handling dengan try-catch

---

### 3. `/src/app/App.tsx` - Root Component

**Fungsi:** Komponen utama yang mengatur routing & state management

```typescript
export default function App() {
  // ========== STATE MANAGEMENT ==========
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [user, setUser] = useState<UserSession>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ========== LOAD SAVED SESSION ==========
  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setUser(session);
      if (session.branchId) {
        const savedBranch = localStorage.getItem(`branch_${session.branchId}`);
        if (savedBranch) {
          setSelectedBranch(JSON.parse(savedBranch));
        }
      }
    }
  }, []);

  // ========== EVENT HANDLERS ==========
  const handleBranchSelect = (branch: Branch) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedBranch(branch);
      localStorage.setItem(`branch_${branch.id}`, JSON.stringify(branch));
      setIsLoading(false);
    }, 1000);
  };

  const handleLogin = (userData: UserSession) => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(userData);
      localStorage.setItem('currentSession', JSON.stringify(userData));
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedBranch(null);
    localStorage.removeItem('currentSession');
  };

  // ========== CONDITIONAL RENDERING ==========
  // Loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Super Admin Dashboard
  if (user?.isSuperAdmin) {
    return <SuperAdminDashboard user={user} onLogout={handleLogout} />;
  }

  // Branch Admin Dashboard
  if (user?.isBranchAdmin && selectedBranch) {
    return <AdminDashboard user={user} branch={selectedBranch} onLogout={handleLogout} onBack={handleBackToBranches} />;
  }

  // Staff Dashboard
  if (user && selectedBranch) {
    return <StaffDashboard user={user} branch={selectedBranch} onLogout={handleLogout} onBack={handleBackToBranches} />;
  }

  // Login Page
  if (selectedBranch) {
    return <LoginPage branch={selectedBranch} onLogin={handleLogin} onBack={handleBackToBranches} />;
  }

  // Branch Selector (default)
  return <BranchSelector onBranchSelect={handleBranchSelect} onSuperAdminLogin={handleLogin} />;
}
```

**Cara Kerja Routing:**
```
┌─────────────────────────────────────┐
│  Cek Loading?                       │
│  YES → LoadingScreen               │
│  NO  → Lanjut                       │
├─────────────────────────────────────┤
│  Cek user.isSuperAdmin?             │
│  YES → SuperAdminDashboard          │
│  NO  → Lanjut                       │
├─────────────────────────────────────┤
│  Cek user.isBranchAdmin & branch?   │
│  YES → AdminDashboard               │
│  NO  → Lanjut                       │
├─────────────────────────────────────┤
│  Cek user & branch?                 │
│  YES → StaffDashboard               │
│  NO  → Lanjut                       │
├─────────────────────────────────────┤
│  Cek selectedBranch?                │
│  YES → LoginPage                    │
│  NO  → BranchSelector               │
└─────────────────────────────────────┘
```

---

### 4. `/src/app/components/BranchSelector.tsx` - Halaman Pertama

**Fungsi:** Menampilkan daftar cabang & tombol Super Admin

#### State Management
```typescript
const [branches, setBranches] = useState<Branch[]>([]);
const [loading, setLoading] = useState(true);
const [showSuperAdminDialog, setShowSuperAdminDialog] = useState(false);
const [superAdminNik, setSuperAdminNik] = useState('');
const [superAdminCode, setSuperAdminCode] = useState('');
const [appSettings, setAppSettings] = useState<AppSettings>({
  mainTitle: 'CROWN | DAILY INDICATORS STAFF',
  mainSubtitle: 'Your Home Life Improvement Partner',
  secondarySubtitle: 'Pilih Toko Anda'
});
```

#### Load Data
```typescript
useEffect(() => {
  loadBranches();
  loadAppSettings();
}, []);

const loadBranches = async () => {
  setLoading(true);
  const data = await api.getBranches();
  setBranches(data);
  setLoading(false);
};

const loadAppSettings = async () => {
  const settings = await api.getAppSettings();
  setAppSettings(settings);
};
```

#### Super Admin Login Logic
```typescript
const handleSuperAdminLogin = async () => {
  if (superAdminNik === 'SUPER001' && superAdminCode === 'IHSANAZKO') {
    onSuperAdminLogin({
      branchId: 'super',
      nik: 'SUPER001',
      nama: 'Super Admin',
      isBranchAdmin: false,
      isSuperAdmin: true
    });
    toast.success('Login Super Admin berhasil!');
  } else {
    toast.error('NIK atau Secret Code salah!');
  }
};
```

#### Render Branch Cards
```typescript
{branches.map((branch) => (
  <Card
    key={branch.id}
    className="hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-red-100 hover:border-red-400 group relative overflow-hidden"
    onClick={() => onBranchSelect(branch)}
  >
    {/* Crown badge animation */}
    <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity duration-300">
      <Crown className="w-5 h-5 text-yellow-500" />
    </div>

    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        {/* Icon dengan gradient & animation */}
        <div className="relative">
          <div className="p-3 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Crown className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Info toko */}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 mb-1 group-hover:text-red-600 transition-colors">
            {branch.displayName || `Toko ${branch.nik}`}
          </h3>
          <p className="text-sm text-gray-600">{branch.name}</p>
        </div>
      </div>
    </CardContent>

    {/* Bottom gradient line animation */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
  </Card>
))}
```

**Teknik CSS yang Digunakan:**
- `group` & `group-hover:` - Parent-child hover interaction
- `transition-all duration-300` - Smooth animation
- `bg-gradient-to-br` - Gradient background
- `animate-pulse` - Built-in animation
- `absolute` & `relative` - Positioning
- `scale-x-0` → `scale-x-100` - Scale animation

---

### 5. `/src/app/components/LoginPage.tsx` - Halaman Login

**Fungsi:** Form login untuk staff/admin cabang

#### Smart Password Mode
```typescript
<Input
  type={nik === branch.nik ? "password" : "text"}
  placeholder="Masukkan Nama"
  value={nama}
  onChange={(e) => setNama(e.target.value)}
  className="pl-4 h-12 text-lg border-2 focus:border-red-500 rounded-xl"
  required
/>
{nik === branch.nik && (
  <p className="text-xs text-gray-500 mt-1">
    Admin mode - Nama disembunyikan untuk keamanan
  </p>
)}
```

**Cara Kerja:**
- Jika NIK = branch.nik → type="password" (admin)
- Jika NIK ≠ branch.nik → type="text" (staff)
- Otomatis berubah saat user mengetik NIK

#### Login Logic
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!nik.trim() || !nama.trim()) {
    toast.error('NIK dan Nama harus diisi!');
    return;
  }

  // Check if this is branch admin
  const isBranchAdmin = nik === branch.nik && nama.toUpperCase() === branch.adminName.toUpperCase();

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

  onLogin({
    branchId: branch.id,
    nik: nik.trim(),
    nama: nama.trim(),
    isBranchAdmin,
    isSuperAdmin: false
  });

  toast.success(`Selamat datang, ${nama}!`);
};
```

---

### 6. `/src/app/components/StaffDashboard.tsx` - Dashboard Staff

**Fungsi:** Form input indikator harian untuk staff

#### Calculate Score (Logika Perhitungan)
```typescript
const calculateScore = () => {
  let totalScore = 0;
  const scoreDetails: any[] = [];

  indicators.forEach(indicator => {
    const inputData = data[indicator.id];
    let score = 0;
    let percentage = 0;

    // ========== TIPE NUMBER ==========
    if (indicator.type === 'number' || indicator.type === 'number+photo') {
      const value = inputData?.value || 0;

      if (indicator.isSpecial) {
        // Formula khusus
        if (indicator.id === 'noBaru') {
          // No Baru = 50% dari Transaksi
          const transaksiValue = data['transaksi']?.value || 0;
          const targetNoBaru = Math.ceil(transaksiValue * 0.5);
          percentage = targetNoBaru > 0 ? Math.min((value / targetNoBaru) * 100, 100) : 0;
        } else if (indicator.id === 'proteksi') {
          // Proteksi: 1 proteksi = 10%
          score = Math.min(value * 10, indicator.weight);
          percentage = (score / indicator.weight) * 100;
        }
      } else if (indicator.targetValue) {
        // Formula normal: (value / target) * 100
        percentage = Math.min((value / indicator.targetValue) * 100, 100);
      }

      if (!indicator.isSpecial || indicator.id === 'noBaru') {
        score = (percentage / 100) * indicator.weight;
      }
    }

    // ========== TIPE PHOTO ==========
    else if (indicator.type === 'photo') {
      const photoCount = inputData?.photos?.length || 0;
      const target = indicator.targetPhotos || 1;
      percentage = Math.min((photoCount / target) * 100, 100);
      score = (percentage / 100) * indicator.weight;
    }

    // ========== TIPE TEXT ==========
    else if (indicator.type === 'text') {
      const textValue = inputData?.textValue || '';
      if (textValue.trim().length > 0) {
        score = indicator.weight;
        percentage = 100;
      }
    }

    // ========== TIPE DROPDOWN ==========
    else if (indicator.type === 'dropdown') {
      const dropdownValue = inputData?.dropdownValue || '';
      if (dropdownValue) {
        score = indicator.weight;
        percentage = 100;
      }
    }

    // ========== TIPE CHECKBOX ==========
    else if (indicator.type === 'checkbox') {
      const checkboxValue = inputData?.checkboxValue || false;
      if (checkboxValue) {
        score = indicator.weight;
        percentage = 100;
      }
    }

    totalScore += score;
    scoreDetails.push({
      indicatorId: indicator.id,
      score: Math.round(score * 10) / 10,
      percentage: Math.round(percentage)
    });
  });

  return {
    total: Math.round(totalScore),
    details: scoreDetails
  };
};
```

**Rumus Perhitungan:**
1. **Number**: `score = (value / target) * 100 * weight / 100`
2. **Photo**: `score = (photoCount / targetPhotos) * 100 * weight / 100`
3. **Text/Dropdown/Checkbox**: Jika terisi = 100%, kosong = 0%
4. **Special Formula**:
   - No Baru: Target = 50% dari Transaksi
   - Proteksi: 1 proteksi = 10%

#### Submit Data
```typescript
const handleSubmit = async () => {
  if (!canSubmit) {
    toast.error('Score minimal 80% untuk submit!');
    return;
  }

  // Convert File objects to data URLs for storage
  const submissionData = await Promise.all(
    Object.values(data).map(async (indicatorData) => {
      if (indicatorData.photos && indicatorData.photos.length > 0) {
        // Convert File objects to data URL strings
        const photoDataUrls = await Promise.all(
          indicatorData.photos.map((photoItem) => {
            // If already a string, return as is
            if (typeof photoItem === 'string') {
              return Promise.resolve(photoItem);
            }

            // If File/Blob, convert to data URL
            if (photoItem instanceof File || photoItem instanceof Blob) {
              return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  resolve(e.target?.result as string);
                };
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(photoItem);
              });
            }

            return Promise.resolve('');
          })
        );

        return {
          ...indicatorData,
          photos: photoDataUrls.filter(url => url.length > 0)
        };
      }
      return indicatorData;
    })
  );

  const submission: Submission = {
    id: `${branch.id}_${user.nik}_${Date.now()}`,
    branchId: branch.id,
    user: {
      nik: user.nik,
      nama: user.nama
    },
    data: submissionData as any,
    totalScore: totalScore,
    scoreDetails: scoreResult.details,
    date: new Date().toISOString(),
    displayDate: new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  };

  const success = await api.addSubmission(branch.id, submission);

  if (success) {
    toast.success(getMotivationMessage());
    // Reset form
    loadData();
  } else {
    toast.error('Gagal menyimpan data!');
  }
};
```

**Cara Kerja Submit:**
1. Convert File objects → Data URL strings (untuk bisa disimpan di JSON)
2. Buat object Submission
3. Kirim ke backend via API
4. Reset form jika sukses

---

### 7. `/src/app/components/admin/AdminHistory.tsx` - Export Excel

**Fungsi:** Export riwayat submission ke Excel dengan foto embedded

#### Smart Export (Auto-detect foto)
```typescript
const handleSmartExport = async () => {
  // Check if any submission has photos
  let hasPhotos = false;
  let totalPhotos = 0;

  for (const submission of filteredSubmissions) {
    for (const data of submission.data) {
      if (data.photos && data.photos.length > 0) {
        hasPhotos = true;
        totalPhotos += data.photos.length;
      }
    }
  }

  // If has photos, export Excel with embedded photos
  if (hasPhotos) {
    toast.info(`Terdeteksi ${totalPhotos} foto. Export Excel dengan foto embedded...`);
    await handleExportExcel();
  } else {
    // Otherwise export CSV (faster)
    toast.info('Tidak ada foto. Export CSV (lebih cepat)...');
    handleExportCSV();
  }
};
```

#### Export Excel dengan Foto
```typescript
const handleExportExcel = async () => {
  setIsExporting(true);
  toast.loading('Sedang membuat file Excel dengan foto...');

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Riwayat Submission');

    // ========== CREATE HEADERS ==========
    const headers = ['No', 'Tanggal', 'Waktu', 'NIK', 'Nama', 'Total Score'];

    // Map untuk track column structure
    const headerMap: { indicator: any; photoIndex?: number }[] = [];
    
    indicators.forEach(ind => {
      if (ind.type === 'photo' || ind.type === 'number+photo') {
        // Add value column for number+photo
        if (ind.type === 'number+photo') {
          headers.push(`${ind.name} (Nilai)`);
          headerMap.push({ indicator: ind, photoIndex: undefined });
        }
        // Add separate columns for each photo
        const maxPhotos = ind.targetPhotos || 3;
        for (let i = 0; i < maxPhotos; i++) {
          headers.push(`${ind.name} Foto ${i + 1}`);
          headerMap.push({ indicator: ind, photoIndex: i });
        }
      } else {
        headers.push(ind.name);
        headerMap.push({ indicator: ind, photoIndex: undefined });
      }
    });

    worksheet.addRow(headers);

    // ========== STYLE HEADER ==========
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD32F2F' } // Red AZKO
    };
    headerRow.height = 25;
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // ========== ADD DATA ROWS ==========
    let rowIndex = 2;
    for (const submission of filteredSubmissions) {
      const date = new Date(submission.date);
      const rowData = [
        rowIndex - 1,
        date.toLocaleDateString('id-ID'),
        date.toLocaleTimeString('id-ID'),
        submission.user.nik,
        submission.user.nama,
        `${submission.totalScore}%`
      ];

      // Add indicator data based on headerMap
      for (const headerInfo of headerMap) {
        const indicator = headerInfo.indicator;
        const indicatorData = submission.data.find(d => d.id === indicator.id);

        if (!indicatorData) {
          rowData.push('-');
          continue;
        }

        // Handle photo columns vs value columns
        if (headerInfo.photoIndex !== undefined) {
          rowData.push(''); // Foto akan diisi nanti
        } else {
          if (indicator.type === 'number' || indicator.type === 'number+photo') {
            rowData.push(indicatorData.value?.toString() || '-');
          } else if (indicator.type === 'text') {
            rowData.push(indicatorData.textValue || '-');
          } else if (indicator.type === 'dropdown') {
            rowData.push(indicatorData.dropdownValue || '-');
          } else if (indicator.type === 'checkbox') {
            rowData.push(indicatorData.checkboxValue ? '✓' : '✗');
          } else {
            rowData.push('-');
          }
        }
      }

      const row = worksheet.addRow(rowData);
      row.height = 80;

      // ========== EMBED PHOTOS ==========
      let colIndex = 7;
      for (const headerInfo of headerMap) {
        const indicator = headerInfo.indicator;
        const photoIdx = headerInfo.photoIndex;

        if (photoIdx !== undefined) {
          const indicatorData = submission.data.find(d => d.id === indicator.id);

          if (indicatorData?.photos && indicatorData.photos[photoIdx]) {
            try {
              const photoData = indicatorData.photos[photoIdx];
              let base64Data: string | null = null;

              // Convert to base64
              if (photoData instanceof File || photoData instanceof Blob) {
                const reader = new FileReader();
                base64Data = await new Promise<string>((resolve, reject) => {
                  reader.onload = (e) => {
                    resolve((e.target?.result as string).split(',')[1] || '');
                  };
                  reader.onerror = () => reject(new Error('Failed to read file'));
                  reader.readAsDataURL(photoData);
                });
              } else if (typeof photoData === 'string') {
                if (photoData.startsWith('data:')) {
                  base64Data = photoData.split(',')[1] || '';
                } else if (photoData.length > 50) {
                  base64Data = photoData;
                }
              }

              // Add image to Excel
              if (base64Data && base64Data.length > 50) {
                const imageId = workbook.addImage({
                  base64: base64Data,
                  extension: 'jpeg',
                });

                worksheet.addImage(imageId, {
                  tl: {
                    col: colIndex - 1,
                    row: rowIndex - 1,
                    colOff: 5,
                    rowOff: 5
                  },
                  ext: { width: 70, height: 70 }
                });
              }
            } catch (err) {
              console.error(`Error adding photo ${photoIdx}:`, err);
            }
          }
        }

        colIndex++;
      }

      rowIndex++;
    }

    // ========== SET COLUMN WIDTHS ==========
    worksheet.columns.forEach((column, idx) => {
      if (idx === 0) {
        column.width = 5;
      } else if (idx <= 5) {
        column.width = 15;
      } else {
        const headerIdx = idx - 6;
        if (headerIdx < headerMap.length) {
          const headerInfo = headerMap[headerIdx];
          if (headerInfo.photoIndex !== undefined) {
            column.width = 12; // Photo column
          } else {
            column.width = 15; // Value column
          }
        }
      }
    });

    // ========== GENERATE & DOWNLOAD ==========
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `riwayat_${branch.nik}_${new Date().toISOString().split('T')[0]}.xlsx`;
    link.click();

    toast.dismiss();
    toast.success('File Excel dengan foto berhasil diexport!');
  } catch (error) {
    console.error('Export error:', error);
    toast.dismiss();
    toast.error('Gagal export Excel. Coba lagi!');
  } finally {
    setIsExporting(false);
  }
};
```

**Cara Kerja:**
1. Create workbook & worksheet
2. Build header dengan kolom terpisah untuk setiap foto
3. Loop setiap submission
4. Add data ke row
5. Convert foto (File/Blob/String) → base64
6. Embed foto ke cell dengan koordinat (col, row)
7. Set column width
8. Generate Excel file → download

---

### 8. `/supabase/functions/server/index.tsx` - Backend API

**Fungsi:** API endpoints menggunakan Hono framework

#### Setup Hono App
```typescript
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);
```

#### Example Endpoint: GET Branches
```typescript
app.get("/make-server-011c131f/branches", async (c) => {
  try {
    const branches = await kv.get("branches") || [];
    return c.json({ success: true, data: branches });
  } catch (error) {
    console.log("Error getting branches:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});
```

#### Example Endpoint: CREATE Branch
```typescript
app.post("/make-server-011c131f/branches", async (c) => {
  try {
    const body = await c.req.json();
    const branches = await kv.get("branches") || [];
    branches.push(body);
    await kv.set("branches", branches);

    // Get template indicators
    let defaultIndicators = await kv.get("template_indicators");
    if (!defaultIndicators || defaultIndicators.length === 0) {
      defaultIndicators = [
        { id: "sales", name: "Sales", type: "number", targetValue: 7000000, weight: 50, order: 1 },
        // ... more indicators
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
    return c.json({ success: false, error: error.message }, 500);
  }
});
```

#### Example Endpoint: DELETE Branch
```typescript
app.delete("/make-server-011c131f/branches/:branchId", async (c) => {
  try {
    const branchId = c.req.param('branchId');
    console.log("Deleting branch:", branchId);

    // Delete from branches list
    const branches = await kv.get("branches") || [];
    const filtered = branches.filter((b: any) => b.id !== branchId);
    await kv.set("branches", filtered);

    // Delete all branch data
    await kv.del(`branch_${branchId}_indicators`);
    await kv.del(`branch_${branchId}_submissions`);
    await kv.del(`branch_${branchId}_settings`);
    await kv.del(`branch_${branchId}_admin`);

    console.log("Branch deleted successfully:", branchId);
    return c.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Error deleting branch:", errorMessage);
    return c.json({ success: false, error: errorMessage }, 500);
  }
});
```

**Struktur Data di KV Store:**
```
Key                           Value
------------------------------|---------------------------------
branches                      | Array<Branch>
branch_A336_indicators        | Array<Indicator>
branch_A336_submissions       | Array<Submission>
branch_A336_settings          | BranchSettings
branch_A336_admin             | BranchAdmin
template_indicators           | Array<Indicator> (default template)
app_settings                  | AppSettings
```

---

## 🎨 Tailwind CSS - Styling Guide

### Utility Classes Penting

#### Layout
```css
/* Flexbox */
flex                    /* display: flex */
flex-col                /* flex-direction: column */
items-center            /* align-items: center */
justify-between         /* justify-content: space-between */
gap-4                   /* gap: 1rem */

/* Grid */
grid                    /* display: grid */
grid-cols-3             /* grid-template-columns: repeat(3, 1fr) */

/* Positioning */
relative                /* position: relative */
absolute                /* position: absolute */
top-4                   /* top: 1rem */
-mt-6                   /* margin-top: -1.5rem */
```

#### Colors
```css
/* Background */
bg-red-600              /* background-color: #dc2626 */
bg-gradient-to-r        /* linear-gradient(to right, ...) */
from-red-600            /* gradient start color */
to-orange-600           /* gradient end color */

/* Text */
text-gray-600           /* color: #4b5563 */
text-white              /* color: #ffffff */

/* Border */
border-red-100          /* border-color: #fee2e2 */
border-2                /* border-width: 2px */
```

#### Sizing
```css
w-32                    /* width: 8rem (128px) */
h-32                    /* height: 8rem (128px) */
p-4                     /* padding: 1rem */
px-6                    /* padding-left & padding-right: 1.5rem */
mb-4                    /* margin-bottom: 1rem */
```

#### Effects
```css
shadow-xl               /* box-shadow: ... */
rounded-xl              /* border-radius: 0.75rem */
blur-3xl                /* filter: blur(64px) */
opacity-50              /* opacity: 0.5 */
```

#### Animations
```css
animate-pulse           /* Built-in pulse animation */
animate-bounce          /* Built-in bounce animation */
animate-spin            /* Built-in spin animation */
transition-all          /* transition: all */
duration-300            /* transition-duration: 300ms */
hover:scale-110         /* transform: scale(1.1) on hover */
group-hover:opacity-100 /* opacity 100 when parent (.group) hovered */
```

### Custom Animations
```typescript
<style>{`
  @keyframes loading-bar {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(400%);
    }
  }

  .animate-loading-bar {
    animation: loading-bar 1.5s ease-in-out infinite;
  }
`}</style>
```

---

## 🚀 Deployment Guide

### Prerequisites
1. **Supabase Account** - Create di supabase.com
2. **Supabase CLI** - Install: `npm install -g supabase`

### Step 1: Setup Supabase Project
```bash
# Login ke Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy edge functions
supabase functions deploy server
```

### Step 2: Get Credentials
Di Supabase Dashboard:
1. Settings → API
2. Copy **Project URL** dan **anon public key**
3. Paste ke `/utils/supabase/info.ts`

```typescript
export const projectId = 'your-project-id';
export const publicAnonKey = 'your-anon-key';
```

### Step 3: Deploy Frontend
```bash
# Build production
npm run build

# Deploy ke hosting (Vercel/Netlify/dll)
# Atau gunakan Figma Make publish
```

---

## 🔐 Security Best Practices

### 1. Input Validation
```typescript
// Selalu validate input
if (!nik.trim() || !nama.trim()) {
  toast.error('NIK dan Nama harus diisi!');
  return;
}
```

### 2. Password Hiding
```typescript
// Hide admin name input
<Input
  type={nik === branch.nik ? "password" : "text"}
  value={nama}
/>
```

### 3. Error Handling
```typescript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error('Request failed');
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Error:', error);
  return null;
}
```

### 4. Authentication Check
```typescript
// Check admin credentials
const isBranchAdmin = 
  nik === branch.nik && 
  nama.toUpperCase() === branch.adminName.toUpperCase();
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTION                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  REACT COMPONENTS                       │
│  (BranchSelector, LoginPage, Dashboard, etc)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   API LAYER (api.ts)                    │
│  - getBranches()                                        │
│  - getIndicators()                                      │
│  - addSubmission()                                      │
│  - etc.                                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼ HTTP Request (fetch)
┌─────────────────────────────────────────────────────────┐
│           SUPABASE EDGE FUNCTIONS (Hono API)            │
│  - GET  /branches                                       │
│  - POST /branches                                       │
│  - GET  /branches/:id/indicators                        │
│  - POST /branches/:id/submissions                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  KV STORE (Database)                    │
│  - branches: []                                         │
│  - branch_A336_indicators: []                           │
│  - branch_A336_submissions: []                          │
│  - template_indicators: []                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Learning Path

### Beginner
1. **HTML & CSS Basics** - Struktur & styling
2. **JavaScript ES6+** - Arrow functions, async/await, destructuring
3. **React Basics** - Components, Props, State, useEffect

### Intermediate
1. **TypeScript** - Type safety & interfaces
2. **React Hooks** - useState, useEffect, custom hooks
3. **Tailwind CSS** - Utility-first CSS
4. **API Integration** - fetch, async/await, error handling

### Advanced
1. **State Management** - Complex state logic
2. **Performance** - Optimization, memoization
3. **Backend Development** - Hono, Deno, API design
4. **Excel Generation** - ExcelJS, File handling, base64

---

## 📚 Resources

### Documentation
- React: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Supabase: https://supabase.com/docs
- Hono: https://hono.dev
- ExcelJS: https://github.com/exceljs/exceljs

### Tutorials
- React Tutorial: https://react.dev/learn
- TypeScript Handbook: https://www.typescriptlang.org/docs/handbook
- Tailwind CSS Tutorial: https://tailwindcss.com/docs
- JavaScript Info: https://javascript.info

---

## 💡 Tips & Tricks

### 1. Debugging
```typescript
// Console log untuk debugging
console.log('Data:', data);
console.log('User:', user);

// Chrome DevTools
// F12 → Console, Network, Elements
```

### 2. Performance
```typescript
// Memoization untuk expensive calculations
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Debounce untuk search
const debouncedSearch = debounce((query) => {
  performSearch(query);
}, 300);
```

### 3. Error Boundaries
```typescript
// Wrap components dengan error boundary
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### 4. Code Organization
```
- Satu component per file
- Nama file = Nama component
- Group related components dalam folder
- Shared components di /ui
- Utils di /utils
```

---

## 🎯 Next Steps untuk Belajar

1. **Clone & Explore** - Download code, baca pelan-pelan
2. **Modify Small Things** - Ubah warna, text, layout
3. **Add Simple Feature** - Tambah field baru, button, dll
4. **Debug Issues** - Sengaja break code, lalu fix
5. **Build Similar App** - Buat versi sederhana sendiri
6. **Read Documentation** - Pahami library yang dipakai
7. **Join Community** - React Discord, Stack Overflow

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
1. Baca dokumentasi ini dulu
2. Check error di Console (F12)
3. Google error message
4. Tanya di Stack Overflow
5. Chat dengan developer

---

**Created by:** Muhammad Ihsan  
**Batch:** Management Trainee Batch 16  
**Date:** 2026  
**Version:** 3.0 - CROWN Edition 👑

---

**Happy Learning! 🚀**
