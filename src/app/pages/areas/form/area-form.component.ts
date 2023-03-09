import { Component, OnInit } from '@angular/core';
import { AreaProvider } from '../area.provider';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Area } from '../area.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResponse } from 'app/providers/provider';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from 'app/pages/components/dialog/dialog-confirmation.component';

@Component({
    selector: 'app-user-area',
    templateUrl: './area-form.component.html',
    styleUrls: ['./area-form.component.css'],
})
export class AreaFormComponent {
    public area: Area;

    public form: FormGroup;
    public isBusy = false;
    public formTitle: string;
    public buttonTitle: string;

    constructor(
        public provider: AreaProvider,
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
        let areaId = this.currentRoute.snapshot.paramMap.get('id');
        if (!areaId && this.provider.area) {
            this.populateFromDependencyInjection(this.provider.area);
        } else if (areaId) {
            this.populateFromUrlParam(areaId);
        } else {
            this.populateFromEmpty();
        }
    }

    populateFromUrlParam(areaId: string) {
        this.provider.get(areaId).subscribe((response: any) => {
            this.provider.area = response.data;
            this.populateForm(response.data);
        });
    }

    populateFromDependencyInjection(area: Area) {
        this.populateForm(area);
    }

    populateFromEmpty() {
        this.populateForm();
    }

    populateForm(area: Area = null) {
        this.area = area;
        this.formTitle = 'New Item';
        this.buttonTitle = 'Add';

        var areaId: string;
        var name: string;
        var business_owner: string;
        var desc: string;
        var status = 'ACTIVATED';
        if (area) {
            this.formTitle = area.name;
            this.buttonTitle = 'Update';
            areaId = area._id;
            name = area.name;
            business_owner = area.business_owner
            desc = area.desc
            status = area.status;
        }

        this.form = this.fb.group({
            _id: [areaId],
            name: [name, Validators.compose([
                Validators.required,
            ])],
            business_owner: [business_owner, Validators.compose([
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

        var area: Area = this.form.value;
        area.status = this.form.get('status').value ? 'ACTIVATED' : 'BLOCKED';

        console.log(area)
        this.provider
            .save(area)
            .subscribe((response: any) => {
                this.isBusy = false;
                let res = response as ApiResponse
                let item: Area = res.data

                if (res.success) {
                    this.router.navigate(['/area-form', item._id]);
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

    delete(area: Area) {
        if (area) {

            let dialogRef = this.dialog.open(DialogConfirmationComponent, {
                data: {
                    title: 'Delete',
                    message: 'Are you sure?'
                }
            });

            dialogRef.afterClosed().subscribe(confirmed => {
                if (confirmed) {
                    this.removeFromServer(area);
                }
            });
        }
    }

    removeFromServer(area: Area) {
        this.isBusy = true;
        this.snackBar.open('Loading...', '', { panelClass: ['alert', 'alert-warning'] });

        this.provider.delete(area).subscribe((response: any) => {
            let res = response as ApiResponse;
            this.isBusy = false;

            if (res.success) {
                this.router.navigate(['/area-list']);
            } else {
                this.snackBar.open(res.message, 'Close', { panelClass: ['alert', 'alert-danger'] });
            }
        });
    }

    clearFormData() {
        this.provider.area = null;
        this.router.navigate(['/area-form']);
    }
}
