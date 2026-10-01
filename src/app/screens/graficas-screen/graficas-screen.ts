import { Component, inject } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { NotificationService } from '../../services/tools/notification-service';
import { AdministradoresService } from '../../services/administradores-service';
import { BaseChartDirective } from 'ng2-charts';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-graficas-screen',
  imports: [
    ...SHARED_IMPORTS,
    BaseChartDirective
  ],
  templateUrl: './graficas-screen.html',
  styleUrl: './graficas-screen.scss',
})
export class GraficasScreen {
   public total_user: any = {};

   lineChartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [89, 34, 43, 54, 28, 74, 93],
        label: 'Registro de materias',
        backgroundColor: '#F88406'
      }
    ]
  };

  lineChartOption = {
    responsive: false
  };

  lineChartPlugins = [DatalabelsPlugin];

  barChartData = {
    labels: ['Congreso', 'FePro', 'Presentación Doctoral', 'Feria Matemáticas', 'T-System'],
    datasets: [
      {
        data: [34, 43, 54, 28, 74],
        label: 'Eventos Académicos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  };

  barChartOption = {
    responsive: false
  };

  barChartPlugins = [DatalabelsPlugin];

  pieChartData = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [89, 34, 43],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  };

  pieChartOption = {
    responsive: false
  };

  pieChartPlugins = [DatalabelsPlugin];

  doughnutChartData = {
    labels: ['Administradores', 'Maestros', 'Alumnos'],
    datasets: [
      {
        data: [89, 34, 43],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  };

  doughnutChartOption = {
    responsive: false
  };

  doughnutChartPlugins = [DatalabelsPlugin];

  private notificationService = inject(NotificationService);
  private administradoresService = inject(AdministradoresService);

  ngOnInit(): void {
    this.obtenerTotalUsers();

    //this.usarDatosMock();
  }

  public obtenerTotalUsers(): void {
    this.administradoresService.getTotalUsuarios().subscribe({
      next: (response) => {
        this.total_user = response;
         this.actualizarGraficasUsuarios(response);
      },
      error: () => {
        this.notificationService.error('No se pudo obtener el total de cada rol de usuarios');
      }
    });
  }

  // 🔹 FUNCIÓN LISTA PARA CUANDO TENGAS BACKEND
  private actualizarGraficasUsuarios(response: any): void {

    // 🔹 Soporta distintos nombres del backend (por si cambia)
    const administradores =
      Number(response?.administradores ?? response?.admins ?? response?.admin ?? 0);

    const maestros =
      Number(response?.maestros ?? response?.teachers ?? response?.teacher ?? 0);

    const alumnos =
      Number(response?.alumnos ?? response?.students ?? response?.student ?? 0);

    const usuariosData = [administradores, maestros, alumnos];

    // 🔹 PIE CHART
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [
        {
          ...this.pieChartData.datasets[0],
          data: usuariosData
        }
      ]
    };

    // 🔹 DOUGHNUT CHART
    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [
        {
          ...this.doughnutChartData.datasets[0],
          data: usuariosData
        }
      ]
    };
  }

  // 🔹 SOLO PARA PRUEBAS (SIN BACKEND)
  public usarDatosMock(): void {
    const mockResponse = {
      administradores: 10,
      maestros: 25,
      alumnos: 120
    };

    this.total_user = mockResponse;

    // 🔹 reutilizamos la misma lógica que backend
    this.actualizarGraficasUsuarios(mockResponse);
  }
}
