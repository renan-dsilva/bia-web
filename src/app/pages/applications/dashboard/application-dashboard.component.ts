import { Component, OnInit } from '@angular/core';
import { ApplicationProvider } from '../application.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Application } from '../application.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from 'app/providers/provider';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/pages/components/dialog/dialog-confirmation.component';
import { SearchabelSelectOption } from 'app/pages/components/searchable-select/searchable-select.model';
import { ProcessProvider } from 'app/pages/processes/process.provider';
import { Process } from 'app/pages/processes/process.model';
import { SupportProvider } from 'app/pages/support/support.provider';
import { Support } from 'app/pages/support/support.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { AreaProvider } from 'app/pages/areas/area.provider';
import { Area } from 'app/pages/areas/area.model';
import { IntegrationProvider } from 'app/pages/integrations/integration.provider';
import { Integration } from 'app/pages/integrations/integration.model';

@Component({
    selector: 'app-user-application',
    templateUrl: './application-dashboard.component.html',
    styleUrls: ['./application-dashboard.component.css'],
})
export class ApplicationDashboardComponent {
    public application: Application;

    public form: FormGroup;
    public isBusy = false;
    public formTitle: string;
    public buttonTitle: string;

    public applications: Application[] = [];
    public integrations: Integration[] = [];
    public areas: Area[] = [];
    public processes: Process[] = [];
    public support: Support[] = [];

    constructor(
        public provider: ApplicationProvider,
        public areaProvider: AreaProvider,
        public processProvider: ProcessProvider,
        public supportProvider: SupportProvider,
        public integrationProvider: IntegrationProvider,
        private currentRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private snackBar: MatSnackBar,
        public dialog: MatDialog,
    ) {
        this.setUp();
    }

    setUp() {
        this.reactiveForm();
    }

    reactiveForm() {
        let applicationId = this.currentRoute.snapshot.paramMap.get('id');
        if (!applicationId && this.provider.application) {
            this.populateFromDependencyInjection(this.provider.application);
        } else if (applicationId) {
            this.populateFromUrlParam(applicationId);
        } else {
            this.populateFromEmpty();
        }
    }

    fetchApplications(application: Application) {
        this.integrationProvider.getByApplication(application._id).subscribe((response: any) => {
            this.integrations = response.data
            let sources = this.integrations.filter(a => a.source_application._id != application._id).map(a => a.source_application)
            let targets = this.integrations.filter(a => a.target_application._id != application._id).map(a => a.target_application)
            this.applications = sources.concat(targets).filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t._id === item._id
                ))
            );
            console.log(this.applications)
        });
    }

    populateFromUrlParam(applicationId: string) {
        this.provider.get(applicationId).subscribe((response: any) => {
            this.provider.application = response.data;
            this.populateForm(response.data);
        });
    }

    populateFromDependencyInjection(application: Application) {
        this.populateForm(application);
    }

    populateFromEmpty() {
        this.populateForm();
    }

    populateForm(application: Application = null) {
        this.application = application;
        this.formTitle = 'New Item';
        this.buttonTitle = 'Add';

        this.processes = application.processes
        this.support = application.support
        this.areas = application.processes.map((a) => a.area);
        this.fetchApplications(application)

        var applicationId: string;
        var name: string;
        var vendor: string;
        var desc: string;
        var status = 'ACTIVATED';
        if (application) {
            this.formTitle = application.name;
            this.buttonTitle = 'Update';
            applicationId = application._id;
            name = application.name;
            vendor = application.vendor
            desc = application.desc
            status = application.status;
        }

        this.form = this.fb.group({
            _id: [applicationId],
            name: [name, Validators.compose([
                Validators.required,
            ])],
            vendor: [vendor, Validators.compose([
                Validators.required,
            ])],
            desc: [desc],
            status: [status == 'ACTIVATED'],
        });
    }

    openApplicationDetails(item?: Application) {
        if (item) {
            this.provider.application = item;
            this.router.navigate(['/application-form', item._id]);
        }
    }

    openAreaDetails(item?: Area) {
        if (item) {
            this.areaProvider.area = item;
            this.router.navigate(['/area-form', item._id]);
        }
    }

    openProcessDetails(item?: Process) {
        if (item) {
            this.processProvider.process = item;
            this.router.navigate(['/process-form', item._id]);
        }
    }

    openSupportDetails(item?: Support) {
        if (item) {
            this.supportProvider.support = item;
            this.router.navigate(['/support-form', item._id]);
        }
    }
}
