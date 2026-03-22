'use client'

import { useState, useRef } from 'react'
import { uploadImageAndGenerateCaptions } from '../actions/uploadImage'

export default function ImageUploadNew() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [captions, setCaptions] = useState<any[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setCaptions([])
      setMessage('')
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile)
      setPreviewUrl(URL.createObjectURL(droppedFile))
      setCaptions([])
      setMessage('')
    }
  }

  async function handleUpload() {
    if (!file) {
      setMessage('Please select an image first')
      return
    }

    setIsUploading(true)
    setMessage('Uploading and generating captions...')
    setCaptions([])

    const result = await uploadImageAndGenerateCaptions(file)

    if (result.success) {
      setMessage('Captions generated successfully!')
      setCaptions(result.captions || [])
    } else {
      setMessage(`Error: ${result.error}`)
    }

    setIsUploading(false)
  }

  return (
    <div style={{
      maxWidth: '520px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? 'rgba(197, 176, 138, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
          borderRadius: '12px',
          padding: previewUrl ? '0' : '80px 40px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: isDragging
            ? 'rgba(197, 176, 138, 0.08)'
            : 'rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            style={{
              width: '100%',
              maxHeight: '360px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.3rem',
              fontWeight: 600,
              color: 'rgba(240, 236, 228, 0.7)',
              marginBottom: '12px',
            }}>
              upload image
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.85rem',
              color: 'rgba(240, 236, 228, 0.35)',
            }}>
              click or drag and drop
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Generate button */}
      {file && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: '1rem',
            background: isUploading ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.9)',
            color: isUploading ? 'rgba(255, 255, 255, 0.3)' : '#1a1a2e',
            border: 'none',
            padding: '14px 32px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            transition: 'all 0.25s ease',
            width: '100%',
          }}
        >
          {isUploading ? 'generating captions...' : 'generate captions'}
        </button>
      )}

      {/* Message */}
      {message && (
        <div style={{
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease',
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem',
            padding: '8px 16px',
            borderRadius: '6px',
            background: message.includes('Error')
              ? 'rgba(239, 68, 68, 0.15)'
              : message.includes('Uploading')
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(16, 185, 129, 0.15)',
            color: message.includes('Error')
              ? '#fca5a5'
              : message.includes('Uploading')
                ? 'rgba(240, 236, 228, 0.6)'
                : '#6ee7b7',
            border: `1px solid ${message.includes('Error')
              ? 'rgba(239, 68, 68, 0.2)'
              : message.includes('Uploading')
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(16, 185, 129, 0.2)'}`,
          }}>
            {message}
          </span>
        </div>
      )}

      {/* Generated Captions */}
      {captions.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#f0ece4',
            textAlign: 'center',
            marginBottom: '4px',
          }}>
            generated captions
          </p>
          {captions.map((caption: any, i: number) => (
            <div key={i} style={{
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
            }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.95rem',
                color: '#f0ece4',
                lineHeight: 1.5,
              }}>
                {caption.content || caption.text || JSON.stringify(caption)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
