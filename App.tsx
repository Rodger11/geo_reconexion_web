import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store';
import { Login } from './views/Login';
import { Layout } from './components/Layout';
import { EncuestaView } from './views/Encuesta';
import { MonitorView } from './views/Monitor';
import { ActividadesView } from './views/Actividades';
import { HeatmapView } from './views/Heatmap';
import { OperacionView } from './views/Operacion';
import { UsuariosView } from './views/Usuarios';
import { RecursosHumanosView } from './views/RecursosHumanos';
import { MonitorRRHHView } from './views/MonitorRRHH';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/encuesta" element={<EncuestaView />} />
            <Route path="/monitor" element={<MonitorView />} />
            <Route path="/heatmap" element={<HeatmapView />} />
            <Route path="/operacion" element={<OperacionView />} />
            <Route path="/actividades" element={<ActividadesView />} />
            <Route path="/usuarios" element={<UsuariosView />} />
            <Route path="/recursos-humanos" element={<RecursosHumanosView />} />
            <Route path="/monitor-rrhh" element={<MonitorRRHHView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
