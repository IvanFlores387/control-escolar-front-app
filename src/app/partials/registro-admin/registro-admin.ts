import { Location } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AdministradoresService } from '../../services/administradores-service';
import { NotificationService } from '../../services/tools/notification-service';
import { EditarUserModal } from '../../modals/editar-user-modal/editar-user-modal';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro-admin.html',
  styleUrl: './registro-admin.scss',
})
export class RegistroAdmin implements OnInit {
  @Input() rol: string = '';
  @Input() datos_user: any = {};

  public admin: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private router = inject(Router);
  private administradoresService = inject(AdministradoresService);
  private notificationService = inject(NotificationService);
  private dialog = inject(MatDialog)

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.params['id'] !== undefined) {
      this.editar = true;
      this.idUser = Number(this.activatedRoute.snapshot.params['id']);
      this.admin = this.datos_user;
    } else {
      this.admin = this.administradoresService.esquemaAdmin();
      this.admin.rol = this.rol;
    }
  }

  public regresar(): void {
    this.location.back();
  }

  public showPassword(): void {
    if (this.inputType_1 === 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    } else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  public showPwdConfirmar(): void {
    if (this.inputType_2 === 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    } else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public registrar(): void {
    this.errors = {};
    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    if (this.admin.password === this.admin.confirmar_password) {
      this.administradoresService.registrarAdmin(this.admin).subscribe(
        (response) => {
          this.notificationService.success('Administrador registrado exitosamente');
          this.router.navigate(['/administrador']);
        },
        (error) => {
          this.notificationService.error('Error al registrar administrador');
        }
      );
    } else {
      this.notificationService.error('Las contraseñas no coinciden');
      this.admin.password = '';
      this.admin.confirmar_password = '';
    }

  }

  /* public actualizar(): void {
    this.errors = {};
    this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    this.administradoresService.actualizarAdmin(this.admin).subscribe(
      (response) => {
        this.notificationService.success('Administrador actualizado exitosamente');
        this.router.navigate(['/app/administrador']);
      },
      (error) => {
        this.notificationService.error('Error al actualizar administrador');
      }
    );
  } */
  public actualizar(): void {
      this.errors = {};
      this.errors = this.administradoresService.validarAdmin(this.admin, this.editar);

      if (Object.keys(this.errors).length > 0) {
        return;
      }

      const dialogRef = this.dialog.open(EditarUserModal, {
        data: {
          id: this.admin,
          rol: 'administrador'
        },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result?.isEdit) {
          this.administradoresService.actualizarAdmin(this.admin).subscribe({
            next: () => {
              this.notificationService.success('Administrador actualizado exitosamente');
              this.router.navigate(['/app/administrador']);
            },
            error: () => {
              this.notificationService.error('Error al actualizar Administrador');
            }
          });
        }
      });
    }

  public soloLetras(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 65 && charCode <= 90) &&
      !(charCode >= 97 && charCode <= 122) &&
      charCode !== 32
    ) {
      event.preventDefault();
    }
  }
}
