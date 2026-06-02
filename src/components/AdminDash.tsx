'use client'
import { useState } from 'react'
import PageDashboard from './admin/PageDashboard'
import PageConversations from './admin/PageConversations'
import PageProspects from './admin/PageProspects'
import PageFormations from './admin/PageFormations'
import PageScenarios from './admin/PageScenarios'
import PageSettings from './admin/PageSettings'

const menu = [
  { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
  { id: 'conversations', label: 'Conversations', icon: '💬' },
  { id: 'prospects', label: 'Prospects', icon: '👥' },
  { id: 'formations', label: 'Formations', icon: '🎓' },
  { id: 'scenarios', label: 'Scénarios', icon: '🤖' },
  { id: 'settings', label: 'Paramètres', icon: '⚙️' },
]

export default function AdminDash() {
  const [page, setPage] = useState('dashboard')
  const current = menu.find((m) => m.id === page)

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 220, background: '#fff', borderRight: '1px solid #e9edef', display: 'flex', flexDirection: 'column', padding: '16px 12px', gap: 4, flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '8px 12px 20px', borderBottom: '1px solid #f0f2f5', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#075E54', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎓</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Nunito', sans-serif", color: '#075E54' }}>FormaPro</div>
              <div style={{ fontSize: 11, color: '#667781' }}>Administration</div>
            </div>
          </div>
        </div>
        {menu.map((m) => (
          <div key={m.id} className={`sidebar-item ${page === m.id ? 'active' : ''}`}
            onClick={() => setPage(m.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', fontWeight: page === m.id ? 600 : 400, color: page === m.id ? '#128C7E' : '#111b21' }}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            <span style={{ fontSize: 14 }}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f7f8fa' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e9edef', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 18, color: '#111b21' }}>
            {current?.icon} {current?.label}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>A</div>
            <span style={{ fontSize: 13, color: '#667781' }}>Admin</span>
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {page === 'dashboard' && <PageDashboard />}
          {page === 'conversations' && <PageConversations />}
          {page === 'prospects' && <PageProspects />}
          {page === 'formations' && <PageFormations />}
          {page === 'scenarios' && <PageScenarios />}
          {page === 'settings' && <PageSettings />}
        </div>
      </div>
    </div>
  )
}
