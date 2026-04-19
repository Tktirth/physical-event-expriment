'use client';

import React, { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RouteStep {
  id: string;
  zone: string;
}

interface RouteData {
  event: string;
  optimalRoute: RouteStep[];
  metadata: {
    avoidsCongestion: boolean;
    latency_ms: string;
  };
}

interface ZoneData {
  id: string;
  name: string;
  density: number;
  status: string;
}

interface VenueState {
  event: string;
  zones: ZoneData[];
  global_metrics: {
    active_attendees: number;
    pings_per_sec: number;
    avg_wait_times: {
      restrooms: number;
      merch: number;
      entry: number;
    };
  };
}

export default function AttendeeHome() {
  const [target, setTarget] = useState('N4');
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [venueState, setVenueState] = useState<VenueState | null>(null);
  const [connected, setConnected] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  // Fetch live venue state
  useEffect(() => {
    const fetchVenueState = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/venue/state`);
        const data = await res.json();
        setVenueState(data);
        setConnected(true);
      } catch {
        setConnected(false);
      }
    };

    fetchVenueState();
    const interval = setInterval(fetchVenueState, 4000);
    return () => clearInterval(interval);
  }, []);

  const getSmartRoute = useCallback(async () => {
    setLoading(true);
    setShowRoute(false);
    try {
      const res = await fetch(`${API_URL}/api/v1/routing?startNode=N1&destNode=${target}`);
      const data = await res.json();
      setRoute(data);
      // Slight delay for animation
      setTimeout(() => setShowRoute(true), 100);
    } catch (err) {
      console.error("Routing error", err);
    } finally {
      setLoading(false);
    }
  }, [target]);

  const getZoneColor = (status: string) => {
    switch (status) {
      case 'CRITICAL': return 'var(--accent-danger)';
      case 'WARNING': return 'var(--accent-warning)';
      default: return 'var(--accent-teal)';
    }
  };

  const getQueueStatus = (val: number) => {
    if (val > 15) return 'critical';
    if (val > 8) return 'warning';
    return 'normal';
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-brand-icon">OF</div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>OmniFlow</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Navigator</div>
          </div>
        </div>
        <div className={`header-badge ${connected ? 'live' : ''}`}>
          {connected ? '● LIVE' : '○ OFFLINE'}
        </div>
      </header>

      <main style={{ flex: 1, paddingBottom: '1rem' }}>
        {/* Event Banner */}
        {venueState && (
          <div className="nav-card" style={{ borderBottom: '2px solid rgba(0, 242, 255, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Now Playing</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{venueState.event}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)', fontVariantNumeric: 'tabular-nums' }}>
                  {(venueState.global_metrics.active_attendees / 1000).toFixed(0)}K
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>IN VENUE</div>
              </div>
            </div>
          </div>
        )}

        {/* Smart Routing Card */}
        <div className="nav-card">
          <h3>Where to?</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
            AI-powered routing avoids congested corridors automatically.
          </p>
          
          <div className="select-container">
            <select 
              value={target} 
              onChange={(e) => { setTarget(e.target.value); setRoute(null); setShowRoute(false); }}
              className="select-input"
            >
              <option value="N4">Your Assigned Seat (SEC 112)</option>
              <option value="N2">Food Court A (Concourse)</option>
              <option value="N3">Food Court B (Lower Level)</option>
            </select>
          </div>

          <button className="btn-route" onClick={getSmartRoute} disabled={loading}>
            {loading ? (
              <><span className="spinner"></span> CALCULATING OPTIMAL FLOW...</>
            ) : (
              'GET SMART ROUTE →'
            )}
          </button>
        </div>

        {/* Route Result */}
        {route && showRoute && (
          <div className="nav-card route-result">
            <h4>Optimal Path</h4>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {route.optimalRoute.length} waypoints · {route.event}
            </div>
            
            {route.optimalRoute.map((step: RouteStep, idx: number) => (
              <div key={idx} className="step">
                <div className="step-indicator"></div>
                {idx < route.optimalRoute.length - 1 && <div className="step-line"></div>}
                <div className="step-content">
                  <h5>{step.zone.replace('ZN-', '').replace(/-/g, ' ')}</h5>
                  <p>
                    {idx === 0 ? 'Start — You are here' : 
                     idx === route.optimalRoute.length - 1 ? '✓ Destination' : 
                     'Continue through corridor'}
                  </p>
                </div>
              </div>
            ))}

            {route.metadata.avoidsCongestion && (
              <div className="congestion-alert">
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <span>Rerouted! Saved ~4 min by avoiding Concourse A congestion.</span>
              </div>
            )}
          </div>
        )}

        {/* Live Queue Times */}
        {venueState && (
          <div className="nav-card">
            <h4 style={{ color: 'var(--accent-warning)' }}>Live Wait Times</h4>
            <div className="queue-grid">
              <div className={`queue-item ${getQueueStatus(venueState.global_metrics.avg_wait_times.restrooms)}`}>
                <div className="label">Restrooms</div>
                <div className="value">
                  {venueState.global_metrics.avg_wait_times.restrooms}
                  <span className="unit"> min</span>
                </div>
              </div>
              <div className={`queue-item ${getQueueStatus(venueState.global_metrics.avg_wait_times.merch)}`}>
                <div className="label">Merchandise</div>
                <div className="value">
                  {venueState.global_metrics.avg_wait_times.merch}
                  <span className="unit"> min</span>
                </div>
              </div>
              <div className={`queue-item ${getQueueStatus(Math.floor(venueState.global_metrics.avg_wait_times.entry / 60))}`}>
                <div className="label">Entry Gates</div>
                <div className="value">
                  {Math.floor(venueState.global_metrics.avg_wait_times.entry / 60)}
                  <span className="unit"> min</span>
                </div>
              </div>
              <div className="queue-item normal">
                <div className="label">Data Rate</div>
                <div className="value" style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>
                  {(venueState.global_metrics.pings_per_sec / 1000).toFixed(1)}K
                  <span className="unit"> /sec</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Zone Density */}
        {venueState && venueState.zones && (
          <div className="nav-card">
            <h4 style={{ color: 'var(--accent-purple, #a78bfa)' }}>Zone Density</h4>
            <div className="zone-bar-container">
              {venueState.zones.map((zone: ZoneData) => (
                <div key={zone.id} className="zone-bar">
                  <span className="name">{zone.name}</span>
                  <div className="track">
                    <div 
                      className="fill" 
                      style={{ 
                        width: `${Math.min(zone.density, 100)}%`,
                        background: getZoneColor(zone.status)
                      }}
                    ></div>
                  </div>
                  <span className="pct" style={{ color: getZoneColor(zone.status) }}>{zone.density}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spatial Mesh Visual */}
        <div className="nav-card">
          <div className="map-visual">
            <div className="ring"></div>
            <div className="dot"></div>
            <div style={{ marginTop: '1rem', zIndex: 2, position: 'relative', letterSpacing: '0.1em', fontWeight: 500 }}>
              SPATIAL MESH ACTIVE
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Trilateration accuracy: 0.8m</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-teal)' }}>● Tracking</span>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        OmniFlow v2.0 · Powered by Real-Time Intelligence
      </footer>
    </div>
  );
}
