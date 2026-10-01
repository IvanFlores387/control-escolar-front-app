import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from '../../services/administradores-service';
import { AlumnosService } from '../../services/alumnos-service';
import { MaestrosService } from '../../services/maestros-service';

@Component({
  selector: 'app-editar-user-modal',
  imports: [...SHARED_IMPORTS],
  templateUrl: './editar-user-modal.html',
  styleUrl: './editar-user-modal.scss',
  standalone: true,
})
export class EditarUserModal {
  public rol: string = '';

  private administradoresService = inject(AdministradoresService);
  private maestrosService = inject(MaestrosService);
  private alumnosService = inject(AlumnosService);
  private dialogRef = inject(MatDialogRef<EditarUserModal>);
  public data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.rol = this.data.rol;
    console.log('Rol modal:', this.rol);
  }

  public cerrar_modal(): void {
    this.dialogRef.close({ isEdit: false });
  }

  public editarUser(): void {
    if (this.rol === 'administrador') {
      this.administradoresService.actualizarAdmin(this.data.id).subscribe({
        next: (response) => {
          console.log(response);
          this.dialogRef.close({ isEdit: true });
        },
        error: () => {
          this.dialogRef.close({ isEdit: false });
        }
      });
    } else if (this.rol === 'maestro') {
      this.maestrosService.editarMaestro(this.data.id).subscribe({
        next: (response) => {
          console.log(response);
          this.dialogRef.close({ isEdit: true });
        },
        error: () => {
          this.dialogRef.close({ isEdit: false });
        }
      });
    } else if (this.rol === 'alumno') {
      this.alumnosService.editarAlumno(this.data.id).subscribe({
        next: (response) => {
          console.log(response);
          this.dialogRef.close({ isEdit: true });
        },
        error: () => {
          this.dialogRef.close({ isEdit: false });
        }
      });
    }
  }
}
