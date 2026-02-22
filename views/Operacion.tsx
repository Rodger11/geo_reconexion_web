import React from 'react';
import { useAppStore } from '../store';
import { Apoyo } from '../types';
import { Icons } from '../constants';

export const OperacionView: React.FC = () => {
  const { encuestas } = useAppStore();

  // Aggregate stats per User & Zone
  const statsMap: Record<string, any> = {};

  encuestas.forEach(enc => {
    const key = `${enc.encuestadorName}-${enc.zona}`;
    if (!statsMap[key]) {
      statsMap[key] = {
        usuario: enc.encuestadorName,
        zona: enc.zona,
        casas: 0,
        votantes: 0,
        si: 0,
        no: 0,
        indeciso: 0
      };
    }
    statsMap[key].casas += 1;
    statsMap[key].votantes += enc.cantidadVotantes;
    if (enc.apoyo === Apoyo.SI) statsMap[key].si += 1;
    if (enc.apoyo === Apoyo.NO) statsMap[key].no += 1;
    if (enc.apoyo === Apoyo.INDECISO) statsMap[key].indeciso += 1;
  });

  const statsList = Object.values(statsMap).sort((a, b) => b.casas - a.casas);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-darkBorder pb-4">
        <h1 className="text-2xl font-bold tracking-widest text-slate-800 flex items-center gap-3">
          <Icons.Users className="text-primary w-8 h-8" />
          DESARROLLO OPERACIÓN
        </h1>
      </div>

      <div className="bg-darkPanel border border-darkBorder rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-primary border-b border-darkBorder font-bold">
              <tr>
                <th className="px-6 py-4">Usuario (Encuestador)</th>
                <th className="px-6 py-4">Zona / Sector</th>
                <th className="px-6 py-4 text-center">Casas Visitadas</th>
                <th className="px-6 py-4 text-center">Cant. Votantes</th>
                <th className="px-6 py-4 text-center text-accentGreen">% SÍ</th>
                <th className="px-6 py-4 text-center text-accentAmber">% INDECISO</th>
                <th className="px-6 py-4 text-center text-accentRed">% NO</th>
              </tr>
            </thead>
            <tbody>
              {statsList.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-bold">No hay registros operativos aún.</td>
                </tr>
              )}
              {statsList.map((stat, idx) => {
                const total = stat.casas;
                const pctSi = ((stat.si / total) * 100).toFixed(1);
                const pctInd = ((stat.indeciso / total) * 100).toFixed(1);
                const pctNo = ((stat.no / total) * 100).toFixed(1);

                return (
                  <tr key={idx} className="border-b border-darkBorder/50 hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{stat.usuario}</td>
                    <td className="px-6 py-4">{stat.zona}</td>
                    <td className="px-6 py-4 text-center font-mono text-lg font-bold text-slate-800">{stat.casas}</td>
                    <td className="px-6 py-4 text-center font-mono text-lg font-bold text-slate-800">{stat.votantes}</td>
                    <td className="px-6 py-4 text-center font-mono text-accentGreen font-bold">{pctSi}%</td>
                    <td className="px-6 py-4 text-center font-mono text-accentAmber font-bold">{pctInd}%</td>
                    <td className="px-6 py-4 text-center font-mono text-accentRed font-bold">{pctNo}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
