'use client';

import React, { useState, useEffect } from 'react';
import Map, { Source, Layer, NavigationControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Using environment variable for security
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapViewerProps {
  densityData: any;
}

const MapViewer: React.FC<MapViewerProps> = ({ densityData }) => {
  const [viewState, setViewState] = useState({
    longitude: -0.1278, // Centered near a stadium (e.g., Wembley area)
    latitude: 51.5560,
    zoom: 15.5,
    pitch: 45,
    bearing: -20
  });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        antialias={true}
      >
        <NavigationControl position="top-right" />
        
        {/* 3D Buildings Layer */}
        <Layer
          id="3d-buildings"
          source="composite"
          source-layer="building"
          filter={['==', 'extrude', 'true']}
          type="fill-extrusion"
          minzoom={15}
          paint={{
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }}
        />

        {/* Mock Density Markers */}
        {densityData && densityData.zones && densityData.zones.map((zone: any) => (
          <Marker 
            key={zone.id}
            longitude={viewState.longitude + (Math.random() - 0.5) * 0.01}
            latitude={viewState.latitude + (Math.random() - 0.5) * 0.01}
            anchor="bottom"
          >
            <div className="live-indicator" style={{ 
              background: zone.status === 'CRITICAL' ? 'var(--accent-danger)' : 
                         zone.status === 'WARNING' ? 'var(--accent-warning)' : 'var(--accent-cyan)',
              width: '15px',
              height: '15px'
            }}></div>
          </Marker>
        ))}
        
        {/* Overlay Label */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          background: 'rgba(0,0,0,0.8)',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-glass)',
          pointerEvents: 'none',
          fontSize: '0.8rem',
          color: 'var(--text-highlight)'
        }}>
          3D SPATIAL MESH ACTIVE
        </div>
      </Map>
    </div>
  );
};

export default MapViewer;
