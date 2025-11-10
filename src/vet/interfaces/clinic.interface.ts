// Interfaces principales
export interface Doctor {
  id: string;
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  email: string;
  fotourl?: string;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  fotourl?: string;
}

export interface Especie {
  id: string;
  descripcion: string;
}

export interface Mascota {
  id: string;
  nombre: string;
  fechanacimiento: string;
  raza: string;
  sexo: string;
  fotourl?: string;
  cliente: Cliente;
  especie: Especie;
}

export interface BloqueHorario {
  id: string;
  diasemana: number;
  horainicio: string;
  horafinal: string;
  activo: number;
}

export interface Cita {
  id: string;
  fechacreacion: string;
  motivo: string;
  fechareserva: string;
  estado: number;
  doctor: Doctor;
  mascota: Mascota;
  bloqueHorario?: BloqueHorario;
}

export interface Diagnostico {
  id: string;
  descripcion: string;
  fecharegistro: string;
  observaciones: string;
  cita: Cita;
  tratamientos: Tratamiento[];
}

export interface Tratamiento {
  id: string;
  nombre: string;
  descripcion: string;
  observaciones: string;
  diagnostico: Diagnostico;
}

export interface Vacuna {
  id: string;
  descripcion: string;
}

export interface CarnetVacunacion {
  id: string;
  fechaemision: string;
  mascota: Mascota;
  detallesVacunacion: DetalleVacunacion[];
}

export interface DetalleVacunacion {
  id: string;
  fechavacunacion: string;
  proximavacunacion?: string;
  carnetVacunacion: CarnetVacunacion;
  vacuna: Vacuna;
}

// Interfaces para Input de creación
export interface DoctorInput {
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  email: string;
  fotourl?: string;
}

export interface ClienteInput {
  nombre: string;
  apellido: string;
  ci: string;
  telefono: string;
  fotourl?: string;
}

export interface MascotaInput {
  nombre: string;
  fechanacimiento: string;
  raza: string;
  sexo: string;
  fotourl?: string;
  clienteId: number;
  especieId: number;
}

export interface EspecieInput {
  descripcion: string;
}

export interface BloqueHorarioInput {
  diasemana: number;
  horainicio: string;
  horafinal: string;
  activo: number;
}

export interface CitaInput {
  fechacreacion: string;
  motivo: string;
  fechareserva: string;
  estado: number;
  mascotaId: number;
  doctorId: number;
  bloqueHorarioId?: number;
}

export interface DiagnosticoInput {
  descripcion: string;
  fecharegistro: string;
  observaciones: string;
  citaId: number;
}

export interface TratamientoInput {
  nombre: string;
  descripcion: string;
  observaciones: string;
  diagnosticoId: number;
}

export interface VacunaInput {
  descripcion: string;
}

export interface CarnetVacunacionInput {
  fechaemision: string;
  mascotaId: number;
}

export interface DetalleVacunacionInput {
  fechavacunacion: string;
  proximavacunacion?: string;
  carnetVacunacionId: number;
  vacunaId: number;
}

// Interfaces para Input de actualización
export interface DoctorUpdateInput {
  id: number;
  nombre?: string;
  apellido?: string;
  ci?: string;
  telefono?: string;
  email?: string;
  fotourl?: string;
}

export interface ClienteUpdateInput {
  id: number;
  nombre?: string;
  apellido?: string;
  ci?: string;
  telefono?: string;
  fotourl?: string;
}

export interface MascotaUpdateInput {
  id: number;
  nombre?: string;
  fechanacimiento?: string;
  raza?: string;
  sexo?: string;
  fotourl?: string;
  clienteId?: number;
  especieId?: number;
}

export interface EspecieUpdateInput {
  id: number;
  descripcion?: string;
}

export interface BloqueHorarioUpdateInput {
  id: number;
  diasemana?: number;
  horainicio?: string;
  horafinal?: string;
  activo?: number;
}

export interface CitaUpdateInput {
  id: string;
  fechacreacion?: string;
  motivo?: string;
  fechareserva?: string;
  estado?: number;
}

export interface DiagnosticoUpdateInput {
  id: string;
  descripcion?: string;
  fecharegistro?: string;
  observaciones?: string;
}

export interface TratamientoUpdateInput {
  id: string;
  nombre?: string;
  descripcion?: string;
  observaciones?: string;
}

export interface VacunaUpdateInput {
  id: string;
  descripcion?: string;
}

export interface CarnetVacunacionUpdateInput {
  id: string;
  fechaemision?: string;
}

export interface DetalleVacunacionUpdateInput {
  id: string;
  fechavacunacion?: string;
  proximavacunacion?: string;
}