'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { LayoutDashboard, Users, BrainCircuit, Binary, Activity, LogOut, Settings as SettingsIcon, X } from 'lucide-react';

const navItems = [
  { id: 'map', label: 'Live Map', icon: LayoutDashboard },
  { id: 'demographics', label: 'Crowd Demographics', icon: Users },
  { id: 'queue', label: 'Queue Intelligence', icon: BrainCircuit },
  { id: 'sim', label: 'Digital Twin Sim', icon: Binary },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'map';

  return (
    <aside className={`dashboard-sidebar glass-panel ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="brand" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {setIsMobileOpen && (
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="mobile-close-btn"
            style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        )}
        <Image 
          src="/images/logo-light.png" 
          alt="OmniFlow Logo" 
          width={160} 
          height={160} 
          style={{ objectFit: 'contain' }}
          priority 
        />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.1em', marginTop: '-10px' }}>COMMAND CENTER</span>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.id}
              href={`?view=${item.id}`} 
              className={isActive ? 'glass-panel active-nav-item' : 'nav-item'}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 1rem', 
                textDecoration: 'none', 
                color: isActive ? 'var(--text-highlight)' : 'var(--text-main)', 
                borderColor: isActive ? 'var(--accent-cyan)' : 'transparent',
                opacity: isActive ? 1 : 0.7,
                borderRadius: 'var(--radius-sm)',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} />
              <span style={{ fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link 
            href="?view=settings" 
            className={currentView === 'settings' ? 'glass-panel active-nav-item' : 'nav-item'}
            style={{ 
              background: 'none', 
              border: currentView === 'settings' ? '1px solid var(--accent-cyan)' : 'none', 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.8rem 1rem', 
              cursor: 'pointer', 
              color: currentView === 'settings' ? 'var(--text-highlight)' : 'var(--text-main)', 
              opacity: currentView === 'settings' ? 1 : 0.7,
              textDecoration: 'none',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s ease'
            }}
          >
            <SettingsIcon size={18} />
            <span>Settings</span>
          </Link>
          <button className="nav-item" style={{ background: 'none', border: 'none', width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem', cursor: 'pointer', color: '#ef4444', opacity: 0.8 }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
            <Activity size={14} style={{ color: 'var(--accent-success)' }} />
            <h4 style={{ color: 'var(--accent-success)', margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>System Status</h4>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
             <div className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
             <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>Real-time Link Active</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-item:hover {
          background: rgba(13, 148, 136, 0.05) !important;
          opacity: 1 !important;
        }
        .active-nav-item {
          background: rgba(13, 148, 136, 0.08) !important;
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1) !important;
        }
        .mobile-close-btn {
          display: none;
        }
        .pulse-dot {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        @media (max-width: 1024px) {
          .mobile-close-btn {
            display: block;
          }
        }
      `}</style>
    </aside>
  );
}
