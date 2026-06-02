'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
const inp = { border: '1.5px solid #e9edef', borderRadius: 10, padding: '9px 12px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans',sans-serif" } as React.CSSProperties

function Modal({ prospect, onClose }: { prospect: any; onClose: () => void }) {
  const [form, setForm] = useState({ ...prospect })
  const save = async () => { await supabase.from('prospects').update(form).eq('id', form.id); onClose() }
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 18, fontSize: 17 }}>✏️ Modifier le prospect</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['nom', 'telephone', 'email', 'formation'].map((f) => (
            <div key={f}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', textTransform: 'capitalize', display: 'block', marginBottom: 4 }}>{f}</label>
              <input value={form[f] || ''} onChange={(e) => setForm((p: any) => ({ ...p, [f]: e.target.value }))} style={inp} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Annuler</button>
          <button onClick={save} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

const catC: Record<string, [string, string]> = {
  Informatique: ['#e8f5e9', '#128C7E'],
  Langues: ['#e3f2fd', '#1565c0'],
  'Marketing Digital': ['#fff8e1', '#e65100'],
  Comptabilité: ['#fce4ec', '#c62828'],
}

export default function PageProspects() {
  const [prospects, setProspects] = useState<any[]>([])
  const [editTarget, setEditTarget] = useState<any>(null)
  const [search, setSearch] = useState('')

  const load = async () => { const { data } = await supabase.from('prospects').select('*').order('created_at', { ascending: false }); setProspects(data || []) }
  useEffect(() => { load() }, [])

  const del = async (id: string) => { if (!confirm('Supprimer ce prospect ?')) return; await supabase.from('prospects').delete().eq('id', id); load() }

  const exportCSV = () => {
    const rows = prospects.map((p) => `"${p.nom}","${p.telephone}","${p.email}","${p.formation || ''}","${fmtDate(p.created_at)}"`)
    const blob = new Blob(['\uFEFF' + 'Nom,Téléphone,Email,Formation,Date\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'prospects.csv'; a.click()
  }

  const filtered = prospects.filter((p) =>
    p.nom?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()) || p.telephone?.includes(search)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher..."
          style={{ ...inp, maxWidth: 240, flex: 1 }} />
        <button onClick={exportCSV} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
          📥 Export CSV
        </button>
        <span style={{ fontSize: 12, color: '#667781' }}>{filtered.length} prospect{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <div className="table-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr>
                {['Nom', 'Téléphone', 'Email', 'Formation', 'Date', ''].map((h) => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#667781', padding: '10px 14px', borderBottom: '2px solid #f0f2f5', textTransform: 'uppercase', letterSpacing: '.4px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#667781', padding: 32, fontSize: 13 }}>Aucun prospect enregistré</td></tr>}
              {filtered.map((p) => {
                const [bg, tc] = catC[p.formation] || ['#f5f5f5', '#111']
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f7f8fa' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{p.nom}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, whiteSpace: 'nowrap' }}>{p.telephone}</td>
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#1a73e8', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</td>
                    <td style={{ padding: '12px 14px' }}>
                      {p.formation && <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: bg, color: tc, whiteSpace: 'nowrap' }}>{p.formation}</span>}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#667781', fontSize: 12, whiteSpace: 'nowrap' }}>{fmtDate(p.created_at)}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setEditTarget(p)} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>✏️</button>
                        <button onClick={() => del(p.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
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
