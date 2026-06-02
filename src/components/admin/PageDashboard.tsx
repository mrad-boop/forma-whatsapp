'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function MiniBarChart({ data, color = '#25D366' }: { data: { label: string; value: number }[]; color?: string }) {
  if (!data.length) return <div style={{ color: '#667781', fontSize: 13, textAlign: 'center', padding: 20 }}>Aucune donnée</div>
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 110, width: '100%' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end', minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#667781' }}>{d.value}</div>
          <div className="chart-bar" style={{ width: '100%', height: `${(d.value / max) * 85}px`, minHeight: 4, background: color }} />
          <div style={{ fontSize: 9, color: '#667781', textAlign: 'center', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>{d.label}</div>
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

      const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0] })
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
    { label: 'Conversations', value: stats.conversations, icon: '💬', border: '#25D366', text: '#128C7E' },
    { label: 'Prospects', value: stats.prospects, icon: '👥', border: '#3b82f6', text: '#1565c0' },
    { label: "Aujourd'hui", value: stats.today, icon: '📅', border: '#f97316', text: '#e65100' },
    { label: 'Conversion', value: `${stats.conversion}%`, icon: '📈', border: '#ef4444', text: '#c62828' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', boxShadow: '0 1px 8px rgba(0,0,0,.06)', borderTop: `4px solid ${c.border}` }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: c.text, fontFamily: "'Nunito',sans-serif" }}>{c.value}</div>
            <div style={{ fontSize: 12, color: '#667781', fontWeight: 500, marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, marginBottom: 16, fontSize: 14 }}>📅 7 derniers jours</h3>
          <MiniBarChart data={chartData} />
        </div>
        <div style={{ background: '#fff', borderRadius: 14, padding: '16px', boxShadow: '0 1px 8px rgba(0,0,0,.06)' }}>
          <h3 style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, marginBottom: 16, fontSize: 14 }}>🎓 Par formation</h3>
          <MiniBarChart data={byFormation} color="#3b82f6" />
        </div>
      </div>
    </div>
  )
}
