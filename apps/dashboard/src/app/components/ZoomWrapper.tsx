'use client';

import React, { useState } from 'react';

export default function ZoomWrapper({ children, title }: { children: React.ReactNode, title: string }) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (isZoomed) {
    return (
      <>
        {/* Render placeholder to keep grid layout intact */}
        <div className="card glass-panel" style={{ opacity: 0 }}>{children}</div>
        
        {/* Render overlay */}
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(255, 255, 255, 0.95)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          padding: '4rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: 'var(--text-highlight)' }}>{title} (Expanded)</h2>
            <button className="btn btn-ghost" onClick={() => setIsZoomed(false)} style={{ fontSize: '1.2rem', padding: '0.5rem 1rem' }}>
              ✕ Close
            </button>
          </div>
          <div style={{ flex: 1, position: 'relative', overflowY: 'auto' }}>
            {children}
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsZoomed(true)}
        style={{
          position: 'absolute',
          top: '1.2rem',
          right: '1.2rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1.2rem',
          opacity: 0.5,
          zIndex: 10,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.5')}
        title="Zoom / Expand"
      >
        ⛶
      </button>
      {children}
    </div>
  );
}
