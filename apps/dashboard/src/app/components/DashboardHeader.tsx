'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CloudSun, MapPin, Activity, Zap } from 'lucide-react';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Precise IST Clock Ticker
    const ticker = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 2. Live Weather Sync (Ahmedabad)
    const fetchWeather = async () => {
      try {
        // wttr.in is reliable and doesn't require a private key for this scale
        const res = await fetch('https://wttr.in/Ahmedabad?format=j1');
        const data = await res.json();
        const current = data.current_condition[0];
        setWeather({
          temp: current.temp_C,
          condition: current.weatherDesc[0].value,
          humidity: current.humidity,
          wind: current.windspeedKmph
        });
        setLoading(false);
      } catch (err) {
        console.error("Weather sync failed:", err);
        // Fallback to high-fidelity Ahmedabad average if API fails
        setWeather({ temp: '34', condition: 'Clear', humidity: '45', wind: '12' });
        setLoading(false);
      }
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 300000); // 5 min sync

    return () => {
      clearInterval(ticker);
      clearInterval(weatherInterval);
    };
  }, []);

  const formatIST = (date: Date) => {
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <header className="glass-panel" style={{ 
      margin: '0 0 1.5rem 0', 
      padding: '1.25rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      borderBottom: '2px solid rgba(13, 148, 136, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.95)',
      boxShadow: '0 4px 20px -5px rgba(0,0,0,0.1)'
    }}>
      {/* Background Pulse Decor */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-10%',
        width: '40%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={onMenuClick}
          style={{
            background: 'rgba(13, 148, 136, 0.1)',
            border: '1px solid rgba(13, 148, 136, 0.2)',
            color: 'var(--accent-teal)',
            padding: '10px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(13, 148, 136, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(13, 148, 136, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Activity size={20} />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div className="status-badge" style={{ background: 'rgba(0, 255, 255, 0.1)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px' }}>
              LIVE SIMULATION
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} /> Narendra Modi Stadium, Ahmedabad
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Operational <span className="text-gradient">Intelligence</span>
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
        {/* Real-Time Clock */}
        <div style={{ textAlign: 'right', minWidth: '180px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-teal)', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
            <Clock size={18} className="animate-pulse" />
            <span style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              {formatIST(time).toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' }}>
            {formatDate(time)} • IST
          </div>
        </div>

        {/* Live Weather */}
        <div style={{ 
          borderLeft: '1px solid var(--border-glass)', 
          paddingLeft: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--accent-warning)'
          }}>
            <CloudSun size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {loading ? '--' : weather?.temp}°C
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: 500 }}>
                {loading ? '' : weather?.condition}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
              <span>H: {loading ? '--' : weather?.humidity}%</span>
              <span>W: {loading ? '--' : weather?.wind}km/h</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
