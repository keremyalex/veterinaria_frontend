import { gql } from '@apollo/client';

// Mutations para Doctores
export const CREAR_DOCTOR = gql`
  mutation CrearDoctor($input: DoctorInput!) {
    crearDoctor(input: $input) {
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

export const ACTUALIZAR_DOCTOR = gql`
  mutation ActualizarDoctor($input: DoctorUpdateInput!) {
    actualizarDoctor(input: $input) {
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

export const ELIMINAR_DOCTOR = gql`
  mutation EliminarDoctor($id: ID!) {
    eliminarDoctor(id: $id)
  }
`;

// Mutations para Clientes
export const CREAR_CLIENTE = gql`
  mutation CrearCliente($input: ClienteInput!) {
    crearCliente(input: $input) {
      id
      nombre
      apellido
      ci
      telefono
      fotourl
    }
  }
`;

export const ACTUALIZAR_CLIENTE = gql`
  mutation ActualizarCliente($input: ClienteUpdateInput!) {
    actualizarCliente(input: $input) {
      id
      nombre
      apellido
      ci
      telefono
      fotourl
    }
  }
`;

export const ELIMINAR_CLIENTE = gql`
  mutation EliminarCliente($id: ID!) {
    eliminarCliente(id: $id)
  }
`;

// Mutations para Especies
export const CREAR_ESPECIE = gql`
  mutation CrearEspecie($input: EspecieInput!) {
    crearEspecie(input: $input) {
      id
      descripcion
    }
  }
`;

export const ACTUALIZAR_ESPECIE = gql`
  mutation ActualizarEspecie($input: EspecieUpdateInput!) {
    actualizarEspecie(input: $input) {
      id
      descripcion
    }
  }
`;

export const ELIMINAR_ESPECIE = gql`
  mutation EliminarEspecie($id: ID!) {
    eliminarEspecie(id: $id)
  }
`;

// Mutations para Mascotas
export const CREAR_MASCOTA = gql`
  mutation CrearMascota($input: MascotaInput!) {
    crearMascota(input: $input) {
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

export const ACTUALIZAR_MASCOTA = gql`
  mutation ActualizarMascota($input: MascotaUpdateInput!) {
    actualizarMascota(input: $input) {
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

export const ELIMINAR_MASCOTA = gql`
  mutation EliminarMascota($id: ID!) {
    eliminarMascota(id: $id)
  }
`;

// Mutations para Bloques Horarios
export const CREAR_BLOQUE_HORARIO = gql`
  mutation CrearBloqueHorario($input: BloqueHorarioInput!) {
    crearBloqueHorario(input: $input) {
      id
      diasemana
      horainicio
      horafinal
      activo
    }
  }
`;

export const ACTUALIZAR_BLOQUE_HORARIO = gql`
  mutation ActualizarBloqueHorario($input: BloqueHorarioUpdateInput!) {
    actualizarBloqueHorario(input: $input) {
      id
      diasemana
      horainicio
      horafinal
      activo
    }
  }
`;

export const ELIMINAR_BLOQUE_HORARIO = gql`
  mutation EliminarBloqueHorario($id: ID!) {
    eliminarBloqueHorario(id: $id)
  }
`;

// Mutations para Citas
export const CREAR_CITA = gql`
  mutation CrearCita($input: CitaInput!) {
    crearCita(input: $input) {
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

export const ACTUALIZAR_CITA = gql`
  mutation ActualizarCita($input: CitaUpdateInput!) {
    actualizarCita(input: $input) {
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

export const ELIMINAR_CITA = gql`
  mutation EliminarCita($id: ID!) {
    eliminarCita(id: $id)
  }
`;

// Mutations para Diagnósticos
export const CREAR_DIAGNOSTICO = gql`
  mutation CrearDiagnostico($input: DiagnosticoInput!) {
    crearDiagnostico(input: $input) {
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

export const ACTUALIZAR_DIAGNOSTICO = gql`
  mutation ActualizarDiagnostico($input: DiagnosticoUpdateInput!) {
    actualizarDiagnostico(input: $input) {
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

export const ELIMINAR_DIAGNOSTICO = gql`
  mutation EliminarDiagnostico($id: ID!) {
    eliminarDiagnostico(id: $id)
  }
`;

// Mutations para Tratamientos
export const CREAR_TRATAMIENTO = gql`
  mutation CrearTratamiento($input: TratamientoInput!) {
    crearTratamiento(input: $input) {
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

export const ACTUALIZAR_TRATAMIENTO = gql`
  mutation ActualizarTratamiento($input: TratamientoUpdateInput!) {
    actualizarTratamiento(input: $input) {
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

export const ELIMINAR_TRATAMIENTO = gql`
  mutation EliminarTratamiento($id: ID!) {
    eliminarTratamiento(id: $id)
  }
`;

// Mutations para Vacunas
export const CREAR_VACUNA = gql`
  mutation CrearVacuna($input: VacunaInput!) {
    crearVacuna(input: $input) {
      id
      descripcion
    }
  }
`;

export const ACTUALIZAR_VACUNA = gql`
  mutation ActualizarVacuna($input: VacunaUpdateInput!) {
    actualizarVacuna(input: $input) {
      id
      descripcion
    }
  }
`;

export const ELIMINAR_VACUNA = gql`
  mutation EliminarVacuna($id: ID!) {
    eliminarVacuna(id: $id)
  }
`;

// Mutations para Carnets de Vacunación
export const CREAR_CARNET_VACUNACION = gql`
  mutation CrearCarnetVacunacion($input: CarnetVacunacionInput!) {
    crearCarnetVacunacion(input: $input) {
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

export const ACTUALIZAR_CARNET_VACUNACION = gql`
  mutation ActualizarCarnetVacunacion($input: CarnetVacunacionUpdateInput!) {
    actualizarCarnetVacunacion(input: $input) {
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

export const ELIMINAR_CARNET_VACUNACION = gql`
  mutation EliminarCarnetVacunacion($id: ID!) {
    eliminarCarnetVacunacion(id: $id)
  }
`;

// Mutations para Detalles de Vacunación
export const CREAR_DETALLE_VACUNACION = gql`
  mutation CrearDetalleVacunacion($input: DetalleVacunacionInput!) {
    crearDetalleVacunacion(input: $input) {
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

export const ACTUALIZAR_DETALLE_VACUNACION = gql`
  mutation ActualizarDetalleVacunacion($input: DetalleVacunacionUpdateInput!) {
    actualizarDetalleVacunacion(input: $input) {
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

export const ELIMINAR_DETALLE_VACUNACION = gql`
  mutation EliminarDetalleVacunacion($id: ID!) {
    eliminarDetalleVacunacion(id: $id)
  }
`;