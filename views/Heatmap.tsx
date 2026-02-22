import React from 'react';
import { useAppStore } from '../store';
import { TacticalMap } from '../components/TacticalMap';
import { Icons } from '../constants';

export const HeatmapView: React.FC = () => {
  const { encuestas } = useAppStore();

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center border-b border-darkBorder pb-4">
        <h1 className="text-2xl font-bold tracking-widest text-slate-800 flex items-center gap-3">
          <Icons.Map className="text-primary w-8 h-8" />
          MAPA DE CALOR - RASTREO DE USUARIOS
        </h1>
      </div>

      <div className="bg-darkPanel border border-darkBorder rounded-xl p-4 flex-1 flex flex-col min-h-[500px]">
        <h2 className="text-sm font-bold text-slate-700 uppercase mb-4 tracking-wider">Despliegue de Brigadas en Tiempo Real</h2>
        <div className="flex-1 rounded-lg overflow-hidden border border-darkBorder relative">
          <TacticalMap encuestas={encuestas} showPaths={true} />
        </div>
        <div className="mt-4 text-xs text-slate-500 flex justify-center gap-6 font-mono font-bold">
           <span className="flex items-center gap-2"><div className="w-4 h-1 bg-[#61abd7]"></div> Rutas de Desplazamiento</span>
           <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-accentGreen border border-white"></div> Punto Marcado</span>
        </div>
      </div>
    </div>
  );
};
