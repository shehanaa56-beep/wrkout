/**
 * Image processing utilities for client and profile pictures.
 * Converts uploaded images to compressed Base64 data URLs to fit easily into localStorage.
 */

/**
 * Reads an image File, scales it to max dimensions while preserving aspect ratio,
 * and compresses it to a lightweight JPEG Base64 string (~15-30KB).
 *
 * @param {File} file - The uploaded image file from file input
 * @param {number} maxWidth - Maximum width (default: 320px)
 * @param {number} maxHeight - Maximum height (default: 320px)
 * @param {number} quality - JPEG compression quality 0.0 - 1.0 (default: 0.75)
 * @returns {Promise<string>} Base64 data URL
 */
export const compressImageToBase64 = (
  file,
  maxWidth = 320,
  maxHeight = 320,
  quality = 0.75
) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file.'));
    };

    reader.onload = (readerEvent) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to decode image data.'));
      };

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to create canvas context.'));
          return;
        }

        // Draw image resized
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 JPEG
        const base64Data = canvas.toDataURL('image/jpeg', quality);
        resolve(base64Data);
      };

      img.src = readerEvent.target.result;
    };

    reader.readAsDataURL(file);
  });
};
