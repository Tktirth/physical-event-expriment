import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vision360 | Stadium Command Center',
  description: 'Intelligent Event Experience Platform Command Center layer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="dashboard-layout">
          {/* Sidebar */}
          <aside className="dashboard-sidebar glass-panel">
            <div className="brand">
              <h2 className="text-gradient" style={{ margin: 0, fontSize: '1.5rem' }}>Vision360</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Command Center</span>
            </div>
            
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
              <a href="#" className="glass-panel" style={{ padding: '0.8rem 1rem', textDecoration: 'none', color: 'var(--text-highlight)', borderColor: 'var(--accent-cyan)' }}>Live Map</a>
              <a href="#" style={{ padding: '0.8rem 1rem', textDecoration: 'none', color: 'var(--text-main)', opacity: 0.7 }}>Crowd Demographics</a>
              <a href="#" style={{ padding: '0.8rem 1rem', textDecoration: 'none', color: 'var(--text-main)', opacity: 0.7 }}>Queue Intelligence</a>
              <a href="#" style={{ padding: '0.8rem 1rem', textDecoration: 'none', color: 'var(--text-main)', opacity: 0.7 }}>Digital Twin Sim</a>
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,75,75,0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,75,75,0.3)' }}>
              <h4 style={{ color: 'var(--accent-danger)', margin: 0 }}>System Status</h4>
              <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0' }}>Data Stream Active</p>
            </div>
          </aside>

          {/* Main Area */}
          <main className="dashboard-main">
            {/* Topbar */}
            <header className="dashboard-header glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="live-indicator"></div>
                <span style={{ fontWeight: 500 }}>Live Feed Connected (100k+ Pings/sec)</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-ghost">Export Data</button>
                <button className="btn btn-primary">Initiate Global Nudge</button>
              </div>
            </header>

            {/* Content Injection */}
            <section className="dashboard-content">
              {children}
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
