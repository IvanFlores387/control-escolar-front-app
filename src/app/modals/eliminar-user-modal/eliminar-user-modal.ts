import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from '../../services/administradores-service';
import { AlumnosService } from '../../services/alumnos-service';
import { MaestrosService } from '../../services/maestros-service';

@Component({
  selector: 'app-eliminar-user-modal',
  imports: [...SHARED_IMPORTS],
  templateUrl: './eliminar-user-modal.html',
  styleUrl: './eliminar-user-modal.scss',
  standalone: true
})
export class EliminarUserModal {

  public rol: string = '';

  private administradoresService = inject(AdministradoresService);
  private maestrosService = inject(MaestrosService);
  private alumnosService = inject(AlumnosService);
  private dialogRef = inject(MatDialogRef<EliminarUserModal>);
  public data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.rol = this.data.rol;
  }

  public cerrar_modal(): void {
    this.dialogRef.close({ isDelete: false });
  }

  public eliminarUser(): void {
    if (this.rol === 'administrador') {
      this.administradoresService.eliminarAdmin(this.data.id).subscribe({
        next: () => {
          this.dialogRef.close({ isDelete: true });
        },
        error: () => {
          this.dialogRef.close({ isDelete: false });
        }
      });
    } else if (this.rol === 'maestro') {
      this.maestrosService.eliminarMaestro(this.data.id).subscribe({
        next: () => {
          this.dialogRef.close({ isDelete: true });
        },
        error: () => {
          this.dialogRef.close({ isDelete: false });
        }
      });
    } else if (this.rol === 'alumno') {
      this.alumnosService.eliminarAlumno(this.data.id).subscribe({
        next: () => {
          this.dialogRef.close({ isDelete: true });
        },
        error: () => {
          this.dialogRef.close({ isDelete: false });
        }
      });
    }
  }

}
