'use server'

import { createClient } from '@/lib/supabase/server'

export async function uploadImageAndGenerateCaptions(file: File) {
  const supabase = await createClient()
  
  // Get authenticated user and their token
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    return { success: false, error: 'Must be logged in to upload images' }
  }

  const token = session.access_token

  try {
    console.log('Step 1: Generating presigned URL...')
    
    // Step 1: Generate presigned URL
    const presignedResponse = await fetch('https://api.almostcrackd.ai/pipeline/generate-presigned-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentType: file.type
      })
    })

    if (!presignedResponse.ok) {
      const error = await presignedResponse.text()
      console.error('Presigned URL error:', error)
      return { success: false, error: `Failed to get presigned URL: ${error}` }
    }

    const { presignedUrl, cdnUrl } = await presignedResponse.json()
    console.log('Presigned URL generated:', cdnUrl)

    console.log('Step 2: Uploading image...')
    
    // Step 2: Upload image to presigned URL
    const fileBuffer = await file.arrayBuffer()
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: fileBuffer
    })

    if (!uploadResponse.ok) {
      console.error('Upload error:', uploadResponse.status)
      return { success: false, error: 'Failed to upload image' }
    }

    console.log('Image uploaded successfully')
    console.log('Step 3: Registering image...')

    // Step 3: Register image URL
    const registerResponse = await fetch('https://api.almostcrackd.ai/pipeline/upload-image-from-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl: cdnUrl,
        isCommonUse: false
      })
    })

    if (!registerResponse.ok) {
      const error = await registerResponse.text()
      console.error('Register error:', error)
      return { success: false, error: `Failed to register image: ${error}` }
    }

    const registerData = await registerResponse.json()
    console.log('Image registered:', registerData)
    const { imageId } = registerData

    if (!imageId) {
      return { success: false, error: 'No imageId returned from registration' }
    }

    console.log('Step 4: Generating captions for imageId:', imageId)

    // Wait a moment for the image to be processed
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Step 4: Generate captions
    const captionsResponse = await fetch('https://api.almostcrackd.ai/pipeline/generate-captions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageId: imageId
      })
    })

    const captionsText = await captionsResponse.text()
    console.log('Captions response status:', captionsResponse.status)
    console.log('Captions response:', captionsText)

    if (!captionsResponse.ok) {
      return { success: false, error: `Failed to generate captions: ${captionsText}` }
    }

    let captions
    try {
      captions = JSON.parse(captionsText)
    } catch (e) {
      console.error('Failed to parse captions:', captionsText)
      return { success: false, error: 'Invalid response from captions API' }
    }

    console.log('Captions generated successfully:', captions)
    return { success: true, captions }

  } catch (error: any) {
    console.error('Upload error:', error)
    return { success: false, error: error.message || 'Unknown error occurred' }
  }
}