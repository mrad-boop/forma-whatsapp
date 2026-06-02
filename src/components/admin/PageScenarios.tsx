'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function ScenarioModal({ scenario, onClose }: { scenario: any; onClose: () => void }) {
  const [form, setForm] = useState(scenario || { trigger: '', response: '', next_step: '' })
  const save = async () => {
    if (!form.trigger || !form.response) { alert('Déclencheur et réponse obligatoires'); return }
    if (scenario?.id) await supabase.from('scenarios').update(form).eq('id', form.id)
    else await supabase.from('scenarios').insert(form)
    onClose()
  }
  const inputStyle = { border: '1.5px solid #e9edef', borderRadius: 10, padding: '10px 14px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans', sans-serif" }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, width: 'min(500px,95vw)', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, marginBottom: 20 }}>{scenario?.id ? '✏️ Modifier le scénario' : '➕ Nouveau scénario'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Déclencheur (mot-clé envoyé par l'utilisateur)</label>
            <input value={form.trigger} onChange={(e) => setForm((p: any) => ({ ...p, trigger: e.target.value }))} placeholder="ex: 1, bonjour, informatique..." style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Réponse du chatbot</label>
            <textarea rows={5} value={form.response} onChange={(e) => setForm((p: any) => ({ ...p, response: e.target.value }))} placeholder="Tapez la réponse que le chatbot enverra..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Étape suivante (optionnel)</label>
            <input value={form.next_step || ''} onChange={(e) => setForm((p: any) => ({ ...p, next_step: e.target.value }))} placeholder="ex: main_menu, contact_prompt..." style={inputStyle} />
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

export default function PageScenarios() {
  const [scenarios, setScenarios] = useState<any[]>([])
  const [modal, setModal] = useState<any>(null)

  const load = async () => {
    const { data } = await supabase.from('scenarios').select('*').order('created_at')
    setScenarios(data || [])
  }
  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Supprimer ce scénario ?')) return
    await supabase.from('scenarios').delete().eq('id', id)
    load()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 13, color: '#667781', maxWidth: 500 }}>
          Gérez ici les réponses automatiques du chatbot. Ces scénarios définissent comment l'assistant répond aux messages des visiteurs.
        </p>
        <button onClick={() => setModal({})} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
          + Nouveau scénario
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {scenarios.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 40, textAlign: 'center', color: '#667781', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
            Aucun scénario configuré
          </div>
        )}
        {scenarios.map((s) => (
          <div key={s.id} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 8px rgba(0,0,0,.06)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#e8f5e9', color: '#128C7E' }}>
                  🎯 Déclencheur : <strong style={{ marginLeft: 4 }}>{s.trigger}</strong>
                </span>
                {s.next_step && (
                  <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#e3f2fd', color: '#1565c0' }}>→ {s.next_step}</span>
                )}
              </div>
              <div style={{ fontSize: 13, color: '#111b21', background: '#f7f8fa', borderRadius: 10, padding: '10px 14px', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {s.response}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setModal(s)} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>✏️</button>
              <button onClick={() => del(s.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal !== null && <ScenarioModal scenario={modal.id ? modal : null} onClose={() => { setModal(null); load() }} />}
    </div>
  )
}
