// Interfaces básicas
export interface Especie {
  id: string;
  descripcion: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export interface Mascota {
  id: string;
  nombre: string;
  sexo: string;
  raza: string;
  fechaNacimiento: string;
  peso?: number;
  cliente: Cliente;
  especie: Especie;
}

export interface Horario {
  id: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface Cita {
  id: string;
  motivo: string;
  fechaProgramada: string;
  fechaReservacion: string;
  cliente: Cliente;
  horario: Horario;
  mascota: Mascota;
}

export interface Diagnostico {
  id: string;
  descripcion: string;
  fechaDiagnostico: string;
  observaciones?: string;
  mascota: Mascota;
}

export interface Tratamiento {
  id: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  instrucciones: string;
  estado: string;
  diagnostico: Diagnostico;
}

export interface Vacuna {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMeses: number;
  laboratorio: string;
  edadMinimaDias: number;
}

export interface AplicacionVacuna {
  id: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  veterinario: string;
  observaciones?: string;
  lote: string;
  mascota: Mascota;
  vacuna: Vacuna;
}

// Interfaces para inputs de creación (nombres del schema)
export interface EspecieInput {
  descripcion: string;
}

export interface ClienteInput {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export interface MascotaInput {
  nombre: string;
  sexo: string;
  raza: string;
  fechaNacimiento: string;
  peso?: number;
  clienteId: string;
  especieId: string;
}

export interface HorarioInput {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface CitaInput {
  motivo: string;
  fechaProgramada: string;
  clienteId: string;
  horarioId: string;
  mascotaId: string;
}

export interface DiagnosticoInput {
  descripcion: string;
  observaciones?: string;
  mascotaId: string;
}

export interface TratamientoInput {
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  instrucciones?: string;
  estado: string;
  diagnosticoId: string;
}

export interface VacunaInput {
  nombre: string;
  descripcion: string;
  duracionMeses?: number;
  laboratorio: string;
  edadMinimaDias?: number;
}

export interface MascotaVacunaInput {
  fechaAplicacion: string;
  fechaProximaDosis?: string;
  veterinario: string;
  observaciones?: string;
  lote?: string;
  mascotaId: string;
  vacunaId: string;
}

// Interfaces para inputs de actualización (nombres del schema) 
export interface EspecieUpdateInput {
  id: string;
  descripcion: string;
}

export interface ClienteUpdateInput {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export interface MascotaUpdateInput {
  id: string;
  nombre: string;
  sexo: string;
  raza: string;
  fechaNacimiento: string;
  peso?: number;
  clienteId: string;
  especieId: string;
}

export interface HorarioUpdateInput {
  id: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface CitaUpdateInput {
  id: string;
  motivo?: string;
  fechaProgramada?: string;
  clienteId?: string;
  horarioId?: string;
  mascotaId?: string;
}

export interface DiagnosticoUpdateInput {
  id: string;
  descripcion?: string;
  observaciones?: string;
  mascotaId?: string;
}

export interface TratamientoUpdateInput {
  id: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  instrucciones?: string;
  estado?: string;
  diagnosticoId?: string;
}

export interface VacunaUpdateInput {
  id: string;
  nombre?: string;
  descripcion?: string;
  duracionMeses?: number;
  laboratorio?: string;
  edadMinimaDias?: number;
}

export interface MascotaVacunaUpdateInput {
  id: string;
  fechaAplicacion?: string;
  fechaProximaDosis?: string;
  veterinario?: string;
  observaciones?: string;
  lote?: string;
  mascotaId?: string;
  vacunaId?: string;
}