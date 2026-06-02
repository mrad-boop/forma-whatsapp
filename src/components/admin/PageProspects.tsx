'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

function Modal({ prospect, onClose }: { prospect: any; onClose: () => void }) {
  const [form, setForm] = useState({ ...prospect })
  const save = async () => {
    await supabase.from('prospects').update({ nom: form.nom, telephone: form.telephone, email: form.email, formation: form.formation }).eq('id', form.id)
    onClose()
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(480px,95vw)', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, marginBottom: 20 }}>✏️ Modifier le prospect</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['nom', 'telephone', 'email', 'formation'].map((f) => (
            <div key={f}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', textTransform: 'capitalize', display: 'block', marginBottom: 4 }}>{f}</label>
              <input value={form[f] || ''} onChange={(e) => setForm((p: any) => ({ ...p, [f]: e.target.value }))}
                style={{ border: '1.5px solid #e9edef', borderRadius: 10, padding: '10px 14px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans', sans-serif" }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Annuler</button>
          <button onClick={save} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default function PageProspects() {
  const [prospects, setProspects] = useState<any[]>([])
  const [editTarget, setEditTarget] = useState<any>(null)
  const [search, setSearch] = useState('')

  const load = async () => {
    const { data } = await supabase.from('prospects').select('*').order('created_at', { ascending: false })
    setProspects(data || [])
  }
  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Supprimer ce prospect ?')) return
    await supabase.from('prospects').delete().eq('id', id)
    load()
  }

  const exportCSV = () => {
    const header = 'Nom,Téléphone,Email,Formation,Date'
    const rows = prospects.map((p) => `"${p.nom}","${p.telephone}","${p.email}","${p.formation || ''}","${fmtDate(p.created_at)}"`)
    const blob = new Blob(['\uFEFF' + header + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'prospects.csv'; a.click()
  }

  const filtered = prospects.filter((p) =>
    p.nom?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()) || p.telephone?.includes(search)
  )

  const catColors: Record<string, { bg: string; text: string }> = {
    Informatique: { bg: '#e8f5e9', text: '#128C7E' },
    Langues: { bg: '#e3f2fd', text: '#1565c0' },
    'Marketing Digital': { bg: '#fff8e1', text: '#e65100' },
    Comptabilité: { bg: '#fce4ec', text: '#c62828' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher..."
          style={{ maxWidth: 260, width: '100%', border: '1.5px solid #e9edef', borderRadius: 10, padding: '10px 14px', fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif" }} />
        <button onClick={exportCSV} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>
          📥 Export CSV
        </button>
        <span style={{ fontSize: 13, color: '#667781' }}>{filtered.length} prospect{filtered.length > 1 ? 's' : ''}</span>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Nom', 'Téléphone', 'Email', 'Formation', 'Date', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#667781', padding: '10px 16px', borderBottom: '2px solid #f0f2f5', textTransform: 'uppercase', letterSpacing: '.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: '#667781', padding: 32, fontSize: 14 }}>Aucun prospect enregistré</td></tr>
              )}
              {filtered.map((p) => {
                const c = catColors[p.formation] || { bg: '#f5f5f5', text: '#111' }
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f7f8fa' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>{p.nom}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14 }}>{p.telephone}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, color: '#1a73e8' }}>{p.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {p.formation && <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text }}>{p.formation}</span>}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#667781', fontSize: 13 }}>{fmtDate(p.created_at)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setEditTarget(p)} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>✏️ Modifier</button>
                        <button onClick={() => del(p.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      {editTarget && <Modal prospect={editTarget} onClose={() => { setEditTarget(null); load() }} />}
    </div>
  )
}
