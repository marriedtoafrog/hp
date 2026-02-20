import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ImageUpload from '@/app/components/ImageUpload'

export default async function UploadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px'
        }}>
        <a href="/" style={{
        color: 'white',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '500'
        }}>
        ← Back to Captions
        </a>
          <span style={{ color: 'white', fontSize: '14px' }}>{user.email}</span>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            Upload Image
          </h1>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
            Upload an image to generate funny captions
          </p>
          
          <ImageUpload />
        </div>
      </div>
    </div>
  )
}