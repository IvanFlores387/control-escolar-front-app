import { Component, inject, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { NotificationService } from '../../services/tools/notification-service';

@Component({
  selector: 'app-login-screen',
  imports: [
    ...SHARED_IMPORTS
  ],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.scss',
  standalone: true
})
export class LoginScreen implements OnInit {

  // Aquí van las variables globales
  public username: string = '';
  public password: string = '';
  public load: boolean = false;
  public errors: any = {};
  public type: string = "password";

  public router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  ngOnInit() {

  }

  public login(){
    // Valida los campos del formulario del login
    this.errors = {};
    this.errors = this.authService.validarLogin(this.username, this.password);
    if(Object.keys(this.errors).length > 0){
      return;
    }
    this.load = true;
    // Lógica para el login
    // Llamar al servicio de login
    this.authService.login(this.username, this.password).subscribe(
      (response:any) => {
        // Guardar el token en el almacenamiento local - las cookies
        this.authService.saveUserData(response);
        // Redirigir según el rol
        const role = response.rol;
        if (role === 'administrador') {
          this.router.navigate(['app/home']);
        } else if (role === 'maestro') {
          this.router.navigate(['app/home']);
        } else if (role === 'alumno') {
          this.router.navigate(['app/home']);
        } else {
          this.router.navigate(['app/home']);
        }
        this.load = false;
      },
      (error:any) => {
        this.load = false;
        // Mostrar mensaje de error
        this.notificationService.error("Error en el login: " + error.message);
        this.errors.general = "Credenciales inválidas. Por favor, inténtalo de nuevo.";
      }
    );
  }

  public registrar() {
    this.router.navigate(['/registro-usuarios']);
  }

  public showPassword() {
    this.type = this.type === "password" ? "text" : "password";
  }

}
export default LoginScreen
