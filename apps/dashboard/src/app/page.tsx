'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { ThroughputChart, ZoneDensityChart } from './components/StatsCharts';
import ZoomWrapper from './components/ZoomWrapper';

// Views
import DemographicsView from './components/views/DemographicsView';
import QueueView from './components/views/QueueView';
import SimulationView from './components/views/SimulationView';
import SettingsView from './components/views/SettingsView';
import DashboardHeader from './components/DashboardHeader';

// Dynamically import MapViewer correctly
const MapViewer = dynamic(() => import('./components/MapViewer'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Initializing 3D Mesh...</div>
});

function LiveMapView({ venueState, isLive, throughputHistory }: any) {
  return (
    <>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Main Ground View - Top */}
      <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', height: '600px' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Digital Twin - Narendra Modi Stadium</h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-family-mono)' }}>
            STATUS: {isLive ? 'CONNECTED' : 'OFFLINE'} | SECTORS: {venueState?.zones?.length || 0}
          </div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#0f172a' }}>
          <MapViewer densityData={venueState} />
        </div>
      </div>

      {/* Metrics Row - Below Ground */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <ZoomWrapper title="Active Chokepoints">
          <div className="card glass-panel" style={{ height: '320px' }}>
            <h4 style={{ color: 'var(--accent-warning)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Active Chokepoints</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '220px' }}>
              {venueState?.zones?.map((zone: any) => (
                <div key={zone.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{zone.name}</span>
                    <span style={{ color: zone.status === 'CRITICAL' ? 'var(--accent-danger)' : 'var(--accent-success)', fontWeight: 600, fontSize: '0.8rem' }}>{zone.density}%</span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.05)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${zone.density}%`, height: '100%', background: zone.status === 'CRITICAL' ? 'var(--accent-danger)' : 'var(--accent-cyan)', transition: 'width 1s ease' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ZoomWrapper>

        <ZoomWrapper title="Ingestion Matrix">
          <div className="card glass-panel" style={{ height: '320px' }}>
            <h4 style={{ color: 'var(--accent-cyan)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Ingestion Matrix</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Location Pings</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{venueState?.global_metrics?.pings_per_sec?.toLocaleString() || '0'} p/s</span>
            </div>
            <ThroughputChart data={throughputHistory} />
          </div>
        </ZoomWrapper>

        <ZoomWrapper title="Zone Balance">
          <div className="card glass-panel" style={{ height: '320px' }}>
            <h4 style={{ color: 'var(--accent-teal)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Zone Balance</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Average Wait</span>
              <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>{venueState?.global_metrics?.avg_wait_times?.entry}ms</span>
            </div>
            <ZoneDensityChart data={venueState?.zones || []} />
          </div>
        </ZoomWrapper>
      </div>
    </div>
    </>
  );
}

export function DashboardHome() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'map';

  const [venueState, setVenueState] = useState<any>(null);
  const [throughputHistory, setThroughputHistory] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-bqcgo2zaia-uc.a.run.app';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/venue/state`);
        const data = await res.json();
        setVenueState(data);
        setIsLive(true);
        setThroughputHistory(prev => [...prev, { time: new Date().toLocaleTimeString(), pings: data.global_metrics.pings_per_sec }].slice(-20));
      } catch (err) {
        console.error(err);
        setIsLive(false);
      }
    };
    const interval = setInterval(fetchData, 2000);
    fetchData();
    return () => clearInterval(interval);
  }, [API_URL]);

  const renderView = () => {
    switch (currentView) {
      case 'demographics': return <DemographicsView />;
      case 'queue': return <QueueView />;
      case 'sim': return <SimulationView />;
      case 'settings': return <SettingsView />;
      case 'map':
      default: return <LiveMapView venueState={venueState} isLive={isLive} throughputHistory={throughputHistory} />;
    }
  };

  return (
    <div style={{ animation: 'fade-in 0.5s ease-out' }}>
      {renderView()}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function Page() {
  return (
    <React.Suspense fallback={<div>Loading Platform Modules...</div>}>
      <DashboardHome />
    </React.Suspense>
  )
}
