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
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f2f5' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher par session ID..."
            style={{ border: '1.5px solid #e9edef', borderRadius: 10, padding: '10px 14px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} />
        </div>
        <div style={{ overflowY: 'auto', maxHeight: '65vh' }}>
          {filtered.length === 0 && <div style={{ padding: 24, color: '#667781', fontSize: 13, textAlign: 'center' }}>Aucune conversation</div>}
          {filtered.map((c) => (
            <div key={c.id} onClick={() => openConv(c)}
              style={{ padding: '14px 20px', borderBottom: '1px solid #f7f8fa', cursor: 'pointer', background: selected?.id === c.id ? '#f0fdf4' : 'transparent', transition: 'background .15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#111b21' }}>Session #{c.session_id.slice(0, 8)}</div>
                <div style={{ fontSize: 11, color: '#667781' }}>{fmtDate(c.created_at)}</div>
              </div>
              <div style={{ fontSize: 12, color: '#667781', marginTop: 2 }}>{c.id.slice(0, 20)}...</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Conversation #{selected.session_id.slice(0, 8)}</span>
            <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '4px 10px', fontWeight: 500, cursor: 'pointer', fontSize: 12 }}>✕ Fermer</button>
          </div>
          <div className="wa-bg" style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4, maxHeight: '60vh' }}>
            {msgs.map((m) => {
              const isBot = m.sender === 'bot'
              return (
                <div key={m.id} className="msg-appear" style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom: 2 }}>
                  <div style={{ maxWidth: '78%', background: isBot ? '#fff' : '#dcf8c6', borderRadius: isBot ? '0 12px 12px 12px' : '12px 0 12px 12px', padding: '8px 12px 6px', boxShadow: '0 1px 2px rgba(0,0,0,.12)' }}>
                    <div style={{ fontSize: 13.5, lineHeight: 1.55, whiteSpace: 'pre-wrap', color: '#111b21' }}>{m.message}</div>
                    <div style={{ fontSize: 10, color: '#667781', textAlign: 'right', marginTop: 3 }}>{fmtTime(m.created_at)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
