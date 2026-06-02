'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const G = { green: '#25D366', darkGreen: '#128C7E', teal: '#075E54' }
const genId = () => Math.random().toString(36).slice(2, 11)
const fmtTime = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

interface Msg { id: string; text: string; sender: 'bot' | 'user'; ts: string }

const FLOW: Record<string, any> = {
  start: { msg: "Bonjour 👋\n\nBienvenue dans notre centre de formation.\n\nComment puis-je vous aider ?\n\n1️⃣ Découvrir nos formations\n2️⃣ Connaître les tarifs\n3️⃣ Être rappelé par un conseiller" },
  collect_name: { msg: "Parfait ! 😊 Pour qu'un conseiller vous contacte, j'ai besoin de quelques informations.\n\nVotre prénom et nom ?" },
  collect_phone: { msg: "Votre numéro de téléphone ?" },
  collect_email: { msg: "Votre adresse email ?" },
  domain_menu: { msg: "Quel domaine vous intéresse ?\n\n1️⃣ Informatique\n2️⃣ Langues\n3️⃣ Marketing Digital\n4️⃣ Comptabilité" },
  pricing: { msg: "Nos tarifs adaptés à chaque parcours :\n\n💻 Informatique : 1 200 € – 1 800 €\n🌍 Langues : 700 € – 800 €\n📱 Marketing Digital : 900 € – 1 100 €\n📊 Comptabilité : 950 € – 1 000 €\n\n✅ Financement et facilités de paiement disponibles.\n\nSouhaitez-vous être contacté par un conseiller ?\n\nOui / Non" },
  show_informatique: { msg: "Nos formations en Informatique :\n\n💻 Développement Web (3 mois — 1 200 €)\n📊 Data Analyst (4 mois — 1 500 €)\n🔐 Cybersécurité (4 mois — 1 800 €)\n\nSouhaitez-vous être contacté ?\n\nOui / Non", formation: 'Informatique' },
  show_langues: { msg: "Nos formations en Langues :\n\n🇬🇧 Anglais des Affaires (2 mois — 800 €)\n🇫🇷 Français Professionnel (2 mois — 700 €)\n\nSouhaitez-vous être contacté ?\n\nOui / Non", formation: 'Langues' },
  show_marketing: { msg: "Nos formations en Marketing Digital :\n\n📱 Marketing Digital (3 mois — 1 100 €)\n💬 Community Management (2 mois — 900 €)\n\nSouhaitez-vous être contacté ?\n\nOui / Non", formation: 'Marketing Digital' },
  show_compta: { msg: "Nos formations en Comptabilité :\n\n📒 Comptabilité Générale (3 mois — 1 000 €)\n💼 Paie et RH (2 mois — 950 €)\n\nSouhaitez-vous être contacté ?\n\nOui / Non", formation: 'Comptabilité' },
  goodbye: { msg: "D'accord ! 😊\n\nN'hésitez pas à revenir si vous avez des questions.\n\nÀ bientôt ! 👋" },
}

// Quick reply suggestions per step
const SUGGESTIONS: Record<string, string[]> = {
  main_menu: ['1', '2', '3'],
  domain_options: ['1 - Informatique', '2 - Langues', '3 - Marketing', '4 - Comptabilité'],
  contact_prompt: ['Oui', 'Non'],
}

export default function WhatsAppSim() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [step, setStep] = useState('start')
  const [prospect, setProspect] = useState({ nom: '', telephone: '', email: '', formation: '' })
  const [sessionId] = useState(() => genId())
  const [convId, setConvId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scroll = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)

  const addMsg = useCallback((text: string, sender: 'bot' | 'user') => {
    const m: Msg = { id: genId(), text, sender, ts: new Date().toISOString() }
    setMessages((p) => [...p, m])
    scroll()
    return m
  }, [])

  const saveMsg = useCallback(async (cId: string, text: string, sender: string) => {
    await supabase.from('messages').insert({ conversation_id: cId, sender, message: text })
  }, [])

  const botSay = useCallback(async (text: string, cId?: string | null) => {
    setTyping(true)
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 500))
    setTyping(false)
    addMsg(text, 'bot')
    if (cId) await saveMsg(cId, text, 'bot')
  }, [addMsg, saveMsg])

  useEffect(() => {
    (async () => {
      const { data: conv } = await supabase.from('conversations').insert({ session_id: sessionId }).select().single()
      const cId = conv?.id ?? null
      setConvId(cId)
      await botSay(FLOW.start.msg, cId)
      setStep('main_menu')
    })()
  }, [])

  const send = useCallback(async (textOverride?: string) => {
    const text = (textOverride ?? input).trim()
    if (!text) return
    setInput('')
    addMsg(text, 'user')
    if (convId) await saveMsg(convId, text, 'user')
    const lower = text.toLowerCase().replace(/\s*-\s*\w+.*$/, '').trim() // strip "1 - Informatique" → "1"

    if (step === 'collect_name') { setProspect((p) => ({ ...p, nom: text })); await botSay(FLOW.collect_phone.msg, convId); setStep('collect_phone'); return }
    if (step === 'collect_phone') { setProspect((p) => ({ ...p, telephone: text })); await botSay(FLOW.collect_email.msg, convId); setStep('collect_email'); return }
    if (step === 'collect_email') {
      const fin = { ...prospect, email: text }
      await supabase.from('prospects').insert({ nom: fin.nom, telephone: fin.telephone, email: text, formation: fin.formation })
      await botSay(`✅ Merci ${fin.nom} !\n\nVos coordonnées ont bien été enregistrées. Un conseiller vous contactera très prochainement.\n\nÀ bientôt ! 👋`, convId)
      setStep('end'); return
    }
    if (step === 'end') { await botSay('Actualisez la page pour recommencer. 😊', convId); return }

    if (step === 'main_menu') {
      if (lower === '1') { await botSay(FLOW.domain_menu.msg, convId); setStep('domain_options'); return }
      if (lower === '2') { await botSay(FLOW.pricing.msg, convId); setStep('contact_prompt'); return }
      if (lower === '3') { await botSay(FLOW.collect_name.msg, convId); setStep('collect_name'); return }
    }
    if (step === 'domain_options') {
      const map: Record<string, string> = { '1': 'show_informatique', informatique: 'show_informatique', '2': 'show_langues', langues: 'show_langues', '3': 'show_marketing', 'marketing digital': 'show_marketing', marketing: 'show_marketing', '4': 'show_compta', 'comptabilité': 'show_compta', comptabilite: 'show_compta' }
      const target = map[lower]
      if (target) {
        const node = FLOW[target]
        if (node.formation) setProspect((p) => ({ ...p, formation: node.formation }))
        await botSay(node.msg, convId); setStep('contact_prompt'); return
      }
    }
    if (step === 'contact_prompt') {
      if (lower === 'oui' || lower === 'o') { await botSay(FLOW.collect_name.msg, convId); setStep('collect_name'); return }
      if (lower === 'non' || lower === 'n') { await botSay(FLOW.goodbye.msg, convId); setStep('end'); return }
    }
    await botSay("Je n'ai pas bien compris. Choisissez parmi les options proposées 😊", convId)
  }, [input, step, prospect, convId, addMsg, botSay, saveMsg])

  const suggestions = SUGGESTIONS[step] || []

  return (
    <div className="sim-phone" style={{ display: 'flex', flexDirection: 'column', height: '90vh', maxHeight: 700, background: '#ECE5DD', fontFamily: "'DM Sans',sans-serif", borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>
      {/* Header */}
      <div style={{ background: G.teal, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: G.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🎓</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: "'Nunito',sans-serif" }}>Assistant Formation</div>
          <div style={{ color: '#a8d5c2', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4fc97e', display: 'inline-block', flexShrink: 0 }} />
            En ligne
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, color: '#fff', fontSize: 18, opacity: .8 }}>
          <span>📞</span><span>⋮</span>
        </div>
      </div>

      {/* Chat */}
      <div className="wa-bg" style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {messages.map((m) => <MsgBubble key={m.id} msg={m} />)}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {suggestions.length > 0 && (
        <div style={{ background: '#f0f2f5', padding: '6px 10px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0, borderTop: '1px solid #e9edef' }}>
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} style={{ background: '#fff', border: '1.5px solid #25D366', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 600, color: '#128C7E', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ background: '#f0f2f5', padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ flex: 1, background: '#fff', borderRadius: 24, padding: '9px 14px', display: 'flex', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,.08)' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Tapez votre message..."
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: 15, color: '#111b21', background: 'transparent', fontFamily: "'DM Sans',sans-serif", minWidth: 0 }}
          />
        </div>
        <button onClick={() => send()} style={{ width: 44, height: 44, borderRadius: '50%', background: G.teal, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.2)', color: '#fff' }}>
          ➤
        </button>
      </div>
    </div>
  )
}

function MsgBubble({ msg }: { msg: Msg }) {
  const isBot = msg.sender === 'bot'
  return (
    <div className="msg-appear" style={{ display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom: 2 }}>
      <div style={{ maxWidth: '80%', background: isBot ? '#fff' : '#dcf8c6', borderRadius: isBot ? '0 12px 12px 12px' : '12px 0 12px 12px', padding: '7px 10px 5px', boxShadow: '0 1px 2px rgba(0,0,0,.1)' }}>
        <div style={{ fontSize: 14, lineHeight: 1.55, whiteSpace: 'pre-wrap', color: '#111b21' }}>{msg.text}</div>
        <div style={{ fontSize: 10, color: '#667781', textAlign: 'right', marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3 }}>
          {fmtTime(msg.ts)}
          {!isBot && <span style={{ color: '#128C7E', fontSize: 12 }}>✓✓</span>}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 4 }}>
      <div style={{ background: '#fff', borderRadius: '0 12px 12px 12px', padding: '10px 14px', boxShadow: '0 1px 2px rgba(0,0,0,.1)', display: 'flex', gap: 4, alignItems: 'center' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#667781', display: 'block', animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  )
}
