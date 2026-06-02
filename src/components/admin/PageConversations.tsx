'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
const fmtTime = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

export default function PageConversations() {
  const [convs, setConvs] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [msgs, setMsgs] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('conversations').select('*').order('created_at', { ascending: false }).then(({ data }) => setConvs(data || []))
  }, [])

  const openConv = async (conv: any) => {
    setSelected(conv)
    const { data } = await supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at')
    setMsgs(data || [])
  }

  const filtered = convs.filter((c) => c.session_id.includes(search) || c.id.includes(search))

  return (
    <div className="conv-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {/* List */}
      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0f2f5' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher..."
            style={{ border: '1.5px solid #e9edef', borderRadius: 10, padding: '8px 12px', fontSize: 13, width: '100%', outline: 'none', fontFamily: "'DM Sans',sans-serif" }} />
        </div>
        <div style={{ overflowY: 'auto', maxHeight: '60vh' }}>
          {filtered.length === 0 && <div style={{ padding: 24, color: '#667781', fontSize: 13, textAlign: 'center' }}>Aucune conversation</div>}
          {filtered.map((c) => (
            <div key={c.id} onClick={() => openConv(c)}
              style={{ padding: '12px 14px', borderBottom: '1px solid #f7f8fa', cursor: 'pointer', background: selected?.id === c.id ? '#f0fdf4' : 'transparent', transition: 'background .15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>#{c.session_id.slice(0, 8)}</span>
                <span style={{ fontSize: 11, color: '#667781' }}>{fmtDate(c.created_at)}</span>
              </div>
              <div style={{ fontSize: 11, color: '#667781', marginTop: 2 }}>{c.id.slice(0, 18)}...</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail — full screen on mobile */}
      <div className={`conv-detail-panel${selected ? ' open' : ''}`} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.06)', display: selected ? 'flex' : 'none', flexDirection: 'column' }}>
        {selected ? (
          <>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>#{selected.session_id.slice(0, 8)}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>✕ Fermer</button>
            </div>
            <div className="wa-bg" style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {msgs.map((m) => {
                const isBot = m.sender === 'bot'
                return (
                  <div key={m.id} className="msg-appear" style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom: 2 }}>
                    <div style={{ maxWidth: '80%', background: isBot ? '#fff' : '#dcf8c6', borderRadius: isBot ? '0 12px 12px 12px' : '12px 0 12px 12px', padding: '7px 10px 5px', boxShadow: '0 1px 2px rgba(0,0,0,.1)' }}>
                      <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: 'pre-wrap', color: '#111b21' }}>{m.message}</div>
                      <div style={{ fontSize: 10, color: '#667781', textAlign: 'right', marginTop: 2 }}>{fmtTime(m.created_at)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#667781', fontSize: 13 }}>
            Sélectionnez une conversation
          </div>
        )}
      </div>
    </div>
  )
}
