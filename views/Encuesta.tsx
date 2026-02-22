import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Apoyo, Prioridad, Role } from '../types';
import { ZONAS_VENTANILLA, MOTIVOS_RECHAZO, Icons } from '../constants';
import { TacticalMap } from '../components/TacticalMap';

export const EncuestaView: React.FC = () => {
  const { currentUser, addEncuesta } = useAppStore();
  
  // Form State
  const [zona, setZona] = useState('');
  const [manzana, setManzana] = useState('');
  const [lote, setLote] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [apoyo, setApoyo] = useState<Apoyo | null>(null);
  
  // Condicionales de Datos Personales
  const [comparteDatos, setComparteDatos] = useState<boolean | null>(null);
  const [dni, setDni] = useState('');
  const [celular, setCelular] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  
  const [motivo, setMotivo] = useState('');
  
  // GPS State
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [calibrating, setCalibrating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persistence State
  const [responsable, setResponsable] = useState(currentUser?.name || '');
  const [showResponsableAlert, setShowResponsableAlert] = useState(false);
  const [lastManzana, setLastManzana] = useState('');
  const [formError, setFormError] = useState('');

  const fetchGPS = () => {
    setCalibrating(true);
    if ("geolocation" in navigator) {
      const geoOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setGpsLoading(false);
          setCalibrating(false);
        },
        (error) => {
          console.error("GPS Error:", error);
          alert("Error obteniendo ubicación precisa. Verifique que el GPS esté encendido y otorgue permisos.");
          // Fallback to Ventanilla approximate if failed, so they aren't completely blocked
          if (!location) {
            setLocation({
              lat: -11.875,
              lng: -77.125
            });
          }
          setGpsLoading(false);
          setCalibrating(false);
        },
        geoOptions
      );
    } else {
      alert("Geolocalización no soportada en su navegador.");
      setGpsLoading(false);
      setCalibrating(false);
    }
  };

  // Fetch Real GPS Coordinates with high accuracy on mount
  useEffect(() => {
    fetchGPS();
  }, []);

  const resetForm = () => {
    setLote('');
    setCantidad(1);
    setApoyo(null);
    setComparteDatos(null);
    setDni('');
    setCelular('');
    setWhatsapp('');
    setMotivo('');
    setFormError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!location) {
      setFormError("Espere a obtener coordenadas GPS.");
      return;
    }
    
    if (!zona || !manzana || !cantidad || !apoyo) {
      setFormError("Faltan campos obligatorios. Seleccione Zona, Manzana y Posición Política.");
      return;
    }

    if (apoyo === Apoyo.SI && comparteDatos === null) {
      setFormError("Debe indicar si el ciudadano comparte sus datos.");
      return;
    }

    if (apoyo === Apoyo.SI && comparteDatos) {
       if (dni.length !== 8) {
          setFormError("El DNI debe tener 8 dígitos.");
          return;
       }
       if (celular.length !== 9) {
          setFormError("El celular debe tener 9 dígitos.");
          return;
       }
       if (whatsapp.length !== 9) {
          setFormError("El WhatsApp debe tener 9 dígitos.");
          return;
       }
    }

    if ((apoyo === Apoyo.NO || apoyo === Apoyo.INDECISO) && !motivo) {
       setFormError("Debe seleccionar un motivo principal.");
       return;
    }

    setIsSubmitting(true);

    // Determine Priority
    let prioridad = Prioridad.BAJA;
    if (apoyo === Apoyo.NO) prioridad = Prioridad.ALTA;
    if (apoyo === Apoyo.INDECISO) prioridad = Prioridad.MEDIA;

    try {
      await addEncuesta({
        lat: location.lat,
        lng: location.lng,
        zona,
        manzana,
        lote,
        cantidadVotantes: cantidad,
        apoyo: apoyo as Apoyo,
        comparteDatos: apoyo === Apoyo.SI ? (comparteDatos ?? false) : undefined,
        dni: (apoyo === Apoyo.SI && comparteDatos) ? dni : undefined,
        celular: (apoyo === Apoyo.SI && comparteDatos) ? celular : undefined,
        whatsapp: (apoyo === Apoyo.SI && comparteDatos) ? whatsapp : undefined,
        motivoRechazo: (apoyo === Apoyo.NO || apoyo === Apoyo.INDECISO) ? motivo : undefined,
        prioridad,
        encuestadorId: currentUser!.id,
        encuestadorName: responsable,
      });

      alert("Registro Exitoso. Fecha/Hora y Operador guardados en el sistema.");

      if (manzana !== lastManzana && lastManzana !== '') {
        setShowResponsableAlert(true);
      } else {
        resetForm();
      }
      setLastManzana(manzana);
    } catch (err) {
      setFormError("Error inesperado al registrar el punto. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Panel Formulario */}
      <div className="bg-darkPanel border border-darkBorder rounded-xl p-6 shadow-lg relative z-10">
        <div className="flex items-center justify-between mb-6 border-b border-darkBorder pb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Icons.Target className="text-primary" />
            Operación Campo
          </h2>
          <div className={`px-3 py-1 rounded-full text-xs font-mono border ${gpsLoading || calibrating ? 'bg-accentAmber/10 border-accentAmber/50 text-accentAmber' : 'bg-accentGreen/10 border-accentGreen/50 text-accentGreen'}`}>
            {gpsLoading || calibrating ? 'Buscando Satélite...' : 'GPS: FIX'}
          </div>
        </div>

        {formError && (
          <div className="mb-4 p-3 bg-accentRed/10 border border-accentRed/50 rounded text-accentRed text-sm flex items-center gap-2 animate-fade-in">
            <Icons.X className="w-5 h-5 flex-shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {showResponsableAlert ? (
          <div className="bg-darkPanel p-6 rounded-lg text-center border border-primary/50 shadow-sm animate-fade-in">
            <h3 className="text-lg text-slate-800 mb-4">¿Sigue siendo el mismo Responsable de Manzana?</h3>
            <p className="text-primary font-bold mb-6">{responsable}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => { setShowResponsableAlert(false); resetForm(); }}
                className="px-4 py-2 bg-slate-100 text-slate-800 border border-darkBorder rounded hover:bg-slate-200 transition"
              >
                Cambiar Responsable
              </button>
              <button 
                onClick={() => { setShowResponsableAlert(false); resetForm(); }}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primaryDark transition"
              >
                Continuar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2 uppercase">Zona *</label>
                <select value={zona} onChange={e => setZona(e.target.value)} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800">
                  <option value="">Seleccione...</option>
                  {ZONAS_VENTANILLA.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2 uppercase">Manzana *</label>
                <input type="text" value={manzana} onChange={e => setManzana(e.target.value.toUpperCase())} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" placeholder="Ej: C4" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2 uppercase">Lote (Opcional)</label>
                <input type="text" value={lote} onChange={e => setLote(e.target.value)} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2 uppercase">Cant. Votantes (18+) *</label>
                <input type="number" min="1" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value))} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" />
              </div>
            </div>

            <div className="border-t border-darkBorder pt-4">
              <label className="block text-sm font-bold text-slate-800 mb-3 uppercase">Posición Política *</label>
              <div className="grid grid-cols-3 gap-3">
                <button type="button" onClick={() => { setApoyo(Apoyo.SI); setComparteDatos(null); }} className={`py-3 rounded border font-bold transition-all ${apoyo === Apoyo.SI ? 'bg-accentGreen/20 border-accentGreen text-accentGreen shadow-sm' : 'bg-slate-50 border-darkBorder text-slate-500'}`}>SÍ</button>
                <button type="button" onClick={() => setApoyo(Apoyo.INDECISO)} className={`py-3 rounded border font-bold transition-all ${apoyo === Apoyo.INDECISO ? 'bg-accentAmber/20 border-accentAmber text-accentAmber shadow-sm' : 'bg-slate-50 border-darkBorder text-slate-500'}`}>INDECISO</button>
                <button type="button" onClick={() => setApoyo(Apoyo.NO)} className={`py-3 rounded border font-bold transition-all ${apoyo === Apoyo.NO ? 'bg-accentRed/20 border-accentRed text-accentRed shadow-sm' : 'bg-slate-50 border-darkBorder text-slate-500'}`}>NO</button>
              </div>
            </div>

            {/* Campos Condicionales SI */}
            {apoyo === Apoyo.SI && (
              <div className="bg-accentGreen/5 p-4 rounded border border-accentGreen/20 space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">¿Comparte sus datos? *</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setComparteDatos(true)} className={`flex-1 py-2 rounded border transition-all ${comparteDatos === true ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-50 border-darkBorder text-slate-500'}`}>SÍ</button>
                    <button type="button" onClick={() => setComparteDatos(false)} className={`flex-1 py-2 rounded border transition-all ${comparteDatos === false ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-slate-50 border-darkBorder text-slate-500'}`}>NO</button>
                  </div>
                </div>

                {comparteDatos === true && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-accentGreen/20 animate-fade-in">
                    <div className="md:col-span-2">
                      <label className="block text-xs text-accentGreen mb-1 font-bold">DNI (Solo 8 dígitos) *</label>
                      <input type="text" maxLength={8} value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, ''))} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" placeholder="12345678" />
                    </div>
                    <div>
                      <label className="block text-xs text-accentGreen mb-1 font-bold">Celular (Solo 9 dígitos) *</label>
                      <input type="text" maxLength={9} value={celular} onChange={e => setCelular(e.target.value.replace(/\D/g, ''))} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" placeholder="987654321" />
                    </div>
                    <div>
                      <label className="block text-xs text-accentGreen mb-1 font-bold">Whatsapp (Solo 9 dígitos) *</label>
                      <input type="text" maxLength={9} value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/\D/g, ''))} className="w-full bg-slate-50 border border-darkBorder rounded p-2 text-slate-800" placeholder="987654321" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Campos Condicionales NO / INDECISO */}
            {(apoyo === Apoyo.NO || apoyo === Apoyo.INDECISO) && (
              <div className="bg-slate-50 p-4 rounded border border-darkBorder space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs text-slate-500 mb-1 font-bold">Motivo Principal *</label>
                  <select value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full bg-white border border-darkBorder rounded p-2 text-slate-800">
                    <option value="">Seleccione un motivo...</option>
                    {MOTIVOS_RECHAZO.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={gpsLoading || calibrating || isSubmitting}
              className="w-full mt-6 bg-primary hover:bg-primaryDark disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded transition shadow-lg flex justify-center items-center gap-2"
            >
              <Icons.Target className="w-5 h-5" />
              {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR PUNTO TÁCTICO'}
            </button>
          </form>
        )}
      </div>

      {/* Panel Mapa / Status */}
      <div className="flex flex-col gap-6 h-[600px] lg:h-auto">
        <div className="bg-darkPanel border border-darkBorder rounded-xl flex-1 relative overflow-hidden p-2 flex flex-col">
          <div className="absolute top-4 right-4 z-[1000]">
            <button 
              onClick={fetchGPS} 
              disabled={calibrating}
              title="Calibrar GPS"
              className="bg-primary hover:bg-primaryDark text-white p-3 rounded-full shadow-[0_0_15px_rgba(97,171,215,0.5)] transition flex items-center justify-center disabled:opacity-50"
            >
              <Icons.Crosshair className={`w-5 h-5 ${calibrating ? 'animate-spin' : ''}`} />
            </button>
          </div>
          {location ? (
             <TacticalMap center={location} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 z-10 bg-darkBg">
               <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
               <p>Estableciendo enlace satelital...</p>
            </div>
          )}
        </div>
        
        <div className="bg-darkPanel border border-darkBorder rounded-xl p-4">
           <h3 className="text-sm text-slate-500 uppercase font-bold mb-3">Status de Operador</h3>
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-3 rounded border border-darkBorder">
               <p className="text-xs text-slate-500 font-bold">COORDENADAS</p>
               <p className="text-sm font-mono text-primary mt-1">
                 {location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'OFFLINE'}
               </p>
             </div>
             <div className="bg-slate-50 p-3 rounded border border-darkBorder">
               <p className="text-xs text-slate-500 font-bold">ZONA ACTIVA</p>
               <p className="text-sm font-bold text-slate-800 mt-1 truncate">{zona || 'NO ASIGNADA'}</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
