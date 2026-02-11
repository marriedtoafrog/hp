'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function vote(captionId: string, userId: string, voteValue: number) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'Must be logged in to vote' }
  }

  // Get the user's profile_id from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: 'Profile not found' }
  }

  // Try to INSERT the vote
  // If duplicate key error (user already voted), it's okay - just return success
  const { error } = await supabase
    .from('caption_votes')
    .insert({
      caption_id: captionId,
      profile_id: profile.id,
      vote_value: voteValue,
      created_datetime_utc: new Date().toISOString(),
      modified_datetime_utc: new Date().toISOString()
    })

  // Check if error is duplicate key error (code 23505)
  if (error) {
    // If it's a duplicate key error, the user already voted - that's fine
    if (error.code === '23505') {
      return { success: true, message: 'You already voted on this caption' }
    }
    // Other errors should be reported
    console.error('Vote error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true, message: 'Vote recorded!' }
}