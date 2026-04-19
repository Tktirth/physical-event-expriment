'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ThroughputChart, ZoneDensityChart } from './components/StatsCharts';

// Dynamically import MapViewer to avoid SSR issues with Mapbox
const MapViewer = dynamic(() => import('./components/MapViewer'), { 
  ssr: false,
  loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Initializing 3D Mesh...</div>
});

export default function DashboardHome() {
  const [venueState, setVenueState] = useState<any>(null);
  const [throughputHistory, setThroughputHistory] = useState<any[]>([]);
  const [isLive, setIsLive] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  // Poll for real-time venue state from our microservices
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching through our consolidated API Gateway
        const res = await fetch(`${API_URL}/api/v1/venue/state`);
        const data = await res.json();
        setVenueState(data);
        setIsLive(true);

        // Update throughput history for the chart
        setThroughputHistory(prev => {
          const newPoint = { 
            time: new Date().toLocaleTimeString(), 
            pings: data.global_metrics.pings_per_sec 
          };
          const next = [...prev, newPoint];
          return next.slice(-20); // Keep last 20 points
        });

      } catch (err) {
        console.error("Failed to fetch live data", err);
        setIsLive(false);
      }
    };

    const interval = setInterval(fetchData, 2000); // 2 second polling (principal level latency)
    fetchData();

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient">Real-Time Operational Intelligence</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {venueState?.event || 'Stadium Overview'} - Match Day Alpha v1.0
          <span style={{ marginLeft: '1rem', color: isLive ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
            ● {isLive ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </p>
      </div>

      <div className="grid-map-panel">
        {/* Main Map Area */}
        <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Digital Twin - Spatial Heatmap</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-family-mono)' }}>
              LNG: {venueState?.zones?.[0]?.density || 0}% | LAT: {isLive ? 'ACTIVE' : 'IDLE'}
            </div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <MapViewer densityData={venueState} />
          </div>
        </div>

        {/* Side Metrics Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card glass-panel">
            <h4 style={{ color: 'var(--accent-warning)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Active Chokepoints</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {venueState?.zones?.map((zone: any) => (
                <div key={zone.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{zone.name}</span>
                    <span style={{ 
                      color: zone.status === 'CRITICAL' ? 'var(--accent-danger)' : 
                             zone.status === 'WARNING' ? 'var(--accent-warning)' : 'var(--accent-success)', 
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}>{zone.density}% Density</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${zone.density}%`, 
                      height: '100%', 
                      background: zone.status === 'CRITICAL' ? 'var(--accent-danger)' : 
                                  zone.status === 'WARNING' ? 'var(--accent-warning)' : 'var(--accent-cyan)',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: '1.5rem', borderColor: 'var(--accent-warning)', color: 'var(--accent-warning)' }}>View Details</button>
          </div>

          <div className="card glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ color: 'var(--accent-cyan)', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Ingestion Matrix</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Location Pings</span>
                <span style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--text-highlight)' }}>
                  {venueState?.global_metrics?.pings_per_sec?.toLocaleString() || '0'}/sec
                </span>
              </div>
              
              <ThroughputChart data={throughputHistory} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Zone Balance</span>
                <span style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--accent-success)' }}>{venueState?.global_metrics?.avg_wait_times?.entry}ms Lag</span>
              </div>
              
              <ZoneDensityChart data={venueState?.zones || []} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
