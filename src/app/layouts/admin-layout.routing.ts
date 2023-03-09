import { Routes } from '@angular/router';


/** BIA */
import { DashboardComponent } from '../pages/dashboards/view/dashboard.component';

import { AreaListComponent } from '../pages/areas/list/area-list.component';
import { AreaFormComponent } from '../pages/areas/form/area-form.component';
import { SupportListComponent } from '../pages/support/list/support-list.component';
import { SupportFormComponent } from '../pages/support/form/support-form.component';
import { ProcessListComponent } from '../pages/processes/list/process-list.component';
import { ProcessFormComponent } from '../pages/processes/form/process-form.component';
import { ApplicationListComponent } from '../pages/applications/list/application-list.component';
import { ApplicationDashboardComponent } from '../pages/applications/dashboard/application-dashboard.component';
import { ApplicationFormComponent } from '../pages/applications/form/application-form.component';
import { IntegrationListComponent } from '../pages/integrations/list/integration-list.component';
import { IntegrationFormComponent } from '../pages/integrations/form/integration-form.component';


/** BIA */

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, },

    { path: 'area-list', component: AreaListComponent },
    { path: 'area-form', component: AreaFormComponent },
    { path: 'area-form/:id', component: AreaFormComponent },

    { path: 'support-list', component: SupportListComponent },
    { path: 'support-form', component: SupportFormComponent },
    { path: 'support-form/:id', component: SupportFormComponent },

    { path: 'process-list', component: ProcessListComponent },
    { path: 'process-form', component: ProcessFormComponent },
    { path: 'process-form/:id', component: ProcessFormComponent },

    { path: 'application-list', component: ApplicationListComponent },
    { path: 'application-dashboard/:id', component: ApplicationDashboardComponent },
    { path: 'application-form', component: ApplicationFormComponent },
    { path: 'application-form/:id', component: ApplicationFormComponent },


    { path: 'integration-list', component: IntegrationListComponent },
    { path: 'integration-form', component: IntegrationFormComponent },
    { path: 'integration-form/:id', component: IntegrationFormComponent },
];
