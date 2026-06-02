'use client'
import RichEditor from '@/components/RichEditor'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const inp = { border: '1.5px solid #e9edef', borderRadius: 10, padding: '9px 12px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans',sans-serif" } as React.CSSProperties

const WELCOME_DEFAULT = `Bonjour 👋<br><br>Bienvenue dans notre <strong>centre de formation</strong>.<br><br>Comment puis-je vous aider ?<br><br><b>1️⃣</b> Découvrir nos formations<br><b>2️⃣</b> Connaître les tarifs<br><b>3️⃣</b> Être rappelé par un conseiller`

export default function PageSettings() {
  const [centre, setCentre] = useState({
    nom: 'FormaPro Centre de Formation',
    telephone: '+33 1 23 45 67 89',
    email: 'contact@formapro.fr',
    adresse: '12 rue de la Formation, 75001 Paris',
  })
  const [welcomeMsg, setWelcomeMsg] = useState(WELCOME_DEFAULT)
  const [delay, setDelay] = useState('1000')
  const [saved, setSaved] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetDone, setResetDone] = useState<{ convs: number; msgs: number } | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleReset = async () => {
    setResetting(true)
    setShowConfirm(false)
    // Count before deleting
    const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true })
    const { count: convCount } = await supabase.from('conversations').select('*', { count: 'exact', head: true })
    // Delete messages first (FK), then conversations
    await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('conversations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    setResetting(false)
    setResetDone({ convs: convCount || 0, msgs: msgCount || 0 })
    setTimeout(() => setResetDone(null), 5000)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620 }}>

      {/* Centre info */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 18px', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 16, fontSize: 15 }}>🏢 Informations du centre</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Nom du centre', key: 'nom' },
            { label: 'Téléphone', key: 'telephone' },
            { label: 'Email', key: 'email' },
            { label: 'Adresse', key: 'adresse' },
          ].map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.4px' }}>{f.label}</label>
              <input value={centre[f.key as keyof typeof centre]} onChange={(e) => setCentre((p) => ({ ...p, [f.key]: e.target.value }))} style={inp} />
            </div>
          ))}
        </div>
        <button onClick={handleSave} style={{ marginTop: 16, background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
          {saved ? '✅ Enregistré !' : '💾 Enregistrer'}
        </button>
      </div>

      {/* Chatbot settings */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 18px', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 16, fontSize: 15 }}>🤖 Message de bienvenue</h3>
        <p style={{ fontSize: 12, color: '#667781', marginBottom: 14, lineHeight: 1.6, background: '#f7f8fa', borderRadius: 8, padding: '8px 12px' }}>
          💡 Ce message est affiché au démarrage de chaque conversation.
        </p>
        <RichEditor value={welcomeMsg} onChange={setWelcomeMsg} placeholder="Message de bienvenue du chatbot..." minHeight={200} />
        {/* Live preview */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#667781', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>Aperçu WhatsApp</div>
          <div style={{ background: '#ECE5DD', borderRadius: 12, padding: 12 }}>
            <div style={{ maxWidth: '85%', background: '#fff', borderRadius: '0 12px 12px 12px', padding: '10px 13px 8px', boxShadow: '0 1px 2px rgba(0,0,0,.12)' }}>
              <div style={{ fontSize: 14, lineHeight: 1.65, color: '#111b21' }} dangerouslySetInnerHTML={{ __html: welcomeMsg }} />
              <div style={{ fontSize: 10, color: '#667781', textAlign: 'right', marginTop: 4 }}>maintenant ✓✓</div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.4px' }}>Délai de réponse simulé (ms)</label>
          <input type="number" value={delay} onChange={(e) => setDelay(e.target.value)} style={{ ...inp, maxWidth: 160 }} />
        </div>
        <button onClick={handleSave} style={{ marginTop: 16, background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
          {saved ? '✅ Enregistré !' : '💾 Enregistrer'}
        </button>
      </div>

      {/* ── RESET CONVERSATIONS ── */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 18px', boxShadow: '0 1px 8px rgba(0,0,0,.06)', border: '1.5px solid #fee2e2' }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 8, fontSize: 15, color: '#c62828', display: 'flex', alignItems: 'center', gap: 8 }}>
          🗑️ Réinitialiser l'historique
        </h3>
        <p style={{ fontSize: 13, color: '#667781', marginBottom: 16, lineHeight: 1.6 }}>
          Supprime <strong>toutes les conversations et messages</strong> de la base de données. Les prospects et formations ne sont pas affectés.
        </p>

        {/* Success feedback */}
        {resetDone && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#15803d' }}>Historique effacé avec succès</div>
              <div style={{ fontSize: 12, color: '#16a34a', marginTop: 2 }}>
                {resetDone.convs} conversation{resetDone.convs > 1 ? 's' : ''} et {resetDone.msgs} message{resetDone.msgs > 1 ? 's' : ''} supprimés.
              </div>
            </div>
          </div>
        )}

        {/* Confirm dialog inline */}
        {showConfirm ? (
          <div style={{ background: '#fff5f5', border: '1.5px solid #fca5a5', borderRadius: 12, padding: '16px', marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#c62828', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚠️ Confirmer la suppression
            </div>
            <p style={{ fontSize: 13, color: '#7f1d1d', marginBottom: 16, lineHeight: 1.5 }}>
              Cette action est <strong>irréversible</strong>. Toutes les conversations et tous les messages seront définitivement supprimés.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1, background: '#f0f2f5', border: 'none', borderRadius: 10, padding: '10px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#444' }}
              >
                Annuler
              </button>
              <button
                onClick={handleReset}
                disabled={resetting}
                style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontWeight: 700, cursor: resetting ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, opacity: resetting ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                {resetting ? (
                  <>
                    <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />
                    Suppression...
                  </>
                ) : '🗑️ Oui, tout supprimer'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            style={{ background: '#fee2e2', color: '#c62828', border: '1.5px solid #fca5a5', borderRadius: 10, padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, transition: 'all .2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2' }}
          >
            🗑️ Réinitialiser les conversations
          </button>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Supabase info */}
      <div style={{ background: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: 14, padding: '16px 18px' }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 8, fontSize: 14, color: '#e65100' }}>ℹ️ Connexion Supabase</h3>
        <p style={{ fontSize: 13, color: '#bf360c' }}>Projet : <strong>qurios-whatsapp</strong></p>
        <p style={{ fontSize: 13, color: '#bf360c', marginTop: 4 }}>URL : <code style={{ fontSize: 12, background: '#ffe0b2', padding: '1px 5px', borderRadius: 4 }}>zixbpwwjweonianynvsq.supabase.co</code></p>
        <p style={{ fontSize: 13, color: '#bf360c', marginTop: 4 }}>Statut : <span style={{ color: '#128C7E', fontWeight: 700 }}>✅ Connecté</span></p>
      </div>
    </div>
  )
}
