import React from 'react';
import { useAppStore } from '../store';
import { Apoyo, Prioridad } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TacticalMap } from '../components/TacticalMap';

export const MonitorView: React.FC = () => {
  const { encuestas } = useAppStore();

  // Calculate stats
  const total = encuestas.length;
  const counts = {
    si: encuestas.filter(e => e.apoyo === Apoyo.SI).length,
    no: encuestas.filter(e => e.apoyo === Apoyo.NO).length,
    indeciso: encuestas.filter(e => e.apoyo === Apoyo.INDECISO).length,
  };

  const pieData = [
    { name: 'SÍ', value: counts.si, color: '#10b981' }, // accentGreen
    { name: 'NO', value: counts.no, color: '#ef4444' }, // accentRed
    { name: 'INDECISO', value: counts.indeciso, color: '#f59e0b' }, // accentAmber
  ];

  // Reasons for rejection
  const motivosMap: Record<string, number> = {};
  encuestas.forEach(e => {
    if (e.motivoRechazo) {
      motivosMap[e.motivoRechazo] = (motivosMap[e.motivoRechazo] || 0) + 1;
    }
  });
  const motivosData = Object.entries(motivosMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5

  const alertasAltas = encuestas.filter(e => e.prioridad === Prioridad.ALTA).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-widest text-slate-800">COMANDO CENTRAL</h1>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-darkPanel border border-darkBorder rounded text-center">
            <p className="text-xs text-slate-500 font-bold">TOTAL CAPTURAS</p>
            <p className="text-xl font-bold text-primary">{total}</p>
          </div>
          <div className="px-4 py-2 bg-accentRed/10 border border-accentRed/30 rounded text-center">
            <p className="text-xs text-accentRed font-bold">ALERTAS ROJAS</p>
            <p className="text-xl font-bold text-accentRed">{alertasAltas}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Map View */}
        <div className="lg:col-span-2 bg-darkPanel border border-darkBorder rounded-xl p-4 h-[500px] flex flex-col">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wider">Mapa Táctico de Intervención</h2>
          <div className="flex-1 rounded-lg overflow-hidden border border-darkBorder">
            <TacticalMap encuestas={encuestas} />
          </div>
        </div>

        {/* Dashboards */}
        <div className="space-y-6 flex flex-col">
          
          <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 flex-1">
            <h2 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wider">Tendencia de Apoyo</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                    itemStyle={{ color: '#1e293b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs font-mono text-slate-600 font-bold">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-accentGreen"></span>SÍ: {counts.si}</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-accentRed"></span>NO: {counts.no}</div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-accentAmber"></span>IND: {counts.indeciso}</div>
            </div>
          </div>

          <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 flex-1">
            <h2 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wider">Top Motivos de Rechazo</h2>
            <div className="h-64">
              {motivosData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={motivosData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                    <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]}>
                      {motivosData.map((_, index) => (
                         <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#f87171'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm">No hay datos suficientes</div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
