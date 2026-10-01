import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from './auth-service';
import { ValidatorService } from './tools/validator-service';
import { ErrorsService } from './tools/errors-service';


@Injectable({
  providedIn: 'root',
})
export class EventosAcademicosService {

  private http = inject(HttpClient);

  private authService = inject(AuthService);

  private validatorService =
    inject(ValidatorService);

  private errorService =
    inject(ErrorsService);


  // =========================================================
  // HEADERS DE AUTENTICACIÓN
  // =========================================================

  private getAuthHeaders(): HttpHeaders {

    const token =
      this.authService.getSessionToken();


    return token

      ? new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        })

      : new HttpHeaders({
          'Content-Type': 'application/json',
        });

  }


  // =========================================================
  // ESQUEMA
  // =========================================================

  public esquemaEventoAcademico() {

    return {

      id: null,

      nombre_evento: '',

      tipo_evento: 'otro',

      descripcion: '',

      fecha_inicio: '',

      fecha_fin: '',

      modalidad: 'presencial',

      lugar: '',

      enlace: '',

    };

  }


  // =========================================================
  // VALIDACIONES
  // =========================================================

  public validarEventoAcademico(
    data: any
  ) {

    const error: any = {};


    // -------------------------------------------------------
    // NOMBRE
    // -------------------------------------------------------

    if (
      !this.validatorService.required(
        data['nombre_evento']
      )
    ) {

      error['nombre_evento'] =
        this.errorService.required;

    } else if (
      !this.validatorService.max(
        data['nombre_evento'],
        255
      )
    ) {

      error['nombre_evento'] =
        this.errorService.max(255);

    }


    // -------------------------------------------------------
    // TIPO
    // -------------------------------------------------------

    if (
      !this.validatorService.required(
        data['tipo_evento']
      )
    ) {

      error['tipo_evento'] =
        this.errorService.required;

    }


    // -------------------------------------------------------
    // FECHA DE INICIO
    // -------------------------------------------------------

    if (
      !this.validatorService.required(
        data['fecha_inicio']
      )
    ) {

      error['fecha_inicio'] =
        this.errorService.required;

    }


    // -------------------------------------------------------
    // FECHA DE FIN
    // -------------------------------------------------------

    if (
      data['fecha_inicio'] &&
      data['fecha_fin']
    ) {

      const inicio =
        new Date(
          data['fecha_inicio']
        ).getTime();


      const fin =
        new Date(
          data['fecha_fin']
        ).getTime();


      if (
        !Number.isNaN(inicio) &&
        !Number.isNaN(fin) &&
        fin < inicio
      ) {

        error['fecha_fin'] =
          'La fecha de finalización no puede ser anterior a la fecha de inicio.';

      }

    }


    // -------------------------------------------------------
    // MODALIDAD
    // -------------------------------------------------------

    if (
      !this.validatorService.required(
        data['modalidad']
      )
    ) {

      error['modalidad'] =
        this.errorService.required;

    }


    // -------------------------------------------------------
    // LUGAR
    // -------------------------------------------------------

    if (
      data['lugar'] &&
      !this.validatorService.max(
        data['lugar'],
        255
      )
    ) {

      error['lugar'] =
        this.errorService.max(255);

    }


    // -------------------------------------------------------
    // ENLACE
    // -------------------------------------------------------

    if (data['enlace']) {

      if (
        !this.validatorService.max(
          data['enlace'],
          500
        )
      ) {

        error['enlace'] =
          this.errorService.max(500);

      } else if (
        !this.urlValida(
          data['enlace']
        )
      ) {

        error['enlace'] =
          'Ingresa un enlace válido que comience con http:// o https://';

      }

    }


    return error;

  }


  // =========================================================
  // VALIDAR URL
  // =========================================================

  private urlValida(
    value: string
  ): boolean {

    try {

      const url =
        new URL(value);


      return (
        url.protocol === 'http:' ||
        url.protocol === 'https:'
      );

    } catch {

      return false;

    }

  }


  // =========================================================
  // POST
  // =========================================================

  public registrarEventoAcademico(
    data: any
  ): Observable<any> {

    return this.http.post<any>(

      `${environment.url_api}/eventos-academicos/`,

      data,

      {
        headers:
          this.getAuthHeaders()
      }

    );

  }


  // =========================================================
  // GET - LISTA
  // =========================================================

  public obtenerListaEventosAcademicos():
    Observable<any> {

    return this.http.get<any>(

      `${environment.url_api}/lista-eventos-academicos/`,

      {
        headers:
          this.getAuthHeaders()
      }

    );

  }


  // =========================================================
  // GET - POR ID
  // =========================================================

  public obtenerEventoPorID(
    idEvento: number
  ): Observable<any> {

    return this.http.get<any>(

      `${environment.url_api}/eventos-academicos/?id=${idEvento}`,

      {
        headers:
          this.getAuthHeaders()
      }

    );

  }


  // =========================================================
  // PUT
  // =========================================================

  public actualizarEventoAcademico(
    data: any
  ): Observable<any> {

    return this.http.put<any>(

      `${environment.url_api}/eventos-academicos/`,

      data,

      {
        headers:
          this.getAuthHeaders()
      }

    );

  }


  // =========================================================
  // DELETE
  // =========================================================

  public eliminarEventoAcademico(
    idEvento: number
  ): Observable<any> {

    return this.http.delete<any>(

      `${environment.url_api}/eventos-academicos/?id=${idEvento}`,

      {
        headers:
          this.getAuthHeaders()
      }

    );

  }

}