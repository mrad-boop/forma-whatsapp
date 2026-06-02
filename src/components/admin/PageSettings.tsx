'use client'

const inputStyle = {
  border: '1.5px solid #e9edef', borderRadius: 10, padding: '10px 14px',
  fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans', sans-serif"
}

export default function PageSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 600 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, marginBottom: 16, fontSize: 16 }}>🏢 Informations du centre</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Nom du centre', value: 'FormaPro Centre de Formation' },
            { label: 'Téléphone de contact', value: '+33 1 23 45 67 89' },
            { label: 'Email', value: 'contact@formapro.fr' },
            { label: 'Adresse', value: '12 rue de la Formation, 75001 Paris' },
          ].map((f) => (
            <div key={f.label}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>{f.label}</label>
              <input defaultValue={f.value} style={inputStyle} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <button style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            💾 Enregistrer
          </button>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, marginBottom: 16, fontSize: 16 }}>🤖 Paramètres du chatbot</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Message de bienvenue</label>
            <textarea rows={4} defaultValue={"Bonjour 👋\n\nBienvenue dans notre centre de formation.\n\nComment puis-je vous aider ?"} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>Délai de réponse simulé (ms)</label>
            <input type="number" defaultValue={1000} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            💾 Enregistrer
          </button>
        </div>
      </div>

      <div style={{ background: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: 16, padding: 20 }}>
        <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, marginBottom: 8, fontSize: 15, color: '#e65100' }}>ℹ️ Connexion Supabase</h3>
        <p style={{ fontSize: 13, color: '#bf360c' }}>Projet : <strong>qurios-whatsapp</strong></p>
        <p style={{ fontSize: 13, color: '#bf360c', marginTop: 4 }}>URL : <code style={{ fontSize: 12 }}>zixbpwwjweonianynvsq.supabase.co</code></p>
        <p style={{ fontSize: 13, color: '#bf360c', marginTop: 4 }}>Statut : <span style={{ color: '#128C7E', fontWeight: 700 }}>✅ Connecté</span></p>
      </div>
    </div>
  )
}
