/**
 * storageService.js — Local Base64 uploader (No-Storage fallback)
 *
 * Converts uploaded files into Base64 Data URLs to store directly in Firestore,
 * bypassing Firebase Storage to avoid CORS and project activation issues.
 * Images are automatically resized and compressed to keep document sizes small.
 */

/**
 * Resizes and compresses an image to JPEG format.
 * Keeps file size small (usually under 50KB) to fit within Firestore limits.
 */
function compressImage(file, maxWidth = 500, maxHeight = 500, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Export as compressed JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(dataUrl)
      }
      img.onerror = () => reject(new Error('Failed to load image for compression.'))
      img.src = e.target.result
    }
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

/**
 * Reads any file directly into a Base64 Data URL.
 */
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

/**
 * Simulates file upload by converting the file to Base64.
 *
 * @param {string} path         - Ignored in Base64 mode
 * @param {File}   file         - The File object from input uploader
 * @param {function} onProgress - Called with progress percent
 * @returns {Promise<string>}   - Base64 Data URL
 */
export function uploadFile(path, file, onProgress = () => {}) {
  return new Promise(async (resolve, reject) => {
    try {
      // Simulate progress ticks
      let pct = 0
      const interval = setInterval(() => {
        pct += 15
        if (pct >= 90) {
          clearInterval(interval)
          onProgress(90)
        } else {
          onProgress(pct)
        }
      }, 40)

      let resultUrl = ''
      if (file.type.startsWith('image/')) {
        resultUrl = await compressImage(file)
      } else {
        // Enforce limit for PDF of 800KB to fit easily in Firestore (1MB max limit)
        if (file.size > 800 * 1024) {
          clearInterval(interval)
          throw new Error('Resume file is too large (max 800KB). Please compress the PDF before uploading.')
        }
        resultUrl = await fileToDataUrl(file)
      }

      clearInterval(interval)
      onProgress(100)
      setTimeout(() => resolve(resultUrl), 150)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Delete helper (no-op in Base64 mode).
 */
export async function deleteFile(path) {
  // Files are stored inside Firestore documents, so deleting them from storage is a no-op
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'item'
}

export function getExt(file) {
  const parts = file.name.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'bin'
}
