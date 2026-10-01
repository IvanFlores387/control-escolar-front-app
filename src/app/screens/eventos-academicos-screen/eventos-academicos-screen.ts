import {
  Component,
  inject,
  ViewChild
} from '@angular/core';

import {
  MatPaginator
} from '@angular/material/paginator';

import {
  MatTableDataSource
} from '@angular/material/table';

import {
  SHARED_IMPORTS
} from '../../shared/shared.imports';

import {
  AuthService
} from '../../services/auth-service';

import {
  EventosAcademicosService
} from '../../services/eventos-academicos-service';

import {
  NotificationService
} from '../../services/tools/notification-service';


@Component({
  selector: 'app-eventos-academicos-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl:
    './eventos-academicos-screen.html',
  styleUrl:
    './eventos-academicos-screen.scss',
  standalone: true,
})
export class EventosAcademicosScreen {

  // =========================================================
  // USUARIO
  // =========================================================

  public name_user: string = '';

  public rol: string = '';


  // =========================================================
  // DATOS
  // =========================================================

  public lista_eventos: any[] = [];

  public evento: any = {};

  public errors: any = {};

  public filtro: string = '';


  // =========================================================
  // ESTADOS DE LA INTERFAZ
  // =========================================================

  public mostrarFormulario: boolean = false;

  public editando: boolean = false;

  public cargando: boolean = false;

  public guardando: boolean = false;


  // =========================================================
  // CATÁLOGOS
  // =========================================================

  public tiposEvento = [

    {
      value: 'congreso',
      label: 'Congreso'
    },

    {
      value: 'conferencia',
      label: 'Conferencia'
    },

    {
      value: 'taller',
      label: 'Taller'
    },

    {
      value: 'seminario',
      label: 'Seminario'
    },

    {
      value: 'feria',
      label: 'Feria'
    },

    {
      value: 'curso',
      label: 'Curso'
    },

    {
      value: 'otro',
      label: 'Otro'
    },

  ];


  public modalidades = [

    {
      value: 'presencial',
      label: 'Presencial'
    },

    {
      value: 'virtual',
      label: 'Virtual'
    },

    {
      value: 'hibrido',
      label: 'Híbrido'
    },

  ];


  // =========================================================
  // TABLA
  // =========================================================

  public displayedColumns: string[] = [

    'nombre_evento',

    'tipo_evento',

    'fecha',

    'modalidad',

    'lugar',

    'situacion',

    'creado_por',

    'acciones',

  ];


  public dataSource =
    new MatTableDataSource<any>([]);


  @ViewChild(MatPaginator)
  set matPaginator(
    paginator: MatPaginator
  ) {

    if (paginator) {

      this.dataSource.paginator =
        paginator;

    }

  }


  // =========================================================
  // SERVICIOS
  // =========================================================

  private authService =
    inject(AuthService);


  private eventosService =
    inject(
      EventosAcademicosService
    );


  private notificationService =
    inject(
      NotificationService
    );


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.name_user =
      this.authService
        .getUserCompleteName();


    this.rol =
      this.authService
        .getUserGroup();


    this.evento =
      this.eventosService
        .esquemaEventoAcademico();


    this.configurarFiltroTabla();


    this.obtenerEventos();

  }


  // =========================================================
  // CONFIGURACIÓN DEL FILTRO
  // =========================================================

  private configurarFiltroTabla():
    void {

    this.dataSource.filterPredicate =
      (
        evento: any,
        filtro: string
      ) => {

        const creador =
          evento.creado_por

            ? `
              ${evento.creado_por.first_name ?? ''}
              ${evento.creado_por.last_name ?? ''}
              ${evento.creado_por.email ?? ''}
            `

            : '';


        const texto = [

          evento.nombre_evento,

          evento.tipo_evento,

          this.obtenerEtiquetaTipo(
            evento.tipo_evento
          ),

          evento.descripcion,

          evento.fecha_inicio,

          evento.fecha_fin,

          evento.modalidad,

          this.obtenerEtiquetaModalidad(
            evento.modalidad
          ),

          evento.lugar,

          evento.enlace,

          this.obtenerSituacionEvento(
            evento
          ).label,

          creador,

        ]
          .join(' ')
          .toLowerCase();


        return texto.includes(
          filtro
        );

      };

  }


  // =========================================================
  // OBTENER EVENTOS
  // =========================================================

  public obtenerEventos(): void {

    this.cargando = true;


    this.eventosService
      .obtenerListaEventosAcademicos()
      .subscribe({

        next: (response) => {

          this.lista_eventos =
            Array.isArray(response)
              ? response
              : [];


          this.dataSource.data =
            this.lista_eventos;


          if (
            this.filtro.trim()
          ) {

            this.aplicarFiltro();

          }


          this.cargando = false;

        },


        error: (error) => {

          this.cargando = false;


          this.notificationService.error(

            this.obtenerMensajeError(
              error,
              'No se pudo obtener la lista de eventos académicos.'
            )

          );

        }

      });

  }


  // =========================================================
  // NUEVO EVENTO
  // =========================================================

  public abrirFormularioRegistro():
    void {

    this.editando = false;

    this.errors = {};


    this.evento =
      this.eventosService
        .esquemaEventoAcademico();


    this.mostrarFormulario =
      true;

  }


  // =========================================================
  // CANCELAR
  // =========================================================

  public cancelarFormulario():
    void {

    this.mostrarFormulario =
      false;


    this.editando =
      false;


    this.errors = {};


    this.evento =
      this.eventosService
        .esquemaEventoAcademico();

  }


  // =========================================================
  // EDITAR
  // =========================================================

  public editarEvento(
    eventoSeleccionado: any
  ): void {

    if (
      !this.puedeModificar(
        eventoSeleccionado
      )
    ) {

      this.notificationService.error(
        'No tienes permisos para modificar este evento académico.'
      );

      return;

    }


    this.editando = true;

    this.errors = {};


    this.evento = {

      id:
        eventoSeleccionado.id,


      nombre_evento:
        eventoSeleccionado
          .nombre_evento ?? '',


      tipo_evento:
        eventoSeleccionado
          .tipo_evento ?? 'otro',


      descripcion:
        eventoSeleccionado
          .descripcion ?? '',


      fecha_inicio:
        this.formatearFechaParaInput(
          eventoSeleccionado
            .fecha_inicio
        ),


      fecha_fin:
        this.formatearFechaParaInput(
          eventoSeleccionado
            .fecha_fin
        ),


      modalidad:
        eventoSeleccionado
          .modalidad ?? 'presencial',


      lugar:
        eventoSeleccionado
          .lugar ?? '',


      enlace:
        eventoSeleccionado
          .enlace ?? '',

    };


    this.mostrarFormulario =
      true;


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  // =========================================================
  // GUARDAR
  // =========================================================

  public guardarEvento(): void {

    this.errors =
      this.eventosService
        .validarEventoAcademico(
          this.evento
        );


    if (
      Object.keys(
        this.errors
      ).length > 0
    ) {

      this.notificationService.error(
        'Verifica los campos marcados en el formulario.'
      );

      return;

    }


    const payload =
      this.prepararPayload();


    if (this.editando) {

      this.actualizarEvento(
        payload
      );

    } else {

      this.registrarEvento(
        payload
      );

    }

  }


  // =========================================================
  // REGISTRAR
  // =========================================================

  private registrarEvento(
    payload: any
  ): void {

    this.guardando =
      true;


    this.eventosService
      .registrarEventoAcademico(
        payload
      )
      .subscribe({

        next: (response) => {

          this.guardando =
            false;


          this.notificationService.success(

            response?.message ||

            'Evento académico registrado correctamente.'

          );


          this.cancelarFormulario();


          this.obtenerEventos();

        },


        error: (error) => {

          this.guardando =
            false;


          this.asignarErroresBackend(
            error
          );


          this.notificationService.error(

            this.obtenerMensajeError(
              error,
              'No se pudo registrar el evento académico.'
            )

          );

        }

      });

  }


  // =========================================================
  // ACTUALIZAR
  // =========================================================

  private actualizarEvento(
    payload: any
  ): void {

    this.guardando =
      true;


    this.eventosService
      .actualizarEventoAcademico(
        payload
      )
      .subscribe({

        next: (response) => {

          this.guardando =
            false;


          this.notificationService.success(

            response?.message ||

            'Evento académico actualizado correctamente.'

          );


          this.cancelarFormulario();


          this.obtenerEventos();

        },


        error: (error) => {

          this.guardando =
            false;


          this.asignarErroresBackend(
            error
          );


          this.notificationService.error(

            this.obtenerMensajeError(
              error,
              'No se pudo actualizar el evento académico.'
            )

          );

        }

      });

  }


  // =========================================================
  // ELIMINAR
  // =========================================================

  public eliminarEvento(
    eventoSeleccionado: any
  ): void {

    if (
      !this.puedeModificar(
        eventoSeleccionado
      )
    ) {

      this.notificationService.error(
        'No tienes permisos para eliminar este evento académico.'
      );

      return;

    }


    const confirmar =
      window.confirm(

        `¿Seguro que deseas eliminar el evento "${eventoSeleccionado.nombre_evento}"? Esta acción no se puede deshacer.`

      );


    if (!confirmar) {

      return;

    }


    this.eventosService
      .eliminarEventoAcademico(
        eventoSeleccionado.id
      )
      .subscribe({

        next: (response) => {

          this.notificationService.success(

            response?.message ||

            'Evento académico eliminado correctamente.'

          );


          if (
            this.evento?.id ===
            eventoSeleccionado.id
          ) {

            this.cancelarFormulario();

          }


          this.obtenerEventos();

        },


        error: (error) => {

          this.notificationService.error(

            this.obtenerMensajeError(
              error,
              'No se pudo eliminar el evento académico.'
            )

          );

        }

      });

  }


  // =========================================================
  // BUSCADOR
  // =========================================================

  public aplicarFiltro(): void {

    const valor =
      this.filtro
        .trim()
        .toLowerCase();


    this.dataSource.filter =
      valor;


    if (
      this.dataSource.paginator
    ) {

      this.dataSource
        .paginator
        .firstPage();

    }

  }


  public limpiarFiltro(): void {

    this.filtro = '';

    this.aplicarFiltro();

  }


  // =========================================================
  // PERMISOS
  // =========================================================

  public puedeModificar(
    eventoSeleccionado: any
  ): boolean {

    /*
     * Administrador:
     * puede modificar cualquier evento.
     */
    if (
      this.authService.isAdmin()
    ) {

      return true;

    }


    /*
     * Cualquier otro rol
     * que no sea maestro:
     */
    if (
      !this.authService.isTeacher()
    ) {

      return false;

    }


    /*
     * El ID de perfil Maestro y el ID de auth.User
     * no necesariamente coinciden.
     *
     * Por ello comparamos el correo del usuario.
     */

    const correoSesion =
      this.authService
        .getUserEmail()
        .trim()
        .toLowerCase();


    const correoCreador =
      String(
        eventoSeleccionado
          ?.creado_por
          ?.email ?? ''
      )
        .trim()
        .toLowerCase();


    return Boolean(

      correoSesion &&

      correoSesion ===
        correoCreador

    );

  }


  // =========================================================
  // PREPARAR PAYLOAD
  // =========================================================

  private prepararPayload():
    any {

    const payload: any = {

      nombre_evento:
        String(
          this.evento
            .nombre_evento ?? ''
        ).trim(),


      tipo_evento:
        this.evento
          .tipo_evento,


      descripcion:
        String(
          this.evento
            .descripcion ?? ''
        ).trim(),


      fecha_inicio:
        this.evento
          .fecha_inicio,


      fecha_fin:
        this.evento
          .fecha_fin

          ? this.evento.fecha_fin

          : null,


      modalidad:
        this.evento
          .modalidad,


      lugar:
        String(
          this.evento
            .lugar ?? ''
        ).trim(),


      enlace:
        String(
          this.evento
            .enlace ?? ''
        ).trim(),

    };


    if (
      this.editando &&
      this.evento.id
    ) {

      payload.id =
        this.evento.id;

    }


    return payload;

  }


  // =========================================================
  // FECHA PARA INPUT datetime-local
  // =========================================================

  private formatearFechaParaInput(
    fecha: string | null
  ): string {

    if (!fecha) {

      return '';

    }


    /*
     * Django devuelve normalmente:
     *
     * 2026-09-10T10:00:00-06:00
     *
     * El input datetime-local espera:
     *
     * 2026-09-10T10:00
     *
     * Tomamos directamente fecha y hora para evitar
     * desplazamientos innecesarios de zona horaria.
     */

    if (
      fecha.length >= 16
    ) {

      return fecha.substring(
        0,
        16
      );

    }


    return fecha;

  }


  // =========================================================
  // ETIQUETA TIPO
  // =========================================================

  public obtenerEtiquetaTipo(
    tipo: string
  ): string {

    const encontrado =
      this.tiposEvento.find(
        item =>
          item.value === tipo
      );


    return encontrado
      ? encontrado.label
      : 'Otro';

  }


  // =========================================================
  // ETIQUETA MODALIDAD
  // =========================================================

  public obtenerEtiquetaModalidad(
    modalidad: string
  ): string {

    const encontrada =
      this.modalidades.find(
        item =>
          item.value === modalidad
      );


    return encontrada
      ? encontrada.label
      : modalidad;

  }


  // =========================================================
  // SITUACIÓN TEMPORAL
  // =========================================================

  public obtenerSituacionEvento(
    evento: any
  ): {
    label: string;
    clase: string;
  } {

    if (
      !evento?.fecha_inicio
    ) {

      return {
        label: 'Sin fecha',
        clase: 'status-neutral'
      };

    }


    const ahora =
      new Date().getTime();


    const inicio =
      new Date(
        evento.fecha_inicio
      ).getTime();


    const fin =
      evento.fecha_fin

        ? new Date(
            evento.fecha_fin
          ).getTime()

        : null;


    if (
      ahora < inicio
    ) {

      return {
        label: 'Próximo',
        clase: 'status-upcoming'
      };

    }


    if (
      fin !== null &&
      ahora <= fin
    ) {

      return {
        label: 'En curso',
        clase: 'status-current'
      };

    }


    return {
      label: 'Finalizado',
      clase: 'status-finished'
    };

  }


  // =========================================================
  // ABRIR ENLACE
  // =========================================================

  public abrirEnlace(
    eventoSeleccionado: any
  ): void {

    const enlace =
      String(
        eventoSeleccionado
          ?.enlace ?? ''
      ).trim();


    if (!enlace) {

      return;

    }


    window.open(
      enlace,
      '_blank',
      'noopener,noreferrer'
    );

  }


  // =========================================================
  // ERRORES DEL BACKEND
  // =========================================================

  private asignarErroresBackend(
    error: any
  ): void {

    const backend =
      error?.error;


    if (
      !backend ||
      typeof backend !== 'object' ||
      Array.isArray(backend)
    ) {

      return;

    }


    const campos = [

      'nombre_evento',

      'tipo_evento',

      'descripcion',

      'fecha_inicio',

      'fecha_fin',

      'modalidad',

      'lugar',

      'enlace',

    ];


    campos.forEach(
      campo => {

        if (
          backend[campo]
        ) {

          this.errors[campo] =

            Array.isArray(
              backend[campo]
            )

              ? backend[campo][0]

              : String(
                  backend[campo]
                );

        }

      }
    );

  }


  private obtenerMensajeError(
    error: any,
    mensajeDefault: string
  ): string {

    const backend =
      error?.error;


    if (!backend) {

      return mensajeDefault;

    }


    if (
      typeof backend === 'string'
    ) {

      return backend;

    }


    if (
      backend.details
    ) {

      return backend.details;

    }


    if (
      backend.detail
    ) {

      return backend.detail;

    }


    const primerCampo =
      Object.keys(
        backend
      )[0];


    if (primerCampo) {

      const valor =
        backend[
          primerCampo
        ];


      if (
        Array.isArray(valor) &&
        valor.length > 0
      ) {

        return String(
          valor[0]
        );

      }


      if (
        typeof valor === 'string'
      ) {

        return valor;

      }

    }


    return mensajeDefault;

  }

}