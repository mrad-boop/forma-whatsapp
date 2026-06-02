'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const inp = { border: '1.5px solid #e9edef', borderRadius: 10, padding: '9px 12px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans',sans-serif" } as React.CSSProperties

function Modal({ scenario, onClose }: { scenario: any; onClose: () => void }) {
  const [form, setForm] = useState(scenario || { trigger: '', response: '', next_step: '' })
  const save = async () => {
    if (!form.trigger || !form.response) { alert('Déclencheur et réponse obligatoires'); return }
    if (form.id) await supabase.from('scenarios').update(form).eq('id', form.id)
    else await supabase.from('scenarios').insert(form)
    onClose()
  }
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 18, fontSize: 17 }}>{form.id ? '✏️ Modifier' : '➕ Nouveau scénario'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Déclencheur</label>
            <input value={form.trigger} onChange={(e) => setForm((p: any) => ({ ...p, trigger: e.target.value }))} placeholder="ex: 1, bonjour, informatique..." style={inp} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Réponse du chatbot</label>
            <textarea rows={5} value={form.response} onChange={(e) => setForm((p: any) => ({ ...p, response: e.target.value }))} placeholder="Message envoyé par le bot..." style={{ ...inp, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Étape suivante (optionnel)</label>
            <input value={form.next_step || ''} onChange={(e) => setForm((p: any) => ({ ...p, next_step: e.target.value }))} placeholder="ex: contact_prompt..." style={inp} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Annuler</button>
          <button onClick={save} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

export default function PageScenarios() {
  const [scenarios, setScenarios] = useState<any[]>([])
  const [modal, setModal] = useState<any>(null)
  const load = async () => { const { data } = await supabase.from('scenarios').select('*').order('created_at'); setScenarios(data || []) }
  useEffect(() => { load() }, [])
  const del = async (id: string) => { if (!confirm('Supprimer ce scénario ?')) return; await supabase.from('scenarios').delete().eq('id', id); load() }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 13, color: '#667781', maxWidth: 480, lineHeight: 1.6 }}>
          Gérez les réponses automatiques du chatbot sans écrire de code.
        </p>
        <button onClick={() => setModal({})} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}>
          + Nouveau
        </button>
      </div>

      {scenarios.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#667781', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>Aucun scénario configuré</div>
      )}
      {scenarios.map((s) => (
        <div key={s.id} style={{ background: '#fff', borderRadius: 14, padding: '16px', boxShadow: '0 1px 8px rgba(0,0,0,.06)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#e8f5e9', color: '#128C7E' }}>
                🎯 <strong style={{ marginLeft: 4 }}>{s.trigger}</strong>
              </span>
              {s.next_step && <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#e3f2fd', color: '#1565c0' }}>→ {s.next_step}</span>}
            </div>
            <div style={{ fontSize: 13, color: '#111b21', background: '#f7f8fa', borderRadius: 10, padding: '10px 12px', whiteSpace: 'pre-wrap', lineHeight: 1.6, wordBreak: 'break-word' }}>
              {s.response}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            <button onClick={() => setModal(s)} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>✏️</button>
            <button onClick={() => del(s.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
          </div>
        </div>
      ))}
      {modal !== null && <Modal scenario={modal.id ? modal : null} onClose={() => { setModal(null); load() }} />}
    </div>
  )
}
