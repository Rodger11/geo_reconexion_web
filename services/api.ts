import { CONFIG } from '../config';
import { Encuesta, Actividad, Personal, User } from '../types';

/**
 * Capa de Servicios de Red (API Service Layer)
 * Esta capa es la encargada de comunicarse con tu Backend (.NET, Node.js, Python, etc.)
 * el cual estará conectado a tu base de datos SQL Server 2022.
 */

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = CONFIG.API_BASE_URL;
  }

  private async fetchWithTimeout(resource: string, options: RequestInit = {}) {
    const { timeout = CONFIG.API_TIMEOUT } = options as any;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`${this.baseUrl}${resource}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });

    clearTimeout(id);
    return response;
  }

  // --- MÓDULO DE ENCUESTAS / OPERACIÓN CAMPO ---
  async guardarEncuesta(encuesta: Encuesta): Promise<void> {
    try {
      // En producción, descomentar la siguiente línea para enviar a SQL Server

      const res = await this.fetchWithTimeout('/api/encuestas', {
        method: 'POST',
        body: JSON.stringify(encuesta)
      });
      if (!res.ok) throw new Error('Error al guardar encuesta en el servidor');

      console.log('✅ [API Simulate] Encuesta enviada al Backend:', encuesta);
    } catch (error) {
      console.error('❌ [API Error] Fallo al conectar con el servidor:', error);
      throw error;
    }
  }

  async obtenerEncuestas(): Promise<Encuesta[]> {
    try {
      const res = await this.fetchWithTimeout('/api/encuestas');
      return await res.json();
      return []; // Simulado para que funcione sin backend por ahora
    } catch (error) {
      console.error('❌ [API Error] Fallo al obtener encuestas:', error);
      return [];
    }
  }

  // --- MÓDULO DE ACTIVIDADES ---
  async guardarActividad(actividad: Actividad): Promise<void> {
    try {
      /*
      const res = await this.fetchWithTimeout('/api/actividades', {
        method: 'POST',
        body: JSON.stringify(actividad)
      });
      if (!res.ok) throw new Error('Error al guardar actividad');
      */
      console.log('✅ [API Simulate] Actividad enviada al Backend:', actividad);
    } catch (error) {
      throw error;
    }
  }

  // --- MÓDULO DE RECURSOS HUMANOS ---
  async guardarPersonal(personal: Personal): Promise<void> {
    try {
      /*
      const res = await this.fetchWithTimeout('/api/personal', {
        method: 'POST',
        body: JSON.stringify(personal)
      });
      if (!res.ok) throw new Error('Error al guardar personal');
      */
      console.log('✅ [API Simulate] Personal enviado al Backend:', personal);
    } catch (error) {
      throw error;
    }
  }
}

export const api = new ApiService();
