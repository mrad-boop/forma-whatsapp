'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RichEditor from '@/components/RichEditor'

const inp = { border: '1.5px solid #e9edef', borderRadius: 10, padding: '9px 12px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans',sans-serif" } as React.CSSProperties

// Strip HTML tags to get plain text for the chatbot engine
function htmlToPlain(html: string): string {
  if (typeof document === 'undefined') return html
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

// Render HTML preview of a response
function ResponsePreview({ html }: { html: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(html)
  if (!isHtml) {
    return <div style={{ whiteSpace: 'pre-wrap', fontSize: 13, color: '#111b21', lineHeight: 1.6 }}>{html}</div>
  }
  return (
    <div
      style={{ fontSize: 13, color: '#111b21', lineHeight: 1.6 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function Modal({ scenario, onClose }: { scenario: any; onClose: () => void }) {
  const [form, setForm] = useState(scenario || { trigger: '', response: '', next_step: '' })
  const [previewMode, setPreviewMode] = useState(false)

  const save = async () => {
    if (!form.trigger || !form.response) { alert('Déclencheur et réponse obligatoires'); return }
    if (form.id) await supabase.from('scenarios').update(form).eq('id', form.id)
    else await supabase.from('scenarios').insert(form)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 600 }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 18, fontSize: 17 }}>
          {form.id ? '✏️ Modifier le scénario' : '➕ Nouveau scénario'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Trigger */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              🎯 Déclencheur
            </label>
            <input
              value={form.trigger}
              onChange={(e) => setForm((p: any) => ({ ...p, trigger: e.target.value }))}
              placeholder="Mot-clé envoyé par l'utilisateur (ex: 1, oui, informatique...)"
              style={inp}
            />
            <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Ce mot-clé déclenche la réponse ci-dessous.</p>
          </div>

          {/* Response with rich editor */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                💬 Réponse du chatbot
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: !previewMode ? '#075E54' : '#f0f2f5', color: !previewMode ? '#fff' : '#667781' }}
                >
                  ✏️ Éditer
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: previewMode ? '#075E54' : '#f0f2f5', color: previewMode ? '#fff' : '#667781' }}
                >
                  👁️ Aperçu
                </button>
              </div>
            </div>

            {!previewMode ? (
              <RichEditor
                value={form.response}
                onChange={(html) => setForm((p: any) => ({ ...p, response: html }))}
                placeholder="Rédigez la réponse du chatbot avec mise en forme..."
                minHeight={180}
              />
            ) : (
              /* WhatsApp-style preview */
              <div style={{ background: '#ECE5DD', borderRadius: 12, padding: 12, minHeight: 120 }}>
                <div style={{ maxWidth: '85%', background: '#fff', borderRadius: '0 12px 12px 12px', padding: '10px 13px 8px', boxShadow: '0 1px 2px rgba(0,0,0,.12)' }}>
                  <ResponsePreview html={form.response} />
                  <div style={{ fontSize: 10, color: '#667781', textAlign: 'right', marginTop: 4 }}>maintenant ✓✓</div>
                </div>
              </div>
            )}
          </div>

          {/* Next step */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              ➡️ Étape suivante <span style={{ fontWeight: 400, color: '#bbb' }}>(optionnel)</span>
            </label>
            <input
              value={form.next_step || ''}
              onChange={(e) => setForm((p: any) => ({ ...p, next_step: e.target.value }))}
              placeholder="ex: main_menu, contact_prompt, collect_name..."
              style={inp}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: '1.5px solid #e9edef', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            Annuler
          </button>
          <button onClick={save} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            💾 Enregistrer
          </button>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 13, color: '#667781', maxWidth: 480, lineHeight: 1.6 }}>
          Gérez les réponses du chatbot avec mise en forme complète (gras, listes, emojis...).
        </p>
        <button onClick={() => setModal({})} style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, whiteSpace: 'nowrap', flexShrink: 0 }}>
          + Nouveau scénario
        </button>
      </div>

      {scenarios.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 40, textAlign: 'center', color: '#667781', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
          Aucun scénario configuré
        </div>
      )}

      {scenarios.map((s) => (
        <div key={s.id} style={{ background: '#fff', borderRadius: 14, padding: '16px', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Header badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#e8f5e9', color: '#128C7E' }}>
                  🎯 {s.trigger}
                </span>
                {s.next_step && (
                  <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#e3f2fd', color: '#1565c0' }}>
                    → {s.next_step}
                  </span>
                )}
              </div>

              {/* Response preview — WhatsApp bubble style */}
              <div style={{ background: '#f7f8fa', borderRadius: 10, padding: '10px 14px' }}>
                <ResponsePreview html={s.response} />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <button onClick={() => setModal(s)} style={{ background: '#f0f2f5', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', fontSize: 13 }} title="Modifier">✏️</button>
              <button onClick={() => del(s.id)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', fontSize: 13 }} title="Supprimer">🗑️</button>
            </div>
          </div>
        </div>
      ))}

      {modal !== null && (
        <Modal scenario={modal.id ? modal : null} onClose={() => { setModal(null); load() }} />
      )}
    </div>
  )
}
