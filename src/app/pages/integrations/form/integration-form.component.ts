import { Component, OnInit } from '@angular/core';
import { IntegrationProvider } from '../integration.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Integration } from '../integration.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from 'app/providers/provider';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/pages/components/dialog/dialog-confirmation.component';
import { SearchabelSelectOption } from 'app/pages/components/searchable-select/searchable-select.model';
import { Application } from 'app/pages/applications/application.model';
import { ApplicationProvider } from 'app/pages/applications/application.provider';

@Component({
    selector: 'app-user-integration',
    templateUrl: './integration-form.component.html',
    styleUrls: ['./integration-form.component.css'],
})
export class IntegrationFormComponent {
    public integration: Integration;

    public form: FormGroup;
    public isBusy = false;
    public formTitle: string;
    public buttonTitle: string;

    public applications: Application[];

    constructor(
        public provider: IntegrationProvider,
        public applicationProvider: ApplicationProvider,
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
        this.fetchDependencies();
    }

    reactiveForm() {
        let integrationId = this.currentRoute.snapshot.paramMap.get('id');
        if (!integrationId && this.provider.integration) {
            this.populateFromDependencyInjection(this.provider.integration);
        } else if (integrationId) {
            this.populateFromUrlParam(integrationId);
        } else {
            this.populateFromEmpty();
        }
    }

    fetchDependencies() {
        this.applicationProvider.getAll().subscribe((response: any) => {
            this.applications = response.data;
        });
    }

    populateFromUrlParam(integrationId: string) {
        this.provider.get(integrationId).subscribe((response: any) => {
            this.provider.integration = response.data;
            this.populateForm(response.data);
        });
    }

    populateFromDependencyInjection(integration: Integration) {
        this.populateForm(integration);
    }

    populateFromEmpty() {
        this.populateForm();
    }

    populateForm(integration: Integration = null) {
        this.integration = integration;
        this.formTitle = 'New Item';
        this.buttonTitle = 'Add';

        var integrationId: string;
        var desc: string;
        var source_application: Application;
        var target_application: Application;
        var status = 'ACTIVATED';
        if (integration) {

            this.formTitle = integration.source_application.name + ' / ' + integration.target_application.name;
            this.buttonTitle = 'Update';
            integrationId = integration._id;
            desc = integration.desc
            source_application = integration.source_application
            target_application = integration.target_application
            desc = integration.desc
            status = integration.status;
        }

        this.form = this.fb.group({
            _id: [integrationId],
            source_application: [source_application, Validators.compose([
                Validators.required,
            ])],
            target_application: [target_application, Validators.compose([
                Validators.required,
            ])],
            desc: [desc],
            status: [status == 'ACTIVATED'],
        });
    }

    save() {
        if (this.form.invalid) {
            this.snackBar.open('Oops, some information is missing', '', { duration: 5000, panelClass: ['alert', 'alert-primary'] });
            return;
        }

        this.isBusy = true;
        this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

        var integration: Integration = this.form.value;
        integration.status = this.form.get('status').value ? 'ACTIVATED' : 'BLOCKED';

        console.log(integration)
        this.provider
            .save(integration)
            .subscribe((response: any) => {
                this.isBusy = false;
                let res = response as ApiResponse
                let item: Integration = res.data

                if (res.success) {
                    this.router.navigate(['/integration-form', item._id]);
                    this.snackBar.open(res.message, '', { duration: 5000, panelClass: ['alert', 'alert-success'] });
                } else {
                    this.snackBar.open(res.message, 'Close', { panelClass: ['alert', 'alert-danger'] });
                }
            },
                (err) => {
                    this.isBusy = false;
                    throw (err);
                });
    }

    delete(integration: Integration) {
        if (integration) {

            let dialogRef = this.dialog.open(DialogConfirmationComponent, {
                data: {
                    title: 'Delete',
                    message: 'Are you sure?'
                }
            });

            dialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    this.removeFromServer(integration);
                }
            });
        }
    }

    removeFromServer(integration: Integration) {
        this.isBusy = true;
        this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

        this.provider.delete(integration).subscribe((response: any) => {
            let res = response as ApiResponse;
            this.isBusy = false;

            if (res.success) {
                this.router.navigate(['/integration-list']);
            } else {
                this.snackBar.open(res.message, 'Close', { panelClass: ['alert', 'alert-danger'] });
            }
        });
    }

    clearFormData() {
        this.provider.integration = null;
        this.router.navigate(['/integration-form']);
    }
}
