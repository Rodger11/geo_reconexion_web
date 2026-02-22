import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Icons } from '../constants';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, users } = useAppStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Credenciales inválidas. Acceso denegado.');
        return;
      }

      const foundUser = await response.json();
      login(foundUser);
      navigate(foundUser.role === 'ENCUESTADOR' ? '/encuesta' : '/monitor');

    } catch (err) {
      setError('Error de red. No se pudo conectar al servidor maestro.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent"></div>

      <div className="w-full max-w-md bg-darkPanel border border-darkBorder rounded-2xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.05)] z-10 relative">
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 mb-4 rounded-full bg-slate-50 border-2 border-darkBorder flex items-center justify-center relative shadow-[0_0_20px_rgba(97,171,215,0.2)]">
            <Icons.Target className="text-primary w-10 h-10" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#61abd7]"></div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-widest">GEO RE-CONEXION</h1>
          <p className="text-primary text-sm font-semibold tracking-[0.2em] mt-2 relative inline-block">
            VENTANILLA 2026
            <span className="absolute top-1/2 -left-8 w-6 h-px bg-primary/50"></span>
            <span className="absolute top-1/2 -right-8 w-6 h-px bg-primary/50"></span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-accentRed/10 border border-accentRed/50 rounded text-accentRed text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-500 text-sm mb-2">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Users className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-darkBorder text-slate-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Ingrese su usuario"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 text-sm mb-2">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Check className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-darkBorder text-slate-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            <div className="mt-2 text-right">
              <p className="text-xs text-slate-500">Demo (admin/123, monitor/123, coordinador/123, encuestador/123)</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryDark text-white font-bold py-3 px-4 rounded-lg transition-all flex justify-center items-center shadow-[0_0_15px_rgba(97,171,215,0.4)]"
          >
            INGRESAR AL SISTEMA
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center px-4 py-1.5 border border-darkBorder rounded-full bg-slate-50">
            <span className="w-2 h-2 rounded-full bg-accentGreen mr-2 animate-pulse"></span>
            <span className="text-[10px] text-slate-500 font-mono">SISTEMA OPERATIVO</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 max-w-[200px] mx-auto leading-relaxed">
            © 2026 Comando Político Ventanilla.<br />
            Acceso restringido a personal autorizado.
          </p>
        </div>
      </div>
    </div>
  );
};
