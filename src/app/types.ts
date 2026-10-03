export interface Branch {
  id: string;
  nik: string;
  name: string;
  displayName?: string; // Nama display untuk halaman login
  logo?: string; // URL logo toko
  adminName: string;
  createdAt: string;
  lastNameChange?: string;
}

export interface Indicator {
  id: string;
  name: string;
  type: 'number' | 'photo' | 'number+photo' | 'text' | 'dropdown' | 'checkbox';
  targetValue?: number;
  targetPhotos?: number;
  targetText?: string; // untuk type text
  dropdownOptions?: string[]; // untuk type dropdown
  weight: number;
  icon?: string;
  order: number;
  isSpecial?: boolean; // untuk indikator dengan rumus khusus seperti "No Baru = 50% dari Transaksi"
  specialFormula?: string;
  placeholder?: string; // custom placeholder/instruction text for input fields
}

export interface IndicatorData {
  id: string;
  value?: number;
  photos?: (File | string)[]; // Can be File objects (before submit) or data URL strings (after submit/from backend)
  textValue?: string; // untuk type text
  dropdownValue?: string; // untuk type dropdown
  checkboxValue?: boolean; // untuk type checkbox
}

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
  date: string; // Tanggal submit (YYYY-MM-DD format)
  createdAt?: string; // Timestamp lengkap (ISO format) - untuk waktu submit yang tepat
  displayDate: string;
  status?: 'pending' | 'failed'; // For optimistic updates
  notes?: {
    reason: string;
    approval: string;
    adminNik: string;
    adminNama: string;
  };
}

export interface BranchSettings {
  loginTitle: string;
  loginSubtitle: string;
  minSubmitScore: number;
  motivationMessages: {
    range: string;
    message: string;
  }[];
}

export interface SuperAdmin {
  nik: string;
  secretCode: string;
}

export interface BranchAdmin {
  nik: string;
  name: string;
  lastNameChange?: string;
}

export interface AppSettings {
  mainTitle: string;
  mainSubtitle: string;
  secondarySubtitle: string;
}