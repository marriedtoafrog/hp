'use client'

import { useState } from 'react'
import { vote } from '../actions/vote'

export default function VoteButtons({ captionId, userId }: { captionId: string, userId: string }) {
  const [isVoting, setIsVoting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleVote(voteValue: number) {
    setIsVoting(true)
    setMessage('')
    
    const result = await vote(captionId, userId, voteValue)
    
    if (result.success) {
      setMessage(`${voteValue === 1 ? 'Upvoted' : 'Downvoted'}!`)
    } else {
      setMessage(`Error: ${result.error}`)
    }
    
    setIsVoting(false)
    
    setTimeout(() => setMessage(''), 2000)
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: '12px',
      paddingTop: '10px',
      borderTop: '1px solid #eee'
    }}>
      <button
        onClick={() => handleVote(1)}
        disabled={isVoting}
        style={{
          padding: '12px 24px',
          background: isVoting ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: isVoting ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: isVoting ? 'none' : '0 4px 10px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          if (!isVoting) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(102, 126, 234, 0.5)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isVoting) {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(102, 126, 234, 0.4)'
          }
        }}
      >
        <span style={{ fontSize: '20px' }}>👍</span>
        Upvote
      </button>
      
      <button
        onClick={() => handleVote(-1)}
        disabled={isVoting}
        style={{
          padding: '12px 24px',
          background: isVoting ? '#ccc' : '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: isVoting ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: isVoting ? 'none' : '0 4px 10px rgba(239, 68, 68, 0.4)',
          transition: 'all 0.3s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          if (!isVoting) {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 15px rgba(239, 68, 68, 0.5)'
          }
        }}
        onMouseLeave={(e) => {
          if (!isVoting) {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 10px rgba(239, 68, 68, 0.4)'
          }
        }}
      >
        <span style={{ fontSize: '20px' }}>👎</span>
        Downvote
      </button>
      
      {message && (
        <span style={{ 
          marginLeft: '10px',
          color: message.includes('Error') ? '#ef4444' : '#10b981',
          fontWeight: '600',
          fontSize: '16px',
          animation: 'fadeIn 0.3s'
        }}>
          {message}
        </span>
      )}
    </div>
  )
}