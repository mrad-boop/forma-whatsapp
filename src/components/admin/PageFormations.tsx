'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RichEditor from '@/components/RichEditor'

const cats = ['Informatique', 'Langues', 'Marketing Digital', 'Comptabilité']
const catS: Record<string, { bg: string; text: string; border: string }> = {
  Informatique: { bg: '#e8f5e9', text: '#128C7E', border: '#128C7E' },
  Langues: { bg: '#e3f2fd', text: '#1565c0', border: '#1565c0' },
  'Marketing Digital': { bg: '#fff8e1', text: '#e65100', border: '#e65100' },
  Comptabilité: { bg: '#fce4ec', text: '#c62828', border: '#c62828' },
}
const inp = { border: '1.5px solid #e9edef', borderRadius: 10, padding: '9px 12px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans',sans-serif" } as React.CSSProperties

function Modal({ formation, onClose }: { formation: any; onClose: () => void }) {
  const [form, setForm] = useState(formation || { titre: '', description: '', prix: '', duree: '', categorie: 'Informatique' })

  const save = async () => {
    if (!form.titre) return
    if (form.id) await supabase.from('formations').update(form).eq('id', form.id)
    else await supabase.from('formations').insert(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 580 }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 18, fontSize: 17 }}>
          {form.id ? '✏️ Modifier la formation' : '➕ Nouvelle formation'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Titre</label>
            <input value={form.titre} onChange={(e) => setForm((p: any) => ({ ...p, titre: e.target.value }))} style={inp} placeholder="Nom de la formation" />
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Description</label>
            <RichEditor
              value={form.description || ''}
              onChange={(html) => setForm((p: any) => ({ ...p, description: html }))}
              placeholder="Décrivez la formation, les objectifs, le programme..."
              minHeight={140}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Prix (€)</label>
              <input type="number" value={form.prix || ''} onChange={(e) => setForm((p: any) => ({ ...p, prix: e.target.value }))} style={inp} placeholder="1200" />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Durée</label>
              <input value={form.duree || ''} onChange={(e) => setForm((p: any) => ({ ...p, duree: e.target.value }))} style={inp} placeholder="ex: 3 mois" />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Catégorie</label>
            <select value={form.categorie} onChange={(e) => setForm((p: any) => ({ ...p, categorie: e.target.value }))} style={inp}>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>Annuler</button>
          <button onClick={save} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>💾 Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default function PageFormations() {
  const [formations, setFormations] = useState<any[]>([])
  const [modal, setModal] = useState<any>(null)

  const load = async () => {
    const { data } = await supabase.from('formations').select('*').order('categorie')
    setFormations(data || [])
  }
  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Supprimer cette formation ?')) return
    await supabase.from('formations').delete().eq('id', id)
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setModal({})} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
          + Ajouter une formation
        </button>
      </div>

      {cats.map((cat) => {
        const list = formations.filter((f) => f.categorie === cat)
        if (!list.length) return null
        const cs = catS[cat] || { bg: '#f5f5f5', text: '#111', border: '#888' }
        return (
          <div key={cat}>
            <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 10, color: cs.text }}>{cat}</h3>
            <div className="formations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
              {list.map((f) => (
                <div key={f.id} style={{ background: '#fff', borderRadius: 14, padding: '16px', boxShadow: '0 1px 8px rgba(0,0,0,.06)', borderLeft: `4px solid ${cs.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Nunito',sans-serif", marginBottom: 6 }}>{f.titre}</div>
                  {/* Render description as HTML if it contains tags */}
                  <div style={{ fontSize: 12, color: '#667781', marginBottom: 12, lineHeight: 1.5 }}
                    dangerouslySetInnerHTML={{ __html: f.description || '' }}
                  />
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: cs.bg, color: cs.text }}>📅 {f.duree}</span>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: '#e8f5e9', color: '#128C7E' }}>💶 {Number(f.prix).toLocaleString()} €</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setModal(f)} style={{ flex: 1, background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '6px', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>✏️ Modifier</button>
                    <button onClick={() => del(f.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      {modal !== null && <Modal formation={modal.id ? modal : null} onClose={() => { setModal(null); load() }} />}
    </div>
  )
}
