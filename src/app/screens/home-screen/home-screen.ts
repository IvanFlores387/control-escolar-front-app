import { Component, OnInit, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './home-screen.html',
  styleUrl: './home-screen.scss',
})
export class HomeScreen implements OnInit {
  public rol: string = '';
  public nombre: string = '';
  public descripcionRol: string = '';
  public accesos: { titulo: string; descripcion: string; icono: string }[] = [];

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.rol = this.authService.getUserGroup() || '';
    this.nombre = this.authService.getUserCompleteName() || 'Usuario';

    this.configurarVistaPorRol();
  }

  private configurarVistaPorRol(): void {
    if (this.rol === 'administrador') {
      this.descripcionRol =
        'Tienes acceso global al sistema. Puedes supervisar usuarios, consultar información académica y administrar los módulos principales.';

      this.accesos = [
        {
          titulo: 'Administradores',
          descripcion: 'Gestiona cuentas administrativas y mantén el control general del sistema.',
          icono: 'admin_panel_settings'
        },
        {
          titulo: 'Maestros',
          descripcion: 'Consulta, actualiza y administra la información del personal docente.',
          icono: 'badge'
        },
        {
          titulo: 'Alumnos',
          descripcion: 'Visualiza y administra los registros estudiantiles del sistema.',
          icono: 'school'
        },
        {
          titulo: 'Materias',
          descripcion: 'Consulta las materias disponibles y su relación con alumnos y maestros.',
          icono: 'menu_book'
        },
        {
          titulo: 'Eventos académicos',
          descripcion: 'Revisa actividades, eventos y participación académica institucional.',
          icono: 'event'
        },
        {
          titulo: 'Gráficas',
          descripcion: 'Analiza indicadores y estadísticas generales del sistema.',
          icono: 'bar_chart'
        }
      ];
    } else if (this.rol === 'maestro') {
      this.descripcionRol =
        'Puedes consultar información académica, visualizar alumnos, trabajar con materias y acceder a los módulos permitidos para tu rol.';

      this.accesos = [
        {
          titulo: 'Alumnos',
          descripcion: 'Consulta el listado de alumnos y su información general.',
          icono: 'groups'
        },
        {
          titulo: 'Materias',
          descripcion: 'Gestiona y consulta las materias vinculadas a la actividad académica.',
          icono: 'library_books'
        },
        {
          titulo: 'Eventos académicos',
          descripcion: 'Consulta eventos y actividades relevantes para la comunidad escolar.',
          icono: 'event_available'
        },
        {
          titulo: 'Editar registros',
          descripcion: 'Accede a la edición de registros permitidos dentro del sistema.',
          icono: 'edit_square'
        }
      ];
    } else if (this.rol === 'alumno') {
      this.descripcionRol =
        'Puedes consultar información útil para tu seguimiento académico, como alumnos, materias y eventos institucionales.';

      this.accesos = [
        {
          titulo: 'Lista de alumnos',
          descripcion: 'Consulta el directorio y la información general de alumnos registrados.',
          icono: 'diversity_3'
        },
        {
          titulo: 'Materias',
          descripcion: 'Revisa las materias disponibles y su información asociada.',
          icono: 'book_2'
        },
        {
          titulo: 'Eventos académicos',
          descripcion: 'Mantente informado sobre actividades, convocatorias y eventos escolares.',
          icono: 'campaign'
        }
      ];
    } else {
      this.descripcionRol =
        'Bienvenido al sistema. Tu perfil se cargó correctamente, pero aún no se identificó un rol válido.';
      this.accesos = [];
    }
  }
}
