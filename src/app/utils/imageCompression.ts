/**
 * Image compression utility
 * Compress images before converting to base64 to reduce payload size
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const defaultOptions: Required<CompressionOptions> = {
  maxWidth: 400,  // EXTREME compression for 5KB/s networks! (was 600)
  maxHeight: 400, // EXTREME compression for 5KB/s networks! (was 600)
  quality: 0.3,   // 30% quality - very aggressive but still usable (was 0.5)
};

/**
 * Compress image file and convert to base64
 */
export async function compressImage(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxWidth, maxHeight, quality } = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      try {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((compressedBlob) => {
          if (!compressedBlob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result !== 'string') {
              reject(new Error('Failed to read compressed image'));
              return;
            }

            console.log(
              `Image compressed: ${(file.size / 1024).toFixed(2)}KB → ${(compressedBlob.size / 1024).toFixed(2)}KB`
            );
            resolve(reader.result);
          };
          reader.onerror = () => reject(new Error('Failed to read compressed image'));
          reader.readAsDataURL(compressedBlob);
        }, 'image/jpeg', quality);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };
    img.src = objectUrl;
  });
}

/**
 * Compress multiple images
 */
export async function compressImages(
  files: (File | Blob)[],
  options: CompressionOptions = {}
): Promise<string[]> {
  const compressionPromises = files.map((file) => compressImage(file, options));
  return Promise.all(compressionPromises);
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File | Blob): boolean {
  return file.type.startsWith('image/');
}

/**
 * Get file size in KB
 */
export function getFileSizeKB(file: File | Blob): number {
  return file.size / 1024;
}