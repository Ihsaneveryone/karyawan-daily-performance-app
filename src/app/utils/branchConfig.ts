import { Branch } from '../types';

export const BRANCH_SPREADSHEET_IDS: Record<string, string> = {
  A321: '1xTtYV1ZnDllfMEXt7DsrOcUwVGkdtWOO_zyVGQi1qiQ',
};

export const A321_BRANCH: Branch = {
  id: 'A321',
  nik: 'A321',
  name: 'Toko A321',
  adminName: 'Manager A321',
  createdAt: new Date().toISOString(),
};

export function includeConfiguredBranches(branches: Branch[]): Branch[] {
  return branches.some(branch => branch.id === A321_BRANCH.id)
    ? branches
    : [...branches, A321_BRANCH];
}