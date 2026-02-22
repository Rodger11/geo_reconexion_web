import React, { useEffect, useRef } from 'react';
import { Encuesta, Apoyo, Actividad, Asistencia } from '../types';

interface TacticalMapProps {
  encuestas?: Encuesta[];
  actividades?: Actividad[];
  center?: { lat: number, lng: number };
  showPaths?: boolean;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({ encuestas = [], actividades = [], center, showPaths = false }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const layersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;
    
    // Fallback if Leaflet isn't loaded yet
    if (!L) {
      console.warn("Leaflet not loaded");
      return;
    }

    if (!mapInstance.current) {
      // Default to Ventanilla coordinates
      const defaultLat = center?.lat || -11.875;
      const defaultLng = center?.lng || -77.125;
      
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([defaultLat, defaultLng], 14);
      
      // Light Mode Map Tiles for clear UX design (CartoDB Voyager)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
    } else if (center) {
      mapInstance.current.setView([center.lat, center.lng], mapInstance.current.getZoom());
    }

    // Clear existing layers
    layersRef.current.forEach(layer => mapInstance.current.removeLayer(layer));
    layersRef.current = [];

    // Custom Icon Generator
    const createIcon = (colorClass: string, shadowClass: string, isPulse: boolean = false) => {
      const html = `<div class="w-4 h-4 rounded-full border-2 border-white ${colorClass} ${shadowClass} ${isPulse ? 'animate-pulse' : ''}"></div>`;
      return L.divIcon({
        html,
        className: '', // Remove default leaflet styles
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
    };

    // Plot Encuestas
    encuestas.forEach(enc => {
      let color = 'bg-accentGreen';
      let shadow = 'shadow-[0_0_10px_#10b981]';
      if (enc.apoyo === Apoyo.NO) {
        color = 'bg-accentRed';
        shadow = 'shadow-[0_0_10px_#ef4444]';
      } else if (enc.apoyo === Apoyo.INDECISO) {
        color = 'bg-accentAmber';
        shadow = 'shadow-[0_0_10px_#f59e0b]';
      }

      const marker = L.marker([enc.lat, enc.lng], { 
        icon: createIcon(color, shadow) 
      }).bindPopup(`<div style="color: #121820;"><b>${enc.zona}</b><br>Manzana: ${enc.manzana}<br>Apoyo: ${enc.apoyo}</div>`);
      
      marker.addTo(mapInstance.current);
      layersRef.current.push(marker);
    });

    // Draw Paths for Heatmap/Tracker
    if (showPaths && encuestas.length > 0) {
      const pathsByUser: Record<string, [number, number][]> = {};
      
      // Sort by time to draw paths correctly
      const sorted = [...encuestas].sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
      
      sorted.forEach(enc => {
        if (!pathsByUser[enc.encuestadorName]) pathsByUser[enc.encuestadorName] = [];
        pathsByUser[enc.encuestadorName].push([enc.lat, enc.lng]);
      });

      const colors = ['#61abd7', '#10b981', '#f59e0b', '#a855f7', '#ec4899'];
      let cIdx = 0;

      Object.entries(pathsByUser).forEach(([user, path]) => {
        if (path.length > 1) {
          const polyline = L.polyline(path, { color: colors[cIdx % colors.length], weight: 4, opacity: 0.8, dashArray: '5, 10' });
          polyline.addTo(mapInstance.current);
          polyline.bindPopup(`<div style="color: #121820;">Ruta de: ${user}</div>`);
          layersRef.current.push(polyline);
          cIdx++;
        }
      });
    }

    // Plot Actividades
    actividades.forEach(act => {
      let colorClass = 'bg-accentAmber border-accentAmber shadow-[0_0_15px_#f59e0b]';
      if (act.asistenciaReal === Asistencia.SI) colorClass = 'bg-accentGreen border-accentGreen shadow-[0_0_15px_#10b981]';
      if (act.asistenciaReal === Asistencia.NO) colorClass = 'bg-accentRed border-accentRed shadow-[0_0_15px_#ef4444]';

      const html = `
        <div class="relative flex items-center justify-center w-6 h-6">
          <div class="absolute inset-0 rounded-sm border-2 ${colorClass.split(' ')[1]} bg-darkPanel z-10"></div>
          <div class="w-2 h-2 rounded-full ${colorClass.split(' ')[0]} z-20"></div>
          <div class="absolute inset-0 rounded-sm ${colorClass} opacity-30 animate-ping z-0"></div>
        </div>
      `;
      
      const icon = L.divIcon({ html, className: '', iconSize: [24, 24], iconAnchor: [12, 12] });
      const marker = L.marker([act.lat, act.lng], { icon })
        .bindPopup(`<div style="color: #121820;"><b>Actividad:</b> ${act.nombre}<br><b>Asistencia:</b> ${act.asistenciaReal}</div>`);
      
      marker.addTo(mapInstance.current);
      layersRef.current.push(marker);
    });

    // Plot Current Center (User Location)
    if (center) {
      const icon = createIcon('bg-primary', 'shadow-[0_0_15px_#61abd7]', true);
      const marker = L.marker([center.lat, center.lng], { icon, zIndexOffset: 1000 })
        .bindPopup("<div style='color: #121820;'>Ubicación Actual</div>");
      marker.addTo(mapInstance.current);
      layersRef.current.push(marker);
    }

  }, [encuestas, actividades, center, showPaths]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-darkBorder shadow-inner">
      <div ref={mapRef} className="absolute inset-0 bg-[#e5e7eb]"></div>
      
      {/* Overlays for UX */}
      <div className="absolute top-4 left-4 z-[400] text-xs font-mono text-primary/80 font-bold tracking-widest flex items-center gap-2 bg-darkBg/80 px-3 py-1.5 rounded-full border border-primary/20 backdrop-blur-sm shadow-md">
        <span className="w-2 h-2 rounded-full bg-accentGreen animate-pulse"></span>
        SAT-LINK: ACTIVE
      </div>
    </div>
  );
};
