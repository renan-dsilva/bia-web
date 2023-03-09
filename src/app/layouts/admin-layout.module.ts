import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

/** BIA */
import { DashboardComponent } from '../pages/dashboards/view/dashboard.component';
import { AreaFormComponent } from '../pages/areas/form/area-form.component';
import { AreaListComponent } from '../pages/areas/list/area-list.component';
import { SupportFormComponent } from '../pages/support/form/support-form.component';
import { SupportListComponent } from '../pages/support/list/support-list.component';
import { ProcessFormComponent } from '../pages/processes/form/process-form.component';
import { ProcessListComponent } from '../pages/processes/list/process-list.component';
import { ApplicationDashboardComponent } from '../pages/applications/dashboard/application-dashboard.component';
import { ApplicationFormComponent } from '../pages/applications/form/application-form.component';
import { ApplicationListComponent } from '../pages/applications/list/application-list.component';
import { IntegrationFormComponent } from '../pages/integrations/form/integration-form.component';
import { IntegrationListComponent } from '../pages/integrations/list/integration-list.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon'
import { PagesComponentsModule } from '../pages/components/pages-component.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxCurrencyModule } from "ngx-currency";
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
/** BIA */

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgxMaskModule.forRoot(maskConfig),
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    PagesComponentsModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDividerModule,
    MatChipsModule,

    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    NgxCurrencyModule,
    MatSelectModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  declarations: [
    DashboardComponent,
    AreaFormComponent,
    AreaListComponent,
    SupportFormComponent,
    SupportListComponent,
    ProcessFormComponent,
    ProcessListComponent,
    ApplicationDashboardComponent,
    ApplicationFormComponent,
    ApplicationListComponent,
    IntegrationFormComponent,
    IntegrationListComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ]
})

export class AdminLayoutModule { }
