import { Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MaestrosService } from '../../services/maestros-service';
import { NotificationService } from '../../services/tools/notification-service';
import { EditarUserModal } from '../../modals/editar-user-modal/editar-user-modal';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-maestros',
  imports: [...SHARED_IMPORTS],
  templateUrl: './registro-maestros.html',
  styleUrl: './registro-maestros.scss',
})
export class RegistroMaestros {

  @Input() rol: string = '';
  @Input() datos_user: any = {};

  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public idUser: number = 0;

  public fechaVisual: Date | null = null;

  public areas: any[] = [
    { value: '1', viewValue: 'Desarrollo Web' },
    { value: '2', viewValue: 'Programación' },
    { value: '3', viewValue: 'Bases de datos' },
    { value: '4', viewValue: 'Redes' },
    { value: '5', viewValue: 'Matemáticas' },
  ];

  public materias: any[] = [
    { value: '1', nombre: 'Aplicaciones Web' },
    { value: '2', nombre: 'Programación 1' },
    { value: '3', nombre: 'Bases de datos' },
    { value: '4', nombre: 'Tecnologías Web' },
    { value: '5', nombre: 'Minería de datos' },
    { value: '6', nombre: 'Desarrollo móvil' },
    { value: '7', nombre: 'Estructuras de datos' },
    { value: '8', nombre: 'Administración de redes' },
    { value: '9', nombre: 'Ingeniería de Software' },
    { value: '10', nombre: 'Administración de S.O.' },
  ];

  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);
  private maestrosService = inject(MaestrosService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];

    if (id !== undefined) {
      this.editar = true;
      this.idUser = Number(id);
      this.maestro = JSON.parse(JSON.stringify(this.datos_user));

      // 2. Armamos la fecha y se la pasamos a la variable visual
      if (this.maestro.fecha_nacimiento) {
        const partesFecha = this.maestro.fecha_nacimiento.split('-');
        if (partesFecha.length === 3) {
          const anio = parseInt(partesFecha[0], 10);
          const mes = parseInt(partesFecha[1], 10) - 1;
          const dia = parseInt(partesFecha[2], 10);

          this.fechaVisual = new Date(anio, mes, dia); // <-- Asignamos a fechaVisual
        }
      }
    } else {
      this.maestro = this.maestrosService.esquemaMaestro();
      this.maestro.rol = this.rol;
    }
  }

  public regresar(): void {
    this.location.back();
  }

  public registrar(): void {
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    if (this.maestro.password === this.maestro.confirmar_password) {
      this.maestrosService.registrarMaestro(this.maestro).subscribe({
        next: () => {
          this.notificationService.success('Maestro registrado exitosamente');
          this.router.navigate(['/maestros']);
        },
        error: () => {
          this.notificationService.error('Error al registrar maestro');
        }
      });
    } else {
      this.notificationService.error('Las contraseñas no coinciden');
      this.maestro.password = '';
      this.maestro.confirmar_password = '';
    }
  }

  /* public actualizar(): void {
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    this.maestrosService.editarMaestro(this.maestro).subscribe({
      next: () => {
        this.notificationService.success('Maestro actualizado exitosamente');
        this.router.navigate(['/app/maestros']);
      },
      error: () => {
        this.notificationService.error('Error al actualizar maestro');
      }
    });
  } */
  public actualizar(): void {
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    const dialogRef = this.dialog.open(EditarUserModal, {
      data: {
        id: this.maestro,
        rol: 'maestro'
      },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.isEdit) {
        this.maestrosService.editarMaestro(this.maestro).subscribe({
          next: () => {
            this.notificationService.success('Maestro actualizado exitosamente');
            this.router.navigate(['/app/maestros']);
          },
          error: () => {
            this.notificationService.error('Error al actualizar maestro');
          }
        });
      }
    });
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

  public changeFecha(event: any): void {
    this.maestro.fecha_nacimiento = event.value.toISOString().split('T')[0];
  }

  public checkboxChange(event: any): void {
    if (event.checked) {
      this.maestro.materias_json.push(event.source.value);
    } else {
      this.maestro.materias_json.forEach((materia: string, i: number) => {
        if (materia === event.source.value) {
          this.maestro.materias_json.splice(i, 1);
        }
      });
    }
  }

  public revisarSeleccion(nombre: string): boolean {
    if (this.maestro.materias_json) {
      const busqueda = this.maestro.materias_json.find(
        (element: string) => element === nombre
      );
      return busqueda !== undefined;
    }
    return false;
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
