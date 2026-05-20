import { codeExample } from '../../data/apiData'

const DOT_COLORS = ['#f87171', '#fbbf24', '#22c55e']

export default function ApiCodeBlock() {
  return (
    <section style={{ padding: '0 60px 70px' }}>
      <div style={{
        maxWidth: 760, margin: '0 auto',
        background: 'rgba(8,6,17,0.95)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, overflow: 'hidden',
      }}>
        {/* Title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {DOT_COLORS.map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
          <span style={{ fontSize: 12, color: 'rgba(226,234,252,0.3)', marginLeft: 8 }}>example.js</span>
        </div>

        {/* Code */}
        <pre style={{
          padding: '24px 28px', fontSize: 13, lineHeight: 1.7,
          color: 'rgba(226,234,252,0.8)', overflowX: 'auto',
          fontFamily: "'Fira Code', 'Courier New', monospace", margin: 0,
        }}>
          {codeExample}
        </pre>
      </div>
    </section>
  )
}