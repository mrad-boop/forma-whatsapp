'use client'
import RichEditor from '@/components/RichEditor'
import { useState } from 'react'

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
              <input
                value={centre[f.key as keyof typeof centre]}
                onChange={(e) => setCentre((p) => ({ ...p, [f.key]: e.target.value }))}
                style={inp}
              />
            </div>
          ))}
        </div>
        <button onClick={handleSave} style={{ marginTop: 16, background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
          {saved ? '✅ Enregistré !' : '💾 Enregistrer'}
        </button>
      </div>

      {/* Chatbot settings */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '20px 18px', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 16, fontSize: 15 }}>🤖 Message de bienvenue</h3>

        <p style={{ fontSize: 12, color: '#667781', marginBottom: 14, lineHeight: 1.6, background: '#f7f8fa', borderRadius: 8, padding: '8px 12px' }}>
          💡 Ce message est affiché au démarrage de chaque conversation. Utilisez la barre d'outils pour le mettre en forme.
        </p>

        <RichEditor
          value={welcomeMsg}
          onChange={setWelcomeMsg}
          placeholder="Message de bienvenue du chatbot..."
          minHeight={200}
        />

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
          <p style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>Temps avant que le bot "réponde" (effet réaliste).</p>
        </div>

        <button onClick={handleSave} style={{ marginTop: 16, background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
          {saved ? '✅ Enregistré !' : '💾 Enregistrer'}
        </button>
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
