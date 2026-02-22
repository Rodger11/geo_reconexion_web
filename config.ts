/**
 * Configuración Global de la Aplicación
 * Preparado para despliegue en la nube (AWS, Azure, Google Cloud, Vercel, etc.)
 */
export const CONFIG = {
  // Cambiar a la URL de tu backend en producción (Ej: https://api.midominio.com)
  // Si está vacío (''), usará rutas relativas asumiendo que el front y back están en el mismo host.
  API_BASE_URL: import.meta.env.VITE_API_URL || '',

  // Timeout para las peticiones al servidor (en milisegundos)
  API_TIMEOUT: 15000,

  // Sistema de reintentos para zonas con baja cobertura (Ventanilla / Pachacútec)
  MAX_RETRIES: 3,

  // Configuración de Mapas
  MAPS: {
    DEFAULT_CENTER: { lat: -11.875, lng: -77.125 }, // Ventanilla Centro
    DEFAULT_ZOOM: 14,
  }
};
