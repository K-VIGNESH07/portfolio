/**
 * ImageUploader.jsx — Reusable drag-drop image uploader
 *
 * Props:
 *   storagePath  {string}   — Firebase Storage path to upload to
 *   currentUrl   {string}   — Existing image URL (shows preview)
 *   onUploaded   {function} — Called with (downloadUrl) after success
 *   accept       {string}   — File accept string, default "image/*"
 *   label        {string}   — Label text above the uploader
 *   shape        {string}   — 'circle' | 'rect' (default 'rect')
 *   maxMB        {number}   — Max file size in MB (default 5)
 */
import React, { useRef, useState } from 'react'
import { uploadFile, deleteFile } from '../../../services/storageService'
import s from './ImageUploader.module.css'

export default function ImageUploader({
  storagePath,
  currentUrl = '',
  onUploaded,
  accept = 'image/*',
  label = 'Upload Image',
  shape = 'rect',
  maxMB = 5,
}) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(currentUrl)

  const handleFile = async (file) => {
    if (!file) return
    setError('')

    // Validate type
    const isImage = file.type.startsWith('image/')
    const isPDF   = file.type === 'application/pdf'
    if (!isImage && !isPDF) {
      setError('Only images or PDFs allowed.')
      return
    }

    // Validate size
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File too large. Max ${maxMB} MB.`)
      return
    }

    // Show local preview for images
    if (isImage) {
      const reader = new FileReader()
      reader.onload = (e) => setPreviewUrl(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl('') // PDF: no image preview
    }

    setUploading(true)
    setProgress(0)
    try {
      const url = await uploadFile(storagePath, file, (pct) => setProgress(pct))
      setPreviewUrl(isImage ? url : '')
      onUploaded?.(url)
    } catch (err) {
      setError('Upload failed: ' + (err.message || 'Unknown error'))
      setPreviewUrl(currentUrl)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleRemove = async () => {
    if (!previewUrl && !currentUrl) return
    try {
      await deleteFile(storagePath)
    } catch { /* ignore — file may not exist */ }
    setPreviewUrl('')
    onUploaded?.('')
  }

  const onInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = '' // allow re-upload of same file
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const isCircle = shape === 'circle'

  return (
    <div className={s.wrap}>
      {label && <span className={s.label}>{label}</span>}

      <div
        className={`${s.dropZone} ${isCircle ? s.circle : s.rect} ${dragging ? s.dragging : ''} ${uploading ? s.uploading : ''}`}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label={label}
      >
        {/* Preview image */}
        {previewUrl && !uploading && (
          <img
            src={previewUrl}
            alt="Preview"
            className={`${s.preview} ${isCircle ? s.previewCircle : s.previewRect}`}
          />
        )}

        {/* Upload progress */}
        {uploading && (
          <div className={s.progressWrap}>
            <div className={s.progressRing}>
              <svg viewBox="0 0 36 36" className={s.svg}>
                <path
                  className={s.svgBg}
                  d="M18 2a16 16 0 1 0 0 32 16 16 0 0 0 0-32"
                />
                <path
                  className={s.svgFill}
                  strokeDasharray={`${progress}, 100`}
                  d="M18 2a16 16 0 1 0 0 32 16 16 0 0 0 0-32"
                />
              </svg>
              <span className={s.progressText}>{progress}%</span>
            </div>
            <span className={s.uploadingLabel}>Uploading…</span>
          </div>
        )}

        {/* Placeholder when empty */}
        {!previewUrl && !uploading && (
          <div className={s.placeholder}>
            <span className={s.placeholderIcon}>
              {accept.includes('pdf') ? '📄' : '🖼️'}
            </span>
            <span className={s.placeholderText}>
              {dragging ? 'Drop to upload' : 'Click or drag & drop'}
            </span>
            <span className={s.placeholderSub}>Max {maxMB} MB</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {(previewUrl || currentUrl) && !uploading && (
        <div className={s.actions}>
          <button
            type="button"
            className={s.changeBtn}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
          >
            ↺ Change
          </button>
          <button
            type="button"
            className={s.removeBtn}
            onClick={(e) => { e.stopPropagation(); handleRemove() }}
          >
            ✕ Remove
          </button>
        </div>
      )}

      {/* Error */}
      {error && <div className={s.error}>{error}</div>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={s.hidden}
        onChange={onInputChange}
      />
    </div>
  )
}
