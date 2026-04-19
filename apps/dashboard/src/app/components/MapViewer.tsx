'use client';

import React, { useMemo, useState } from 'react';
import { ZoomIn, ZoomOut, MapPin, ExternalLink } from 'lucide-react';

// Stable offsets for marker positions (oriented towards Narendra Modi Stadium layout)
const ZONE_OFFSETS = [
  { left: '42%', top: '35%', label: 'North Stand' },
  { left: '58%', top: '35%', label: 'South Stand' },
  { left: '42%', top: '65%', label: 'East Stand' },
  { left: '58%', top: '65%', label: 'West Stand' },
  { left: '50%', top: '50%', label: 'Main Ingress' },
];

interface MapViewerProps {
  densityData: any;
}

const MapViewer: React.FC<MapViewerProps> = ({ densityData }) => {
  const [zoom, setZoom] = useState(1);

  // Compute stable marker positions from zone data
  const markerPositions = useMemo(() => {
    if (!densityData?.zones) return [];
    return densityData.zones.map((zone: any, idx: number) => ({
      ...zone,
      left: ZONE_OFFSETS[idx % ZONE_OFFSETS.length].left,
      top: ZONE_OFFSETS[idx % ZONE_OFFSETS.length].top,
      displayLabel: ZONE_OFFSETS[idx % ZONE_OFFSETS.length].label
    }));
  }, [densityData?.zones]);

  const handleSmartRoute = () => {
    // Coordinates for Narendra Modi Stadium, Ahmedabad
    const lat = 23.0919;
    const lng = 72.5975;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0f172a', overflow: 'hidden' }}>
      
      {/* Zoomable Container */}
      <div style={{ 
        width: '100%', 
        height: '100%', 
        transform: `scale(${zoom})`, 
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Real Ground Image */}
        <div style={{ 
          position: 'absolute', 
          width: '90%', 
          height: '90%', 
          backgroundImage: 'url(/stadium.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: '50%',
          boxShadow: '0 0 50px rgba(0,0,0,0.5)',
          zIndex: 1
        }} />

        {/* Tactical Overlay Overlay */}
        <div style={{ 
          position: 'absolute', 
          width: '90%', 
          height: '90%', 
          border: '2px solid rgba(255,255,255,0.1)', 
          borderRadius: '50%',
          zIndex: 2
        }} />

        {/* Density Markers */}
        {markerPositions.map((zone: any) => (
          <div
            key={zone.id}
            style={{
              position: 'absolute',
              left: zone.left,
              top: zone.top,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              zIndex: 10
            }}
          >
            <div className="live-indicator" style={{ 
              background: zone.status === 'CRITICAL' ? 'var(--accent-danger)' : 
                         zone.status === 'WARNING' ? 'var(--accent-warning)' : 'var(--accent-cyan)',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              boxShadow: `0 0 15px ${zone.status === 'CRITICAL' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(13, 148, 136, 0.8)'}`,
              border: '2px solid white'
            }}></div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'white', 
              background: 'rgba(15, 23, 42, 0.8)', 
              backdropFilter: 'blur(4px)',
              padding: '4px 10px', 
              borderRadius: '6px', 
              whiteSpace: 'nowrap', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontWeight: 600
            }}>
              {zone.displayLabel}: {zone.density}%
            </div>
          </div>
        ))}
      </div>

      {/* Controls Overlay */}
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button 
          onClick={handleSmartRoute}
          className="glass-panel"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.75rem 1.25rem', 
            border: 'none', 
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-teal))',
            color: 'white',
            fontWeight: 600,
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 10px 20px rgba(13, 148, 136, 0.2)'
          }}
        >
          <MapPin size={16} />
          Get the Smart Route
          <ExternalLink size={14} style={{ opacity: 0.8 }} />
        </button>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: 'var(--radius-lg)' }}>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.15))} style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
            <ZoomOut size={18} />
          </button>
          <div style={{ width: '1px', height: '16px', background: 'var(--border-glass)' }}></div>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.15))} style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-main)' }}>
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      {/* Info Badge */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        background: 'white',
        padding: '0.6rem 1rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-glass)',
        boxShadow: 'var(--shadow-premium)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{ width: '8px', height: '8px', background: 'var(--accent-success)', borderRadius: '50%' }}></div>
        <div>
          <h5 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-main)' }}>Narendra Modi Stadium</h5>
          <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ahmedabad, India • Active Digital Twin</p>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
