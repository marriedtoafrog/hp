import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to the App</h1>
      
      {!user ? (
        <form action={signInWithGoogle}>
          <button type="submit" style={{
            padding: '10px 20px',
            background: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}>
            Sign in with Google
          </button>
        </form>
      ) : (
        <div>
          <p>Logged in as: {user.email}</p>
          <a href="/protected" style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#333',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            marginTop: '10px'
          }}>
            Go to Protected Page
          </a>
        </div>
      )}
    </div>
  )
}