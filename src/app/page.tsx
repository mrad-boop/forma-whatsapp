'use client'
import { useState } from 'react'
import WhatsAppSim from '@/components/WhatsAppSim'
import AdminDash from '@/components/AdminDash'

export default function Home() {
  const [view, setView] = useState<'simulator' | 'admin'>('simulator')

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Top nav */}
      <nav style={{
        background: '#075E54',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,.2)',
        position: 'relative',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', flex: 1 }}>
          <span style={{ fontSize: 22 }}>🎓</span>
          <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: '#fff', fontSize: 17, letterSpacing: -0.3 }}>
            FormaPro
          </span>
          <span style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, marginLeft: 4 }}>| Centre de Formation</span>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'simulator' as const, label: '💬 Simulateur' },
            { id: 'admin' as const, label: '⚙️ Administration' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                background: view === v.id ? 'rgba(255,255,255,.2)' : 'transparent',
                border: 'none',
                color: '#fff',
                padding: '14px 18px',
                fontWeight: view === v.id ? 700 : 400,
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                borderBottom: view === v.id ? '3px solid #fff' : '3px solid transparent',
                transition: 'all .2s',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
      </nav>

      {view === 'simulator' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 48px)',
          background: 'linear-gradient(135deg,#e8f5e9 0%,#f0f2f5 60%,#e3f2fd 100%)',
          padding: 20
        }}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h1 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900, fontSize: 28, color: '#075E54', marginBottom: 6 }}>
                Assistant WhatsApp
              </h1>
              <p style={{ color: '#667781', fontSize: 14 }}>
                Testez notre assistant conversationnel — simulateur réaliste
              </p>
            </div>
            <WhatsAppSim />
          </div>
        </div>
      )}

      {view === 'admin' && <AdminDash />}
    </div>
  )
}
