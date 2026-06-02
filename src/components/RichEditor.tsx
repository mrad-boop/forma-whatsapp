'use client'
import { useEffect, useRef, useCallback, useState } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}

const EMOJIS = ['👋','😊','✅','🎓','💻','📊','🔐','🌍','📱','💬','📅','💶','🇫🇷','🇬🇧','⭐','🚀','📒','💼','❌','✔️','🔥','💡','📞','🤝','🎯']

export default function RichEditor({ value, onChange, placeholder = 'Rédigez ici...', minHeight = 160 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())
  const lastValue = useRef('')

  // Init content once
  useEffect(() => {
    if (editorRef.current && value !== lastValue.current) {
      // Only update DOM if value changed externally (not from typing)
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || ''
        lastValue.current = value
      }
    }
  }, [value])

  const updateFormats = useCallback(() => {
    const formats = new Set<string>()
    if (document.queryCommandState('bold')) formats.add('bold')
    if (document.queryCommandState('italic')) formats.add('italic')
    if (document.queryCommandState('underline')) formats.add('underline')
    if (document.queryCommandState('insertUnorderedList')) formats.add('ul')
    if (document.queryCommandState('insertOrderedList')) formats.add('ol')
    setActiveFormats(formats)
  }, [])

  const exec = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(cmd, false, value)
    updateFormats()
    if (editorRef.current) {
      lastValue.current = editorRef.current.innerHTML
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange, updateFormats])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      lastValue.current = editorRef.current.innerHTML
      onChange(editorRef.current.innerHTML)
      updateFormats()
    }
  }, [onChange, updateFormats])

  const insertEmoji = useCallback((emoji: string) => {
    editorRef.current?.focus()
    document.execCommand('insertText', false, emoji)
    setShowEmoji(false)
    if (editorRef.current) {
      lastValue.current = editorRef.current.innerHTML
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  const btn = (label: string, cmd: string, title: string, val?: string) => {
    const active = activeFormats.has(cmd === 'insertUnorderedList' ? 'ul' : cmd === 'insertOrderedList' ? 'ol' : cmd)
    return (
      <button
        type="button"
        title={title}
        onMouseDown={(e) => { e.preventDefault(); exec(cmd, val) }}
        style={{
          width: 30, height: 30, border: 'none', cursor: 'pointer', borderRadius: 6,
          background: active ? '#dcf8c6' : 'transparent',
          color: active ? '#075E54' : '#444',
          fontWeight: cmd === 'bold' ? 700 : 400,
          fontStyle: cmd === 'italic' ? 'italic' : 'normal',
          fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s', flexShrink: 0,
        }}
      >
        {label}
      </button>
    )
  }

  const divider = () => <div style={{ width: 1, background: '#e9edef', margin: '0 2px', alignSelf: 'stretch' }} />

  return (
    <div style={{ border: '1.5px solid #e9edef', borderRadius: 12, overflow: 'hidden', background: '#fff', transition: 'border-color .2s' }}
      onFocus={() => { const el = document.querySelector('.rich-wrap'); if (el) (el as HTMLElement).style.borderColor = '#25D366' }}
      onBlur={() => { const el = document.querySelector('.rich-wrap'); if (el) (el as HTMLElement).style.borderColor = '#e9edef' }}
      className="rich-wrap"
    >
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '6px 8px', borderBottom: '1px solid #f0f2f5', background: '#fafafa', flexWrap: 'wrap' }}>
        {btn('B', 'bold', 'Gras')}
        {btn('I', 'italic', 'Italique')}
        {btn('U', 'underline', 'Souligné')}
        {divider()}
        {btn('•', 'insertUnorderedList', 'Liste à puces')}
        {btn('1.', 'insertOrderedList', 'Liste numérotée')}
        {divider()}
        {btn('H1', 'formatBlock', 'Titre', 'h3')}
        {btn('¶', 'formatBlock', 'Paragraphe', 'p')}
        {divider()}
        {btn('←', 'justifyLeft', 'Aligner gauche')}
        {btn('≡', 'justifyCenter', 'Centrer')}
        {btn('→', 'justifyRight', 'Aligner droite')}
        {divider()}
        {btn('—', 'strikeThrough', 'Barré')}
        {divider()}
        {/* Emoji picker */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            title="Insérer un emoji"
            onMouseDown={(e) => { e.preventDefault(); setShowEmoji((p) => !p) }}
            style={{ width: 30, height: 30, border: 'none', cursor: 'pointer', borderRadius: 6, background: showEmoji ? '#dcf8c6' : 'transparent', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            😊
          </button>
          {showEmoji && (
            <div style={{ position: 'absolute', top: 34, left: 0, background: '#fff', border: '1px solid #e9edef', borderRadius: 12, padding: 10, boxShadow: '0 8px 24px rgba(0,0,0,.12)', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4, zIndex: 100, width: 180 }}>
              {EMOJIS.map((e) => (
                <button key={e} type="button" onMouseDown={(ev) => { ev.preventDefault(); insertEmoji(e) }}
                  style={{ width: 30, height: 30, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title={e}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        {/* Clear */}
        <button type="button" title="Effacer tout" onMouseDown={(e) => { e.preventDefault(); if (editorRef.current) { editorRef.current.innerHTML = ''; onChange('') } }}
          style={{ width: 30, height: 30, border: 'none', cursor: 'pointer', borderRadius: 6, background: 'transparent', color: '#ef4444', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ✕
        </button>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateFormats}
        onMouseUp={updateFormats}
        data-placeholder={placeholder}
        style={{
          minHeight,
          padding: '12px 14px',
          outline: 'none',
          fontSize: 14,
          lineHeight: 1.65,
          color: '#111b21',
          fontFamily: "'DM Sans', sans-serif",
          overflowY: 'auto',
          maxHeight: 320,
        }}
      />

      {/* Preview indicator */}
      <div style={{ padding: '5px 14px', background: '#f7f8fa', borderTop: '1px solid #f0f2f5', fontSize: 11, color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
        <span>Rich Text</span>
        <span>Aperçu dans la carte ci-dessous</span>
      </div>

      <style>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #aaa;
          pointer-events: none;
        }
        .rich-wrap div[contenteditable] h3 { font-size: 16px; font-weight: 700; margin: 6px 0 4px; font-family: 'Nunito', sans-serif; }
        .rich-wrap div[contenteditable] ul { padding-left: 20px; margin: 4px 0; }
        .rich-wrap div[contenteditable] ol { padding-left: 20px; margin: 4px 0; }
        .rich-wrap div[contenteditable] li { margin-bottom: 2px; }
        .rich-wrap div[contenteditable] p { margin: 4px 0; }
        .rich-wrap div[contenteditable]:focus { outline: none; }
      `}</style>
    </div>
  )
}
