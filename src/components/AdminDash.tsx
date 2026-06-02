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
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', fontFamily: "'DM Sans',sans-serif", position: 'relative' }}>

      {/* ── Desktop Sidebar ── */}
      <div className="desktop-sidebar" style={{ width: 220, background: '#fff', borderRight: '1px solid #e9edef', display: 'flex', flexDirection: 'column', padding: '14px 10px', gap: 3, flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '6px 12px 16px', borderBottom: '1px solid #f0f2f5', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#075E54', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🎓</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Nunito',sans-serif", color: '#075E54' }}>FormaPro</div>
              <div style={{ fontSize: 11, color: '#667781' }}>Administration</div>
            </div>
          </div>
        </div>
        {menu.map((m) => (
          <div key={m.id} className={`sidebar-item ${page === m.id ? 'active' : ''}`}
            onClick={() => setPage(m.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', fontWeight: page === m.id ? 600 : 400, color: page === m.id ? '#128C7E' : '#111b21' }}>
            <span style={{ fontSize: 17 }}>{m.icon}</span>
            <span style={{ fontSize: 13 }}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="admin-main" style={{ flex: 1, overflowY: 'auto', background: '#f7f8fa' }}>
        {/* Top bar */}
        <div className="admin-topbar" style={{ background: '#fff', borderBottom: '1px solid #e9edef', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <h2 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: 16, color: '#111b21', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{current?.icon}</span> <span>{current?.label}</span>
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13 }}>A</div>
            <span style={{ fontSize: 12, color: '#667781' }}>Admin</span>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {page === 'dashboard' && <PageDashboard />}
          {page === 'conversations' && <PageConversations />}
          {page === 'prospects' && <PageProspects />}
          {page === 'formations' && <PageFormations />}
          {page === 'scenarios' && <PageScenarios />}
          {page === 'settings' && <PageSettings />}
        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="bottom-nav">
        {menu.map((m) => (
          <button key={m.id} onClick={() => setPage(m.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, padding: '8px 0', border: 'none', background: 'transparent',
            color: page === m.id ? '#128C7E' : '#667781', cursor: 'pointer',
            borderTop: page === m.id ? '2px solid #25D366' : '2px solid transparent',
            transition: 'all .15s', fontFamily: "'DM Sans',sans-serif",
          }}>
            <span style={{ fontSize: 20 }}>{m.icon}</span>
            <span style={{ fontSize: 9, fontWeight: page === m.id ? 700 : 400, lineHeight: 1 }}>{m.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
