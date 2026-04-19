'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { Suspense } from 'react';

export default function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Suspense fallback={<div className="dashboard-sidebar glass-panel" style={{ width: '280px' }}>Loading Nav...</div>}>
        <Sidebar isMobileOpen={isSidebarOpen} setIsMobileOpen={setIsSidebarOpen} />
      </Suspense>

      <main className="dashboard-main">
        <Suspense fallback={<header className="dashboard-header glass-panel" style={{ height: '70px', borderRadius: 0 }} />}>
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        </Suspense>

        <section className="dashboard-content">
          {children}
          {/* Overlay for mobile when sidebar is open */}
          <div 
            className={`mobile-overlay ${isSidebarOpen ? 'active' : ''}`} 
            onClick={() => setIsSidebarOpen(false)}
          />
        </section>
      </main>

      <style jsx>{`
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }
        @media (min-width: 1024px) {
          .mobile-overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
