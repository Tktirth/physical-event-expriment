'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import ZoomWrapper from '../ZoomWrapper';

const ageData = [
  { group: '18-24', count: 18400 },
  { group: '25-34', count: 32600 },
  { group: '35-44', count: 21200 },
  { group: '45-54', count: 10800 },
  { group: '55+', count: 4000 },
];

const genderData = [
  { name: 'Male', value: 58 },
  { name: 'Female', value: 39 },
  { name: 'Other', value: 3 },
];

const originData = [
  { city: 'Ahmedabad', count: 42000 },
  { city: 'Mumbai', count: 12000 },
  { city: 'Surat', count: 8000 },
  { city: 'Rajkot', count: 5000 },
  { city: 'Delhi', count: 4000 },
  { city: 'Other', count: 13000 },
];

const COLORS = ['#0d9488', '#0f766e', '#14b8a6', '#5eead4', '#99f6e4', '#64748b'];

const occupancyHistory = [
  { time: '14:00', occupancy: 15 },
  { time: '15:00', occupancy: 35 },
  { time: '16:00', occupancy: 70 },
  { time: '17:00', occupancy: 85 },
  { time: '18:00', occupancy: 94 },
  { time: '19:00', occupancy: 98 },
];

export default function DemographicsView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
      
      {/* Top Row: Age and Origins */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        <ZoomWrapper title="Age Distribution">
          <div className="card glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-highlight)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '4px', height: '18px', background: 'var(--accent-teal)', borderRadius: '2px' }}></div>
              Attendee Age Groups
            </h4>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis dataKey="group" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'rgba(13, 148, 136, 0.05)'}}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid var(--border-glass)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-cyan)" />
                      <stop offset="100%" stopColor="var(--accent-teal)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ZoomWrapper>

        <ZoomWrapper title="Geographic Intelligence">
          <div className="card glass-panel" style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-highlight)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '4px', height: '18px', background: 'var(--accent-teal)', borderRadius: '2px' }}></div>
              Audience Origins (Narendra Modi Stadium)
            </h4>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={originData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="city" type="category" stroke="var(--text-main)" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    cursor={{fill: 'rgba(13, 148, 136, 0.05)'}}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid var(--border-glass)', borderRadius: '8px' }} 
                  />
                  <Bar dataKey="count" fill="var(--accent-cyan)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ZoomWrapper>
      </div>

      {/* Bottom Row: Gender and Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        
        <ZoomWrapper title="Gender Balance">
          <div className="card glass-panel" style={{ height: '350px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-highlight)' }}>Demographic Split</h4>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={80}
                      paddingAngle={8} dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                {genderData.map((item, i) => (
                  <div key={item.name} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: COLORS[i] }}>{item.value}%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ZoomWrapper>

        <ZoomWrapper title="Veneue Occupancy Trends">
          <div className="card glass-panel" style={{ height: '350px', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-highlight)' }}>Real-Time Entry Flow (Live)</h4>
            <div style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyHistory}>
                  <defs>
                    <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="occupancy" stroke="var(--accent-cyan)" strokeWidth={3} fillOpacity={1} fill="url(#colorWave)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ZoomWrapper>
      </div>
    </div>
  );
}
