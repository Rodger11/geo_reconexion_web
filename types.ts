export enum Role {
  ADMIN = 'ADMIN',
  MONITOR = 'MONITOR',
  COORDINADOR = 'COORDINADOR',
  ENCUESTADOR = 'ENCUESTADOR'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  role: Role;
  name: string;
  cargo?: string; // LIDER, COORDINADOR, DELEGADO
  zona?: string;
  activo?: boolean;
}

export enum Apoyo {
  SI = 'SI',
  NO = 'NO',
  INDECISO = 'INDECISO'
}

export enum Prioridad {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAJA = 'BAJA'
}

export interface Encuesta {
  id: string;
  fechaHora: string;
  lat: number;
  lng: number;
  zona: string;
  manzana: string;
  lote?: string;
  cantidadVotantes: number;
  apoyo: Apoyo;
  comparteDatos?: boolean;
  dni?: string;
  celular?: string;
  whatsapp?: string;
  motivoRechazo?: string;
  prioridad: Prioridad;
  encuestadorId: string;
  encuestadorName: string;
}

export enum Asistencia {
  SI = 'SI',
  NO = 'NO',
  PENDIENTE = 'PENDIENTE'
}

export interface Actividad {
  id: string;
  tipo: string;
  nombre: string;
  fecha: string;
  hora: string;
  asistenciaEsperada: string;
  asistenciaReal: Asistencia;
  direccion: string;
  zona: string;
  observaciones?: string;
  lat: number;
  lng: number;
  fotoUrl?: string;
}

export interface Personal {
  id: string;
  estado: boolean; // true = ACTIVO, false = INACTIVO
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombres: string;
  tipoDoc: string; // DNI / CE
  numeroDoc: string;
  telefono: string;
  whatsapp: string;
  fechaNacimiento: string;
  sexo: string; // MASCULINO / FEMENINO
  esPadreMadre: string; // PADRE, NO PADRE, MADRE, NO MADRE
  correo: string;
  cargoPartido: string; // LIDER, COORDINADOR, DELEGADO, APOYO
  profesion: string;
  profesionOtro?: string;
  ocupacion: string;
  ocupacionOtro?: string;
  zona: string;
}

export interface AppState {
  currentUser: User | null;
  encuestas: Encuesta[];
  actividades: Actividad[];
  users: User[];
  personal: Personal[];
}
