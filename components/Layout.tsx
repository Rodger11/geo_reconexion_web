import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Icons } from '../constants';
import { Role } from '../types';

export const Layout: React.FC = () => {
  const { currentUser, logout } = useAppStore();
  const navigate = useNavigate();

  // Corrección: Envolver la redirección en un useEffect
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/encuesta', label: 'Operación Campo', icon: <Icons.Target className="w-5 h-5" />, roles: [Role.ADMIN, Role.MONITOR, Role.COORDINADOR, Role.ENCUESTADOR] },
    { to: '/monitor', label: 'Monitor Táctico', icon: <Icons.BarChart className="w-5 h-5" />, roles: [Role.ADMIN, Role.MONITOR] },
    { to: '/heatmap', label: 'Mapa de Calor', icon: <Icons.Map className="w-5 h-5" />, roles: [Role.ADMIN, Role.MONITOR, Role.COORDINADOR] },
    { to: '/operacion', label: 'Desarrollo Operación', icon: <Icons.Users className="w-5 h-5" />, roles: [Role.ADMIN, Role.MONITOR] },
    { to: '/actividades', label: 'Actividades', icon: <Icons.Activity className="w-5 h-5" />, roles: [Role.ADMIN, Role.MONITOR] },
    { to: '/monitor-rrhh', label: 'Monitor RR.HH.', icon: <Icons.PieChart className="w-5 h-5" />, roles: [Role.ADMIN, Role.MONITOR] },
    { to: '/recursos-humanos', label: 'Recursos Humanos', icon: <Icons.Briefcase className="w-5 h-5" />, roles: [Role.ADMIN, Role.MONITOR] },
    { to: '/usuarios', label: 'Gestión Usuarios', icon: <Icons.UserPlus className="w-5 h-5" />, roles: [Role.ADMIN] },
  ];

  return (
    <div className="flex h-screen bg-darkBg text-slate-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-darkPanel border-r border-darkBorder flex flex-col z-50">
        <div className="py-4 flex flex-col items-center justify-center border-b border-darkBorder">
          <div className="text-primary font-bold tracking-wider text-sm flex items-center gap-2">
            <Icons.Target className="w-5 h-5" />
            GEO RE-CONEXIÓN 2026
          </div>
          <span className="text-[10px] text-slate-500 tracking-widest mt-1">VENTANILLA 2026</span>
        </div>

        <div className="p-4 border-b border-darkBorder bg-slate-50">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Operador Activo</p>
          <p className="font-semibold text-sm truncate text-slate-800">{currentUser.name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-accentGreen animate-pulse"></span>
            <span className="text-xs text-primary font-mono">{currentUser.role} {currentUser.cargo ? `(${currentUser.cargo})` : ''}</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.filter(item => item.roles.includes(currentUser.role)).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                  : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-darkBorder">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-500 hover:text-accentRed transition-colors"
          >
            <Icons.LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-40"></div>
        <div className="flex-1 overflow-auto p-6 z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};