import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './shared/spanish-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Realiza las peticiones http, esta es la nueva forma de declararlo
    provideHttpClient(withFetch()),
    provideRouter(routes),
    // Esta es la nueva forma de injectar el mask para que no le de errores
    // al momento de crear los formularios
    provideNgxMask(),
    // Registramos globalmente los charts para las graficas
    provideCharts(withDefaultRegisterables()),
    //Habilita animaciones
    provideAnimationsAsync(),
    // Configuración para el paginator en idioma español
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
  ]
};


