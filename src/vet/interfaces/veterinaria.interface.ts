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

// Interfaces para inputs de creación
export interface CreateEspecieInput {
  descripcion: string;
}

export interface CreateClienteInput {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export interface CreateMascotaInput {
  nombre: string;
  sexo: string;
  raza: string;
  fechaNacimiento: string;
  peso?: number;
  clienteId: string;
  especieId: string;
}

export interface CreateHorarioInput {
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface CreateCitaInput {
  motivo: string;
  fechaProgramada: string;
  clienteId: string;
  horarioId: string;
  mascotaId: string;
}

export interface CreateDiagnosticoInput {
  descripcion: string;
  observaciones?: string;
  mascotaId: string;
}

export interface CreateTratamientoInput {
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  instrucciones: string;
  estado: string;
  diagnosticoId: string;
}

export interface CreateVacunaInput {
  nombre: string;
  descripcion: string;
  duracionMeses: number;
  laboratorio: string;
  edadMinimaDias: number;
}

export interface AplicarVacunaInput {
  mascotaId: string;
  vacunaId: string;
  fechaAplicacion: string;
  veterinario: string;
  observaciones?: string;
  lote: string;
}

// Interfaces para inputs de actualización
export interface UpdateEspecieInput {
  id: string;
  descripcion: string;
}

export interface UpdateClienteInput {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
}

export interface UpdateMascotaInput {
  id: string;
  nombre: string;
  sexo: string;
  raza: string;
  fechaNacimiento: string;
  peso?: number;
  clienteId: string;
  especieId: string;
}

export interface UpdateHorarioInput {
  id: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
}

export interface UpdateCitaInput {
  id: string;
  motivo: string;
  fechaProgramada: string;
  clienteId: string;
  horarioId: string;
  mascotaId: string;
}

export interface UpdateDiagnosticoInput {
  id: string;
  descripcion: string;
  observaciones?: string;
  mascotaId: string;
}

export interface UpdateTratamientoInput {
  id: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  instrucciones: string;
  estado: string;
  diagnosticoId: string;
}

export interface UpdateVacunaInput {
  id: string;
  nombre: string;
  descripcion: string;
  duracionMeses: number;
  laboratorio: string;
  edadMinimaDias: number;
}