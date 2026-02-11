'use client'

import { useState } from 'react'
import { uploadImageAndGenerateCaptions } from '../actions/uploadImage'

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [captions, setCaptions] = useState<any[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
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
      setMessage('✅ Captions generated successfully!')
      setCaptions(result.captions || [])
    } else {
      setMessage(`❌ Error: ${result.error}`)
    }

    setIsUploading(false)
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        fontSize: '24px',
        marginBottom: '20px',
        color: '#333',
        fontWeight: '600'
      }}>
        📸 Upload Image for Captions
      </h2>

      {/* File Input */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic"
          onChange={handleFileChange}
          style={{
            padding: '10px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            width: '100%',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Preview */}
      {previewUrl && (
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              borderRadius: '8px',
              border: '2px solid #eee'
            }}
          />
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        style={{
          padding: '12px 30px',
          background: isUploading || !file ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: isUploading || !file ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: isUploading || !file ? 'none' : '0 4px 10px rgba(102, 126, 234, 0.4)',
          marginBottom: '20px'
        }}
      >
        {isUploading ? '⏳ Generating...' : '🚀 Generate Captions'}
      </button>

      {/* Message */}
      {message && (
        <p style={{
          padding: '15px',
          borderRadius: '8px',
          background: message.includes('Error') ? '#fee' : '#efe',
          color: message.includes('Error') ? '#c00' : '#060',
          marginBottom: '20px',
          fontWeight: '500'
        }}>
          {message}
        </p>
      )}

      {/* Generated Captions */}
      {captions.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '20px',
            marginBottom: '15px',
            color: '#333',
            fontWeight: '600'
          }}>
            Generated Captions:
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {captions.map((caption: any, index: number) => (
              <div key={index} style={{
                padding: '15px',
                background: '#f9f9f9',
                borderRadius: '8px',
                borderLeft: '4px solid #667eea'
              }}>
                <p style={{ fontSize: '16px', color: '#333' }}>
                  {caption.content || caption.text || JSON.stringify(caption)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}