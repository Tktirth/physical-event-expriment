'use client';

import React, { useState, useEffect } from 'react';
import { Download, Radio, ShieldCheck, Zap, Wifi, Database, CheckCircle2 } from 'lucide-react';

export default function HeaderActions() {
  const [nudgeState, setNudgeState] = useState<'idle' | 'transmitting' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const handleExport = () => {
    // Simulate professional export
    const content = JSON.stringify({
      timestamp: new Date().toISOString(),
      venue: "Narendra Modi Stadium",
      analytics: "3D_SPATIAL_MESH_ACTIVE",
      load: "84,000 Pings/sec"
    }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OmniFlow_Export_${Date.now()}.json`;
    link.click();
  };

  const transmitSteps = [
    "Establishing encrypted mesh link...",
    "Calibrating crowd density zones...",
    "Synchronizing rerouting parameters...",
    "Pushing nudge packets to 84,000+ nodes..."
  ];

  const handleGlobalNudge = () => {
    setNudgeState('transmitting');
    setProgress(0);
    setLog([]);
    
    let step = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setNudgeState('success');
          return 100;
        }
        
        // Update log based on progress
        const currentStep = Math.floor(prev / 25);
        if (currentStep > step && currentStep < transmitSteps.length) {
          step = currentStep;
          setLog(prevLog => [...prevLog, transmitSteps[step]]);
        } else if (prev === 0) {
          setLog([transmitSteps[0]]);
        }
        
        return prev + 2;
      });
    }, 100);
  };

  const closeNudge = () => {
    setNudgeState('idle');
    setProgress(0);
    setLog([]);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn btn-ghost" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Download size={16} />
          Export Metadata
        </button>
        <button className="btn btn-primary" onClick={handleGlobalNudge} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-teal))', border: 'none', color: 'white', fontWeight: 600 }}>
          <Radio size={16} />
          Initialize Global Nudge
        </button>
      </div>

      {nudgeState !== 'idle' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(5, 10, 20, 0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white'
        }}>
          <div className="card glass-panel" style={{ 
            width: '550px', 
            padding: '3rem', 
            border: '1px solid rgba(0, 243, 255, 0.2)', 
            background: 'rgba(10, 20, 40, 0.8)', 
            boxShadow: '0 0 100px rgba(0, 243, 255, 0.1)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background scanner effect */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, width: '200%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.05), transparent)',
              animation: 'scan 4s linear infinite'
            }}></div>
            
            {nudgeState === 'transmitting' ? (
              <>
                <div style={{ marginBottom: '2rem', position: 'relative', display: 'inline-block' }}>
                  <div className="pulse-ripple" style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid var(--accent-cyan)', animation: 'ripple 2s ease-out infinite' }}></div>
                  <Radio size={64} style={{ color: 'var(--accent-cyan)', filter: 'drop-shadow(0 0 15px var(--accent-cyan))' }} />
                </div>
                
                <h2 style={{ margin: '0 0 1rem 0', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>Signal Transmission Active</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem', fontFamily: 'var(--font-family-mono)' }}>TARGET: 84,000+ DEVICES @ NARENDRA MODI STADIUM</div>
                
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '2rem' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)', transition: 'width 0.1s linear' }}></div>
                </div>

                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)', height: '160px', overflowY: 'auto', fontFamily: 'monospace' }}>
                  {log.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', color: '#88ccff', marginBottom: '0.5rem' }}>
                      <span style={{ color: 'var(--accent-cyan)', opacity: 0.5 }}>[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                      <ShieldCheck size={14} style={{ color: 'var(--accent-success)' }} />
                      {msg}
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 500, marginTop: '0.5rem' }}>
                    <div className="loader" style={{ width: '12px', height: '12px', border: '2px solid var(--accent-cyan)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    ENCRYPTING BROADCAST PACKETS...
                  </div>
                </div>
              </>
            ) : (
              <div style={{ animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                <div style={{ marginBottom: '2rem', color: 'var(--accent-success)' }}>
                  <CheckCircle2 size={80} style={{ filter: 'drop-shadow(0 0 20px var(--accent-success))' }} />
                </div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>HANDSHAKE COMPLETE</h2>
                <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '2.5rem', maxWidth: '400px', marginInline: 'auto' }}>
                  Strategic redirection broadcast successfully acknowledged by the edge infrastructure. Attendee movement lag predicted to drop by 24% in T-5m.
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={closeNudge}
                  style={{ 
                    width: '100%', 
                    background: 'var(--accent-cyan)', 
                    border: 'none', 
                    color: 'var(--bg-main)', 
                    fontWeight: 800,
                    fontSize: '1rem',
                    padding: '1rem'
                  }}
                >
                  RESUME MONITORING
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .loader {
          display: inline-block;
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes scan {
          from { transform: translateX(-100%); }
          to { transform: translateX(50%); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </>
  );
}
