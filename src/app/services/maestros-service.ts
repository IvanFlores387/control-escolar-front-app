import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator-service';
import { ErrorsService } from './tools/errors-service';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MaestrosService {

  private http = inject(HttpClient);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);
  private authService = inject(AuthService);

  /** Genera los HttpHeaders con el token de sesión si existe */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  public esquemaMaestro(){
    return {
      'rol':'',
      'id_trabajador': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'fecha_nacimiento': '',
      'telefono': '',
      'rfc': '',
      'cubiculo': '',
      'area_investigacion': '',
      'materias_json': []
    }
  }

  //Validación para el formulario
  public validarMaestro(data: any, editar: boolean){
    const error: any = {};

    if(!this.validatorService.required(data["id_trabajador"])){
      error["id_trabajador"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["first_name"])){
      error["first_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["last_name"])){
      error["last_name"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["email"])){
      error["email"] = this.errorService.required;
    }else if(!this.validatorService.max(data["email"], 40)){
      error["email"] = this.errorService.max(40);
    }else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if(!editar){
      if(!this.validatorService.required(data["password"])){
        error["password"] = this.errorService.required;
      }

      if(!this.validatorService.required(data["confirmar_password"])){
        error["confirmar_password"] = this.errorService.required;
      }
    }

    if(!this.validatorService.required(data["fecha_nacimiento"])){
      error["fecha_nacimiento"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.min(data["rfc"], 12)){
      error["rfc"] = this.errorService.min(12);
    }else if(!this.validatorService.max(data["rfc"], 13)){
      error["rfc"] = this.errorService.max(13);
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["cubiculo"])){
      error["cubiculo"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["area_investigacion"])){
      error["area_investigacion"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["materias_json"])){
      error["materias_json"] = "Debes seleccionar materias para poder registrarte";
    }
    //Return arreglo
    return error;
  }

  public registrarMaestro(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/maestros/`, data, { headers: this.getAuthHeaders() });
  }

  public obtenerListaMaestros(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/lista-maestros/`, { headers: this.getAuthHeaders() });
  }

  public obtenerMaestroPorId(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/maestros/?id=${id}`, { headers: this.getAuthHeaders() });
  }

  //Se agrego este enpoint ya que no estaba incluidos en los respositorios de referencia
  public editarMaestro(data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_api}/maestros/`, data, { headers: this.getAuthHeaders() });
  }

  public eliminarMaestro(idMaestro: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_api}/maestros/?id=${idMaestro}`, { headers: this.getAuthHeaders() });
  }
}
