import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ImageUploadNew from '@/app/components/ImageUploadNew'
import Link from 'next/link'

export default async function UploadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #2a2d4a 0%, #0f1019 60%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Title */}
      <div style={{ paddingTop: '40px', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: '2.8rem',
          color: '#f0ece4',
          letterSpacing: '-0.01em',
          marginBottom: '6px',
        }}>
          The Humor Project
        </h1>
      </div>

      {/* Upload area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 20px 120px 20px',
      }}>
        <ImageUploadNew />
      </div>

      {/* Bottom bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
        background: 'linear-gradient(to top, #0f1019 0%, transparent 100%)',
      }}>
        <Link href="/" style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 600,
          fontSize: '0.95rem',
          background: 'rgba(255, 255, 255, 0.9)',
          color: '#1a1a2e',
          border: 'none',
          padding: '10px 24px',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          back to voting
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.85rem',
            color: 'rgba(240, 236, 228, 0.55)',
          }}>
            {user.email}
          </span>
          <form action="/auth/signout" method="post">
            <button type="submit" style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: '0.9rem',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1a1a2e',
              border: 'none',
              padding: '8px 20px',
              cursor: 'pointer',
            }}>
              Log Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
