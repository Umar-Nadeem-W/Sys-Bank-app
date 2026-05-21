import { useState } from 'react'

const avatarStyle = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #10b981, #3b82f6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 14,
  color: '#fff',
  flexShrink: 0,
}

export default function Header({ user }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(6, 13, 26, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '0 32px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* left spacer to balance layout */}
      <div style={{ width: 160 }} />

      {/* Bank name — centered */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.3px', color: '#f1f5f9' }}>
          Meezan Bank
        </span>
      </div>

      {/* User info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: 160,
        justifyContent: 'flex-end',
      }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>
            {user?.name ?? 'Umar'}
          </div>
          <div style={{ fontSize: 11, color: '#64748b' }}>
            {user?.accountType ?? 'Premium Account'}
          </div>
        </div>
        <div style={avatarStyle}>
          {(user?.name ?? 'U')[0]}
        </div>
      </div>
    </header>
  )
}
