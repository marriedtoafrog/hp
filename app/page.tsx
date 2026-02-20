import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import VoteButtons from '@/app/components/VoteButtons'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // LOGIN PAGE - if not authenticated
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          maxWidth: '400px'
        }}>
          <h1 style={{ 
            fontSize: '32px', 
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🎭 Caption Voting
          </h1>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
            Vote on AI-generated captions and upload your own images
          </p>
          <form action={signInWithGoogle}>
            <button type="submit" style={{
              padding: '15px 40px',
              background: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.4)'
            }}>
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    )
  }

  // CAPTIONS PAGE - if authenticated
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
  .limit(20)

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        padding: '20px 40px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            fontSize: '28px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            margin: 0
          }}>
            🎭 Caption Voting
          </h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link href="/upload" style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}>
              + Upload Image
            </Link>
            <span style={{ color: '#666', fontSize: '14px' }}>{user.email}</span>
            <form action="/auth/signout" method="post">
              <button style={{
                padding: '8px 20px',
                background: 'transparent',
                border: '2px solid #e5e5e5',
                borderRadius: '50px',
                color: '#666',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
{/* Caption Grid */}
<div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        {/* Welcome Title */}
        <h2 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'white',
          marginBottom: '40px',
          textShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          Welcome to The Humor Project
        </h2>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '30px'
        }}>
          {captions?.map((caption: any) => (
            <div key={caption.id} style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              {/* Image */}
              {caption.images && (
                <div style={{
                  width: '100%',
                  height: '250px',
                  overflow: 'hidden',
                  background: '#f5f5f5'
                }}>
                  <img
                    src={caption.images.url}
                    alt="Caption image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}

              {/* Caption Content */}
              <div style={{ padding: '24px' }}>
                <p style={{
                  fontSize: '18px',
                  lineHeight: '1.6',
                  color: '#333',
                  marginBottom: '20px',
                  minHeight: '60px'
                }}>
                  {caption.content || caption.caption_content || 'No caption available'}
                </p>

                {/* Vote Stats & Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '20px',
                  borderTop: '1px solid #f0f0f0'
                }}>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: caption.like_count > 0 ? '#10b981' : '#666'
                  }}>
                    {caption.like_count || 0} 👍
                  </div>
                  <VoteButtons captionId={caption.id} userId={user.id} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {!captions || captions.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '18px', color: '#666' }}>
              No captions yet. Be the first to upload an image!
            </p>
            <Link href="/upload" style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '600'
            }}>
              Upload Image
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}