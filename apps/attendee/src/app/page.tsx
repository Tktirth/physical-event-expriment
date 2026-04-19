'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { HomeIcon, MapIcon, RouteIcon, ZapIcon, ClockIcon, CoffeeIcon, UserIcon } from './components/Icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-613466328958.us-central1.run.app';

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
  const [activeTab, setActiveTab] = useState('home');
  const [target, setTarget] = useState('N4');
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [venueState, setVenueState] = useState<VenueState | null>(null);
  const [connected, setConnected] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [weather, setWeather] = useState({ temp: '32°C', icon: '☀️' });

  // Real-time IST Clock
  useEffect(() => {
    const updateTime = () => {
      const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
      setCurrentTime(istTime);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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
      setTimeout(() => {
        setShowRoute(true);
        const destinationMapping: Record<string, string> = {
          'N4': 'Narendra Modi Stadium Pavilion Block C',
          'N2': 'Narendra Modi Stadium Reliance Concourse',
          'N3': 'Narendra Modi Stadium Gate 1'
        };
        const destStr = destinationMapping[target] || 'Stadium';
        const gmUrl = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(destStr)}&travelmode=walking`;
        window.open(gmUrl, '_blank');
      }, 1200);
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

  return (
    <div className="mobile-container">
      {/* Dynamic Header */}
      <header style={{ padding: '1.5rem 1rem 0.5rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Image src="/images/omniflow_logo.png" alt="Logo" width={110} height={40} style={{ objectFit: 'contain' }} />
        </div>
        <div className="live-badge">
          <div className="live-dot" />
          Ahmedabad
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <div className="animate-enter">
            {/* Live Match Ticker */}
            <div className="glass-card" style={{ background: 'linear-gradient(135deg, #000 0%, #222 100%)', color: 'white', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Live Match • 2nd Innings</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--accent-cyan)' }}>{currentTime} IST</span>
                    <span>{weather.temp} {weather.icon}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>IND</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>INDIA</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>184/3</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--accent-teal)' }}>Req. 7.2 RPO</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>PAK</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>PAKISTAN</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Hub */}
            <div style={{ padding: '0.5rem 1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Your Smart Hub</h3>
            </div>
            <div className="hub-grid">
              <div className="hub-tile" onClick={() => setActiveTab('map')}>
                <div className="icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}>
                  <MapIcon size={20} />
                </div>
                <div className="title">Stadium Map</div>
                <div className="status">Interactive View</div>
              </div>
              <div className="hub-tile" onClick={() => setActiveTab('route')}>
                <div className="icon" style={{ background: 'rgba(6, 214, 160, 0.1)', color: 'var(--accent-teal)' }}>
                  <RouteIcon size={20} />
                </div>
                <div className="title">Smart Route</div>
                <div className="status">Avoid Crowds</div>
              </div>
            </div>

            {/* Venue Wait Times */}
            <div className="glass-card" style={{ marginTop: '1.25rem' }}>
              <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ClockIcon size={18} color="var(--accent-warning)" /> Live Wait Times
              </h4>
              {venueState ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px' }}>ENTRY GATES</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{Math.floor(venueState.global_metrics.avg_wait_times.entry / 60)} <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>min</span></div>
                  </div>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px' }}>RESTROOMS</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: venueState.global_metrics.avg_wait_times.restrooms > 10 ? 'var(--accent-danger)' : 'inherit' }}>{venueState.global_metrics.avg_wait_times.restrooms} <span style={{ fontSize: '0.7rem', fontWeight: 400 }}>min</span></div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>Refreshing venue data...</div>
              )}
            </div>
            
            {/* Context Awareness */}
            <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(0, 242, 255, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ZapIcon color="var(--accent-cyan)" size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>Crowd Pulse Alert</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Concourse A is experiencing high density. Use <strong>Entrance B</strong> for 50% faster entry to Block C.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="animate-enter" style={{ padding: '1rem' }}>
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden', height: '65vh', position: 'relative' }}>
              <Image 
                src="/images/stadium.png" 
                alt="Stadium Map" 
                fill 
                style={{ objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', zIndex: 10 }}>
                <div className="glass-card" style={{ margin: 0, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>YOUR LOCATION</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Pavilion Block C</div>
                  </div>
                  <div style={{ color: 'var(--accent-teal)', fontSize: '0.7rem', fontWeight: 700 }}>● 0.8m Accuracy</div>
                </div>
              </div>
              
              {/* Dynamic Hotspots */}
              <div style={{ position: 'absolute', top: '40%', left: '30%', width: '20px', height: '20px', background: 'var(--accent-cyan)', borderRadius: '50%', boxShadow: '0 0 20px var(--accent-cyan)', border: '3px solid white' }} />
              <div style={{ position: 'absolute', top: '60%', left: '70%', background: 'white', padding: '4px 8px', borderRadius: '20px', fontSize: '0.6rem', fontWeight: 800, border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>BUSY</div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Explore Venues</h3>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                    {['Restrooms', 'Food', 'Exit', 'Medic'].map((tag) => (
                        <div key={tag} style={{ padding: '8px 16px', background: 'white', borderRadius: '20px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{tag}</div>
                    ))}
                </div>
            </div>
          </div>
        )}

        {activeTab === 'route' && (
          <div className="animate-enter" style={{ padding: '1rem' }}>
            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem' }}>Get Smart Route</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                AI calculates the fastest path by analyzing 100,000+ real-time attendee pings.
              </p>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>DESTINATION</label>
                <select 
                  value={target} 
                  onChange={(e) => { setTarget(e.target.value); setRoute(null); setShowRoute(false); }}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: '#f8fafc', fontSize: '0.95rem', fontWeight: 600 }}
                >
                  <option value="N4">Your Seat (Block C)</option>
                  <option value="N2">Reliance Concourse</option>
                  <option value="N3">Exit Gate 1</option>
                </select>
              </div>

              <button className="btn-primary" onClick={getSmartRoute} disabled={loading}>
                {loading ? 'CALCULATING...' : 'NAVIGATE NOW'}
              </button>
            </div>

            {route && showRoute && (
              <div className="glass-card animate-enter" style={{ marginTop: '1rem', borderLeft: '4px solid var(--accent-teal)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--text-main)' }}>Step-by-Step Guidance</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', fontWeight: 700 }}>~4 min saved</span>
                </div>
                
                {route.optimalRoute.map((step: RouteStep, idx: number) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', position: 'relative' }}>
                    <div style={{ width: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: '10px', height: '10px', background: idx === 0 ? 'var(--accent-cyan)' : 'var(--text-muted)', borderRadius: '50%', zIndex: 2 }} />
                        {idx < route.optimalRoute.length - 1 && <div style={{ width: '2px', flex: 1, background: '#eee', margin: '4px 0' }} />}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{step.zone.replace('ZN-', '').replace(/-/g, ' ')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {idx === 0 ? 'Current Location' : idx === route.optimalRoute.length - 1 ? 'Destination Reached' : 'Follow the corridor path'}
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="bottom-nav">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <div className="icon-box"><HomeIcon size={22} /></div>
          <span>Home</span>
        </div>
        <div className={`nav-item ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
          <div className="icon-box"><MapIcon size={22} /></div>
          <span>Map</span>
        </div>
        <div className={`nav-item ${activeTab === 'route' ? 'active' : ''}`} onClick={() => setActiveTab('route')}>
          <div className="icon-box"><RouteIcon size={22} /></div>
          <span>Route</span>
        </div>
        <div className="nav-item">
          <div className="icon-box"><UserIcon size={22} /></div>
          <span>Profile</span>
        </div>
      </nav>
    </div>
  );
}
