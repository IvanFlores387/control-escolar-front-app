import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { ValidatorService } from './tools/validator-service';
import { ErrorsService } from './tools/errors-service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministradoresService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private validatorService = inject(ValidatorService);
  private errorService = inject(ErrorsService);

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getSessionToken();
    return token
      ? new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` })
      : new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  public esquemaAdmin(){
    return {
      'rol':'',
      'clave_admin': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'telefono': '',
      'rfc': '',
      'edad': '',
      'ocupacion': ''
    }
  }

  public validarAdmin(data: any, editar: boolean){
    const error: any = {};

    //Validaciones
    if(!this.validatorService.required(data["clave_admin"])){
      error["clave_admin"] = this.errorService.required;
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

    if(!this.validatorService.required(data["rfc"])){
      error["rfc"] = this.errorService.required;
    }else if(!this.validatorService.min(data["rfc"], 12)){
      error["rfc"] = this.errorService.min(12);
    }else if(!this.validatorService.max(data["rfc"], 13)){
      error["rfc"] = this.errorService.max(13);
    }

    if(!this.validatorService.required(data["edad"])){
      error["edad"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["edad"])){
      error["edad"] = "El formato es solo números";
    }else if(data["edad"]<18){
      error["edad"] = "La edad debe ser mayor o igual a 18";
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["ocupacion"])){
      error["ocupacion"] = this.errorService.required;
    }

    //Return arreglo
    return error;
  }

  public registrarAdmin(data: any): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/admin/`, data, { headers: this.getAuthHeaders() });
  }

  public obtenerListaAdmins(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/lista-admins/`, { headers: this.getAuthHeaders() });
  }

  public obtenerAdminPorID(idAdmin: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/admin/?id=${idAdmin}`, { headers: this.getAuthHeaders() });
  }

  public actualizarAdmin(data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_api}/admin/`, data, { headers: this.getAuthHeaders() });
  }

  public eliminarAdmin(idAdmin: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_api}/admin/?id=${idAdmin}`, { headers: this.getAuthHeaders() });
  }

  public getTotalUsuarios(): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/total-usuarios/`, { headers: this.getAuthHeaders() });
  }

}
