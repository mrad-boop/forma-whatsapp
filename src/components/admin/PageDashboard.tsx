'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const fmtDate = (d: string) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })

function MiniBarChart({ data, color = '#25D366' }: { data: { label: string; value: number }[]; color?: string }) {
  if (!data.length) return <div style={{ color: '#667781', fontSize: 13, textAlign: 'center', padding: 20 }}>Aucune donnée</div>
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, width: '100%' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#667781' }}>{d.value}</div>
          <div className="chart-bar" style={{ width: '100%', height: `${(d.value / max) * 90}px`, minHeight: 4, background: color, borderRadius: '4px 4px 0 0' }} />
          <div style={{ fontSize: 10, color: '#667781', textAlign: 'center', lineHeight: 1.2 }}>{d.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function PageDashboard() {
  const [stats, setStats] = useState({ conversations: 0, prospects: 0, today: 0, conversion: 0 })
  const [chartData, setChartData] = useState<{ label: string; value: number }[]>([])
  const [byFormation, setByFormation] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    (async () => {
      const [{ count: convCount }, { count: prospCount }] = await Promise.all([
        supabase.from('conversations').select('*', { count: 'exact', head: true }),
        supabase.from('prospects').select('*', { count: 'exact', head: true }),
      ])
      const today = new Date().toISOString().split('T')[0]
      const { count: todayCount } = await supabase.from('prospects').select('*', { count: 'exact', head: true }).gte('created_at', today)
      setStats({ conversations: convCount || 0, prospects: prospCount || 0, today: todayCount || 0, conversion: convCount ? Math.round(((prospCount || 0) / convCount) * 100) : 0 })

      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i))
        return d.toISOString().split('T')[0]
      })
      const chartRows = await Promise.all(days.map(async (d) => {
        const { count } = await supabase.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', d).lt('created_at', d + 'T23:59:59')
        return { label: new Date(d).toLocaleDateString('fr-FR', { weekday: 'short' }), value: count || 0 }
      }))
      setChartData(chartRows)

      const { data: prospects } = await supabase.from('prospects').select('formation')
      const map: Record<string, number> = {}
      prospects?.forEach((p: any) => { const f = p.formation || 'Autre'; map[f] = (map[f] || 0) + 1 })
      setByFormation(Object.entries(map).map(([f, c]) => ({ label: f, value: c })))
    })()
  }, [])

  const cards = [
    { label: 'Conversations', value: stats.conversations, icon: '💬', border: '#25D366', textColor: '#128C7E' },
    { label: 'Prospects', value: stats.prospects, icon: '👥', border: '#3b82f6', textColor: '#1565c0' },
    { label: "Demandes aujourd'hui", value: stats.today, icon: '📅', border: '#f97316', textColor: '#e65100' },
    { label: 'Taux de conversion', value: `${stats.conversion}%`, icon: '📈', border: '#ef4444', textColor: '#c62828' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 8px rgba(0,0,0,.06)', borderTop: `4px solid ${c.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 28 }}>{c.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: c.textColor, fontFamily: "'Nunito', sans-serif" }}>{c.value}</div>
            <div style={{ fontSize: 13, color: '#667781', fontWeight: 500 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
          <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, marginBottom: 20, fontSize: 15 }}>📅 Conversations — 7 derniers jours</h3>
          <MiniBarChart data={chartData} />
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
          <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, marginBottom: 20, fontSize: 15 }}>🎓 Prospects par formation</h3>
          <MiniBarChart data={byFormation} color="#3b82f6" />
        </div>
      </div>
    </div>
  )
}
