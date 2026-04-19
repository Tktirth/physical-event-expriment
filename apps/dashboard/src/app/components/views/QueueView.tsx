'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import ZoomWrapper from '../ZoomWrapper';
import { Clock, TrendingDown, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

const waitTimePredictions = [
  { time: '14:00', actual: 12, predicted: 12 },
  { time: '15:00', actual: 18, predicted: 17 },
  { time: '16:00', actual: 28, predicted: 26 },
  { time: '17:00', actual: 35, predicted: 32 },
  { time: '18:00', actual: null, predicted: 42 },
  { time: '19:00', actual: null, predicted: 38 },
  { time: '20:00', actual: null, predicted: 25 },
];

const gatePerformance = [
  { name: 'Gate A (North)', throughput: 2800, wait: 28 },
  { name: 'Gate B (South)', throughput: 3100, wait: 12 },
  { name: 'Gate C (East)', throughput: 4200, wait: 45 },
  { name: 'Club Entry (Main)', throughput: 800, wait: 4 },
];

export default function QueueView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ background: 'rgba(13, 148, 136, 0.08)', padding: '0.85rem', borderRadius: '12px' }}>
            <Clock size={24} style={{ color: 'var(--accent-teal)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Peak Wait Time Est.</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>42.5 min</div>
          </div>
        </div>
        
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', borderLeft: '4px solid var(--accent-success)' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.85rem', borderRadius: '12px' }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-success)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Clearance</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>99.2%</div>
          </div>
        </div>

        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', borderLeft: '4px solid var(--accent-danger)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.85rem', borderRadius: '12px' }}>
            <AlertTriangle size={24} style={{ color: 'var(--accent-danger)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Critical Congestion</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Gate C</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1.5rem' }}>
        <ZoomWrapper title="Crowd Velocity Forecasting">
          <div className="card glass-panel" style={{ height: '420px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-highlight)', fontWeight: 600 }}>Forecasting wait times for Kickoff entry</h4>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waitTimePredictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.06)' }}
                  />
                  <Line type="monotone" dataKey="actual" stroke="var(--accent-cyan)" strokeWidth={4} dot={{ r: 6, fill: 'white', stroke: 'var(--accent-cyan)', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="predicted" stroke="var(--text-muted)" strokeDasharray="6 4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></div>
                 <span>Real-time Telemetry</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ width: '12px', height: '12px', borderRadius: '2px', border: '1px dashed var(--text-muted)' }}></div>
                 <span>OmniFlow Predicitve Mesh</span>
               </div>
            </div>
          </div>
        </ZoomWrapper>

        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-highlight)' }}>Inflow Intelligence</h4>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {gatePerformance.map((gp) => (
              <div key={gp.name} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{gp.name}</span>
                  <span style={{ 
                    color: gp.wait > 30 ? 'var(--accent-danger)' : gp.wait > 15 ? 'var(--accent-warning)' : 'var(--accent-success)', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: gp.wait > 30 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                    padding: '2px 8px',
                    borderRadius: '20px'
                  }}>{gp.wait} min wait</span>
                </div>
                <div style={{ height: '8px', width: '100%', background: 'rgba(0,0,0,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${Math.min(100, (gp.throughput / 5000) * 100)}%`, 
                    height: '100%', 
                    background: gp.wait > 30 ? 'var(--accent-danger)' : 'var(--accent-cyan)',
                    transition: 'width 1s ease-in-out'
                  }}></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Throughput: {gp.throughput} / hr</span>
                  <span>Max Capacity: 5.0k</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #0d94880a, #0f766e0a)', border: '1px solid var(--accent-cyan)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'var(--accent-cyan)', padding: '0.75rem', borderRadius: '50%', color: 'white' }}>
            <Zap size={20} fill="white" />
          </div>
          <div style={{ flex: 1 }}>
            <h5 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem', fontWeight: 700 }}>Intelligent Rerouting Recommendation</h5>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Critical congestion at <strong>Gate C (East)</strong>. AI predicts 15min rise in wait time. 
              Deploy nudge to divert traffic from <strong>East Concourse</strong> to <strong>Gate B (South)</strong>.
            </p>
          </div>
          <button className="btn btn-primary" style={{ background: 'var(--text-main)', border: 'none', color: 'white', padding: '0.75rem 1.5rem' }}>Execute Reroute</button>
        </div>
      </div>
    </div>
  );
}
