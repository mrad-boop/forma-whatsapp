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
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,.2)',
        position: 'sticky', top: 0, zIndex: 30,
        height: 48,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: 20 }}>🎓</span>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, color: '#fff', fontSize: 16, whiteSpace: 'nowrap' }}>
            FormaPro
          </span>
          <span style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            | Centre de Formation
          </span>
        </div>
        <div style={{ display: 'flex', flexShrink: 0 }}>
          {[
            { id: 'simulator' as const, label: '💬', full: '💬 Simulateur' },
            { id: 'admin' as const, label: '⚙️', full: '⚙️ Admin' },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                background: view === v.id ? 'rgba(255,255,255,.2)' : 'transparent',
                border: 'none', color: '#fff',
                padding: '0 14px', height: 48,
                fontWeight: view === v.id ? 700 : 400,
                cursor: 'pointer', fontSize: 13,
                fontFamily: "'DM Sans',sans-serif",
                borderBottom: view === v.id ? '3px solid #fff' : '3px solid transparent',
                transition: 'all .2s', whiteSpace: 'nowrap',
              }}
            >
              <span className="nav-full">{v.full}</span>
              <span className="nav-short" style={{ display: 'none' }}>{v.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <style>{`
        @media (max-width: 400px) {
          .nav-full { display: none !important; }
          .nav-short { display: inline !important; }
        }
      `}</style>

      {view === 'simulator' && (
        <div className="sim-wrapper" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 'calc(100vh - 48px)',
          background: 'linear-gradient(135deg,#e8f5e9 0%,#f0f2f5 60%,#e3f2fd 100%)',
          padding: 20,
        }}>
          <div style={{ width: '100%', maxWidth: 480 }}>
            <div className="sim-intro" style={{ textAlign: 'center', marginBottom: 20 }}>
              <h1 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: 26, color: '#075E54', marginBottom: 6 }}>
                Assistant WhatsApp
              </h1>
              <p style={{ color: '#667781', fontSize: 13 }}>
                Testez notre assistant conversationnel
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
