import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VoteButtons from './components/VoteButtons'
import ImageUpload from './components/ImageUpload'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  async function signInWithGoogle() {
    'use server'
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })
    
    if (data.url) {
      redirect(data.url)
    }
  }

  // Fetch captions if user is logged in
  let captions = []
  if (user) {
    const { data } = await supabase
      .from('captions')
      .select('*')
      .limit(20)
    
    captions = data || []
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{ 
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}>
            🎭 Caption Voting
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            Vote on your favorite captions!
          </p>
        </div>

        {/* User info card */}
        {user && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Logged in as</p>
              <p style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>{user.email}</p>
            </div>
            <form action="/auth/signout" method="post">
              <button style={{
                padding: '10px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Sign Out
              </button>
            </form>
          </div>
        )}

{user && (
  <div style={{
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    {/* ... existing user info ... */}
  </div>
)}

{/* ADD THIS: */}
{user && <ImageUpload />}

{user && (
  <div>
    {/* ... existing captions section ... */}
  </div>
)}
        
        {!user ? (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{ 
              fontSize: '32px',
              marginBottom: '15px',
              color: '#333'
            }}>
              Welcome! 👋
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#666',
              marginBottom: '30px'
            }}>
              Please sign in to view and vote on captions
            </p>
            <form action={signInWithGoogle}>
              <button type="submit" style={{
                padding: '15px 40px',
                background: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)'
              }}>
                🔐 Sign in with Google
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Captions */}
            <div style={{ marginTop: '20px' }}>
              {captions.map((caption: any, index: number) => (
                <div key={caption.id} style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '30px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#999',
                    marginBottom: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    Caption #{index + 1}
                  </div>
                  <p style={{ 
                    fontSize: '22px',
                    lineHeight: '1.6',
                    marginBottom: '20px',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    {caption.content || caption.text || 'No caption text'}
                  </p>
                  <VoteButtons captionId={caption.id} userId={user.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}