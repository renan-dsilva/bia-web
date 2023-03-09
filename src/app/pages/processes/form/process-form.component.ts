import { Component, OnInit } from '@angular/core';
import { ProcessProvider } from '../process.provider';
import { AreaProvider } from '../../areas/area.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Process } from '../process.model';
import { Area } from '../../areas/area.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from 'app/providers/provider';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/pages/components/dialog/dialog-confirmation.component';

@Component({
    selector: 'app-user-process',
    templateUrl: './process-form.component.html',
    styleUrls: ['./process-form.component.css'],
})
export class ProcessFormComponent {
    public process: Process;

    public form: FormGroup;
    public isBusy = false;
    public formTitle: string;
    public buttonTitle: string;

    public areas: Area[]

    constructor(
        public provider: ProcessProvider,
        private areaProvider: AreaProvider,
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
        let processId = this.currentRoute.snapshot.paramMap.get('id');
        if (!processId && this.provider.process) {
            this.populateFromDependencyInjection(this.provider.process);
        } else if (processId) {
            this.populateFromUrlParam(processId);
        } else {
            this.populateFromEmpty();
        }
    }

    fetchDependencies() {
        this.areaProvider.getAll().subscribe((response: any) => {
            this.areas = response.data;
        });
    }

    populateFromUrlParam(processId: string) {
        this.provider.get(processId).subscribe((response: any) => {
            this.provider.process = response.data;
            this.populateForm(response.data);
        });
    }

    populateFromDependencyInjection(process: Process) {
        this.populateForm(process);
    }

    populateFromEmpty() {
        this.populateForm();
    }

    populateForm(process: Process = null) {
        this.process = process;
        this.formTitle = 'New Item';
        this.buttonTitle = 'Add';

        var processId: string;
        var name: string;
        var area: Area;
        var desc: string;
        var status = 'ACTIVATED';
        if (process) {
            this.formTitle = process.name;
            this.buttonTitle = 'Update';
            processId = process._id;
            name = process.name;
            area = process.area
            desc = process.desc
            status = process.status;
        }

        this.form = this.fb.group({
            _id: [processId],
            name: [name, Validators.compose([
                Validators.required,
            ])],
            area: [area, Validators.compose([
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

        var process: Process = this.form.value;
        process.status = this.form.get('status').value ? 'ACTIVATED' : 'BLOCKED';

        console.log(process)
        this.provider
            .save(process)
            .subscribe((response: any) => {
                this.isBusy = false;
                let res = response as ApiResponse
                let item: Process = res.data

                if (res.success) {
                    this.router.navigate(['/process-form', item._id]);
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

    delete(process: Process) {
        if (process) {

            let dialogRef = this.dialog.open(DialogConfirmationComponent, {
                data: {
                    title: 'Delete',
                    message: 'Are you sure?'
                }
            });

            dialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    this.removeFromServer(process);
                }
            });
        }
    }

    removeFromServer(process: Process) {
        this.isBusy = true;
        this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

        this.provider.delete(process).subscribe((response: any) => {
            let res = response as ApiResponse;
            this.isBusy = false;

            if (res.success) {
                this.router.navigate(['/process-list']);
            } else {
                this.snackBar.open(res.message, 'Close', { panelClass: ['alert', 'alert-danger'] });
            }
        });
    }

    clearFormData() {
        this.provider.process = null;
        this.router.navigate(['/process-form']);
    }
}
