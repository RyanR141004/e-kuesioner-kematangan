import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '20px',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)',
        top: -300, right: -200,
      }} />
      <div style={{
        position: 'absolute', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)',
        bottom: -200, left: -100,
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 700 }}>
        {/* Logo */}
        <div style={{
          width: 80, height: 80, margin: '0 auto 32px',
          borderRadius: 20,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, fontWeight: 800, color: 'white',
          boxShadow: '0 0 40px rgba(59,130,246,0.3)',
        }}>
          EK
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 16,
          lineHeight: 1.2,
        }}>
          E-Kuesioner Evaluasi<br />Kematangan Perangkat Daerah
        </h1>

        <p style={{
          fontSize: 16, color: '#94a3b8', marginBottom: 40, lineHeight: 1.8,
        }}>
          Sistem evaluasi mandiri (self-assessment) tingkat kematangan 26 Perangkat Daerah
          berdasarkan <strong style={{ color: '#f1f5f9' }}>Permendagri No 99 Tahun 2018</strong>
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" className="btn btn-primary btn-lg">
            Masuk ke Sistem
          </Link>
        </div>

        {/* Feature badges */}
        <div style={{
          display: 'flex', gap: 24, justifyContent: 'center', marginTop: 60,
          flexWrap: 'wrap',
        }}>
          {['11 Instrumen Evaluasi', '26 Kelembagaan', 'Ranking Otomatis', 'Export PDF & Excel'].map((f) => (
            <div key={f} style={{
              padding: '8px 20px', borderRadius: 20,
              background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
              fontSize: 13, fontWeight: 500, color: '#94a3b8',
            }}>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
