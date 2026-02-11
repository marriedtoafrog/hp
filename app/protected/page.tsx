import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  // If no user is logged in, redirect to home
  if (error || !user) {
    redirect('/')
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Protected Page</h1>
      <p>Welcome, {user.email}!</p>
      <p>This page is only visible to authenticated users.</p>
      
      <form action="/auth/signout" method="post">
        <button type="submit" style={{
          padding: '10px 20px',
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Sign Out
        </button>
      </form>
    </div>
  )
}