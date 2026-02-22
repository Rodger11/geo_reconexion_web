import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AppState, Encuesta, Actividad, Personal, Role, Apoyo, Prioridad, Asistencia } from './types';
import { api } from './services/api';

// Mock Users based on requirements
const mockUsers: User[] = [
  { id: '1', name: 'Administrador Dios', username: 'admin', password: '123', role: Role.ADMIN, cargo: 'LIDER', zona: 'TODAS', activo: true },
  { id: '3', name: 'Usuario Monitor', username: 'monitor', password: '123', role: Role.MONITOR, cargo: 'COORDINADOR', zona: 'TODAS', activo: true },
  { id: '4', name: 'Usuario Coordinador', username: 'coordinador', password: '123', role: Role.COORDINADOR, cargo: 'COORDINADOR', zona: 'ZONA NORTE', activo: true },
  { id: '5', name: 'Usuario Encuestador', username: 'encuestador', password: '123', role: Role.ENCUESTADOR, cargo: 'DELEGADO', zona: 'ZONA SUR', activo: true },
];

const mockEncuestas: Encuesta[] = [
  { id: '1', fechaHora: new Date(Date.now() - 3600000).toISOString(), lat: -11.875, lng: -77.125, zona: 'ZONA NORTE', manzana: 'A1', lote: '1', cantidadVotantes: 3, apoyo: Apoyo.SI, comparteDatos: true, dni: '12345678', celular: '987654321', whatsapp: '987654321', prioridad: Prioridad.BAJA, encuestadorId: '5', encuestadorName: 'Usuario Encuestador' },
  { id: '2', fechaHora: new Date(Date.now() - 3000000).toISOString(), lat: -11.876, lng: -77.124, zona: 'ZONA NORTE', manzana: 'A1', lote: '2', cantidadVotantes: 2, apoyo: Apoyo.NO, motivoRechazo: 'INSEGURIDAD CIUDADANA', prioridad: Prioridad.ALTA, encuestadorId: '5', encuestadorName: 'Usuario Encuestador' },
];

const mockActividades: Actividad[] = [];

// Mock Personal Data for HR Dashboard visualization
const mockPersonal: Personal[] = [
  { id: 'p1', estado: true, apellidoPaterno: 'RODRIGUEZ', apellidoMaterno: 'LOPEZ', nombres: 'CARLOS', tipoDoc: 'DNI', numeroDoc: '11111111', telefono: '999999991', whatsapp: '999999991', fechaNacimiento: '1995-05-15', sexo: 'MASCULINO', esPadreMadre: 'NO PADRE', correo: 'carlos@test.com', cargoPartido: 'LIDER', profesion: 'ABOGADO(A)', ocupacion: 'GERENTE', zona: 'ZONA NORTE' },
  { id: 'p2', estado: true, apellidoPaterno: 'GARCIA', apellidoMaterno: 'MENDEZ', nombres: 'MARIA', tipoDoc: 'DNI', numeroDoc: '22222222', telefono: '999999992', whatsapp: '999999992', fechaNacimiento: '1980-08-22', sexo: 'FEMENINO', esPadreMadre: 'MADRE', correo: 'maria@test.com', cargoPartido: 'COORDINADOR', profesion: 'ADMINISTRADOR(A)', ocupacion: 'JEFE DE ÁREA', zona: 'ZONA CENTRO' },
  { id: 'p3', estado: true, apellidoPaterno: 'QUISPE', apellidoMaterno: 'MAMANI', nombres: 'JUAN', tipoDoc: 'DNI', numeroDoc: '33333333', telefono: '999999993', whatsapp: '999999993', fechaNacimiento: '1960-12-10', sexo: 'MASCULINO', esPadreMadre: 'PADRE', correo: 'juan@test.com', cargoPartido: 'DELEGADO', profesion: 'INGENIERO(A) CIVIL', ocupacion: 'INDEPENDIENTE', zona: 'ZONA SUR' },
  { id: 'p4', estado: true, apellidoPaterno: 'FLORES', apellidoMaterno: 'PEREZ', nombres: 'ANA', tipoDoc: 'DNI', numeroDoc: '44444444', telefono: '999999994', whatsapp: '999999994', fechaNacimiento: '2000-01-05', sexo: 'FEMENINO', esPadreMadre: 'NO MADRE', correo: 'ana@test.com', cargoPartido: 'APOYO', profesion: 'ESTUDIANTE', ocupacion: 'PRACTICANTE', zona: 'PACHACUTEC' },
];

interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  addEncuesta: (encuesta: Omit<Encuesta, 'id' | 'fechaHora'>) => Promise<void>;
  addActividad: (actividad: Omit<Actividad, 'id'>) => Promise<void>;
  updateActividadStatus: (id: string, status: Asistencia) => void;
  saveUser: (user: User) => void;
  savePersonal: (personal: Personal) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [encuestas, setEncuestas] = useState<Encuesta[]>(mockEncuestas);
  const [actividades, setActividades] = useState<Actividad[]>(mockActividades);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [personal, setPersonal] = useState<Personal[]>(mockPersonal);

  const login = (user: User) => setCurrentUser(user);
  const logout = () => setCurrentUser(null);

  // OPTIMISTIC UPDATE: Se actualiza la UI al instante, luego sincroniza a la BD
  const addEncuesta = async (encuesta: Omit<Encuesta, 'id' | 'fechaHora'>) => {
    const newEncuesta: Encuesta = {
      ...encuesta,
      id: Math.random().toString(36).substr(2, 9),
      fechaHora: new Date().toISOString(),
    };

    // 1. Actualización inmediata en el UI (Velocidad en campo)
    setEncuestas(prev => [...prev, newEncuesta]);

    // 2. Intento de persistencia en SQL Server vía API
    try {
      await api.guardarEncuesta(newEncuesta);
    } catch (error) {
      console.warn("⚠️ API desconectada. Datos guardados en memoria local.");
      // Aquí se podría implementar IndexedDB para sincronización offline robusta
    }
  };

  const addActividad = async (actividad: Omit<Actividad, 'id'>) => {
    const newActividad: Actividad = {
      ...actividad,
      id: Math.random().toString(36).substr(2, 9),
    };
    setActividades(prev => [...prev, newActividad]);

    try {
      await api.guardarActividad(newActividad);
    } catch (error) {
      console.warn("⚠️ API desconectada. Datos guardados localmente.");
    }
  };

  const updateActividadStatus = (id: string, status: Asistencia) => {
    setActividades(prev => prev.map(a => a.id === id ? { ...a, asistenciaReal: status } : a));
    // Aquí iría el update a la base de datos
  };

  const saveUser = async (user: User) => {
    try {
      const response = await fetch(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:3001'}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      if (!response.ok) throw new Error('Error al guardar en el servidor');

      // Como lo guardamos en BD, volvemos a descargar la lista fresca de usuarios
      const refreshRes = await fetch(`${(import.meta as any).env.VITE_API_URL || 'http://localhost:3001'}/api/usuarios`);
      if (refreshRes.ok) {
        const dataDb = await refreshRes.json();
        setUsers(dataDb);
      }
    } catch (error) {
      console.error("Error guardando usuario:", error);
      alert("Hubo un error al conectar con SQL Server.");
    }
  };

  const savePersonal = async (p: Personal) => {
    let newPersonal = { ...p };
    setPersonal(prev => {
      const idx = prev.findIndex(item => item.id === p.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = p;
        return copy;
      }
      newPersonal = { ...p, id: Math.random().toString(36).substr(2, 9) };
      return [...prev, newPersonal];
    });

    try {
      await api.guardarPersonal(newPersonal);
    } catch (error) {
      console.warn("⚠️ API desconectada. Datos guardados localmente.");
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser, encuestas, actividades, users, personal,
      login, logout, addEncuesta, addActividad, updateActividadStatus, saveUser, savePersonal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within AppProvider');
  return context;
};
