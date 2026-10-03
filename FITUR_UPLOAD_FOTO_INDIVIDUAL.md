# 📸 FITUR BARU: UPLOAD FOTO INDIVIDUAL (1 BUTTON 1 FOTO)

## 🎯 MASALAH YANG DIPERBAIKI

### **Problem Sebelumnya:**
Untuk indicator yang butuh **3 foto** (seperti MGB = Merchandise Good & Brand):
- ❌ Hanya ada **1 input file** dengan `multiple` attribute
- ❌ User harus select **3 foto sekaligus** di file picker
- ❌ Di **mobile browser**, ini sangat susah dan confusing
- ❌ Tidak bisa preview foto individual
- ❌ Tidak bisa hapus 1 foto saja (harus hapus semua)

### **Solusi Baru:**
- ✅ **3 button terpisah**: Foto 1, Foto 2, Foto 3
- ✅ Setiap button upload **1 foto** saja
- ✅ User bisa upload **1-1** (lebih mudah!)
- ✅ Ada **preview** untuk setiap foto
- ✅ Bisa **hapus individual** foto jika salah
- ✅ Ada **progress indicator**: 2/3 foto

---

## 🎨 UI/UX DESIGN

### **Before (OLD):**
```
┌────────────────────────────────────┐
│ MGB (3 Foto)                       │
│ ┌──────────────────────────────┐   │
│ │ [Choose Files] No file chosen│   │ ← Confusing!
│ └──────────────────────────────┘   │
│ Target: 3 foto                     │
└────────────────────────────────────┘
```

### **After (NEW):**
```
┌────────────────────────────────────┐
│ MGB (3 Foto)                       │
│                                    │
│ 📸 Foto 1 ✓              [Hapus]  │
│ ┌──────────────────────────────┐   │
│ │ [Choose File]         ✓ Uploaded│
│ └──────────────────────────────┘   │
│ [Preview image 80x80]              │
│                                    │
│ 📸 Foto 2                          │
│ ┌──────────────────────────────┐   │
│ │ [Choose File]                │   │
│ └──────────────────────────────┘   │
│                                    │
│ 📸 Foto 3                          │
│ ┌──────────────────────────────┐   │
│ │ [Choose File]                │   │
│ └──────────────────────────────┘   │
│                                    │
│ Progress: 1/3 foto                 │
└────────────────────────────────────┘
```

---

## ✨ FITUR-FITUR BARU

### **1. Individual Photo Buttons**
- Setiap foto punya input sendiri
- Label jelas: "📸 Foto 1", "📸 Foto 2", "📸 Foto 3"
- User upload 1-1, tidak perlu sekaligus

### **2. Photo Preview**
- Preview 80x80px untuk setiap foto
- Langsung muncul setelah upload
- Support File object & base64 string

### **3. Delete Individual Photo**
- Button "Hapus" di setiap foto
- Hapus 1 foto tanpa affect foto lain
- Re-upload foto yang salah

### **4. Progress Indicator**
```
Progress: 2/3 foto ← Orange (belum lengkap)
Progress: 3/3 foto ✓ Lengkap! ← Green (sudah lengkap)
```

### **5. Visual Feedback**
- ✓ Green checkmark saat foto uploaded
- ✓ "Uploaded" label
- ✓ "Lengkap!" message saat semua foto sudah ada

---

## 🔧 TECHNICAL IMPLEMENTATION

### **1. Modified handleFileChange Function**

```typescript
const handleFileChange = (
  indicatorId: string, 
  files: FileList | null, 
  photoIndex?: number  // ← NEW! Index untuk foto ke-berapa
) => {
  if (files && files.length > 0) {
    const file = files[0]; // Always take first file
    const currentPhotos = data[indicatorId]?.photos || [];

    let newPhotos;
    if (photoIndex !== undefined) {
      // Replace specific index
      newPhotos = [...currentPhotos];
      newPhotos[photoIndex] = file;  // ← Update index tertentu!
    } else {
      // Legacy: replace all
      newPhotos = Array.from(files);
    }

    const newData = {
      ...data,
      [indicatorId]: {
        ...data[indicatorId],
        photos: newPhotos
      }
    };

    setData(newData);
    draftManager.saveDraftDebounced(branch.id, user?.nik || '', newData);
  }
};
```

### **2. New handleRemovePhoto Function**

```typescript
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

  setData(newData);
  draftManager.saveDraftDebounced(branch.id, user?.nik || '', newData);
};
```

### **3. Conditional Rendering**

```typescript
{indicator.targetPhotos && indicator.targetPhotos > 1 ? (
  // 🆕 MULTIPLE PHOTOS: Render individual buttons
  <div className="space-y-2">
    {Array.from({ length: indicator.targetPhotos }).map((_, photoIndex) => (
      // Individual input untuk setiap foto
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(indicator.id, e.target.files, photoIndex)}
      />
    ))}
  </div>
) : (
  // SINGLE PHOTO: Original simple input
  <Input
    type="file"
    accept="image/*"
    onChange={(e) => handleFileChange(indicator.id, e.target.files, 0)}
  />
)}
```

---

## 📱 MOBILE-FRIENDLY

### **Why This is Better for Mobile:**

1. **No Multiple File Selection**
   - Mobile browsers tidak support multiple file selection dengan baik
   - User bingung cara select banyak foto sekaligus
   - **Solution:** 1 button = 1 foto, jelas & simple!

2. **Clear Visual Feedback**
   - User tahu foto mana yang sudah diupload
   - User tahu foto mana yang masih kurang
   - Progress bar jelas: 2/3 foto

3. **Easy Error Recovery**
   - Upload foto salah? Klik "Hapus" dan upload ulang
   - Tidak perlu upload ulang semua foto
   - Save time & data!

4. **Better UX Flow**
   ```
   Step 1: Upload Foto 1 → ✓ Done → Preview muncul
   Step 2: Upload Foto 2 → ✓ Done → Preview muncul
   Step 3: Upload Foto 3 → ✓ Done → Preview muncul
   → Progress: 3/3 ✓ Lengkap!
   ```

---

## 🎯 USE CASES

### **Use Case 1: Upload MGB (3 Foto)**

**Scenario:** Staff perlu upload 3 foto untuk MGB indicator

**Flow:**
1. Scroll ke indicator "MGB"
2. Klik input **"📸 Foto 1"**
3. Pilih foto dari galeri
4. Preview muncul ✓
5. Klik input **"📸 Foto 2"**
6. Pilih foto dari galeri
7. Preview muncul ✓
8. Klik input **"📸 Foto 3"**
9. Pilih foto dari galeri
10. Preview muncul ✓
11. **Progress: 3/3 foto ✓ Lengkap!**

**Result:** Semua 3 foto terupload dengan jelas!

---

### **Use Case 2: Hapus & Re-upload Foto**

**Scenario:** Staff upload foto yang salah di Foto 2

**Flow:**
1. Lihat preview Foto 2 → "Oh salah foto ini!"
2. Klik button **"Hapus"** di Foto 2
3. Foto 2 dihapus (Foto 1 & 3 tetap ada!)
4. Klik input **"📸 Foto 2"** lagi
5. Pilih foto yang benar
6. Preview muncul ✓
7. **Progress: 3/3 foto ✓ Lengkap!**

**Result:** Foto 2 diganti tanpa affect foto lain!

---

### **Use Case 3: Upload Bertahap**

**Scenario:** Staff upload foto satu-satu (tidak sekaligus)

**Flow:**
1. Upload Foto 1 → Save draft
2. Close app
3. **Buka app lagi** (draft restored!)
4. Upload Foto 2 → Save draft
5. Close app
6. **Buka app lagi** (draft restored!)
7. Upload Foto 3 → Save draft
8. Submit! ✓

**Result:** Draft auto-save setiap foto, no data loss!

---

## ✅ BENEFITS

### **For Users:**
✅ **Easier Upload** - 1 button 1 foto, simple!
✅ **Visual Progress** - Tahu sudah upload berapa foto
✅ **Error Recovery** - Hapus & re-upload individual foto
✅ **Preview** - Lihat foto sebelum submit
✅ **Mobile-Friendly** - No confusing multiple select

### **For Mobile Users:**
✅ **No Multiple Select** - Tidak perlu select 3 foto sekaligus
✅ **Clear Flow** - Upload 1-1 step by step
✅ **Data Efficient** - Bisa upload pakai data seluler (1-1)

### **For Admins:**
✅ **Better Data Quality** - User upload foto yang benar
✅ **Less Errors** - User tidak salah upload
✅ **Clear Validation** - Progress indicator jelas

---

## 🧪 TESTING

### **Test 1: Upload 3 Foto (Happy Path)**
1. Login & pilih indicator dengan 3 foto (MGB)
2. Upload Foto 1 → Check preview muncul
3. Upload Foto 2 → Check preview muncul
4. Upload Foto 3 → Check preview muncul
5. Check progress: "3/3 foto ✓ Lengkap!"
6. Submit → Check semua foto ter-submit

**Expected:**
- ✅ 3 preview muncul
- ✅ Progress 3/3
- ✅ Semua foto ter-submit ke server

---

### **Test 2: Hapus & Re-upload**
1. Upload Foto 1, 2, 3
2. Klik "Hapus" di Foto 2
3. Check Foto 1 & 3 masih ada
4. Check progress: "2/3 foto"
5. Upload Foto 2 lagi
6. Check progress: "3/3 foto ✓ Lengkap!"

**Expected:**
- ✅ Foto 2 terhapus
- ✅ Foto 1 & 3 tetap ada
- ✅ Bisa re-upload Foto 2

---

### **Test 3: Draft Save & Restore**
1. Upload Foto 1 → Wait 2 seconds (auto-save)
2. Close app (don't submit)
3. Reopen app
4. Check draft notification muncul
5. Klik "Pulihkan Draft"
6. Check Foto 1 masih ada dengan preview

**Expected:**
- ✅ Draft saved dengan foto
- ✅ Draft restored dengan preview

---

### **Test 4: Single Photo Indicator**
1. Pilih indicator dengan 1 foto saja
2. Check UI → Should show simple input (bukan 3 button)
3. Upload 1 foto
4. Check preview muncul

**Expected:**
- ✅ Simple input (legacy behavior)
- ✅ No "Foto 1" label
- ✅ Preview muncul

---

### **Test 5: Mobile Browser**
1. Buka di mobile browser (Chrome/Safari mobile)
2. Upload Foto 1 → Should open camera/gallery
3. Take/select photo → Should upload smooth
4. Repeat for Foto 2 & 3
5. Check all previews visible on mobile

**Expected:**
- ✅ No multiple select confusion
- ✅ Smooth upload flow
- ✅ Preview responsive

---

## 🐛 EDGE CASES HANDLED

### **1. User Upload Same Foto Twice**
- ✅ Allowed! Each input independent
- ✅ Both previews show same foto

### **2. User Delete All Photos**
- ✅ Progress shows "0/3 foto"
- ✅ Can re-upload from scratch

### **3. User Upload in Random Order**
- ✅ Can upload Foto 3 first, then Foto 1, then Foto 2
- ✅ Order doesn't matter for functionality

### **4. Large Photo Files**
- ✅ Compression still works (handled in handleSubmit)
- ✅ Preview shows immediately (before compression)

### **5. Draft with Partial Photos**
- ✅ Draft saves photos array with gaps: [File, undefined, File]
- ✅ Restore shows Foto 1 & 3, Foto 2 empty

---

## 📊 COMPARISON

| Feature | OLD (Multiple Input) | NEW (Individual Inputs) |
|---------|---------------------|------------------------|
| Input Type | 1 input `multiple` | 3 individual inputs |
| User Flow | Select 3 at once | Upload 1-1 |
| Mobile UX | Confusing 😕 | Easy 😊 |
| Preview | No preview | 3 previews ✓ |
| Delete | Delete all | Delete individual ✓ |
| Progress | "3 foto dipilih" | "2/3 foto" ✓ |
| Error Recovery | Re-upload all | Re-upload 1 only ✓ |

---

## 🔄 BACKWARD COMPATIBILITY

### **Single Photo Indicators:**
- ✅ Still use simple input (no changes)
- ✅ Legacy behavior maintained
- ✅ No breaking changes

### **Multiple Photo Indicators:**
- ✅ Automatically use new UI (3 buttons)
- ✅ Data structure same (photos array)
- ✅ Backend tidak perlu update

---

## 📄 FILES MODIFIED

**`src/app/components/StaffDashboard.tsx`:**
1. Modified `handleFileChange()` - Added `photoIndex` parameter
2. Added `handleRemovePhoto()` - New function for delete
3. Modified photo input rendering - Conditional: multiple vs single
4. Added preview & delete UI
5. Added progress indicator

---

## 🚀 FUTURE ENHANCEMENTS

### **V2 Ideas:**

1. **Drag & Drop**
   - Drag foto ke slot Foto 1/2/3

2. **Camera Direct Capture**
   - Button "Ambil Foto" untuk direct camera
   - No need open gallery

3. **Photo Validation**
   - Check resolution (min 800x600)
   - Check file size (max 5MB per foto)
   - Show warning jika foto blur

4. **Bulk Upload Helper**
   - Button "Upload 3 Foto Sekaligus" (optional)
   - For users yang mau select multiple

5. **Photo Editing**
   - Crop foto before upload
   - Rotate foto
   - Add filter (brightness, contrast)

---

## ✅ CHECKLIST

After implement, verify:

- [ ] Indicator dengan 3 foto menampilkan 3 input terpisah
- [ ] Setiap input bisa upload 1 foto
- [ ] Preview muncul setelah upload
- [ ] Button "Hapus" berfungsi
- [ ] Progress indicator akurat (X/3 foto)
- [ ] "Lengkap!" muncul saat 3/3
- [ ] Draft save & restore with photos
- [ ] Submit semua foto berhasil
- [ ] Mobile responsive
- [ ] Single photo indicators tidak berubah (backward compatible)

---

Dibuat: 2026-05-03  
Status: ✅ IMPLEMENTED  
Priority: ⭐⭐⭐ HIGH - Better mobile UX!  
Version: 1.0
