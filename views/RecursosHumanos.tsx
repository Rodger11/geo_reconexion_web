import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Personal, Role } from '../types';
import { ZONAS_VENTANILLA, PROFESIONES, OCUPACIONES, CARGOS_PARTIDO, Icons } from '../constants';

export const RecursosHumanosView: React.FC = () => {
  const { personal, savePersonal, currentUser } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const initialForm: Personal = {
    id: '', estado: true, apellidoPaterno: '', apellidoMaterno: '', nombres: '', 
    tipoDoc: 'DNI', numeroDoc: '', telefono: '', whatsapp: '', fechaNacimiento: '', 
    sexo: 'MASCULINO', esPadreMadre: 'NO PADRE', correo: '', cargoPartido: CARGOS_PARTIDO[0], 
    profesion: PROFESIONES[0], ocupacion: OCUPACIONES[0], zona: ZONAS_VENTANILLA[0]
  };
  
  const [formData, setFormData] = useState<Personal>(initialForm);

  if (currentUser?.role !== Role.ADMIN && currentUser?.role !== Role.MONITOR) {
    return <div className="text-center mt-10 text-accentRed font-bold">Acceso Denegado</div>;
  }

  const calcularEdad = (fecha: string) => {
    if (!fecha) return '-';
    const hoy = new Date();
    const cumpleanos = new Date(fecha);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const m = hoy.getMonth() - cumpleanos.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
    return isNaN(edad) ? '-' : edad.toString();
  };

  const handleEdit = (p: Personal) => {
    if (currentUser?.role === Role.MONITOR) return;
    setFormData(p);
    setShowForm(true);
    setErrorMsg('');
  };

  const resetForm = () => {
    setFormData(initialForm);
    setShowForm(false);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.apellidoPaterno || !formData.nombres || !formData.numeroDoc) {
      setErrorMsg('Faltan campos obligatorios. Revise el formulario.');
      return;
    }
    
    // Auto populate tracking fields 
    savePersonal(formData);
    alert('Personal registrado correctamente con Fecha y Hora: ' + new Date().toLocaleString());
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-widest text-slate-800 flex items-center gap-3">
          <Icons.Briefcase className="text-primary w-8 h-8" />
          RECURSOS HUMANOS
        </h1>
        {currentUser?.role === Role.ADMIN && (
          <button 
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded font-bold transition flex items-center gap-2 shadow-sm"
          >
            {showForm ? 'Cerrar Registro' : 'Nuevo Personal'}
          </button>
        )}
      </div>

      {showForm && currentUser?.role === Role.ADMIN && (
        <div className="bg-darkPanel border border-primary/50 rounded-xl p-6 shadow-sm animate-fade-in">
          {errorMsg && <div className="mb-4 p-3 bg-accentRed/10 border border-accentRed/50 rounded text-accentRed text-sm font-bold">{errorMsg}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-primary border-b border-darkBorder pb-2 mb-4 font-bold uppercase text-sm">Datos Personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Estado</label>
                  <select value={formData.estado ? 'ACTIVO' : 'INACTIVO'} onChange={e => setFormData({...formData, estado: e.target.value === 'ACTIVO'})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Apellido Paterno *</label>
                  <input type="text" value={formData.apellidoPaterno} onChange={e => setFormData({...formData, apellidoPaterno: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800 uppercase" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Apellido Materno</label>
                  <input type="text" value={formData.apellidoMaterno} onChange={e => setFormData({...formData, apellidoMaterno: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800 uppercase" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Nombres *</label>
                  <input type="text" value={formData.nombres} onChange={e => setFormData({...formData, nombres: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800 uppercase" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Tipo Doc.</label>
                  <select value={formData.tipoDoc} onChange={e => setFormData({...formData, tipoDoc: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Número Doc. (8 dígitos) *</label>
                  <input type="text" maxLength={8} pattern="\d{8}" value={formData.numeroDoc} onChange={e => setFormData({...formData, numeroDoc: e.target.value.replace(/\D/g, '')})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Fecha de Nacimiento</label>
                  <input type="date" value={formData.fechaNacimiento} onChange={e => setFormData({...formData, fechaNacimiento: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Edad Calculada</label>
                  <input type="text" disabled value={calcularEdad(formData.fechaNacimiento)} className="w-full bg-slate-100 border border-darkBorder rounded p-2 text-slate-500 font-mono font-bold" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Sexo</label>
                  <select value={formData.sexo} onChange={e => setFormData({...formData, sexo: e.target.value, esPadreMadre: e.target.value === 'MASCULINO' ? 'NO PADRE' : 'NO MADRE'})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    <option value="MASCULINO">MASCULINO</option>
                    <option value="FEMENINO">FEMENINO</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Condición Familiar</label>
                  <select value={formData.esPadreMadre} onChange={e => setFormData({...formData, esPadreMadre: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    {formData.sexo === 'MASCULINO' ? (
                      <><option value="PADRE">PADRE</option><option value="NO PADRE">NO PADRE</option></>
                    ) : (
                      <><option value="MADRE">MADRE</option><option value="NO MADRE">NO MADRE</option></>
                    )}
                  </select>
               </div>
            </div>

            <h3 className="text-primary border-b border-darkBorder pb-2 mb-4 mt-6 font-bold uppercase text-sm">Contacto y Perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Teléfono (9 dígitos)</label>
                  <input type="text" maxLength={9} pattern="\d{9}" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value.replace(/\D/g, '')})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">WhatsApp (9 dígitos)</label>
                  <input type="text" maxLength={9} pattern="\d{9}" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value.replace(/\D/g, '')})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Correo Electrónico</label>
                  <input type="email" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Cargo en Partido</label>
                  <select value={formData.cargoPartido} onChange={e => setFormData({...formData, cargoPartido: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    {CARGOS_PARTIDO.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Zona</label>
                  <select value={formData.zona} onChange={e => setFormData({...formData, zona: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                    {ZONAS_VENTANILLA.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 border border-darkBorder rounded bg-slate-50">
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Profesión</label>
                  <select value={formData.profesion} onChange={e => setFormData({...formData, profesion: e.target.value})} className="w-full bg-white border border-darkBorder rounded p-2 text-slate-800 mb-2">
                    {PROFESIONES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {formData.profesion === 'OTRO' && (
                    <input type="text" placeholder="Especifique Profesión" value={formData.profesionOtro || ''} onChange={e => setFormData({...formData, profesionOtro: e.target.value.toUpperCase()})} className="w-full bg-white border border-darkBorder rounded p-2 text-slate-800 uppercase" />
                  )}
              </div>
              <div className="p-3 border border-darkBorder rounded bg-slate-50">
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Ocupación</label>
                  <select value={formData.ocupacion} onChange={e => setFormData({...formData, ocupacion: e.target.value})} className="w-full bg-white border border-darkBorder rounded p-2 text-slate-800 mb-2">
                    {OCUPACIONES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {formData.ocupacion === 'OTRO' && (
                    <input type="text" placeholder="Especifique Ocupación" value={formData.ocupacionOtro || ''} onChange={e => setFormData({...formData, ocupacionOtro: e.target.value.toUpperCase()})} className="w-full bg-white border border-darkBorder rounded p-2 text-slate-800 uppercase" />
                  )}
              </div>
            </div>

            <div className="flex justify-end border-t border-darkBorder pt-4">
              <button type="submit" className="bg-primary text-white font-bold py-2 px-8 rounded hover:bg-primaryDark flex items-center gap-2 shadow-sm">
                <Icons.Check className="w-4 h-4"/> Guardar Registro
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table view */}
      <div className="bg-darkPanel border border-darkBorder rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
            <thead className="bg-slate-50 text-xs uppercase text-primary border-b border-darkBorder font-bold">
              <tr>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Apellidos y Nombres</th>
                <th className="px-4 py-3">Doc. Identidad</th>
                <th className="px-4 py-3">Contacto</th>
                <th className="px-4 py-3">Edad/Sexo</th>
                <th className="px-4 py-3">Cargo/Zona</th>
                <th className="px-4 py-3">Profesión/Ocupación</th>
                {currentUser?.role === Role.ADMIN && <th className="px-4 py-3 text-center">Acción</th>}
              </tr>
            </thead>
            <tbody>
              {personal.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-bold">No hay registros de personal.</td></tr>
              )}
              {personal.map(p => (
                <tr key={p.id} className="border-b border-darkBorder/50 hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                     <span className={`px-2 py-1 rounded text-xs border font-bold ${p.estado ? 'bg-accentGreen/10 text-accentGreen border-accentGreen/30' : 'bg-accentRed/10 text-accentRed border-accentRed/30'}`}>
                       {p.estado ? 'ACTIVO' : 'INACTIVO'}
                     </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800">
                    {p.apellidoPaterno} {p.apellidoMaterno}, {p.nombres}
                  </td>
                  <td className="px-4 py-3 font-bold">{p.tipoDoc}: {p.numeroDoc}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 font-bold">
                    T: {p.telefono || '-'}<br/>W: {p.whatsapp || '-'}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {calcularEdad(p.fechaNacimiento)} años<br/>
                    <span className="text-xs text-slate-400">{p.sexo} ({p.esPadreMadre})</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-primary font-bold">{p.cargoPartido}</span><br/>
                    <span className="text-xs text-slate-500">{p.zona}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold">
                    {p.profesion === 'OTRO' ? p.profesionOtro : p.profesion}<br/>
                    <span className="text-slate-500">{p.ocupacion === 'OTRO' ? p.ocupacionOtro : p.ocupacion}</span>
                  </td>
                  {currentUser?.role === Role.ADMIN && (
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleEdit(p)} className="text-primary hover:text-primaryDark transition p-1">
                        <Icons.Edit className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
