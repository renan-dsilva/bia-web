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

@Component({
    selector: 'app-user-application',
    templateUrl: './application-form.component.html',
    styleUrls: ['./application-form.component.css'],
})
export class ApplicationFormComponent {
    public application: Application;

    public form: FormGroup;
    public isBusy = false;
    public formTitle: string;
    public buttonTitle: string;

    public processes: SearchabelSelectOption[];
    public processesSelected: SearchabelSelectOption[] = [];
    public support: SearchabelSelectOption[];
    public supportSelected: SearchabelSelectOption[] = [];

    constructor(
        public provider: ApplicationProvider,
        public processProvider: ProcessProvider,
        public supportProvider: SupportProvider,
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
        let applicationId = this.currentRoute.snapshot.paramMap.get('id');
        if (!applicationId && this.provider.application) {
            this.populateFromDependencyInjection(this.provider.application);
        } else if (applicationId) {
            this.populateFromUrlParam(applicationId);
        } else {
            this.populateFromEmpty();
        }
    }

    fetchDependencies() {
        this.processProvider.getAll().subscribe((response: any) => {
            this.processes = response.data.map((a) => new SearchabelSelectOption(a._id, a.name));
        });

        this.supportProvider.getAll().subscribe((response: any) => {
            this.support = response.data.map((a) => new SearchabelSelectOption(a._id, a.name));
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

        var applicationId: string;
        var name: string;
        var vendor: string;
        var desc: string;
        var status = 'ACTIVATED';
        if (application) {
            this.processesSelected = !application.processes ? [] : application.processes.map((a) => new SearchabelSelectOption(a._id, a.name));
            this.supportSelected = !application.support ? [] : application.support.map((a) => new SearchabelSelectOption(a._id, a.name));

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
            processes: [this.processesSelected],
            support: [this.supportSelected],
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

        var application: Application = this.form.value;
        application.status = this.form.get('status').value ? 'ACTIVATED' : 'BLOCKED';

        application.processes = Process.fromSelect(this.processesSelected);
        application.support = Support.fromSelect(this.supportSelected);

        console.log(application)
        this.provider
            .save(application)
            .subscribe((response: any) => {
                this.isBusy = false;
                let res = response as ApiResponse
                let item: Application = res.data

                if (res.success) {
                    this.router.navigate(['/application-form', item._id]);
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

    delete(application: Application) {
        if (application) {

            let dialogRef = this.dialog.open(DialogConfirmationComponent, {
                data: {
                    title: 'Delete',
                    message: 'Are you sure?'
                }
            });

            dialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    this.removeFromServer(application);
                }
            });
        }
    }

    removeFromServer(application: Application) {
        this.isBusy = true;
        this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

        this.provider.delete(application).subscribe((response: any) => {
            let res = response as ApiResponse;
            this.isBusy = false;

            if (res.success) {
                this.router.navigate(['/application-list']);
            } else {
                this.snackBar.open(res.message, 'Close', { panelClass: ['alert', 'alert-danger'] });
            }
        });
    }

    clearFormData() {
        this.provider.application = null;
        this.router.navigate(['/application-form']);
    }
}
