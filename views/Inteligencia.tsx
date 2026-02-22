import React, { useState, useRef } from 'react';
import { analyzeImage, editImage } from '../services/geminiService';
import { Icons } from '../constants';

export const InteligenciaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'edit'>('analyze');
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const processRequest = async () => {
    if (!image) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (activeTab === 'analyze') {
        const textResponse = await analyzeImage(image, mimeType, prompt || "Describe detalladamente esta imagen para un reporte de campaña.");
        setResult(textResponse);
      } else {
        if (!prompt) {
          setError("Se requiere un prompt de texto para editar.");
          setLoading(false);
          return;
        }
        const imgResponse = await editImage(image, mimeType, prompt);
        setResult(imgResponse);
      }
    } catch (err: any) {
      setError(err.message || "Error procesando la solicitud. Verifique la API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-darkBorder pb-4">
        <h1 className="text-2xl font-bold tracking-widest text-slate-800 flex items-center gap-3">
          <Icons.Brain className="text-primary w-8 h-8" />
          INTELIGENCIA TÁCTICA
        </h1>
        
        {/* Tab Switcher */}
        <div className="flex bg-slate-50 rounded-lg p-1 border border-darkBorder">
          <button 
            onClick={() => { setActiveTab('analyze'); setResult(null); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'analyze' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Analizar Imagen
          </button>
          <button 
            onClick={() => { setActiveTab('edit'); setResult(null); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'edit' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Editar Imagen
          </button>
        </div>
      </div>

      <div className="bg-darkPanel border border-darkBorder rounded-xl p-6 shadow-sm">
        <p className="text-slate-500 mb-6 text-sm">
          {activeTab === 'analyze' 
            ? "Módulo de visión computacional. Sube fotos de campo, panfletos o eventos para obtener un análisis detallado del contexto usando Gemini Pro."
            : "Módulo de edición generativa. Modifica imágenes de campaña usando prompts de texto (ej. 'Agrega un filtro retro') usando Gemini Flash."}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Input */}
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed ${image ? 'border-primary/50' : 'border-darkBorder hover:border-primary/50'} rounded-lg h-64 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-slate-50 transition`}
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Upload" className="absolute inset-0 w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center p-6">
                  <Icons.Image className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 font-bold">Clic para subir imagen</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1 uppercase font-bold">
                {activeTab === 'analyze' ? "Instrucción Específica (Opcional)" : "Instrucción de Edición (Requerida)"}
              </label>
              <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                className="w-full bg-slate-50 border border-darkBorder rounded p-3 text-slate-800 focus:border-primary focus:outline-none" 
                rows={3}
                placeholder={activeTab === 'analyze' ? "¿Qué deseas saber de esta imagen?" : "Ej: Remueve a la persona del fondo"}
              ></textarea>
            </div>

            <button 
              onClick={processRequest}
              disabled={!image || loading}
              className="w-full bg-primary hover:bg-primaryDark disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded transition flex justify-center items-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Procesando...</>
              ) : (
                <><Icons.Brain className="w-5 h-5" /> {activeTab === 'analyze' ? 'Analizar' : 'Generar'}</>
              )}
            </button>
            {error && <p className="text-accentRed text-sm font-bold">{error}</p>}
          </div>

          {/* Right: Output */}
          <div className="bg-slate-50 border border-darkBorder rounded-lg p-4 min-h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 border-b border-darkBorder pb-2">Resultado Operativo</h3>
            
            <div className="flex-1 overflow-auto">
              {!result && !loading && (
                 <div className="h-full flex items-center justify-center text-slate-400 italic text-sm font-bold">Esperando datos...</div>
              )}
              {loading && (
                 <div className="h-full flex flex-col items-center justify-center text-primary/70 text-sm gap-4 font-bold">
                   <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                   Estableciendo enlace con Mainframe IA...
                 </div>
              )}
              {result && activeTab === 'analyze' && (
                <div className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {result}
                </div>
              )}
              {result && activeTab === 'edit' && (
                <div className="w-full h-full flex items-center justify-center">
                   <img src={result} alt="Generated" className="max-w-full max-h-full object-contain rounded border border-primary/30 shadow-sm" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
