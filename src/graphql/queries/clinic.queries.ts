import { gql } from '@apollo/client';

// Queries para Doctores
export const GET_DOCTORES = gql`
  query GetDoctores {
    doctores {
      id
      nombre
      apellido
      ci
      telefono
      email
      fotourl
    }
  }
`;

export const GET_DOCTOR = gql`
  query GetDoctor($id: ID!) {
    doctor(id: $id) {
      id
      nombre
      apellido
      ci
      telefono
      email
      fotourl
    }
  }
`;

// Queries para Clientes
export const GET_CLIENTES = gql`
  query GetClientes {
    clientes {
      id
      nombre
      apellido
      ci
      telefono
      fotourl
    }
  }
`;

export const GET_CLIENTE = gql`
  query GetCliente($id: ID!) {
    cliente(id: $id) {
      id
      nombre
      apellido
      ci
      telefono
      fotourl
    }
  }
`;

// Queries para Especies
export const GET_ESPECIES = gql`
  query GetEspecies {
    especies {
      id
      descripcion
    }
  }
`;

export const GET_ESPECIE = gql`
  query GetEspecie($id: ID!) {
    especie(id: $id) {
      id
      descripcion
    }
  }
`;

// Queries para Mascotas
export const GET_MASCOTAS = gql`
  query GetMascotas {
    mascotas {
      id
      nombre
      fechanacimiento
      raza
      sexo
      fotourl
      cliente {
        id
        nombre
        apellido
        ci
        telefono
        fotourl
      }
      especie {
        id
        descripcion
      }
    }
  }
`;

export const GET_MASCOTA = gql`
  query GetMascota($id: ID!) {
    mascota(id: $id) {
      id
      nombre
      fechanacimiento
      raza
      sexo
      fotourl
      cliente {
        id
        nombre
        apellido
        ci
        telefono
        fotourl
      }
      especie {
        id
        descripcion
      }
    }
  }
`;

export const GET_MASCOTAS_POR_CLIENTE = gql`
  query GetMascotasPorCliente($clienteId: ID!) {
    mascotasPorCliente(clienteId: $clienteId) {
      id
      nombre
      fechanacimiento
      raza
      sexo
      fotourl
      especie {
        id
        descripcion
      }
    }
  }
`;

// Queries para Bloques Horarios
export const GET_BLOQUES_HORARIOS = gql`
  query GetBloquesHorarios {
    bloquesHorarios {
      id
      diasemana
      horainicio
      horafinal
      activo
    }
  }
`;

export const GET_BLOQUES_HORARIOS_ACTIVOS = gql`
  query GetBloquesHorariosActivos {
    bloquesHorariosActivos {
      id
      diasemana
      horainicio
      horafinal
      activo
    }
  }
`;

// Queries para Citas
export const GET_CITAS = gql`
  query GetCitas {
    citas {
      id
      fechacreacion
      motivo
      fechareserva
      estado
      doctor {
        id
        nombre
        apellido
        ci
        telefono
        email
        fotourl
      }
      mascota {
        id
        nombre
        raza
        fechanacimiento
        cliente {
          nombre
          apellido
          ci
        }
        especie {
          descripcion
        }
      }
      bloqueHorario {
        id
        diasemana
        horainicio
        horafinal
        activo
      }
    }
  }
`;

export const GET_CITA = gql`
  query GetCita($id: ID!) {
    cita(id: $id) {
      id
      fechacreacion
      motivo
      fechareserva
      estado
      doctor {
        id
        nombre
        apellido
        ci
        telefono
        email
        fotourl
      }
      mascota {
        id
        nombre
        raza
        fechanacimiento
        cliente {
          nombre
          apellido
          ci
        }
        especie {
          descripcion
        }
      }
      bloqueHorario {
        id
        diasemana
        horainicio
        horafinal
        activo
      }
    }
  }
`;

export const GET_CITAS_POR_FECHA = gql`
  query GetCitasPorFecha($fecha: String!) {
    citasPorFecha(fecha: $fecha) {
      id
      fechacreacion
      motivo
      fechareserva
      estado
      doctor {
        id
        nombre
        apellido
        ci
        telefono
        email
      }
      mascota {
        id
        nombre
        raza
        fechanacimiento
        cliente {
          nombre
          apellido
          ci
        }
        especie {
          descripcion
        }
      }
      bloqueHorario {
        id
        diasemana
        horainicio
        horafinal
        activo
      }
    }
  }
`;

// Queries para Diagnósticos
export const GET_DIAGNOSTICOS = gql`
  query GetDiagnosticos {
    diagnosticos {
      id
      descripcion
      fecharegistro
      observaciones
      cita {
        id
        fechacreacion
        motivo
        fechareserva
        estado
        doctor {
          id
          nombre
          apellido
          ci
        }
        mascota {
          id
          nombre
          especie {
            id
            descripcion
          }
          cliente {
            id
            nombre
            apellido
          }
        }
      }
      tratamientos {
        id
        nombre
        descripcion
        observaciones
      }
    }
  }
`;

export const GET_DIAGNOSTICO = gql`
  query GetDiagnostico($id: ID!) {
    diagnostico(id: $id) {
      id
      descripcion
      fecharegistro
      observaciones
      cita {
        id
        fechacreacion
        motivo
        fechareserva
        doctor {
          nombre
          apellido
          ci
        }
        mascota {
          nombre
          cliente {
            nombre
            apellido
          }
        }
      }
      tratamientos {
        id
        nombre
        descripcion
        observaciones
      }
    }
  }
`;

// Queries para Tratamientos
export const GET_TRATAMIENTOS = gql`
  query GetTratamientos {
    tratamientos {
      id
      nombre
      descripcion
      observaciones
      diagnostico {
        id
        descripcion
        fecharegistro
        cita {
          id
          fechareserva
          mascota {
            id
            nombre
            especie {
              id
              descripcion
            }
            cliente {
              id
              nombre
              apellido
            }
          }
          doctor {
            id
            nombre
            apellido
          }
        }
      }
    }
  }
`;

export const GET_TRATAMIENTO = gql`
  query GetTratamiento($id: ID!) {
    tratamiento(id: $id) {
      id
      nombre
      descripcion
      observaciones
      diagnostico {
        id
        descripcion
        fecharegistro
        cita {
          id
          fechareserva
          mascota {
            nombre
            cliente {
              nombre
              apellido
            }
          }
          doctor {
            nombre
            apellido
          }
        }
      }
    }
  }
`;

// Queries para Vacunas
export const GET_VACUNAS = gql`
  query GetVacunas {
    vacunas {
      id
      descripcion
    }
  }
`;

export const GET_VACUNA = gql`
  query GetVacuna($id: ID!) {
    vacuna(id: $id) {
      id
      descripcion
    }
  }
`;

// Queries para Carnets de Vacunación
export const GET_CARNETS_VACUNACION = gql`
  query GetCarnetsVacunacion {
    carnetsVacunacion {
      id
      fechaemision
      mascota {
        id
        nombre
        raza
        cliente {
          nombre
          apellido
          ci
        }
        especie {
          descripcion
        }
      }
      detallesVacunacion {
        id
        fechavacunacion
        proximavacunacion
        vacuna {
          id
          descripcion
        }
      }
    }
  }
`;

export const GET_CARNET_VACUNACION = gql`
  query GetCarnetVacunacion($id: ID!) {
    carnetVacunacion(id: $id) {
      id
      fechaemision
      mascota {
        id
        nombre
        raza
        cliente {
          nombre
          apellido
          ci
        }
        especie {
          descripcion
        }
      }
      detallesVacunacion {
        id
        fechavacunacion
        proximavacunacion
        vacuna {
          id
          descripcion
        }
      }
    }
  }
`;

export const GET_CARNET_VACUNACION_POR_MASCOTA = gql`
  query GetCarnetVacunacionPorMascota($mascotaId: ID!) {
    carnetVacunacionPorMascota(mascotaId: $mascotaId) {
      id
      fechaemision
      mascota {
        id
        nombre
        raza
        cliente {
          nombre
          apellido
          ci
        }
        especie {
          descripcion
        }
      }
      detallesVacunacion {
        id
        fechavacunacion
        proximavacunacion
        vacuna {
          id
          descripcion
        }
      }
    }
  }
`;

// Queries para Detalles de Vacunación
export const GET_DETALLES_VACUNACION = gql`
  query GetDetallesVacunacion {
    detallesVacunacion {
      id
      fechavacunacion
      proximavacunacion
      vacuna {
        id
        descripcion
      }
      carnetVacunacion {
        id
        fechaemision
        mascota {
          nombre
          cliente {
            nombre
            apellido
          }
        }
      }
    }
  }
`;

export const GET_DETALLES_VACUNACION_POR_MASCOTA = gql`
  query GetDetallesVacunacionPorMascota($mascotaId: ID!) {
    detallesVacunacionPorMascota(mascotaId: $mascotaId) {
      id
      fechavacunacion
      proximavacunacion
      vacuna {
        id
        descripcion
      }
      carnetVacunacion {
        id
        fechaemision
        mascota {
          nombre
          cliente {
            nombre
            apellido
          }
        }
      }
    }
  }
`;