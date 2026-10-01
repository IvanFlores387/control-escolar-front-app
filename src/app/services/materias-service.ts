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
export class MateriasService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  // =========================================================
  // HEADERS DE AUTENTICACIÓN
  // =========================================================

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();

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
  // ESQUEMA DE MATERIA
  // =========================================================

  public esquemaMateria() {
    return {
      id: null,
      clave_materia: '',
      nombre_materia: '',
      descripcion: '',
      creditos: '',
      semestre: '',
      estado: 'activa',
    };
  }


  // =========================================================
  // VALIDACIONES
  // =========================================================

  public validarMateria(data: any) {

    const error: any = {};

    // Clave
    if (!this.validatorService.required(data['clave_materia'])) {
      error['clave_materia'] = this.errorService.required;

    } else if (!this.validatorService.max(data['clave_materia'], 50)) {
      error['clave_materia'] = this.errorService.max(50);
    }


    // Nombre
    if (!this.validatorService.required(data['nombre_materia'])) {
      error['nombre_materia'] = this.errorService.required;

    } else if (!this.validatorService.max(data['nombre_materia'], 255)) {
      error['nombre_materia'] = this.errorService.max(255);
    }


    // Créditos
    if (
      data['creditos'] !== '' &&
      data['creditos'] !== null &&
      data['creditos'] !== undefined
    ) {

      if (!this.validatorService.numeric(data['creditos'])) {
        error['creditos'] = this.errorService.numeric;

      } else if (Number(data['creditos']) <= 0) {
        error['creditos'] =
          'Los créditos deben ser mayores a 0';
      }
    }


    // Semestre
    if (
      data['semestre'] !== '' &&
      data['semestre'] !== null &&
      data['semestre'] !== undefined
    ) {

      if (!this.validatorService.numeric(data['semestre'])) {
        error['semestre'] = this.errorService.numeric;

      } else if (Number(data['semestre']) <= 0) {
        error['semestre'] =
          'El semestre debe ser mayor a 0';
      }
    }


    // Estado
    if (!this.validatorService.required(data['estado'])) {
      error['estado'] = this.errorService.required;
    }


    return error;
  }


  // =========================================================
  // POST
  // =========================================================

  public registrarMateria(data: any): Observable<any> {

    return this.http.post<any>(
      `${environment.url_api}/materias/`,
      data,
      {
        headers: this.getAuthHeaders()
      }
    );
  }


  // =========================================================
  // GET - LISTA
  // =========================================================

  public obtenerListaMaterias(): Observable<any> {

    return this.http.get<any>(
      `${environment.url_api}/lista-materias/`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }


  // =========================================================
  // GET - POR ID
  // =========================================================

  public obtenerMateriaPorID(
    idMateria: number
  ): Observable<any> {

    return this.http.get<any>(
      `${environment.url_api}/materias/?id=${idMateria}`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }


  // =========================================================
  // PUT
  // =========================================================

  public actualizarMateria(
    data: any
  ): Observable<any> {

    return this.http.put<any>(
      `${environment.url_api}/materias/`,
      data,
      {
        headers: this.getAuthHeaders()
      }
    );
  }


  // =========================================================
  // DELETE
  // =========================================================

  public eliminarMateria(
    idMateria: number
  ): Observable<any> {

    return this.http.delete<any>(
      `${environment.url_api}/materias/?id=${idMateria}`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

}
