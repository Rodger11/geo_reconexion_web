import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Role, User } from '../types';
import { ZONAS_VENTANILLA, Icons } from '../constants';

export const UsuariosView: React.FC = () => {
  const { users, saveUser, currentUser } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: '',
    name: '',
    username: '',
    password: '',
    role: Role.ENCUESTADOR,
    cargo: 'DELEGADO',
    zona: ZONAS_VENTANILLA[0],
    activo: true
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (currentUser?.role !== Role.ADMIN) {
    return <div className="text-center mt-10 text-accentRed font-bold">Acceso Denegado</div>;
  }

  const handleEdit = (u: User) => {
    if (u.id === currentUser.id) {
      alert("No puedes editar tu propio usuario administrador desde esta pantalla.");
      return;
    }
    setFormData(u);
    setShowForm(true);
    setErrorMsg('');
  };

  const resetForm = () => {
    setFormData({
      id: '', name: '', username: '', password: '', role: Role.ENCUESTADOR, cargo: 'DELEGADO', zona: ZONAS_VENTANILLA[0], activo: true
    });
    setShowForm(false);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username || !formData.password) {
      setErrorMsg('Por favor complete todos los campos obligatorios.');
      return;
    }
    saveUser(formData);
    resetForm();
    alert('Usuario guardado exitosamente.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-widest text-slate-800 flex items-center gap-3">
          <Icons.UserPlus className="text-primary w-8 h-8" />
          GESTIÓN DE USUARIOS
        </h1>
        <button 
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded font-bold transition flex items-center gap-2 shadow-sm"
        >
          {showForm ? 'Cerrar Formulario' : 'Nuevo Usuario'}
        </button>
      </div>

      {showForm && (
        <div className="bg-darkPanel border border-primary/50 rounded-xl p-6 shadow-sm animate-fade-in">
          {errorMsg && <div className="mb-4 p-3 bg-accentRed/10 border border-accentRed/50 rounded text-accentRed text-sm font-bold">{errorMsg}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-bold">Nombre Completo *</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800 uppercase" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-bold">Usuario (Login) *</label>
              <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-bold">Contraseña *</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-bold">Rol en Sistema</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as Role})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                <option value={Role.ADMIN}>ADMINISTRADOR (TODO)</option>
                <option value={Role.MONITOR}>MONITOR (LECTURA)</option>
                <option value={Role.COORDINADOR}>COORDINADOR (MAPA/CAMPO)</option>
                <option value={Role.ENCUESTADOR}>ENCUESTADOR (SOLO CAMPO)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-bold">Cargo</label>
              <select value={formData.cargo} onChange={e => setFormData({...formData, cargo: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                <option value="LIDER">LÍDER</option>
                <option value="COORDINADOR">COORDINADOR</option>
                <option value="DELEGADO">DELEGADO</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-bold">Zona</label>
              <select value={formData.zona} onChange={e => setFormData({...formData, zona: e.target.value})} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                <option value="TODAS">TODAS LAS ZONAS</option>
                {ZONAS_VENTANILLA.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-bold">Estado</label>
              <div className="flex items-center gap-3 h-[38px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.activo === true} onChange={() => setFormData({...formData, activo: true})} />
                  <span className="text-sm text-accentGreen font-bold">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" checked={formData.activo === false} onChange={() => setFormData({...formData, activo: false})} />
                  <span className="text-sm text-accentRed font-bold">Inactivo</span>
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-2 border-t border-darkBorder pt-4">
              <button type="submit" className="bg-primary text-white font-bold py-2 px-8 rounded hover:bg-primaryDark flex items-center gap-2 shadow-sm">
                <Icons.Check className="w-4 h-4"/> Guardar Usuario
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-darkPanel border border-darkBorder rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-primary border-b border-darkBorder font-bold">
              <tr>
                <th className="px-6 py-4">ID / Estado</th>
                <th className="px-6 py-4">Nombre Completo</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol Sistema</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Zona</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-darkBorder/50 hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 font-mono text-slate-500 font-bold">
                      <span className={`w-2 h-2 rounded-full ${u.activo ? 'bg-accentGreen' : 'bg-accentRed'}`}></span>
                      {u.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{u.name}</td>
                  <td className="px-6 py-4 text-primary font-bold">{u.username}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 border border-darkBorder rounded text-xs font-bold text-slate-600">{u.role}</span></td>
                  <td className="px-6 py-4 font-bold">{u.cargo}</td>
                  <td className="px-6 py-4 text-slate-500">{u.zona}</td>
                  <td className="px-6 py-4 text-center">
                    {u.id !== currentUser.id ? (
                      <button onClick={() => handleEdit(u)} className="text-primary hover:text-primaryDark transition p-1" title="Editar Usuario">
                        <Icons.Edit className="w-5 h-5 mx-auto" />
                      </button>
                    ) : (
                      <span className="text-slate-400 italic text-xs font-bold">Actual</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
