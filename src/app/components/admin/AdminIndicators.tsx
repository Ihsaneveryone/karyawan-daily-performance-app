import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Plus, Edit, Trash2, GripVertical, Save } from 'lucide-react';
import { Branch, Indicator } from '../../types';
import { api } from '../../utils/api';
import { toast } from 'sonner';
import { useIndicators } from '../../hooks/useIndicators';
import { IndicatorSkeleton } from '../ui/indicator-skeleton';

interface AdminIndicatorsProps {
  branch: Branch;
}

export default function AdminIndicators({ branch }: AdminIndicatorsProps) {
  // REACT QUERY: Data loading dengan cache otomatis
  const { 
    indicators: configuredIndicators, 
    isLoading, 
    isFetching,
    updateIndicators, 
    isUpdating 
  } = useIndicators(branch.id);
  const isA321 = branch.id === 'A321';
  const [showDialog, setShowDialog] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);
  const indicators = isA321
    ? configuredIndicators
      .filter((indicator) => {
        const id = indicator.id.toLowerCase().replace(/[^a-z0-9]/g, '');
        const name = indicator.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return id !== 'aftersales' && id !== 'aftersalesservice' && name !== 'aftersales' && name !== 'aftersalesservice';
      })
      .map((indicator) => {
        const isMgb = indicator.id.toLowerCase() === 'mgb' || indicator.name.toLowerCase() === 'mgb';
        return { ...indicator, weight: 0, ...(isMgb ? { type: 'photo' as const } : {}) };
      })
    : configuredIndicators;
  const isEditingMgb = isA321 && editingIndicator !== null
    && (editingIndicator.id.toLowerCase() === 'mgb' || editingIndicator.name.toLowerCase() === 'mgb');

  const [formData, setFormData] = useState({
    name: '',
    type: 'number' as 'number' | 'photo' | 'number+photo' | 'text' | 'dropdown' | 'checkbox',
    targetValue: 0,
    targetPhotos: 0,
    targetText: '',
    dropdownOptions: [] as string[],
    weight: 0,
    icon: 'Target',
    isSpecial: false,
    specialFormula: '',
    placeholder: ''
  });

  const [newDropdownOption, setNewDropdownOption] = useState('');

  const handleSave = async () => {
    if (!formData.name || (!isA321 && formData.weight <= 0)) {
      toast.error(isA321 ? 'Nama indikator harus diisi!' : 'Nama dan bobot harus diisi!');
      return;
    }

    const totalWeight = isA321 ? 0 : indicators
      .filter(i => i.id !== editingIndicator?.id)
      .reduce((sum, i) => sum + i.weight, 0) + formData.weight;

    if (totalWeight > 100) {
      toast.error(`Total bobot melebihi 100%! (Sekarang: ${totalWeight}%)`);
      return;
    }

    let updatedIndicators: Indicator[];

    if (editingIndicator) {
      // Edit existing
      updatedIndicators = indicators.map(ind =>
        ind.id === editingIndicator.id
          ? {
              ...ind,
              name: formData.name,
              type: isA321 && (ind.id.toLowerCase() === 'mgb' || ind.name.toLowerCase() === 'mgb') ? 'photo' : formData.type,
              targetValue: formData.targetValue || undefined,
              targetPhotos: formData.targetPhotos || undefined,
              targetText: formData.targetText || undefined,
              dropdownOptions: formData.dropdownOptions.length > 0 ? formData.dropdownOptions : undefined,
              weight: isA321 ? 0 : formData.weight,
              icon: formData.icon,
              isSpecial: formData.isSpecial,
              specialFormula: formData.specialFormula || undefined,
              placeholder: formData.placeholder || undefined
            }
          : ind
      );
    } else {
      // Add new
      const newIndicator: Indicator = {
        id: `ind_${Date.now()}`,
        name: formData.name,
        type: isA321 && formData.name.trim().toLowerCase() === 'mgb' ? 'photo' : formData.type,
        targetValue: formData.targetValue || undefined,
        targetPhotos: formData.targetPhotos || undefined,
        targetText: formData.targetText || undefined,
        dropdownOptions: formData.dropdownOptions.length > 0 ? formData.dropdownOptions : undefined,
        weight: isA321 ? 0 : formData.weight,
        icon: formData.icon,
        order: indicators.length + 1,
        isSpecial: formData.isSpecial,
        specialFormula: formData.specialFormula || undefined,
        placeholder: formData.placeholder || undefined
      };
      updatedIndicators = [...indicators, newIndicator];
    }

    // React Query mutation akan auto handle toast success/error
    updateIndicators(updatedIndicators);
    setShowDialog(false);
    setEditingIndicator(null);
    resetForm();
  };

  const handleEdit = (indicator: Indicator) => {
    setEditingIndicator(indicator);
    setFormData({
      name: indicator.name,
      type: isA321 && (indicator.id.toLowerCase() === 'mgb' || indicator.name.toLowerCase() === 'mgb') ? 'photo' : indicator.type,
      targetValue: indicator.targetValue || 0,
      targetPhotos: indicator.targetPhotos || 0,
      targetText: indicator.targetText || '',
      dropdownOptions: indicator.dropdownOptions || [],
      weight: indicator.weight,
      icon: indicator.icon || 'Target',
      isSpecial: indicator.isSpecial || false,
      specialFormula: indicator.specialFormula || '',
      placeholder: indicator.placeholder || ''
    });
    setShowDialog(true);
  };

  const handleDelete = async (indicatorId: string) => {
    if (!confirm('Yakin ingin menghapus indikator ini?')) return;

    const updatedIndicators = indicators
      .filter(i => i.id !== indicatorId)
      .map((ind, idx) => ({ ...ind, order: idx + 1 }));

    updateIndicators(updatedIndicators);
  };

  const moveIndicator = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= indicators.length) return;

    const updatedIndicators = [...indicators];
    [updatedIndicators[index], updatedIndicators[newIndex]] = [updatedIndicators[newIndex], updatedIndicators[index]];

    // Update order
    const reordered = updatedIndicators.map((ind, idx) => ({ ...ind, order: idx + 1 }));

    updateIndicators(reordered);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'number',
      targetValue: 0,
      targetPhotos: 0,
      targetText: '',
      dropdownOptions: [],
      weight: 0,
      icon: 'Target',
      isSpecial: false,
      specialFormula: '',
      placeholder: ''
    });
    setNewDropdownOption('');
  };

  const addDropdownOption = () => {
    if (newDropdownOption.trim()) {
      setFormData({
        ...formData,
        dropdownOptions: [...formData.dropdownOptions, newDropdownOption.trim()]
      });
      setNewDropdownOption('');
    }
  };

  const removeDropdownOption = (index: number) => {
    setFormData({
      ...formData,
      dropdownOptions: formData.dropdownOptions.filter((_, i) => i !== index)
    });
  };

  const totalWeight = indicators.reduce((sum, i) => sum + i.weight, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Kelola Indikator</CardTitle>
              <CardDescription>
                {isA321 ? 'Tambah, edit, atau hapus indikator.' : `Tambah, edit, atau hapus indikator penilaian. Total bobot: ${totalWeight}%`}
              </CardDescription>
            </div>
            <Button
              onClick={() => {
                setEditingIndicator(null);
                resetForm();
                setShowDialog(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Indikator
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading || isFetching ? (
            <IndicatorSkeleton />
          ) : indicators.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Belum ada indikator</p>
          ) : (
            <div className="space-y-3">
              {indicators.map((indicator, idx) => (
                <Card key={indicator.id} className="border-2">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveIndicator(idx, 'up')}
                          disabled={idx === 0}
                        >
                          <GripVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold">{indicator.name}</h4>
                        <p className="text-sm text-gray-600">
                          Tipe: {indicator.type} |
                          {indicator.targetValue && ` Target: ${indicator.targetValue} |`}
                          {indicator.targetPhotos && ` Foto: ${indicator.targetPhotos} |`}
                          {indicator.isSpecial && ` Formula: ${indicator.specialFormula} |`}
                          {!isA321 && <>Bobot: {indicator.weight}%</>}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(indicator)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(indicator.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingIndicator ? 'Edit Indikator' : 'Tambah Indikator Baru'}
            </DialogTitle>
            <DialogDescription>
              Isi form di bawah untuk menambah atau mengubah indikator
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Indikator</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Sales"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipe Indikator</label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  disabled={isEditingMgb}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">Angka</SelectItem>
                    <SelectItem value="photo">Foto</SelectItem>
                    <SelectItem value="number+photo">Angka + Foto</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="dropdown">Dropdown</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom placeholder/instruction text */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Teks Petunjuk/Placeholder (Opsional)</label>
              <Input
                value={formData.placeholder}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                placeholder="Contoh: Masukkan nilai WA customer"
              />
              <p className="text-xs text-gray-500">Teks panduan yang akan muncul di form input staff</p>
            </div>

            {(formData.type === 'number' || formData.type === 'number+photo') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Nilai (0 jika tidak ada target)</label>
                <Input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) || 0 })}
                />
              </div>
            )}

            {(formData.type === 'photo' || formData.type === 'number+photo') && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Jumlah Foto yang Dibutuhkan</label>
                <Input
                  type="number"
                  value={formData.targetPhotos}
                  onChange={(e) => setFormData({ ...formData, targetPhotos: parseInt(e.target.value) || 0 })}
                />
              </div>
            )}

            {formData.type === 'text' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Placeholder Text (opsional)</label>
                <Input
                  value={formData.targetText}
                  onChange={(e) => setFormData({ ...formData, targetText: e.target.value })}
                  placeholder="Contoh: Masukkan keterangan"
                />
              </div>
            )}

            {formData.type === 'dropdown' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Pilihan Dropdown</label>
                <div className="flex gap-2">
                  <Input
                    value={newDropdownOption}
                    onChange={(e) => setNewDropdownOption(e.target.value)}
                    placeholder="Tambah pilihan..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDropdownOption())}
                  />
                  <Button type="button" onClick={addDropdownOption}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.dropdownOptions.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {formData.dropdownOptions.map((option, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{option}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDropdownOption(idx)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {!isA321 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bobot (%)</label>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-xs text-gray-500">Total saat ini: {totalWeight}%</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Icon</label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TrendingUp">TrendingUp</SelectItem>
                    <SelectItem value="ShoppingCart">ShoppingCart</SelectItem>
                    <SelectItem value="DollarSign">DollarSign</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="UserPlus">UserPlus</SelectItem>
                    <SelectItem value="Shield">Shield</SelectItem>
                    <SelectItem value="ThumbsUp">ThumbsUp</SelectItem>
                    <SelectItem value="Target">Target</SelectItem>
                    <SelectItem value="Camera">Camera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isSpecial"
                checked={formData.isSpecial}
                onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isSpecial" className="text-sm font-medium">Indikator dengan Formula Khusus</label>
            </div>

            {formData.isSpecial && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Formula Khusus</label>
                <Input
                  value={formData.specialFormula}
                  onChange={(e) => setFormData({ ...formData, specialFormula: e.target.value })}
                  placeholder="Contoh: 50% dari Transaksi"
                />
              </div>
            )}

            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Simpan Indikator
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}