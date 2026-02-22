import React, { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { ZONAS_VENTANILLA, TIPOS_ACTIVIDAD, Icons } from '../constants';
import { Asistencia } from '../types';
import { TacticalMap } from '../components/TacticalMap';

export const ActividadesView: React.FC = () => {
  const { actividades, addActividad, updateActividadStatus } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tipo: TIPOS_ACTIVIDAD[0],
    nombre: '',
    fecha: '',
    hora: '',
    asistenciaEsperada: 'NO',
    asistenciaReal: Asistencia.PENDIENTE,
    direccion: '',
    zona: ZONAS_VENTANILLA[0],
    observaciones: '',
    lat: -11.88, // Default Ventanilla center
    lng: -77.12,
    fotoUrl: ''
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, fotoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActividad({
      ...formData,
      nombre: formData.nombre.toUpperCase()
    });
    setShowForm(false);
    setFormData({ ...formData, nombre: '', direccion: '', observaciones: '', fotoUrl: '' });
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-widest text-slate-800">CONTROL DE ACTIVIDADES</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded font-bold transition flex items-center gap-2"
        >
          {showForm ? 'Cerrar Registro' : 'Nueva Actividad'}
        </button>
      </div>

      {showForm && (
        <div className="bg-darkPanel border border-primary/50 rounded-xl p-6 shadow-sm animate-fade-in">
           <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Tipo de Actividad</label>
                  <select value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    {TIPOS_ACTIVIDAD.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Nombre (Mayúsculas)</label>
                  <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800 uppercase" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Zona</label>
                  <select value={formData.zona} onChange={e => setFormData({...formData, zona: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    {ZONAS_VENTANILLA.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Fecha</label>
                  <input required type="date" value={formData.fecha} onChange={e => setFormData({...formData, fecha: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Hora</label>
                  <input required type="time" value={formData.hora} onChange={e => setFormData({...formData, hora: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
                </div>
                 <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">¿Asiste LIC. OM?</label>
                  <select value={formData.asistenciaEsperada} onChange={e => setFormData({...formData, asistenciaEsperada: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    <option value="SI">SÍ</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Dirección</label>
                  <input required type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Foto de la Actividad</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-100 border border-darkBorder text-slate-800 px-3 py-2 rounded text-sm hover:bg-slate-200 transition flex-1 flex justify-center items-center gap-2 font-bold">
                      <Icons.Image className="w-4 h-4" />
                      {formData.fotoUrl ? 'Cambiar Foto' : 'Subir Imagen'}
                    </button>
                    {formData.fotoUrl && <span className="text-xs text-accentGreen flex items-center gap-1 font-bold"><Icons.Check className="w-4 h-4"/> Cargada</span>}
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-1 font-bold">Observaciones</label>
                <textarea value={formData.observaciones} onChange={e => setFormData({...formData, observaciones: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" rows={2}></textarea>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary text-white font-bold py-2 px-8 rounded hover:bg-primaryDark">Guardar Actividad</button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 h-[400px] flex flex-col">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wider flex items-center gap-2">
            <Icons.Map className="w-4 h-4 text-primary" />
            Mapa de Calor de Eventos (Google Maps UX)
          </h2>
          <div className="flex-1 rounded-lg overflow-hidden border border-darkBorder">
            <TacticalMap actividades={actividades} />
          </div>
          <div className="mt-4 flex justify-center gap-4 text-xs font-mono text-slate-600 font-bold">
              <div className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-accentGreen bg-darkBg"></span>OM Asistió</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-accentRed bg-darkBg"></span>OM No Asistió</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-accentAmber bg-darkBg"></span>Pendiente</div>
          </div>
        </div>

        {/* List */}
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 flex flex-col h-[400px]">
          <h2 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wider">Actividades Programadas</h2>
          <div className="flex-1 overflow-auto space-y-3 pr-2">
            {actividades.length === 0 && <div className="text-slate-500 text-sm text-center mt-10">No hay actividades registradas</div>}
            {actividades.map(act => (
              <div key={act.id} className="bg-slate-50 border border-darkBorder rounded p-3 text-sm flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-primary font-mono font-bold">{act.fecha} {act.hora}</span>
                    <p className="font-bold text-slate-800">{act.nombre}</p>
                    <p className="text-xs text-slate-500">{act.tipo} - {act.zona}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs border font-mono font-bold
                    ${act.asistenciaReal === Asistencia.SI ? 'bg-accentGreen/10 text-accentGreen border-accentGreen/30' : 
                      act.asistenciaReal === Asistencia.NO ? 'bg-accentRed/10 text-accentRed border-accentRed/30' : 
                      'bg-accentAmber/10 text-accentAmber border-accentAmber/30'}`
                  }>
                    {act.asistenciaReal}
                  </div>
                </div>
                {act.asistenciaReal === Asistencia.PENDIENTE && act.asistenciaEsperada === 'SI' && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-darkBorder">
                    <span className="text-xs text-slate-500 font-bold flex-1 self-center">Confirmar OM:</span>
                    <button onClick={() => updateActividadStatus(act.id, Asistencia.SI)} className="px-2 py-1 bg-accentGreen/20 text-accentGreen font-bold rounded text-xs hover:bg-accentGreen/40">Confirmar</button>
                    <button onClick={() => updateActividadStatus(act.id, Asistencia.NO)} className="px-2 py-1 bg-accentRed/20 text-accentRed font-bold rounded text-xs hover:bg-accentRed/40">No Asistió</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
