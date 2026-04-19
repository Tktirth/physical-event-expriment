'use client';

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Box, Zap, Cpu, Settings, Activity, SignalHigh } from 'lucide-react';
import ZoomWrapper from '../ZoomWrapper';

export default function SimulationView() {
  const [simRunning, setSimRunning] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(84000);
  const [simSpeed, setSimSpeed] = useState(1);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '1.5rem', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Control Panel */}
      <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
          <Settings size={18} style={{ color: 'var(--text-highlight)' }} />
          <h4 style={{ margin: 0, fontSize: '1rem' }}>Engine Parameters</h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>EXPECTED ATTENDEES</label>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-teal)' }}>{(attendeeCount / 1000).toFixed(0)}K</span>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="132000" 
              step="1000" 
              value={attendeeCount} 
              onChange={(e) => setAttendeeCount(parseInt(e.target.value))} 
              style={{ width: '100%', accentColor: 'var(--accent-teal)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>10K</span>
              <span>132K (MAX CAP)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 500 }}>SOLVER FIDELITY</label>
            <select 
              value={simSpeed} 
              onChange={(e) => setSimSpeed(parseInt(e.target.value))}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid var(--border-glass)', outline: 'none', fontSize: '0.9rem', fontWeight: 500 }}
            >
              <option value={1}>1.0x Real-Time Analysis</option>
              <option value={2}>2.0x Predictive Stream</option>
              <option value={5}>5.0x Accelerated Stress</option>
              <option value={10}>10.0x Warp Stress Test</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button 
              className={simRunning ? 'btn btn-ghost' : 'btn btn-primary'} 
              style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.75rem', 
                padding: '1rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                background: simRunning ? 'rgba(0,0,0,0.05)' : 'var(--text-main)',
                color: simRunning ? 'var(--text-main)' : 'white'
              }}
              onClick={() => setSimRunning(!simRunning)}
            >
              {simRunning ? <><Pause size={18} /> PAUSE ENGINE</> : <><Play size={18} /> INITIALIZE SIM</>}
            </button>
            <button className="btn btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
              <RotateCcw size={16} /> RESET ENVIRONMENT
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div className={simRunning ? 'live-indicator' : ''} style={{ width: '8px', height: '8px', borderRadius: '50%', background: simRunning ? 'var(--accent-success)' : '#cbd5e1' }}></div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {simRunning ? 'SOLVER ACTIVE' : 'ENGINE STANDBY'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Location: Block G, Narendra Modi Stadium</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Compute: 1.2 TF Floating Point Ops</p>
        </div>
      </div>

      {/* Visual Simulation Display */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <ZoomWrapper title="Digital Twin Spatial Mesh">
          <div className="card glass-panel" style={{ height: '420px', position: 'relative', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            {/* Tech Grid Background */}
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              backgroundImage: 'radial-gradient(rgba(13, 148, 136, 0.1) 2px, transparent 0)',
              backgroundSize: '30px 30px',
              opacity: 0.5
            }}></div>

            {/* Neural Net Processing Effect */}
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 2
            }}>
              <div style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                border: '1px solid rgba(13, 148, 136, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  width: '100%', 
                  height: '100%', 
                  borderTop: '3px solid var(--accent-cyan)', 
                  borderRadius: '50%', 
                  animation: simRunning ? 'spin 2s linear infinite' : 'none' 
                }}></div>
                <Cpu size={48} style={{ color: 'var(--accent-cyan)', opacity: simRunning ? 1 : 0.5, transition: 'opacity 0.3s' }} />
              </div>
              <div style={{ marginTop: '1.5rem', fontFamily: 'var(--font-family-mono)', color: 'var(--accent-cyan)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
               {simRunning ? 'GENERATING SYNTHETIC FLOW VECTORS...' : 'KERNEL READY FOR INJECTION'}
              </div>
            </div>

            {/* In-View Status Badges */}
            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SignalHigh size={14} style={{ color: 'var(--accent-success)' }} />
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>MESH ACTIVE</span>
              </div>
            </div>
          </div>
        </ZoomWrapper>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(13, 148, 136, 0.08)', padding: '0.75rem', borderRadius: '12px' }}>
              <Box size={24} style={{ color: 'var(--accent-teal)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Dynamic Density</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{(attendeeCount / 500).toFixed(1)} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>p/m²</span></div>
            </div>
          </div>
          <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '0.75rem', borderRadius: '12px' }}>
              <Zap size={24} style={{ color: 'var(--accent-warning)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Energy Demand</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{((attendeeCount / 1000) * 5.2).toFixed(1)} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>kW</span></div>
            </div>
          </div>
          <div className="card glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: '12px' }}>
              <Activity size={24} style={{ color: 'var(--accent-success)' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Simulation Latency</div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>1.2 <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>ms/solve</span></div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
