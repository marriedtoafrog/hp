'use client'

import { useState } from 'react'
import { vote } from '../actions/vote'

interface Caption {
  id: string
  content?: string
  caption_content?: string
  like_count?: number
  images?: {
    id: string
    url: string
    created_datetime_utc: string
  }
}

export default function CaptionCarousel({ captions, userId }: { captions: Caption[], userId: string }) {
  const [index, setIndex] = useState(0)
  const [isVoting, setIsVoting] = useState(false)
  const [message, setMessage] = useState('')
  const [direction, setDirection] = useState<'next' | 'back'>('next')

  const caption = captions[index]
  const canGoBack = index > 0
  const canGoNext = index < captions.length - 1

  function goBack() {
    if (canGoBack) {
      setDirection('back')
      setIndex(i => i - 1)
      setMessage('')
    }
  }

  function goNext() {
    if (canGoNext) {
      setDirection('next')
      setIndex(i => i + 1)
      setMessage('')
    }
  }

  async function handleVote(voteValue: number) {
    setIsVoting(true)
    setMessage('')

    const result = await vote(caption.id, userId, voteValue)

    if (result.success) {
      setMessage(result.message || (voteValue === 1 ? 'Upvoted!' : 'Downvoted!'))
      setIsVoting(false)
      // Auto-advance after a short delay so they see the confirmation
      setTimeout(() => {
        if (index < captions.length - 1) {
          setDirection('next')
          setIndex(i => i + 1)
          setMessage('')
        } else {
          setMessage('You voted on the last one!')
        }
      }, 800)
      return
    } else {
      setMessage(`Error: ${result.error}`)
    }

    setIsVoting(false)
    setTimeout(() => setMessage(''), 2500)
  }

  if (!caption) return null

  const captionText = caption.content || caption.caption_content || 'No caption available'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      maxWidth: '560px',
      width: '100%',
    }}>
      {/* Image + Caption Card */}
      <div
        key={caption.id}
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          overflow: 'hidden',
          backdropFilter: 'blur(20px)',
          animation: 'fadeSlideIn 0.35s ease-out',
        }}
      >
        {/* Image */}
        {caption.images?.url && (
          <div style={{
            width: '100%',
            aspectRatio: '4 / 3',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.03)',
          }}>
            <img
              src={caption.images.url}
              alt="Caption image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        )}

        {/* Caption text */}
        <div style={{
          padding: '28px 24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1.15rem',
            fontWeight: 400,
            color: '#f0ece4',
            lineHeight: 1.6,
          }}>
            {captionText}
          </p>
        </div>

        {/* Vote row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '0 24px 28px 24px',
        }}>
          <button
            onClick={() => handleVote(1)}
            disabled={isVoting}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#f0ece4',
              fontSize: '1.3rem',
              cursor: isVoting ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isVoting ? 0.4 : 1,
            }}
            title="Upvote"
          >
            👍
          </button>

          <button
            onClick={() => handleVote(-1)}
            disabled={isVoting}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#f0ece4',
              fontSize: '1.3rem',
              cursor: isVoting ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isVoting ? 0.4 : 1,
            }}
            title="Downvote"
          >
            👎
          </button>
        </div>

        {/* Vote message */}
        {message && (
          <div style={{
            textAlign: 'center',
            paddingBottom: '20px',
            animation: 'fadeIn 0.3s ease',
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.85rem',
              padding: '6px 14px',
              borderRadius: '6px',
              background: message.includes('Error')
                ? 'rgba(239, 68, 68, 0.15)'
                : 'rgba(16, 185, 129, 0.15)',
              color: message.includes('Error') ? '#fca5a5' : '#6ee7b7',
              border: `1px solid ${message.includes('Error')
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(16, 185, 129, 0.2)'}`,
            }}>
              {message}
            </span>
          </div>
        )}
      </div>

      {/* Back / Next navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={goBack}
          disabled={!canGoBack}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: '0.95rem',
            background: canGoBack ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)',
            color: canGoBack ? '#1a1a2e' : 'rgba(255, 255, 255, 0.3)',
            border: 'none',
            padding: '10px 28px',
            cursor: canGoBack ? 'pointer' : 'not-allowed',
            transition: 'all 0.25s ease',
          }}
        >
          back
        </button>

        {/* Counter */}
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.8rem',
          color: 'rgba(240, 236, 228, 0.4)',
          minWidth: '60px',
          textAlign: 'center',
        }}>
          {index + 1} / {captions.length}
        </span>

        <button
          onClick={goNext}
          disabled={!canGoNext}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: '0.95rem',
            background: canGoNext ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)',
            color: canGoNext ? '#1a1a2e' : 'rgba(255, 255, 255, 0.3)',
            border: 'none',
            padding: '10px 28px',
            cursor: canGoNext ? 'pointer' : 'not-allowed',
            transition: 'all 0.25s ease',
          }}
        >
          next
        </button>
      </div>
    </div>
  )
}
