'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const cats = ['Informatique', 'Langues', 'Marketing Digital', 'Comptabilité']
const catStyle: Record<string, { bg: string; text: string; border: string }> = {
  Informatique: { bg: '#e8f5e9', text: '#128C7E', border: '#128C7E' },
  Langues: { bg: '#e3f2fd', text: '#1565c0', border: '#1565c0' },
  'Marketing Digital': { bg: '#fff8e1', text: '#e65100', border: '#e65100' },
  Comptabilité: { bg: '#fce4ec', text: '#c62828', border: '#c62828' },
}

function FormationModal({ formation, onClose }: { formation: any; onClose: () => void }) {
  const [form, setForm] = useState(formation || { titre: '', description: '', prix: '', duree: '', categorie: 'Informatique' })
  const save = async () => {
    if (!form.titre) return
    if (formation?.id) await supabase.from('formations').update(form).eq('id', form.id)
    else await supabase.from('formations').insert(form)
    onClose()
  }
  const inputStyle = { border: '1.5px solid #e9edef', borderRadius: 10, padding: '10px 14px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans', sans-serif" }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(500px,95vw)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, marginBottom: 20 }}>{formation?.id ? '✏️ Modifier la formation' : '➕ Nouvelle formation'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'titre', label: 'Titre', type: 'text' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'prix', label: 'Prix (€)', type: 'number' },
            { key: 'duree', label: 'Durée', type: 'text', placeholder: 'ex: 3 mois' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>{f.label}</label>
              {f.type === 'textarea'
                ? <textarea rows={3} value={form[f.key] || ''} onChange={(e) => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
                : <input type={f.type} value={form[f.key] || ''} placeholder={f.placeholder} onChange={(e) => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              }
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Catégorie</label>
            <select value={form.categorie} onChange={(e) => setForm((p: any) => ({ ...p, categorie: e.target.value }))} style={inputStyle}>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Annuler</button>
          <button onClick={save} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Enregistrer</button>
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
        <button onClick={() => setModal({})} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
          + Ajouter une formation
        </button>
      </div>

      {cats.map((cat) => {
        const catForms = formations.filter((f) => f.categorie === cat)
        if (!catForms.length) return null
        const cs = catStyle[cat] || { bg: '#f5f5f5', text: '#111', border: '#888' }
        return (
          <div key={cat}>
            <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 12, color: cs.text }}>{cat}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
              {catForms.map((f) => (
                <div key={f.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 8px rgba(0,0,0,.06)', borderLeft: `4px solid ${cs.border}` }}>
                  <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Nunito', sans-serif", marginBottom: 6 }}>{f.titre}</div>
                  <div style={{ fontSize: 13, color: '#667781', marginBottom: 12, lineHeight: 1.5 }}>{f.description}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: cs.bg, color: cs.text }}>📅 {f.duree}</span>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: '#e8f5e9', color: '#128C7E' }}>💶 {Number(f.prix).toLocaleString()} €</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => setModal(f)} style={{ flex: 1, background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>✏️ Modifier</button>
                    <button onClick={() => del(f.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {modal !== null && <FormationModal formation={modal.id ? modal : null} onClose={() => { setModal(null); load() }} />}
    </div>
  )
}
