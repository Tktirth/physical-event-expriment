'use client';

import React, { useState } from 'react';
import { 
  Shield, 
  Cpu, 
  Network, 
  Users, 
  Bell, 
  Map as MapIcon, 
  Database, 
  Cloud, 
  Lock,
  ChevronRight,
  Save,
  RefreshCcw,
  Zap,
  BrainCircuit
} from 'lucide-react';

export default function SettingsView() {
  const [activeTab, setActiveTab] = useState('system');

  const tabs = [
    { id: 'system', label: 'System Backbone', icon: Cpu },
    { id: 'venue', label: 'Venue Logic', icon: MapIcon },
    { id: 'ai', label: 'AI Intelligence', icon: BrainCircuit },
    { id: 'security', label: 'Security & Access', icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'system':
        return (
          <div style={{ animation: 'fade-in 0.3s ease-out' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Infrastructure Integrity</h3>
            <div className="settings-grid">
              <div className="card glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Cloud size={20} style={{ color: 'var(--accent-cyan)' }} />
                    <span style={{ fontWeight: 600 }}>API Gateway Mesh</span>
                  </div>
                  <span className="badge badge-success">STABLE</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Primary entry point via Google Cloud Run (us-central1). Managed traffic distribution across 3 microservices.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>View Logs</button>
                  <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }}><RefreshCcw size={12} /> Sync</button>
                </div>
              </div>

              <div className="card glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Database size={20} style={{ color: 'var(--accent-teal)' }} />
                    <span style={{ fontWeight: 600 }}>State Persistence</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-success)' }}>12ms Latency</div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Real-time synchronization for Narendra Modi Stadium spatial datasets. Peak load handled: 132k nodes.
                </p>
                <div className="toggle-switch-container">
                  <span style={{ fontSize: '0.85rem' }}>Auto-Archive Inactive Data</span>
                  <div className="switch active"></div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'venue':
        return (
          <div style={{ animation: 'fade-in 0.3s ease-out' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Operational Parameters</h3>
            <div className="card glass-panel" style={{ padding: '2rem', maxWidth: '600px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>GLOBAL CAPACITY LIMIT</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="range" style={{ flex: 1, accentColor: 'var(--accent-cyan)' }} defaultValue={132000} max={150000} />
                    <span style={{ fontWeight: 700, minWidth: '80px' }}>132,000</span>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>CROWD DENSITY THRESHOLD (RED-ALERT)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <input type="range" style={{ flex: 1, accentColor: 'var(--accent-danger)' }} defaultValue={85} />
                    <span style={{ fontWeight: 700, minWidth: '80px' }}>85%</span>
                  </div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-glass)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Gate 1 Priority Induction</span>
                  <div className="switch"></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Smart Route Propagation</span>
                  <div className="switch active"></div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <BrainCircuit size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>Configuring environment modules...</p>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', minHeight: '600px' }}>
      {/* Sidebar for Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderRight: '1px solid var(--border-glass)', paddingRight: '1rem' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 1rem',
                background: isActive ? 'var(--accent-cyan)' : 'transparent',
                color: isActive ? 'white' : 'var(--text-main)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 400
              }}
            >
              <Icon size={18} />
              {tab.label}
              {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          {renderContent()}
        </div>

        <div style={{ marginTop: '2rem', padding: '1.5rem', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-ghost">Reset Defaults</button>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem' }}>
            <Save size={16} />
            Commit Changes
          </button>
        </div>
      </div>

      <style jsx>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .toggle-switch-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border-glass);
        }
        .switch {
          width: 36px;
          height: 18px;
          background: #e2e8f0;
          border-radius: 9px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }
        .switch::after {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
          background: white;
          border-radius: 50%;
          top: 2px;
          left: 2px;
          transition: transform 0.3s;
        }
        .switch.active {
          background: var(--accent-success);
        }
        .switch.active::after {
          transform: translateX(18px);
        }
        .badge {
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .badge-success {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent-success);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
