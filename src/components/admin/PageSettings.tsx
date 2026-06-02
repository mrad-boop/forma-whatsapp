'use client'

const inp = { border: '1.5px solid #e9edef', borderRadius: 10, padding: '9px 12px', fontSize: 14, width: '100%', outline: 'none', fontFamily: "'DM Sans',sans-serif" } as React.CSSProperties

export default function PageSettings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 580 }}>
      {[
        {
          title: '🏢 Informations du centre',
          fields: [
            { label: 'Nom du centre', value: 'FormaPro Centre de Formation' },
            { label: 'Téléphone', value: '+33 1 23 45 67 89' },
            { label: 'Email', value: 'contact@formapro.fr' },
            { label: 'Adresse', value: '12 rue de la Formation, 75001 Paris' },
          ],
        },
        {
          title: '🤖 Paramètres du chatbot',
          fields: [
            { label: 'Délai de réponse (ms)', value: '1000', type: 'number' },
          ],
          textarea: { label: 'Message de bienvenue', value: "Bonjour 👋\n\nBienvenue dans notre centre de formation.\n\nComment puis-je vous aider ?" },
        },
      ].map((section) => (
        <div key={section.title} style={{ background: '#fff', borderRadius: 14, padding: '20px 16px', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 16, fontSize: 15 }}>{section.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {section.fields.map((f) => (
              <div key={f.label}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>{f.label}</label>
                <input type={(f as any).type || 'text'} defaultValue={f.value} style={inp} />
              </div>
            ))}
            {section.textarea && (
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#667781', display: 'block', marginBottom: 4 }}>{section.textarea.label}</label>
                <textarea rows={4} defaultValue={section.textarea.value} style={{ ...inp, resize: 'vertical' }} />
              </div>
            )}
          </div>
          <button style={{ marginTop: 14, background: '#25D366', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>
            💾 Enregistrer
          </button>
        </div>
      ))}

      <div style={{ background: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: 14, padding: '16px' }}>
        <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 800, marginBottom: 8, fontSize: 14, color: '#e65100' }}>ℹ️ Connexion Supabase</h3>
        <p style={{ fontSize: 13, color: '#bf360c' }}>Projet : <strong>qurios-whatsapp</strong></p>
        <p style={{ fontSize: 13, color: '#bf360c', marginTop: 4 }}>Statut : <span style={{ color: '#128C7E', fontWeight: 700 }}>✅ Connecté</span></p>
      </div>
    </div>
  )
}
