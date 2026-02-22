import React, { useState } from 'react';
import { useAppStore } from '../store';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Icons } from '../constants';

export const MonitorRRHHView: React.FC = () => {
  const { personal } = useAppStore();
  const [mesFiltro, setMesFiltro] = useState<number>(new Date().getMonth()); // 0-11

  // Metrics
  const activos = personal.filter(p => p.estado);
  const total = activos.length;
  const hombres = activos.filter(p => p.sexo === 'MASCULINO').length;
  const mujeres = activos.filter(p => p.sexo === 'FEMENINO').length;
  const padres = activos.filter(p => p.esPadreMadre === 'PADRE').length;
  const madres = activos.filter(p => p.esPadreMadre === 'MADRE').length;

  const genderData = [
    { name: 'Hombres', value: hombres, color: '#3b82f6' }, // blue-500
    { name: 'Mujeres', value: mujeres, color: '#ec4899' }, // pink-500
  ];

  // Age calculation
  const getEdad = (fecha: string) => {
    if (!fecha) return null;
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return isNaN(edad) ? null : edad;
  };

  let jovenes = 0; // 18-29
  let adultos = 0; // 30-59
  let adultosMayores = 0; // 60+

  activos.forEach(p => {
    const edad = getEdad(p.fechaNacimiento);
    if (edad !== null) {
      if (edad >= 18 && edad <= 29) jovenes++;
      else if (edad >= 30 && edad <= 59) adultos++;
      else if (edad >= 60) adultosMayores++;
    }
  });

  const ageData = [
    { name: 'Jóvenes (18-29)', value: jovenes, fill: '#10b981' },
    { name: 'Adultos (30-59)', value: adultos, fill: '#f59e0b' },
    { name: 'Adulto Mayor (60+)', value: adultosMayores, fill: '#6366f1' },
  ];

  // Professions & Occupations
  const profMap: Record<string, number> = {};
  const ocupMap: Record<string, number> = {};
  activos.forEach(p => {
    const prof = p.profesion === 'OTRO' ? p.profesionOtro || 'OTRO' : p.profesion;
    const ocup = p.ocupacion === 'OTRO' ? p.ocupacionOtro || 'OTRO' : p.ocupacion;
    profMap[prof] = (profMap[prof] || 0) + 1;
    ocupMap[ocup] = (ocupMap[ocup] || 0) + 1;
  });

  const profData = Object.entries(profMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  const ocupData = Object.entries(ocupMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  // Birthdays filtering
  const cumpleaneros = activos.filter(p => {
    if (!p.fechaNacimiento) return false;
    const date = new Date(p.fechaNacimiento);
    // Note: dates from input type=date are parsed in UTC, but getUTCMonth is safer
    return date.getUTCMonth() === mesFiltro;
  }).sort((a, b) => {
    return new Date(a.fechaNacimiento).getUTCDate() - new Date(b.fechaNacimiento).getUTCDate();
  });

  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-darkBorder pb-4">
        <h1 className="text-2xl font-bold tracking-widest text-slate-800 flex items-center gap-3">
          <Icons.PieChart className="text-primary w-8 h-8" />
          MONITOR RR.HH.
        </h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">TOTAL PERSONAL</p>
          <p className="text-2xl font-bold text-primary mt-1">{total}</p>
        </div>
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">HOMBRES</p>
          <p className="text-2xl font-bold text-blue-500 mt-1">{hombres}</p>
        </div>
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">MUJERES</p>
          <p className="text-2xl font-bold text-pink-500 mt-1">{mujeres}</p>
        </div>
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">PADRES</p>
          <p className="text-2xl font-bold text-accentGreen mt-1">{padres}</p>
        </div>
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 text-center shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase">MADRES</p>
          <p className="text-2xl font-bold text-accentAmber mt-1">{madres}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gender & Age */}
        <div className="space-y-6">
          <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 h-64 flex flex-col shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 uppercase mb-2 tracking-wider">Distribución por Sexo</h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} itemStyle={{ color: '#1e293b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 h-64 flex flex-col shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 uppercase mb-2 tracking-wider">Grupo Etario (MINSA)</h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {ageData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Professions & Occupations */}
        <div className="space-y-6">
          <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 h-64 flex flex-col shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 uppercase mb-2 tracking-wider">Top Profesiones</h2>
            <div className="flex-1">
              {profData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                    <Bar dataKey="value" fill="#61abd7" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="h-full flex items-center justify-center text-slate-500 text-sm font-bold">No hay datos</div>}
            </div>
          </div>

          <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 h-64 flex flex-col shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 uppercase mb-2 tracking-wider">Top Ocupaciones</h2>
            <div className="flex-1">
              {ocupData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ocupData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
                    <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="h-full flex items-center justify-center text-slate-500 text-sm font-bold">No hay datos</div>}
            </div>
          </div>
        </div>

        {/* Birthdays */}
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 h-[536px] flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-darkBorder pb-2">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Icons.Cake className="w-5 h-5 text-accentAmber" /> Cumpleañeros
            </h2>
            <select value={mesFiltro} onChange={e => setMesFiltro(Number(e.target.value))} className="bg-slate-50 border border-darkBorder rounded p-1 text-sm text-primary font-bold">
              {meses.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
            </select>
          </div>
          
          <div className="flex-1 overflow-auto space-y-2 pr-1">
            {cumpleaneros.length === 0 && (
              <div className="text-center text-slate-500 font-bold text-sm mt-10">Ningún cumpleaños en este mes.</div>
            )}
            {cumpleaneros.map(p => {
               const day = new Date(p.fechaNacimiento).getUTCDate();
               const esHoy = day === new Date().getDate() && mesFiltro === new Date().getMonth();
               return (
                 <div key={p.id} className={`p-3 rounded border flex items-center gap-3 ${esHoy ? 'bg-primary/10 border-primary shadow-sm' : 'bg-slate-50 border-darkBorder'}`}>
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-800 border border-darkBorder shrink-0">
                     {day}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-bold text-slate-800 text-sm truncate">{p.nombres} {p.apellidoPaterno}</p>
                     <p className="text-xs text-slate-500 truncate font-bold">{p.cargoPartido} - {p.zona}</p>
                   </div>
                   {esHoy && <Icons.Cake className="w-5 h-5 text-primary animate-bounce" />}
                 </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
