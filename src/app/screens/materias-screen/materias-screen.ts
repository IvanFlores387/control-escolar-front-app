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
  MateriasService
} from '../../services/materias-service';

import {
  NotificationService
} from '../../services/tools/notification-service';


@Component({
  selector: 'app-materias-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './materias-screen.html',
  styleUrl: './materias-screen.scss',
  standalone: true,
})
export class MateriasScreen {

  // =========================================================
  // VARIABLES GENERALES
  // =========================================================

  public name_user: string = '';

  public rol: string = '';

  public lista_materias: any[] = [];

  public materia: any = {};

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
  // TABLA
  // =========================================================

  public displayedColumns: string[] = [
    'clave_materia',
    'nombre_materia',
    'semestre',
    'creditos',
    'estado',
    'creado_por',
    'update',
    'acciones',
  ];


  public dataSource =
    new MatTableDataSource<any>([]);


  /*
   * Usamos un setter porque el paginator solamente existe
   * cuando la tabla se encuentra visible.
   *
   * De esta manera Angular lo conecta automáticamente
   * aunque los datos lleguen después de la petición HTTP.
   */
  @ViewChild(MatPaginator)
  set matPaginator(
    paginator: MatPaginator
  ) {

    if (paginator) {
      this.dataSource.paginator = paginator;
    }

  }


  // =========================================================
  // SERVICIOS
  // =========================================================

  private authService =
    inject(AuthService);

  private materiasService =
    inject(MateriasService);

  private notificationService =
    inject(NotificationService);


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.name_user =
      this.authService.getUserCompleteName();

    this.rol =
      this.authService.getUserGroup();

    this.materia =
      this.materiasService.esquemaMateria();

    this.configurarFiltroTabla();

    this.obtenerMaterias();

  }


  // =========================================================
  // FILTRO PERSONALIZADO
  // =========================================================

  private configurarFiltroTabla(): void {

    this.dataSource.filterPredicate =
      (
        materia: any,
        filtro: string
      ) => {

        const creador =
          materia.creado_por
            ? `
              ${materia.creado_por.first_name ?? ''}
              ${materia.creado_por.last_name ?? ''}
              ${materia.creado_por.email ?? ''}
            `
            : '';


        const texto = [

          materia.clave_materia,

          materia.nombre_materia,

          materia.descripcion,

          materia.semestre,

          materia.creditos,

          materia.estado,

          creador,

        ]
          .join(' ')
          .toLowerCase();


        return texto.includes(filtro);

      };

  }


  // =========================================================
  // OBTENER MATERIAS
  // =========================================================

  public obtenerMaterias(): void {

    this.cargando = true;


    this.materiasService
      .obtenerListaMaterias()
      .subscribe({

        next: (response) => {

          this.lista_materias =
            Array.isArray(response)
              ? response
              : [];


          this.dataSource.data =
            this.lista_materias;


          if (this.filtro.trim()) {
            this.aplicarFiltro();
          }


          this.cargando = false;

        },


        error: (error) => {

          this.cargando = false;


          this.notificationService.error(

            this.obtenerMensajeError(
              error,
              'No se pudo obtener la lista de materias.'
            )

          );

        }

      });

  }


  // =========================================================
  // ABRIR FORMULARIO DE REGISTRO
  // =========================================================

  public abrirFormularioRegistro(): void {

    this.editando = false;

    this.errors = {};

    this.materia =
      this.materiasService.esquemaMateria();

    this.mostrarFormulario = true;

  }


  // =========================================================
  // CANCELAR FORMULARIO
  // =========================================================

  public cancelarFormulario(): void {

    this.mostrarFormulario = false;

    this.editando = false;

    this.errors = {};

    this.materia =
      this.materiasService.esquemaMateria();

  }


  // =========================================================
  // EDITAR
  // =========================================================

  public editarMateria(
    materiaSeleccionada: any
  ): void {

    if (
      !this.puedeModificar(
        materiaSeleccionada
      )
    ) {

      this.notificationService.error(
        'No tienes permisos para modificar esta materia.'
      );

      return;

    }


    this.editando = true;

    this.errors = {};


    this.materia = {

      id:
        materiaSeleccionada.id,

      clave_materia:
        materiaSeleccionada.clave_materia ?? '',

      nombre_materia:
        materiaSeleccionada.nombre_materia ?? '',

      descripcion:
        materiaSeleccionada.descripcion ?? '',

      creditos:
        materiaSeleccionada.creditos ?? '',

      semestre:
        materiaSeleccionada.semestre ?? '',

      estado:
        materiaSeleccionada.estado ?? 'activa',

    };


    this.mostrarFormulario = true;


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  // =========================================================
  // GUARDAR
  // =========================================================

  public guardarMateria(): void {

    this.errors =
      this.materiasService.validarMateria(
        this.materia
      );


    if (
      Object.keys(this.errors).length > 0
    ) {

      this.notificationService.error(
        'Verifica los campos marcados en el formulario.'
      );

      return;

    }


    const payload =
      this.prepararPayload();


    if (this.editando) {

      this.actualizarMateria(
        payload
      );

    } else {

      this.registrarMateria(
        payload
      );

    }

  }


  // =========================================================
  // REGISTRAR
  // =========================================================

  private registrarMateria(
    payload: any
  ): void {

    this.guardando = true;


    this.materiasService
      .registrarMateria(payload)
      .subscribe({

        next: (response) => {

          this.guardando = false;


          this.notificationService.success(

            response?.message ||
            'Materia registrada correctamente.'

          );


          this.cancelarFormulario();

          this.obtenerMaterias();

        },


        error: (error) => {

          this.guardando = false;


          this.asignarErroresBackend(
            error
          );


          this.notificationService.error(

            this.obtenerMensajeError(
              error,
              'No se pudo registrar la materia.'
            )

          );

        }

      });

  }


  // =========================================================
  // ACTUALIZAR
  // =========================================================

  private actualizarMateria(
    payload: any
  ): void {

    this.guardando = true;


    this.materiasService
      .actualizarMateria(payload)
      .subscribe({

        next: (response) => {

          this.guardando = false;


          this.notificationService.success(

            response?.message ||
            'Materia actualizada correctamente.'

          );


          this.cancelarFormulario();

          this.obtenerMaterias();

        },


        error: (error) => {

          this.guardando = false;


          this.asignarErroresBackend(
            error
          );


          this.notificationService.error(

            this.obtenerMensajeError(
              error,
              'No se pudo actualizar la materia.'
            )

          );

        }

      });

  }


  // =========================================================
  // ELIMINAR
  // =========================================================

  public eliminarMateria(
    materiaSeleccionada: any
  ): void {

    if (
      !this.puedeModificar(
        materiaSeleccionada
      )
    ) {

      this.notificationService.error(
        'No tienes permisos para eliminar esta materia.'
      );

      return;

    }


    const confirmar =
      window.confirm(

        `¿Seguro que deseas eliminar la materia "${materiaSeleccionada.nombre_materia}"? Esta acción no se puede deshacer.`

      );


    if (!confirmar) {
      return;
    }


    this.materiasService
      .eliminarMateria(
        materiaSeleccionada.id
      )
      .subscribe({

        next: (response) => {

          this.notificationService.success(

            response?.message ||
            'Materia eliminada correctamente.'

          );


          if (
            this.materia?.id ===
            materiaSeleccionada.id
          ) {

            this.cancelarFormulario();

          }


          this.obtenerMaterias();

        },


        error: (error) => {

          this.notificationService.error(

            this.obtenerMensajeError(
              error,
              'No se pudo eliminar la materia.'
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
    materiaSeleccionada: any
  ): boolean {

    /*
     * Administrador:
     * puede administrar cualquier materia.
     */
    if (
      this.authService.isAdmin()
    ) {

      return true;

    }


    /*
     * Si no es maestro,
     * no debe modificar.
     */
    if (
      !this.authService.isTeacher()
    ) {

      return false;

    }


    /*
     * IMPORTANTE:
     *
     * En tu login actual, para maestros el ID guardado
     * en la cookie corresponde al perfil Maestros.
     *
     * En cambio:
     *
     * materia.creado_por.id
     *
     * corresponde al User de Django.
     *
     * Por eso NO debemos comparar esos IDs.
     *
     * Utilizamos el correo, que sí representa
     * exactamente al mismo usuario en ambos casos.
     */

    const correoSesion =
      this.authService
        .getUserEmail()
        .trim()
        .toLowerCase();


    const correoCreador =
      String(
        materiaSeleccionada
          ?.creado_por
          ?.email ?? ''
      )
        .trim()
        .toLowerCase();


    return Boolean(
      correoSesion &&
      correoSesion === correoCreador
    );

  }


  // =========================================================
  // PREPARAR PAYLOAD
  // =========================================================

  private prepararPayload(): any {

    const payload: any = {

      clave_materia:
        String(
          this.materia.clave_materia ?? ''
        )
          .trim()
          .toUpperCase(),


      nombre_materia:
        String(
          this.materia.nombre_materia ?? ''
        )
          .trim(),


      descripcion:
        String(
          this.materia.descripcion ?? ''
        )
          .trim(),


      creditos:
        this.materia.creditos === '' ||
        this.materia.creditos === null

          ? null

          : Number(
              this.materia.creditos
            ),


      semestre:
        this.materia.semestre === '' ||
        this.materia.semestre === null

          ? null

          : Number(
              this.materia.semestre
            ),


      estado:
        this.materia.estado,

    };


    if (
      this.editando &&
      this.materia.id
    ) {

      payload.id =
        this.materia.id;

    }


    return payload;

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

      'clave_materia',

      'nombre_materia',

      'descripcion',

      'creditos',

      'semestre',

      'estado',

    ];


    campos.forEach(
      (campo) => {

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


    if (backend.details) {
      return backend.details;
    }


    if (backend.detail) {
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
