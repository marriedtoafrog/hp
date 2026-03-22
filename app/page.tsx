import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CaptionCarousel from '@/app/components/CaptionCarousel'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // SIGN IN PAGE
  if (!user) {
    async function signInWithGoogle() {
      'use server'
      const supabase = await createClient()
      const { data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })
      if (data.url) {
        redirect(data.url)
      }
    }

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #2a2d4a 0%, #0f1019 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        {/* Title */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: '3rem',
            color: '#f0ece4',
            letterSpacing: '-0.01em',
            marginBottom: '8px',
          }}>
            The Humor Project
          </h1>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: '1.1rem',
            color: 'rgba(240, 236, 228, 0.55)',
            letterSpacing: '0.15em',
          }}>
            caption voting
          </p>
        </div>

        {/* Sign In Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          padding: '60px 50px',
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%',
        }}>
          <form action={signInWithGoogle}>
            <button type="submit" style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: '1.1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1a1a2e',
              border: 'none',
              padding: '14px 40px',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              width: '100%',
            }}>
              sign in
            </button>
          </form>
        </div>
      </div>
    )
  }

  // VOTING PAGE — fetch captions
  const { data: captions } = await supabase
    .from('captions')
    .select(`
      *,
      images (
        id,
        url,
        created_datetime_utc
      )
    `)
    .order('created_datetime_utc', { ascending: false })
    .limit(50)

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
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: '1rem',
          color: 'rgba(240, 236, 228, 0.55)',
          letterSpacing: '0.15em',
        }}>
          caption voting
        </p>
      </div>

      {/* Carousel area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 20px 120px 20px',
      }}>
        {captions && captions.length > 0 ? (
          <CaptionCarousel captions={captions} userId={user.id} />
        ) : (
          <div style={{
            textAlign: 'center',
            color: 'rgba(240, 236, 228, 0.55)',
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>No captions yet. Upload an image to get started.</p>
            <Link href="/upload" style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1a1a2e',
              border: 'none',
              padding: '12px 32px',
              textDecoration: 'none',
              display: 'inline-block',
            }}>
              upload picture
            </Link>
          </div>
        )}
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
        <Link href="/upload" style={{
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
          upload picture
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
